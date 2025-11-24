# HOCI Platform (Homeless Outreach Coordination Intelligence) 🏠🤝

**Bridging the gap between vulnerable populations and life-saving services through AI and real-time coordination.**

![HOCI Platform Banner](https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop)
*(Note: Replace with actual screenshot of the app)*

## 🌟 The Mission
Homelessness is a coordination crisis. Vulnerable individuals often struggle to navigate complex service systems, while outreach teams lack real-time visibility into where help is needed most.

The **HOCI Platform** solves this by creating a unified ecosystem:
1.  **For Vulnerable Users**: An accessible, AI-powered lifeline to find food, shelter, and medical help.
2.  **For Field Workers**: A mobile tool to receive live alerts, navigate to clients, and log encounters.
3.  **For Case Managers**: A dashboard to triage alerts and coordinate care in real-time.

---

## 🚀 Key Features

### 🤖 AI-Powered "Compassionate Chat"
*   **Gemini 1.5 Flash Integration**: Context-aware AI that acts as a digital social worker.
*   **Voice Mode**: Speech-to-Text and Text-to-Speech for accessibility.
*   **Multilingual**: Instant translation for 8+ languages (Spanish, Chinese, Arabic, etc.).
*   **Trauma-Informed**: Prompts designed to be non-judgmental, simple, and supportive.

### 📍 Smart Location & Navigation
*   **One-Tap Location Sharing**: Privacy-first geolocation to find nearby services.
*   **Live Service Availability**: See real-time bed counts at shelters.
*   **Turn-by-Turn Navigation**: Integrated routing to guide users to help.

### 🚨 Real-Time Alert System
*   **Emergency Button**: One-tap distress signal for users.
*   **Live Coordination**: Alerts appear instantly on Field Worker maps.
*   **Status Tracking**: Track alerts from "Active" to "Assigned" to "Resolved".

### 📱 Native Mobile Support
*   **Cross-Platform**: Built with **Capacitor** to run as a native Android/iOS app.
*   **Offline Capable**: Core features work even with spotty connection.

---

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS
*   **AI**: Google Gemini API (Generative AI)
*   **Maps**: Leaflet, OpenStreetMap, OSRM (Routing)
*   **Mobile**: Capacitor (Native Bridge)
*   **Voice**: Web Speech API (Browser Native)
*   **Icons**: Lucide React

---

## 🏁 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Gemini API Key (Get one [here](https://aistudio.google.com/app/apikey))

### Installation

1.  **Clone the repo**
    ```bash
    git clone https://github.com/yourusername/hoci-platform.git
    cd hoci-platform
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```

### Running on Mobile (Android)
1.  Initialize Android project: `npx cap add android`
2.  Open in Android Studio: `npx cap open android`
3.  Run on Emulator or Device.

---

## 🤝 Contributing
This project is open-source and welcomes contributions. Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ for NYC*