from __future__ import annotations
import os, json, hashlib, re, random
from pathlib import Path
from datetime import datetime, timezone, timedelta
from urllib.request import Request, urlopen

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'data'
TZ=timezone(timedelta(hours=-3))
TODAY=datetime.now(TZ).strftime('%d/%m/%Y')
ISO=datetime.now(TZ).strftime('%Y-%m-%d')

OFFICIAL_SOURCES=[
  ('Consulplan — concurso FHCGV','https://consulplan.azurewebsites.net/Concurso/Index/1606'),
  ('FHCGV — portal oficial','https://www.fhcgv.pa.gov.br/'),
  ('SEPLAD — Governo do Pará','https://www.seplad.pa.gov.br/'),
  ('Ministério da Saúde — RAPS','https://www.gov.br/saude/pt-br/composicao/saes/desmad/raps'),
]
KEYWORDS=('edital','retifica','inscri','prova','resultado','convoca','nomea','psiquiatr','concurso','c-224')

def clean_html(raw:str)->str:
    raw=re.sub(r'<script[\s\S]*?</script>',' ',raw,flags=re.I)
    raw=re.sub(r'<style[\s\S]*?</style>',' ',raw,flags=re.I)
    raw=re.sub(r'<[^>]+>',' ',raw)
    raw=re.sub(r'\s+',' ',raw)
    return raw.strip()

def fetch(url:str)->str:
    req=Request(url,headers={'User-Agent':'Mozilla/5.0 HCGV-study-monitor/1.0'})
    with urlopen(req,timeout=25) as r:
        return r.read().decode('utf-8','ignore')

def relevant_snippet(text:str)->str:
    lo=text.lower(); positions=[lo.find(k) for k in KEYWORDS if lo.find(k)>=0]
    if not positions: return text[:500]
    i=min(positions); return text[max(0,i-180):i+520].strip()

def update_sources():
    state_path=DATA/'source_status.json'
    old=json.loads(state_path.read_text()) if state_path.exists() else {}
    new={}; changes=[]
    for name,url in OFFICIAL_SOURCES:
        try:
            txt=clean_html(fetch(url))
            digest=hashlib.sha256(txt.encode()).hexdigest()
            new[url]={'hash':digest,'checked_at':TODAY,'name':name}
            if url in old and old[url].get('hash')!=digest:
                changes.append({'date':TODAY,'title':f'Alteração detectada em {name}','summary':relevant_snippet(txt)[:650],'url':url})
        except Exception as e:
            new[url]=old.get(url,{'hash':'','name':name})|{'checked_at':TODAY,'error':str(e)[:180]}
    state_path.write_text(json.dumps(new,ensure_ascii=False,indent=2))
    out={'generated_at':TODAY,'items':changes}
    (DATA/'updates.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))

def fallback_questions(n=8):
    bank=json.loads((DATA/'question_bank.json').read_text())
    seed=int(hashlib.sha256(ISO.encode()).hexdigest()[:12],16)
    rnd=random.Random(seed); rnd.shuffle(bank)
    chosen=[]; seen=set()
    for q in bank:
        if q['cat'] not in seen or len(chosen)>=4:
            chosen.append(q); seen.add(q['cat'])
        if len(chosen)>=n: break
    if len(chosen)<n: chosen.extend(bank[len(chosen):n])
    return chosen[:n]

def ai_questions(n=8):
    key=os.getenv('OPENAI_API_KEY')
    if not key: return None
    try:
        from openai import OpenAI
        client=OpenAI(api_key=key)
        prompt=f'''Gere {n} questões inéditas de múltipla escolha em português para o concurso FHCGV C-224, cargo Médico Psiquiatra, banca Consulplan. Distribua entre Psiquiatria, Clínica Geral, SUS/saúde pública, legislação estadual, Português, RLM e Ética, dando prioridade a Psiquiatria/Clínica/SUS. Cada questão deve ter 5 alternativas, uma correta e comentário didático curto. Não invente norma legal; quando a questão depender de lei, use apenas conhecimento consolidado. Retorne SOMENTE JSON no formato {{"questions":[{{"cat":"...","q":"...","opts":["..."],"answer":"A — ...","explanation":"..."}}]}}.'''
        resp=client.responses.create(model=os.getenv('OPENAI_MODEL','gpt-5.6-luna'),input=prompt)
        text=resp.output_text.strip()
        text=re.sub(r'^\x60\x60\x60json\s*|\s*\x60\x60\x60$','',text,flags=re.S)
        data=json.loads(text)
        qs=data.get('questions',[])
        return qs if len(qs)>=n else None
    except Exception as e:
        print('AI generation failed, using fallback:',e)
        return None

def update_questions():
    qs=ai_questions(8) or fallback_questions(8)
    (DATA/'daily_questions.json').write_text(json.dumps({'generated_at':TODAY,'questions':qs},ensure_ascii=False,indent=2))

if __name__=='__main__':
    DATA.mkdir(exist_ok=True)
    update_sources(); update_questions()
    print('Daily update complete:',TODAY)
