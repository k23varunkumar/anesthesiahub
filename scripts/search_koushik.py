import fitz

doc_koushik = fitz.open('d:/Machas/Path to Medal/Books/Anesthesiareview DNB Koushik.pdf')

queries = ['cricoid pressure', 'laryngeal nerve', 'tuffier', 'ligamentum flavum', 'internal jugular']
for q in queries:
    for p in range(len(doc_koushik)):
        txt = doc_koushik[p].get_text()
        if q in txt.lower():
            start = max(0, txt.lower().find(q) - 50)
            snippet = txt[start:start+300].replace('\n', ' ')
            clean_snippet = snippet.encode('ascii', 'ignore').decode('ascii')
            print(f'Koushik "{q}": Page {p+1}')
            print(f'  Snippet: {clean_snippet}')
            break
