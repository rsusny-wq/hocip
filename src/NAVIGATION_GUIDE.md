# HOCI Platform - Navigation Guide

## Navigation System Overview

The HOCI platform includes comprehensive navigation controls to help you move between different screens and user roles.

## Primary Navigation Methods

### 1. **Navigation Hub (Home Screen)**
- **How to access**: Click the floating blue home button (bottom-right corner) from any screen
- **What it contains**: 
  - Overview of the entire platform
  - Quick links to Mobile App, Web Dashboards, and Design System
  - Feature descriptions and design principles

### 2. **Header Navigation Buttons**
Every screen includes navigation controls in the header:

#### Mobile App Screens:
- **Login** → No back button (entry point)
- **Home** → Home icon (returns to Navigation Hub)
- **Map View** → Back button (returns to Home)
- **Encounter Logging** → X button (returns to Home)
- **Service Recommendations** → Back button (returns to Encounter Logging)

#### Web Dashboard Screens:
- **Case Manager Dashboard** → Home icon (returns to Navigation Hub)
- **Client Profile** → Back arrow (returns to Case Manager Dashboard)
- **Program Manager Dashboard** → Home icon (returns to Navigation Hub)

#### Design System:
- **Design System** → Back arrow (returns to Navigation Hub)

### 3. **Floating Home Button**
- Located in the bottom-right corner on ALL screens (except Navigation Hub)
- Always visible as a safety net to return to the main hub
- Blue circular button with home icon

### 4. **Bottom Navigation (Mobile App Only)**
On the mobile Outreach Worker app home screen:
- Home
- Map
- Log (Encounter)
- Clients

## Screen Flow Diagrams

### Mobile Outreach Worker Flow:
```
Navigation Hub
    ↓
Login Screen
    ↓
Outreach Home ←→ Map View
    ↓
Encounter Logging
    ↓
Service Recommendations
    ↓
Back to Home
```

### Case Manager Flow:
```
Navigation Hub
    ↓
Case Manager Dashboard
    ↓
Client Profile
    ↓
(Various tabs: Timeline, Appointments, Documents, Notes)
    ↓
Back to Dashboard
```

### Program Manager Flow:
```
Navigation Hub
    ↓
Program Manager Dashboard
(View analytics, charts, team coverage)
    ↓
Back to Hub
```

## Quick Tips

1. **Lost?** Click the blue floating home button (bottom-right) to return to the Navigation Hub
2. **Going Back One Step?** Use the back arrow or home icon in the header
3. **Exploring Features?** Start from the Navigation Hub and use the tabs to explore different sections
4. **Mobile vs Web?** Mobile screens are optimized for portrait view, Web dashboards for landscape

## Keyboard Shortcuts (Future Enhancement)
- `Esc` - Go back one screen
- `Ctrl/Cmd + H` - Return to Navigation Hub
- `Ctrl/Cmd + D` - Open Design System

## Navigation Elements by Screen

| Screen | Header Button | Floating Button | Bottom Nav |
|--------|--------------|-----------------|------------|
| Navigation Hub | None | Hidden | No |
| Login | None | Yes | No |
| Outreach Home | Home icon | Yes | Yes (4 tabs) |
| Map View | Back arrow | Yes | No |
| Encounter Log | X button | Yes | No |
| Service Rec | Back arrow | Yes | No |
| Case Manager | Home icon | Yes | No |
| Client Profile | Back arrow | Yes | No |
| Program Manager | Home icon | Yes | No |
| Design System | Back arrow | Yes | No |
