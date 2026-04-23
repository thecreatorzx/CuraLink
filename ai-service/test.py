import asyncio
import json
# Swap httpx out for curl_cffi
from curl_cffi.requests import AsyncSession

CT_V2_URL = "https://clinicaltrials.gov/api/v2/studies"

async def test_clinical_trials_api():
    disease = "Parkinson's disease"
    query = "deep brain stimulation"
    
    # We no longer need a massive User-Agent string because the 
    # impersonate="chrome" flag handles it automatically at the network level!
    headers = {
        "Accept": "application/json"
    }
    
    params = {
        "query.cond": disease,
        "query.term": query,
        "pageSize": 5, 
        "format": "json"
    }

    print(f"Testing CT.gov API v2 with Chrome TLS Spoofing...")

    # Impersonate a real Chrome browser's cryptographic signature
    async with AsyncSession(impersonate="chrome", timeout=30) as client:
        try:
            resp = await client.get(CT_V2_URL, params=params, headers=headers)
            
            print(f"HTTP Status Code: {resp.status_code}")
            
            if resp.status_code == 200:
                data = resp.json()
                studies = data.get("studies", [])
                
                print(f"Success! Retrieved {len(studies)} studies.\n")
                
                if studies:
                    print("=== PREVIEW OF FIRST RESULT (JSON) ===")
                    preview = json.dumps(studies[0], indent=2)
                    print(preview[:1500] + "\n\n... [TRUNCATED] ...")
            else:
                print(f"Failed to fetch. Raw response:\n{resp.text}")
                
        except Exception as e:
            print(f"Script crashed during request: {e}")

if __name__ == "__main__":
    asyncio.run(test_clinical_trials_api())