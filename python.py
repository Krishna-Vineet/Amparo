import os
import sys
import json
from dotenv import load_dotenv
import datetime
import asyncio
import requests
import logging
from typing import Dict, Any
try:
    from twilio.rest import Client
    HAS_TWILIO = True
except ImportError:
    HAS_TWILIO = False
from google import genai

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration class with environment variables
class Config:
    ACCOUNT_SID = os.getenv("ACCOUNT_SID", "")
    AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_PHONE = os.getenv("TWILIO_PHONE_NUMBER", "")
    WEATHER_KEY = os.getenv("WEATHER_API_KEY", "")
    GEMINI_KEY = os.getenv("GEMINI_API_KEY", "")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    EMERGENCY_CONTACT = os.getenv("EMERGENCY_CONTACT", "")
    GNEWS_API_KEY = os.getenv("GNEWS_API_KEY", "")

# logger.info(f"Loaded TWILIO_ACCOUNT_SID: {Config.ACCOUNT_SID}")
# logger.info(f"Loaded WEATHER_API_KEY: {Config.WEATHER_KEY}")
# Service initialization
genai_client = genai.Client(api_key=Config.GEMINI_KEY)
if HAS_TWILIO and Config.ACCOUNT_SID and Config.AUTH_TOKEN:
    try:
        twilio_client = Client(Config.ACCOUNT_SID, Config.AUTH_TOKEN)
    except Exception as e:
        logger.error(f"Failed to initialize Twilio client: {e}")
        twilio_client = None
else:
    twilio_client = None

class AIAssistant:
    def __init__(self, user_profile=None):
        self.api_key = Config.GROQ_API_KEY
        self.model_name = "llama-3.1-8b-instant"
        self.user_profile = user_profile or {}

    def _query_ai(self, prompt: str, system_message: str = "You are Amparo, a friendly voice assistant.") -> str:
        """Helper to query Groq API."""
        if not self.api_key:
            return "AI configuration missing."
        
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        data = {
            "model": self.model_name,
            "messages": [
                {"role": "system", "content": system_message},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 150
        }
        try:
            response = requests.post(url, headers=headers, json=data, timeout=10)
            response.raise_for_status()
            return response.json()['choices'][0]['message']['content'].strip()
        except Exception as e:
            logger.error(f"Groq API error: {str(e)}")
            return "I'm having trouble connecting to my brain right now."

    @staticmethod
    def humanify_weather(weather_data: str) -> str:
        """Use AI to make the weather response more conversational."""
        prompt = (
            f"Convert this raw weather data into a natural, conversational response:\n"
            f"{weather_data}\n"
            f"and respond in 25 to 50 words in total without markdown, * symbol, or emojis, etc."
        )
        ai = AIAssistant()
        return ai._query_ai(prompt)
    def _build_context(self) -> str:
        """Build a context string based on user profile."""
        context = []
        user_info = self.user_profile.get("user", {})
        
        if user_info.get("name"):
            context.append(f"User's name: {user_info['name']}")
        if user_info.get("medicalIssues"):
            context.append(f"Medical issues: {user_info['medicalIssues']}")
        if self.user_profile.get("reminders"):
            reminders = ", ".join([r["message"] for r in self.user_profile["reminders"]])
            context.append(f"Reminders: {reminders}")
        return "\n".join(context)

    def classify_intent(self, text: str) -> str:
        """Classify user input into action categories."""
        context = self._build_context()
        prompt = (
            f"User Profile Context:\n{context}\n\n"
            f"User Input: \"{text}\"\n\n"
            "Categorize this input into exactly one: sos, weather, news, greetings, health, reminder, conversation.\n"
            "Reply with ONLY the category name."
        )
        intent = self._query_ai(prompt, system_message="You are a classifier that returns only single words.")
        return intent.lower()

    def generate_response(self, prompt: str) -> str:
        """Generate natural conversational response."""
        context = self._build_context()
        full_prompt = (
            f"User Context: {context}\n"
            f"User says: \"{prompt}\""
        )
        system_msg = "You are Amparo, a friendly health assistant. Respond in 1-2 short sentences. No markdown, no emojis."
        return self._query_ai(full_prompt, system_message=system_msg)

    def extract_city(self, text: str) -> str:
        """Extract location from user input."""
        prompt = f"Extract only the city name from this text: {text}. If none, return 'Gurugram'."
        return self._query_ai(prompt, system_message="Return only the city name.")
    
class WeatherService:
    @staticmethod
    def get_report(city: str) -> str:
        """Get simplified weather report using wttr.in."""
        try:
            # Fetch weather data from wttr.in
            response = requests.get(
                f"http://wttr.in/{city}?format=%l:+%C+%t+%w+%h",
                timeout=10
            )
            response.raise_for_status()
            weather_data = response.text.strip()
            # logger.info(f"Raw weather data from wttr.in: {weather_data}")

            # Use AI to humanify the response
            humanified_response = AIAssistant.humanify_weather(weather_data)
            return humanified_response
        except Exception as e:
            logger.error(f"Weather API error: {str(e)}")
            return "Weather service unavailable. Try again later."

    @staticmethod
    def humanify_weather(weather_data: str) -> str:
        """Alias for AIAssistant.humanify_weather."""
        return AIAssistant.humanify_weather(weather_data)
        
class EmergencyService:
    @staticmethod
    def send_alert(to_number) -> str:
        """Handle emergency communications."""
        try:
            # Send SMS
            # twilio_client.messages.create(
            #     body="SOS! I need help. Please contact me immediately.",
            #     from_=Config.TWILIO_PHONE,
            #     to=to_number
            # )
            # Initiate voice call
            # twilio_client.calls.create(
            #     twiml="<Response><Say>SOS! I need help! Please respond.</Say></Response>",
            #     from_=Config.TWILIO_PHONE,
            #     to=to_number
            # )
            return f"MOCK_SOS: Emergency alert simulated for {to_number}"
        except Exception as e:
            logger.error(f"Emergency service error: {str(e)}")
            return "Emergency services unavailable. Try again."

class ResponseHandler:
    def __init__(self, user_profile=None):
        self.ai = AIAssistant(user_profile=user_profile)
        self.weather = WeatherService()
        self.emergency = EmergencyService()
        self.user_profile = user_profile or {}

    def _format_response(self, message: str, status: int = 200) -> Dict[str, Any]:
        """Helper method to format the response."""
        return {
            "status": status,
            "message": message,
            "timestamp": datetime.datetime.now().isoformat()
        }

    async def process_input(self, text: str) -> Dict[str, Any]:
        """Main processing pipeline"""
        if not text.strip():
            return self._format_response("Please provide input", 400)
        try:
            intent = self.ai.classify_intent(text)
            # logger.info(f"Processed intent: {intent} | User: {self.user_profile.get('name', 'Unknown')}")
            if intent == "sos":
                emergency_contacts = self.user_profile.get("emergencyContacts", [])
                to_number = Config.EMERGENCY_CONTACT
                if emergency_contacts and isinstance(emergency_contacts, list):
                    # Get the phone number of the first contact
                    to_number = emergency_contacts[0].get("phone", Config.EMERGENCY_CONTACT)
                return self._handle_emergency(to_number)
            elif intent == "weather":
                return self._handle_weather(text)
            elif intent == "greetings":
                return self._handle_greeting(text)
            elif intent == "reminder":
                return self._handle_reminder(text)
            elif intent == "health":
                return self._handle_health(text)
            elif intent == "news":
                return self._handle_news(text)
            else:
                return self._handle_conversation(text)
        except Exception as e:
            logger.error(f"Processing error: {str(e)}")
            return self._format_response("System error. Please try again.", 500)

    def _handle_emergency(self, to_number) -> Dict[str, Any]:
        """Handle emergency alerts."""
        result = self.emergency.send_alert(to_number)
        return self._format_response(result)

    def _handle_weather(self, text: str) -> Dict[str, Any]:
        """Handle weather requests."""
        city = self.ai.extract_city(text)
        report = self.weather.get_report(city)
        return self._format_response(report)

    def _handle_news(self, text: str) -> Dict[str, Any]:
        """Handle news-related queries."""
        try:
            # Fallback to GNews API
            response = requests.get(
                "https://gnews.io/api/v4/top-headlines",
                params={
                    "country": "in",  # Focus on India
                    "lang": "en",  # English language
                    "max": 5,
                    "apikey": Config.GNEWS_API_KEY
                },
                timeout=10
            )
            response.raise_for_status()
            data = response.json()
            if data.get("totalArticles", 0) > 0:
                news_list = []
                articles = data.get("articles", [])
                for article in articles:
                    title = article.get("title", " ")
                    news_list.append(f"- {title}")
                news_message = "Here are the latest news headlines:\n" + "\n".join(news_list)
                return self._format_response(news_message)
            else:
                return self._format_response("No news available at the moment.")
        except Exception as e:
            logger.error(f"GNews API error: {str(e)}")
            return self._format_response("Failed to fetch news. Please try again later.")

    def _handle_greeting(self, text: str) -> Dict[str, Any]:
        """Handle greetings with personalized responses."""
        try:
            response = self.ai.generate_response(
                f"Give a personalised greeting to this user based on its detail and current time, "
                f"you can also remind him about his reminders and medicines if they are happening in 2-3 days. "
                f"Here is the user's details:\n{self.user_profile}\n\n and user says: {text}"
            )
            return self._format_response(response)
        except Exception as e:
            logger.error(f"Greeting generation error: {str(e)}")
            return self._format_response("Hi there, Amparo this side, how can I help you?")

    def _handle_reminder(self, text: str) -> Dict[str, Any]:
        """Handle reminders."""
        reminders = self.user_profile.get("reminders", [])
        if not reminders:
            return self._format_response("You don't have any reminders set.")
        reminder_list = "\n".join([f"- {r['message']} at {r['time']}" for r in reminders])
        return self._format_response(f"Here are your reminders:\n{reminder_list}")

    def _handle_health(self, text: str) -> Dict[str, Any]:
        """Handle health-related queries."""
        try:
            response = self.ai.generate_response(
                f"Tell user about his health, give remedial solutions and guide him over his issues in short and concise way. "
                f"Here is the user's details:\n{self.user_profile}\n\n and user says: {text}"
            )
            return self._format_response(response)
        except Exception as e:
            logger.error(f"Health query error: {str(e)}")
            return self._format_response("Hi there, you are all fine, be healthy and take care.")

    def _handle_conversation(self, text: str) -> Dict[str, Any]:
        """Handle general conversational responses."""
        response = self.ai.generate_response(
            f"Respond conversationally in 1-2 short sentences without markdown, * symbol, or emojis, etc.\n"
            f"User says: \"{text}\""
        )
        return self._format_response(response)

if __name__ == "__main__":
    try:
        # Read JSON input from stdin
        input_json = sys.stdin.read().strip()
        request_data = json.loads(input_json)
        
        text = request_data.get('text', '')
        user_profile = request_data.get('user_profile', {})
        
        handler = ResponseHandler(user_profile=user_profile)
        response = asyncio.run(handler.process_input(text))
        print(json.dumps(response))
        sys.stdout.flush()
    except Exception as e:
        logger.critical(f"Critical system error: {str(e)}")
        print(json.dumps({
            "status": 500,
            "message": "System malfunction",
            "timestamp": datetime.datetime.now().isoformat()
        }))
        sys.exit(1)