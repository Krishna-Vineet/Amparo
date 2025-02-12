

# **Amparo AI**


Amparo AI is a versatile personal assistant that extends its capabilities to include health-related features such as medication management, reminders, SOS alerts, and more. It combines the power of AI to provide users with a seamless experience for both general-purpose queries and health-specific needs.

---

## **Table of Contents**
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [AI Integration](#ai-integration)
- [Speech-to-Text and Text-to-Speech](#speech-to-text-and-text-to-speech)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## **Introduction**
Amparo AI is a general-purpose AI-powered assistant with extended health-related functionalities. It helps users manage their daily routines, stay on top of their health schedules, and interact with an AI chatbot for personalized advice and reminders.

Key benefits:
- Manage medications and reminders effortlessly.
- Receive timely alerts and emergency notifications.
- Interact with the AI via voice or text for health-related queries and general conversations.
- Get weather updates, news headlines, and more.

---

## **Features**
- **User Authentication**:
  - Secure login and registration using JWT (JSON Web Tokens).
- **Profile Management**:
  - View and update user profile details.
- **Medicine Management**:
  - Add, edit, and delete medications with dosage and schedule details.
- **Reminder Management**:
  - Set reminders for medications, appointments, and emergency alerts.
- **AI-Powered Chatbot**:
  - Ask questions and receive responses in natural language.
  - Health-related queries, weather updates, news headlines, and general conversations.
- **Emergency SOS Alerts**:
  - Send SMS and voice calls to emergency contacts using Twilio.
- **Light/Dark Theme Toggle**:
  - Switch between light and dark themes for better accessibility.

---

## **Installation**
### **Prerequisites**
- Node.js and npm installed.
- MongoDB instance running (local or cloud).
- Python installed (for AI backend).

### **Steps**
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/amparo-ai.git
   cd amparo-ai
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory and add the required variables:
     ```
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     TWILIO_ACCOUNT_SID=your_twilio_account_sid
     TWILIO_AUTH_TOKEN=your_twilio_auth_token
     TWILIO_PHONE_NUMBER=your_twilio_phone_number
     GEMINI_API_KEY=your_gemini_api_key
     GNEWS_API_KEY=your_gnews_api_key
     ```
4. Start the server:
   ```bash
   npm start
   ```
   
---

## **Usage**
1. **Register/Login**:
   - Create an account or log in using your phone number and password.
2. **Add Medications and Reminders**:
   - Navigate to the "Medicine" and "Reminders" sections to manage your health schedules.
3. **Interact with the AI**:
   - Use the chat interface to ask questions or get reminders.
   - Enable voice input by clicking the mic button.
4. **Emergency Alerts**:
   - Trigger SOS alerts to notify your emergency contacts.

---

## **API Endpoints**
- **Authentication**:
  - `POST /login`: Authenticate user.
  - `POST /register`: Register a new user.
- **Profile**:
  - `GET /profile`: Fetch user profile details.
- **Medicines**:
  - `GET /medicines`: Fetch all medicines for the user.
  - `POST /medicines`: Add a new medicine.
  - `PUT /medicines/:id`: Update an existing medicine.
  - `DELETE /medicines/:id`: Delete a medicine.
- **Reminders**:
  - `GET /reminders`: Fetch all reminders for the user.
  - `POST /reminders`: Add a new reminder.
  - `PUT /reminders/:id`: Update an existing reminder.
  - `DELETE /reminders/:id`: Delete a reminder.
- **AI Interaction**:
  - `POST /aiwork`: Send user queries to the AI backend.

---

## **AI Integration**
Amparo AI uses Google's Gemini Pro model for intent classification, response generation, and data processing. The AI backend handles:
- Weather updates using `wttr.in`.
- News headlines using the GNews API.
- Emergency alerts via Twilio SMS and voice calls.
- Natural language responses for user queries.

---

## **Speech-to-Text and Text-to-Speech**
Amparo AI leverages the Web Speech API for seamless voice interactions:
- **Speech-to-Text**:
  - The browser's `SpeechRecognition` API converts spoken words into text.
  - Users can speak their queries, which are then processed by the AI backend.
- **Text-to-Speech**:
  - The `speechSynthesis` API converts AI-generated responses into spoken words.
  - This ensures a hands-free experience for users.

---

## **Contributing**
We welcome contributions from the community! To contribute:
1. Fork the repository.
2. Create a new branch for your feature/bugfix.
3. Submit a pull request with a detailed description of your changes.

---

## **License**
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## **Support**
For questions or issues, please contact the developers:
- **Vineet Kumar Sahu**: [LinkedIn Profile](https://www.linkedin.com/in/vineet-kumar-sahu/)
- **Rakesh Kumar Gupta**: [LinkedIn Profile](https://www.linkedin.com/in/rakesh02k04/)
- **Sunaina Kasera**: [LinkedIn Profile](https://www.linkedin.com/in/sunaina-kasera-259352319/)

---
