from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import MessageInput
from models import detect_logic, explain_logic, action_logic, simulate_logic
from database import log_detection, get_history

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Kavach AI Backend Running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/detect")
def detect(data: MessageInput):
    if not data.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    classification, confidence, reason = detect_logic(data.text)

    log_detection(data.text, classification, confidence)

    return {
        "classification": classification,
        "confidence": confidence,
        "reason": reason
    }

@app.post("/explain")
def explain(data: MessageInput):
    return {"indicators": explain_logic(data.text)}

@app.post("/action")
def action(data: MessageInput):
    classification, _, _ = detect_logic(data.text)
    return {"actions": action_logic(classification)}

@app.get("/simulate")
def simulate():
    return {"message": simulate_logic()}

@app.get("/history")
def history():
    return {"history": get_history()}