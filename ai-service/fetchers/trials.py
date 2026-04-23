from curl_cffi.requests import AsyncSession
from schemas import ClinicalTrial

CT_V2_URL = "https://clinicaltrials.gov/api/v2/studies"

async def fetch_trials(disease: str, query: str, max_results: int = 50) -> list[ClinicalTrial]:
    trials = []
    
    headers = {
        "Accept": "application/json"
    }
    
    params = {
        "query.cond": disease,
        "query.term": query,
        "pageSize": max_results,
        "format": "json"
    }

    try:
        async with AsyncSession(impersonate="chrome", timeout=30) as client:
            resp = await client.get(CT_V2_URL, params=params, headers=headers)
            
            if resp.status_code != 200:
                print(f"  ❌ CT.gov API Error: {resp.status_code}")
                return []
                
            data = resp.json()
            studies = data.get("studies", [])
            
    except Exception as e:
        print(f"  ❌ Trial fetch failed: {e}")
        return []

    for study in studies:
        try:
            protocol = study.get("protocolSection", {})
            
            ident = protocol.get("identificationModule", {})
            nct_id = ident.get("nctId", "")
            title = ident.get("briefTitle", "No title")
            
            status_mod = protocol.get("statusModule", {})
            status = status_mod.get("overallStatus", "Unknown")
            
            desc_mod = protocol.get("descriptionModule", {})
            eligibility = desc_mod.get("briefSummary", "See publication for details")
            
            contacts_mod = protocol.get("contactsLocationsModule", {})
            locations_list = contacts_mod.get("locations", [])
            
            if locations_list:
                loc = locations_list[0]
                location_str = f"{loc.get('facility', 'Unknown Facility')}, {loc.get('city', '')}"
            else:
                location_str = "Location not provided"
                
            central_contacts = contacts_mod.get("centralContacts", [])
            if central_contacts:
                contact_str = central_contacts[0].get("name", "See trial link")
            else:
                contact_str = "See trial link"

            url = f"https://clinicaltrials.gov/study/{nct_id}" if nct_id else ""

            trials.append(ClinicalTrial(
                title=title,
                status=status,
                eligibility=eligibility[:400],
                location=location_str.strip(", "),
                contact=contact_str,
                url=url
            ))

        except Exception as e:
            print(f"    ⚠ Skipped trial parsing: {e}")
            continue

    print(f"  [Trials v2] Parsed {len(trials)} trials successfully")
    return trials