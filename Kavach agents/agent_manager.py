import os
import google.generativeai as genai
from dotenv import load_dotenv
from agent_prompts import INFILTRATOR_PROMPT, FORENSIC_PROMPT, MENTOR_PROMPT

# Force reload dotenv and override system env vars to ensure we read from .env
load_dotenv(override=True)

# Temporarily remove GCP ADC to prevent scope/ALTS errors
if "GOOGLE_APPLICATION_CREDENTIALS" in os.environ:
    del os.environ["GOOGLE_APPLICATION_CREDENTIALS"]

# Configure API Key securely
api_key = os.environ.get("GEMINI_API_KEY", "").strip('"').strip("'").strip()
if api_key:
    genai.configure(api_key=api_key)
else:
    print("Warning: No GEMINI_API_KEY found.")

class AgentManager:
    def __init__(self, agent_type):
        self.agent_type = agent_type
        
        system_instruction = ""
        if agent_type == "Infiltrator":
            system_instruction = INFILTRATOR_PROMPT
        elif agent_type == "Forensic":
            system_instruction = FORENSIC_PROMPT
        elif agent_type == "Mentor":
            system_instruction = MENTOR_PROMPT
            
        try:
            # Auto-detect a working model
            available_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
            
            # Prefer 1.5-flash if available, else take the first one
            model_name = "gemini-1.5-flash" # Default attempt
            if "models/gemini-1.5-flash" in available_models:
                model_name = "models/gemini-1.5-flash"
            elif "models/gemini-1.5-flash-latest" in available_models:
                model_name = "models/gemini-1.5-flash-latest"
            elif "models/gemini-pro" in available_models:
                model_name = "models/gemini-pro"
            elif available_models:
                model_name = available_models[0]
                
            self.model = genai.GenerativeModel(
                model_name=model_name,
                system_instruction=system_instruction
            )
            self.chat = self.model.start_chat(history=[])
        except Exception as e:
            self.model = None
            self.chat = None
            print(f"Failed to initialize {agent_type}: {e}")

    def send_message(self, message):
        if not self.chat:
            return "API Key missing or invalid configuration. Please check your .env file."
        try:
            response = self.chat.send_message(message)
            return response.text
        except Exception as e:
            return f"Error communicating with AI: {e}"
