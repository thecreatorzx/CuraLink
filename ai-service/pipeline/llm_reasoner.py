import httpx
import json

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = "llama3.1:8b"

def _build_context(publications, trials) -> str:
    context = "=== RESEARCH PUBLICATIONS === \n"
    for i, pub in enumerate(publications[:6], 1):
        context += f"\n[{i}] {pub.title} - {pub.source}\n"
        context += f"Authors: {', '.join(pub.authors[:3])}\n"
        context += f"Abstract: {pub.abstract[:500]}\n"
    
    context +=  "\n=== CLINICAL TRIALS ===\n"
  
    for i, trial in enumerate(trials[:4], 1):
        context += f"\n[{i}] {trial.title}\n"
        context += f"Status: {trial.status} | Location: {trial.location}\n"
        context += f"Eligibility: {trial.eligibility[:200]}\n"
    
    return context

def _build_messages(disease: str, query: str, context: str, history: list) -> list:
    system_msg = {
        "role": "system",
        "content": f""" You are Curalink, an expert AI medical research assistant.
        You are helping with: {disease}
        
        RULES:
        - Only use facts from the research context below
        - Never invent facts not in the context or hallucinate
        - Cite papers as [1], [2] etc in output.
        - Be specific and critical, not generic or vague"""
    }
  
    messages = [system_msg]

    for msg in history[-6:]:
        messages.append(msg)
    
    user_content = f""" Research context:
    {context}
    User's question : {query}
  
    Respond in this exact JSON format, no other format or text:
    {{
        "condition_overview": "2-3 sentences about {disease} relevant to this query",
        "research_insights": "Detailed paragraph citing papers as [1],[2] with specific findings",
        "recommendations": "Specific research-backed recommendations for this query."
    }}"""
  
    messages.append({"role":"user", "content": user_content})
    return messages


async def generate_response(disease, query, publications, trials, history) -> dict:
    context = _build_context(publications, trials)
    messages = _build_messages(disease, query, context, history)
  
    async with httpx.AsyncClient(timeout=120) as client:
        resp = await client.post(OLLAMA_URL, json ={
            "model": MODEL,
            "messages": messages, 
            "stream": False,
            "format": "json", 
            "options": {
                "temperature": 0.2,
                "num_predict": 800,
                "top_p": 0.9,
                "num_ctx": 8192
            }
        })
        
        raw = resp.json().get("message", {}).get("content", "").strip()
    
        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            parsed = {
                "condition_overview": f"Research results for {disease} — {query}",
                "research_insights": raw,
                "recommendations": "Please review the source publications for detailed guidance."
            }
        
        return parsed