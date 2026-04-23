import httpx
import asyncio
from schemas import Publication

BASE_URL = "https://api.openalex.org/works"

async def _fetch_page(client: httpx.AsyncClient, query: str, page: int) -> list:
    resp = await client.get(BASE_URL, params={
        "search": query,
        "per-page": 50,
        "page": page,
        "sort": "relevance_score:desc",
        "filter": "from_publication_date:2018-01-01"
    }, headers={"User-Agent": "Curalink/1.0 (mailto:dev@curalink.com)"})
    return resp.json().get("results", [])

async def fetch_openalex(query: str, max_results: int = 150) -> list[Publication]:
    publications = []

    async with httpx.AsyncClient(timeout=30) as client:
        # Fetch 3 pages concurrently (~150 results total)
        pages = await asyncio.gather(
            _fetch_page(client, query, 1),
            _fetch_page(client, query, 2),
            _fetch_page(client, query, 3),
            return_exceptions=True
        )

        for page_results in pages:
            if isinstance(page_results, BaseException):
                continue
            for work in page_results:
                try:
                    title = work.get("title") or "No title"
                    abstract = work.get("abstract") or ""

                    # OpenAlex stores abstract as inverted index sometimes
                    if not abstract and work.get("abstract_inverted_index"):
                        words = {}
                        for word, positions in work["abstract_inverted_index"].items():
                            for pos in positions:
                                words[pos] = word
                        abstract = " ".join(words[k] for k in sorted(words))

                    year = work.get("publication_year") or 2020

                    authors = []
                    for authorship in work.get("authorships", [])[:5]:
                        name = authorship.get("author", {}).get("display_name", "")
                        if name:
                            authors.append(name)

                    doi = work.get("doi") or ""
                    url = doi if doi.startswith("http") else (f"https://doi.org/{doi}" if doi else work.get("id", ""))

                    publications.append(Publication(
                        title=title,
                        abstract=abstract[:600],
                        authors=authors,
                        year=year,
                        source="OpenAlex",
                        url=url,
                        relevance_score=0.0
                    ))
                except Exception:
                    continue

    return publications