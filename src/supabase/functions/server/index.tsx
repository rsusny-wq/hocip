import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to verify user authentication
async function verifyAuth(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) {
    return { authenticated: false, userId: null };
  }
  
  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return { authenticated: false, userId: null };
  }
  
  return { authenticated: true, userId: user.id, user };
}

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Sign up with email (with OTP)
app.post("/make-server-1a012ab1/auth/signup", async (c) => {
  try {
    const { email, password, role, name, phone } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since email server not configured
      user_metadata: { 
        role, // field-worker, case-manager, program-manager
        name,
        phone
      },
    });
    
    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    // Store additional user info in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      role,
      name,
      phone,
      createdAt: new Date().toISOString()
    });
    
    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Send OTP to email
app.post("/make-server-1a012ab1/auth/send-otp", async (c) => {
  try {
    const { email } = await c.req.json();
    
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
    });
    
    if (error) {
      console.error('OTP send error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    return c.json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    console.error('OTP send error:', error);
    return c.json({ error: 'Failed to send OTP' }, 500);
  }
});

// Get current user profile
app.get("/make-server-1a012ab1/auth/profile", async (c) => {
  const { authenticated, userId } = await verifyAuth(c.req.header('Authorization'));
  
  if (!authenticated) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const profile = await kv.get(`user:${userId}`);
  return c.json({ profile });
});

// ============================================
// CLIENT ROUTES
// ============================================

// Create a new client
app.post("/make-server-1a012ab1/clients", async (c) => {
  const { authenticated, userId } = await verifyAuth(c.req.header('Authorization'));
  
  if (!authenticated) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const clientData = await c.req.json();
    const clientId = `client:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const client = {
      id: clientId,
      ...clientData,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(clientId, client);
    
    // Add to client index
    const allClients = await kv.get('clients:all') || [];
    allClients.push(clientId);
    await kv.set('clients:all', allClients);
    
    return c.json({ success: true, client });
  } catch (error) {
    console.error('Create client error:', error);
    return c.json({ error: 'Failed to create client' }, 500);
  }
});

// Get all clients
app.get("/make-server-1a012ab1/clients", async (c) => {
  const { authenticated } = await verifyAuth(c.req.header('Authorization'));
  
  if (!authenticated) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const clientIds = await kv.get('clients:all') || [];
    const clients = await Promise.all(
      clientIds.map(async (id: string) => await kv.get(id))
    );
    
    return c.json({ clients: clients.filter(Boolean) });
  } catch (error) {
    console.error('Get clients error:', error);
    return c.json({ error: 'Failed to get clients' }, 500);
  }
});

// Get single client
app.get("/make-server-1a012ab1/clients/:id", async (c) => {
  const { authenticated } = await verifyAuth(c.req.header('Authorization'));
  
  if (!authenticated) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const clientId = c.req.param('id');
    const client = await kv.get(clientId);
    
    if (!client) {
      return c.json({ error: 'Client not found' }, 404);
    }
    
    return c.json({ client });
  } catch (error) {
    console.error('Get client error:', error);
    return c.json({ error: 'Failed to get client' }, 500);
  }
});

// Update client
app.put("/make-server-1a012ab1/clients/:id", async (c) => {
  const { authenticated } = await verifyAuth(c.req.header('Authorization'));
  
  if (!authenticated) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const clientId = c.req.param('id');
    const updates = await c.req.json();
    
    const existingClient = await kv.get(clientId);
    if (!existingClient) {
      return c.json({ error: 'Client not found' }, 404);
    }
    
    const updatedClient = {
      ...existingClient,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(clientId, updatedClient);
    
    return c.json({ success: true, client: updatedClient });
  } catch (error) {
    console.error('Update client error:', error);
    return c.json({ error: 'Failed to update client' }, 500);
  }
});

// ============================================
// ENCOUNTER ROUTES
// ============================================

// Create encounter
app.post("/make-server-1a012ab1/encounters", async (c) => {
  const { authenticated, userId } = await verifyAuth(c.req.header('Authorization'));
  
  if (!authenticated) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const encounterData = await c.req.json();
    const encounterId = `encounter:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const encounter = {
      id: encounterId,
      ...encounterData,
      fieldWorkerId: userId,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(encounterId, encounter);
    
    // Add to encounter index
    const allEncounters = await kv.get('encounters:all') || [];
    allEncounters.push(encounterId);
    await kv.set('encounters:all', allEncounters);
    
    // Add to client's encounters if clientId provided
    if (encounterData.clientId) {
      const clientEncounters = await kv.get(`encounters:client:${encounterData.clientId}`) || [];
      clientEncounters.push(encounterId);
      await kv.set(`encounters:client:${encounterData.clientId}`, clientEncounters);
    }
    
    return c.json({ success: true, encounter });
  } catch (error) {
    console.error('Create encounter error:', error);
    return c.json({ error: 'Failed to create encounter' }, 500);
  }
});

// Get encounters for a client
app.get("/make-server-1a012ab1/encounters/client/:clientId", async (c) => {
  const { authenticated } = await verifyAuth(c.req.header('Authorization'));
  
  if (!authenticated) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const clientId = c.req.param('clientId');
    const encounterIds = await kv.get(`encounters:client:${clientId}`) || [];
    const encounters = await Promise.all(
      encounterIds.map(async (id: string) => await kv.get(id))
    );
    
    return c.json({ encounters: encounters.filter(Boolean) });
  } catch (error) {
    console.error('Get encounters error:', error);
    return c.json({ error: 'Failed to get encounters' }, 500);
  }
});

// ============================================
// CASE ROUTES
// ============================================

// Create case
app.post("/make-server-1a012ab1/cases", async (c) => {
  const { authenticated, userId } = await verifyAuth(c.req.header('Authorization'));
  
  if (!authenticated) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const caseData = await c.req.json();
    const caseId = `case:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newCase = {
      id: caseId,
      ...caseData,
      caseManagerId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(caseId, newCase);
    
    // Add to case index
    const allCases = await kv.get('cases:all') || [];
    allCases.push(caseId);
    await kv.set('cases:all', allCases);
    
    return c.json({ success: true, case: newCase });
  } catch (error) {
    console.error('Create case error:', error);
    return c.json({ error: 'Failed to create case' }, 500);
  }
});

// Get all cases
app.get("/make-server-1a012ab1/cases", async (c) => {
  const { authenticated } = await verifyAuth(c.req.header('Authorization'));
  
  if (!authenticated) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const caseIds = await kv.get('cases:all') || [];
    const cases = await Promise.all(
      caseIds.map(async (id: string) => await kv.get(id))
    );
    
    return c.json({ cases: cases.filter(Boolean) });
  } catch (error) {
    console.error('Get cases error:', error);
    return c.json({ error: 'Failed to get cases' }, 500);
  }
});

// ============================================
// FILE UPLOAD ROUTES (For images and audio)
// ============================================

// Upload file (image or audio) to Supabase Storage
app.post("/make-server-1a012ab1/upload", async (c) => {
  const { authenticated, userId } = await verifyAuth(c.req.header('Authorization'));
  
  if (!authenticated) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  try {
    const { file, fileName, fileType, bucket = 'outreach-files' } = await c.req.json();
    
    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === `make-1a012ab1-${bucket}`);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(`make-1a012ab1-${bucket}`, {
        public: false
      });
    }
    
    // Upload file
    const filePath = `${userId}/${Date.now()}-${fileName}`;
    const { data, error } = await supabase.storage
      .from(`make-1a012ab1-${bucket}`)
      .upload(filePath, file, {
        contentType: fileType
      });
    
    if (error) {
      console.error('Upload error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    // Get signed URL
    const { data: signedUrlData } = await supabase.storage
      .from(`make-1a012ab1-${bucket}`)
      .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year
    
    return c.json({ 
      success: true, 
      path: data.path,
      url: signedUrlData?.signedUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

// Health check endpoint
app.get("/make-server-1a012ab1/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);
