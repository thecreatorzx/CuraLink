import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import ResearchRequest, ResearchResponse
from fetchers.pubmed import fetch_pubmed
from fetchers.openalex import fetch_openalex
from fetchers.trials import fetch_trials
from pipeline.query_expander import expand_query
from pipeline.ranker import rank_publications
from pipeline.llm_reasoner import generate_response

app = FastAPI(title = "Curalink AI Helper")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_methods=["*"],
  allow_headers=["*"]
)
@app.get("/health")
async def health():
    return {"status": "ok", "service": "curalink-ai"}

@app.post("/research", response_model = ResearchResponse)
async def research(req: ResearchRequest):
  if not req.disease or not req.query:
    raise HTTPException(status_code=400, detail="disease and query are required")
  
  print(f"\nStep [1/5] Expanding: disease='{req.disease}' query ='{req.query}'")
  expanded = await expand_query(req.disease, req.query)
  print(f"       -> '{expanded}'")
  
  print("Step [2/5] Fetching from all sources...")
  pubmed_results, openalex_results = await asyncio.gather(
      fetch_pubmed(expanded, max_results=80),
      fetch_openalex(expanded, max_results=150)
)
  trial_results = await fetch_trials(req.disease, req.query, max_results=50)
  
  print(f"      PubMed:{len(pubmed_results)} OpenAlex:{len(openalex_results)} Trials:{len(trial_results)}")

  print("Step [3/5] Ranking...")
  all_pubs = pubmed_results + openalex_results
  top_pubs = rank_publications(all_pubs, expanded, top_k=8)
  top_trials = trial_results[:5]
  
  
  print("Step [4/5] Asking LLM...")
  llm_output = await generate_response(
    disease= req.disease,
    query= req.query,
    publications=top_pubs,
    trials=top_trials,
    history=req.history
  )
  
  print("Step [5/5] Done!")
  return ResearchResponse(
    condition_overview=llm_output.get("condition_overview", ""),
    research_insights=llm_output.get("research_insights", ""),
    recommendations=llm_output.get("recommendations", ""),
    publications = top_pubs,
    clinical_trials=top_trials,
    expanded_query=expanded
  )
  
  app.get