import httpx
import xml.etree.ElementTree as ET
from schemas import Publication

ESEARCH_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
EFETCH_URL  = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"

async def fetch_pubmed(query: str, max_results: int = 80) -> list[Publication]:
    
    publications = []
    
    async with httpx.AsyncClient(timeout=30) as client:
        search_resp = await client.get(ESEARCH_URL ,params={
            "db": "pubmed",
            "term": query,
            "retmax": max_results,
            "sort": "pub date",
            "retmode": "json"
        })
        search_data = search_resp.json()
        ids = search_data.get("esearchresult",{}).get("idlist", [])
    
        if not ids:
            return []
        
        fetch_resp = await client.post(EFETCH_URL, data = {
            "db" : "pubmed",
            "id": ",".join(ids),
            "retmode": "xml"
        })
        print(f"[DEBUG PubMed] Response status: {fetch_resp.status_code}")
        root = ET.fromstring(fetch_resp.text)
        
        for article in root.findall(".//PubmedArticle"):
            try:
                title = article.findtext(".//ArticleTitle") or "No title"
                abstract = article.findtext(".//AbstractText") or ""
                year_el = article.find(".//PubDate/Year")
                year = int(year_el.text) if year_el is not None and year_el.text is not None else 2020

                authors  = []
                for author in article.findall(".//Author") [:5]:
                    last = author.findtext("LastName") or ""
                    fore = author.findtext("ForeName") or ""
                    if last: 
                        authors.append(f"{last} {fore}".strip())
                pmid = article.findtext(".//PMID") or ""
                url = f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/" if pmid else ""
                publications.append(Publication(
                        title=title, 
                        abstract=abstract[:600],
                        authors= authors, 
                        year=year, 
                        source= "PubMed",
                        url=url, 
                        relevance_score=0.0
                    ))
            except Exception as e:
                print("Error: ", e)
                continue
            
        return publications