from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import absolu depuis app
from app.database import engine, Base
from app.models.entretien_annuel import EntretienAnnuel
from app.models.resume_annee import ResumeAnnee  
from app.models.appreciation_objectif import AppreciationObjectif

# Création tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="RH Tool API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routers import entretien, pdf
app.include_router(entretien.router)
app.include_router(pdf.router)

@app.get("/")
def root():
    return {"message": "RH Tool API"}