import httpx
import json

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = "llama3.1:8b"

async def expand_query(disease: str, query: str) -> str:
    """
    Ask the LLM to combine disease + query into an optimized search string.
    Returns a single expanded query string.
    """
    prompt = f"""You are a medical research search specialist.

Disease: {disease}
User query: {query}

Generate ONE optimized PubMed/academic search query that combines both.
Rules:
- Combine disease name + user query intelligently
- Add 1-2 relevant medical synonyms or related terms
- Keep it under 10 words
- Return ONLY the query string, no explanation, no quotes

Example:
Disease: Parkinson's disease, Query: deep brain stimulation
Output: deep brain stimulation Parkinson's disease clinical outcomes

Now generate for the inputs above:"""

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(OLLAMA_URL, json={
            "model": MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "stream": False,
            "options": {"temperature": 0.3, "num_predict": 50}
        })
        data = resp.json()
        expanded = data["message"]["content"].strip()
        # Fallback: just combine them if LLM output is weird
        if len(expanded) > 100 or "\n" in expanded:
            expanded = f"{query} {disease}"
        return expanded