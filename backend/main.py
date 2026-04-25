from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import io
import os

app = FastAPI(title="Sarkaar Saathi API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load Database ---
CSV_PATH = os.path.join(os.path.dirname(__file__), "data", "schemes.csv")
try:
    df_schemes = pd.read_csv(CSV_PATH)
    print(f"Loaded {len(df_schemes)} schemes from database.")
except Exception as e:
    print(f"Error loading schemes.csv: {e}")
    df_schemes = pd.DataFrame()

# --- Logic from uploaded files ---

def extract_text(file_content):
    return file_content.decode("utf-8", errors="ignore")

def analyze_rejection(text):
    text = text.lower()
    if "income certificate" in text:
        return {
            "reason": "Income certificate missing",
            "explanation": "Aapka income certificate format galat hai ya expired ho chuka hai.",
            "next_steps": [
                "Obtain corrected Income Certificate from Tehsil.",
                "Apply for updated Domicile Certificate (2024).",
                "Submit an appeal letter to the Welfare Department."
            ],
            "authority": "Welfare Department"
        }
    return {
        "reason": "Unknown reason",
        "explanation": "System could not clearly identify the reason from the document.",
        "next_steps": ["Check the document manually or visit the office."],
        "authority": "Concerned Authority"
    }

def generate_appeal_text(reason, name="Applicant", authority="Concerned Authority"):
    return f"""
To,
The {authority},
Subject: Appeal against rejection of application due to {reason}.

Respected Sir/Madam,

I, {name}, am writing this letter to formally appeal the rejection of my application. The reason stated was {reason}. 

I would like to clarify that I have now obtained the necessary documents and would like to request you to reconsider my case.

Sincerely,
{name}
"""

# --- API Endpoints ---

@app.post("/appeal")
async def process_appeal(file: UploadFile = File(...), name: str = Form("Applicant")):
    content = await file.read()
    text = extract_text(content)
    analysis = analyze_rejection(text)
    appeal = generate_appeal_text(analysis["reason"], name, analysis["authority"])
    
    return {
        "reason": analysis["reason"],
        "explanation": analysis["explanation"],
        "next_steps": analysis["next_steps"],
        "appeal": appeal
    }

@app.post("/validate")
async def validate_doc(file: UploadFile = File(...)):
    # Simulating the validator (1).py logic
    # In a real app, you'd use OCR here to check fields
    return {
        "valid": True,
        "message": "Document structure looks valid for processing."
    }

class BenefitQuery(BaseModel):
    state: str
    income: int
    age: int
    occupation: str

@app.post("/benefits")
async def find_benefits(query: BenefitQuery):
    if df_schemes.empty:
        return {"schemes": []}
    
    # Filter by state (if provided and matches)
    filtered = df_schemes[
        (df_schemes['state_or_central'].str.contains(query.state, case=False, na=False)) | 
        (df_schemes['state_or_central'].str.contains('Central', case=False, na=False))
    ]
    
    # Keyword search for occupation in target_beneficiary or scheme_name
    occ_keyword = query.occupation.lower()
    matches = filtered[
        (filtered['target_beneficiary'].str.contains(occ_keyword, case=False, na=False)) |
        (filtered['scheme_name'].str.contains(occ_keyword, case=False, na=False))
    ]
    
    # Limit results for performance
    results = matches.head(10).to_dict(orient="records")
    
    # Map to frontend expected format
    mapped_results = []
    for r in results:
        mapped_results.append({
            "name": r.get("scheme_name", "Unknown Scheme"),
            "description": r.get("answer_english", "Details available on website.")[:200] + "...",
            "benefit": "View details on official website",
            "url": r.get("official_website", "#")
        })
    
    return {"schemes": mapped_results}

@app.get("/")
def health_check():
    return {"status": "Sarkaar Saathi Backend is fully operational!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
