from schemas import Publication
from datetime import datetime

CURRENT_YEAR = datetime.now().year

def score_publication(pub: Publication, query: str) -> float:
    year_gap = CURRENT_YEAR - pub.year
    recency = max(0.0, 1.0-(year_gap/10))
    
    query_words = set(query.lower().split())
    stopwords = {"the","a","an","and","or","of","in","for","with","on","is","are"}
    query_words -= stopwords
    
    text = (pub.title + " "+ pub.abstract).lower()
    if query_words: 
        matched = sum(1 for w in query_words if w in text)
        keyword_score = min(1.0, matched/ len(query_words))
    else:
        keyword_score = 0.5
        
    source_score = 1.0 if pub.source == "PubMed" else 0.85
    
    has_abstract = 0.1 if len(pub.abstract) > 100 else 0.0
    
    final = (recency * 0.35) + (keyword_score * 0.45) + (source_score * 0.15) + has_abstract
    return final

def rank_publications(publications: list[Publication], query: str, top_k: int = 8) -> list[Publication]:
    for pub in publications:
        pub.relevance_score = score_publication(pub, query)
        
    seen_titles = set()
    unique = []
    for pub in publications:
        key = pub.title[:60].lower().strip()
        if key not in seen_titles:
            seen_titles.add(key)
            unique.append(pub)
            
    ranked = sorted(unique, key = lambda p: p.relevance_score, reverse = True)
    return ranked[:top_k]