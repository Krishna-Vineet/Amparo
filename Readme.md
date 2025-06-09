
# 🛡️ Amparo AI

**Amparo AI** is a versatile, AI-powered personal assistant that bridges the gap between daily convenience and critical health management. Designed with accessibility and safety in mind, it offers medication reminders, emergency alerts, conversational AI, and voice interaction—everything in one platform.

---

## 📚 Table of Contents

- [🔍 Overview](#-overview)
- [✨ Features](#-features)
- [🧠 AI Integration](#-ai-integration)
- [🎙️ Voice Interaction](#️-voice-interaction)
- [🚀 Live Demo](#-live-demo)
- [📸 Screenshots](#-screenshots)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚙️ Installation & Setup](#️-installation--setup)
- [📡 API Endpoints](#-api-endpoints)
- [🧪 Usage Guide](#-usage-guide)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [📬 Support](#-support)

---

## 🔍 Overview

**Amparo AI** is more than just a chatbot—it's a personal health and safety companion. It helps users:

- Manage medications and health routines
- Set important reminders
- Trigger real-time emergency SOS alerts
- Ask general queries (weather, news, etc.)
- Use voice input/output for hands-free interaction

Amparo is ideal for:
- Elderly individuals or patients with medical needs
- Anyone who needs an intelligent assistant for day-to-day help

> 🌟 **What makes Amparo AI special?**
> - Combines health tracking, emergency alerts, and general AI interaction
> - Voice-enabled AI chat and commands
> - Sends real-time emergency SMS and voice calls via Twilio
> - Personalized responses using user data and reminders

---

## ✨ Features

- 🔐 **User Authentication**: Secure login/register via JWT
- 👤 **Profile Management**: Medical info and emergency contacts
- 💊 **Medicine Manager**: Add/edit/delete medications with schedules
- ⏰ **Reminders**: For medicine, appointments, and more
- 🤖 **AI Chatbot**: Ask questions, get daily help, or casual conversation
- 🆘 **SOS Alerts**: Trigger SMS/voice calls to emergency contacts (Twilio)
- 🎤 **Voice Interaction**: Speech-to-text and text-to-speech enabled
- 🌗 **Theme Toggle**: Switch between light/dark mode
- 💾 **Persistent Storage**: MongoDB backend with Mongoose

---

## 🧠 AI Integration

Amparo uses the **Gemini Pro API** (Google Generative AI) to process user queries:

- ✨ Contextual responses based on user data
- 🌦️ Weather info via `wttr.in`
- 🗞️ News via GNews API
- 📲 AI handles reminders, medications, and chat

Python backend handles AI-specific tasks and integrations with:

- `google-generativeai` (Gemini)
- `twilio` (SMS + voice)

---

## 🎙️ Voice Interaction

Hands-free control and feedback:

- **Speech-to-Text**: Converts voice commands to text using Web Speech API
- **Text-to-Speech**: Reads chatbot responses aloud
- Ideal for visually impaired or elderly users

---

## 🚀 Live Demo

**[🔗 View Amparo AI Live](#)**  


---

## 🛠️ Tech Stack

**Frontend**:

* EJS (Server-rendered views)
* Vanilla JavaScript
* HTML5 / CSS3

**Backend**:

* Node.js + Express
* Python (for AI)

**Database**:

* MongoDB (with Mongoose ODM)

**APIs & Integrations**:

* Gemini Pro API (Google AI)
* Twilio API (SMS + Voice)
* GNews API
* wttr.in API (Weather)

**Tools & Libraries**:

* `bcrypt`, `jsonwebtoken`, `dotenv`, `cookie-parser`, `cors`, `body-parser`
* `twilio`, `google-generativeai`
* `nodemon` (dev), `mongoose`, `ejs`

---

## ⚙️ Installation & Setup

### 🔧 Prerequisites

* Node.js + npm
* Python 3.x
* MongoDB (local or Atlas)

### 📥 Clone & Install

```bash
git clone https://github.com/yourusername/amparo-ai.git
cd amparo-ai
npm install
```

### 📄 Environment Variables

Create a `.env` file in the root:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
GEMINI_API_KEY=your_gemini_api_key
GNEWS_API_KEY=your_gnews_api_key
```

### 🚀 Start Servers

```bash
npm start         # Node.js backend
python python.py  # AI Python backend
```

---

## 📡 API Endpoints

### 🧾 Authentication

* `POST /register` – Register a new user
* `POST /login` – Login and receive JWT

### 👤 User Profile

* `GET /profile` – Fetch user info

### 💊 Medicines

* `GET /medicines`
* `POST /medicines`
* `PUT /medicines/:id`
* `DELETE /medicines/:id`

### ⏰ Reminders

* `GET /reminders`
* `POST /reminders`
* `PUT /reminders/:id`
* `DELETE /reminders/:id`

### 🤖 AI Interaction

* `POST /aiwork` – Send prompt to AI and receive response

---

## 🧪 Usage Guide

1. **Register/Login** to access your dashboard.
2. **Add your medical details and emergency contacts** in the profile.
3. **Manage medications** under the “Medicines” tab.
4. **Set reminders** to get notified on time.
5. **Use the AI chatbot** for questions and health queries.
6. **Enable mic** for voice commands.
7. **Trigger SOS** during emergencies to notify your contacts.

---

## 🤝 Contributing

We welcome contributions from the community!

```bash
# Steps:
1. Fork the repo
2. Create a new branch (git checkout -b feature-name)
3. Make your changes
4. Commit and push
5. Open a pull request
```

---

## 📄 License

Licensed under the [MIT License](LICENSE).

---

## 📬 Developers' Contact

Amparo was initially crafted by the team of 3 developers, It was the winning project of the Innoverse'36 Hackathon organised by SGT University, Gurugram. Here's the team.

* **Vineet Kumar Sahu** – [LinkedIn](https://www.linkedin.com/in/vineet-kumar-sahu/) Fullstack dev
* **Rakesh Kumar Gupta** – [LinkedIn](https://www.linkedin.com/in/rakesh02k04/)  The Python Dev
* **Sunaina Kasera** – [LinkedIn](https://www.linkedin.com/in/sunaina-kasera-259352319/)  UI/UX manager and presenter
> *Built with 💡 by developers who care about accessibility, safety, and seamless AI integration.*

---


