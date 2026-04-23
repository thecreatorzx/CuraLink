from pydantic import BaseModel
from typing import Optional

class ResearchRequest(BaseModel):
    disease: str
    query: str
    location: Optional[str] = ""
    patient_name: Optional[str] = ""
    history: Optional[list] = []    

class Publication(BaseModel):
    title: str
    abstract: str
    authors: list[str]
    year: int
    source: str         
    url: str
    relevance_score: float

class ClinicalTrial(BaseModel):
    title: str
    status: str
    eligibility: str
    location: str
    contact: str
    url: str

class ResearchResponse(BaseModel):
    condition_overview: str
    research_insights: str
    recommendations: str
    publications: list[Publication]
    clinical_trials: list[ClinicalTrial]
    expanded_query: str