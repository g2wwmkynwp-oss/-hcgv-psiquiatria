"""Monitor técnico. Não gera conteúdo clínico ou legal automaticamente."""
import hashlib, json, random, re
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone, timedelta
from pathlib import Path
from urllib.request import Request, urlopen
DATA = Path(__file__).resolve().parents[1] / 'data'
NOW = datetime.now(timezone(timedelta(hours=-3)))
TODAY = NOW.strftime('%d/%m/%Y')
SOURCES = [('Consulplan — FHCGV', 'https://consulplan.azurewebsites.net/Concurso/Index/1606'), ('FHCGV', 'https://www.fhcgv.pa.gov.br/')]
def check(source):
    name, url = source
    try:
        req = Request(url, headers={'User-Agent': 'Mozilla/5.0 HCGV-study-monitor/2.0'})
        with urlopen(req, timeout=25) as response:
            raw = response.read().decode('utf-8', 'replace')
        text = re.sub(r'<[^>]+>', ' ', raw)
        text = re.sub(r'\s+', ' ', text).strip()
        if len(text) < 100: raise ValueError('Resposta insuficiente')
        return url, {'name': name, 'hash': hashlib.sha256(text.encode()).hexdigest(), 'last_success': TODAY, 'checked_at': TODAY}
    except Exception as exc:
        return url, {'name': name, 'checked_at': TODAY, 'error': str(exc)[:180]}
def main():
    path = DATA / 'source_status.json'
    old = json.loads(path.read_text()) if path.exists() else {}
    current, changes, errors = {}, [], []
    with ThreadPoolExecutor(max_workers=2) as pool:
        for url, result in pool.map(check, SOURCES):
            if 'error' in result:
                current[url] = old.get(url, {}) | result
                errors.append({'url': url, 'error': result['error']})
            else:
                current[url] = result
                if old.get(url, {}).get('hash') and old[url]['hash'] != result['hash']:
                    changes.append({'date': TODAY, 'title': 'Alteração técnica em ' + result['name'], 'summary': 'Confira a página oficial. A detecção não comprova retificação e pode refletir apenas a estrutura da página.', 'url': url})
    for filename, payload in [('source_status.json', current), ('updates.json', {'generated_at': TODAY, 'items': changes, 'errors': errors})]:
        (DATA / filename).write_text(json.dumps(payload, ensure_ascii=False, indent=2))
    bank = json.loads((DATA / 'question_bank.json').read_text())
    random.Random(NOW.strftime('%Y-%m-%d')).shuffle(bank)
    (DATA / 'daily_questions.json').write_text(json.dumps({'generated_at': TODAY, 'kind': 'Seleção do banco autoral; não são inéditas diárias.', 'questions': bank[:8]}, ensure_ascii=False, indent=2))
if __name__ == '__main__': main()
