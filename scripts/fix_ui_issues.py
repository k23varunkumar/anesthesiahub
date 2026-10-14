with open('app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_actions_chunk = """      <Button className={`primary-action ${state.isolate?'active':''}`} onClick={()=>setState(s=>({...s,isolate:!s.isolate,explode:0}))}>
        <Focus size={18}/>{state.isolate?'Show surrounding anatomy':'Isolate structure'}<ChevronRight size={16}/>
      </Button>
      <Button className={`primary-action ${state.xray?'active':''}`} style={{background:state.xray?'#135364':'#ffffff',color:state.xray?'#ffffff':'#233644',border:'1px solid #18253620'}} onClick={()=>setState(s=>({...s,xray:!s.xray}))}>
        <Scan size={18}/>{state.xray?'Exit X-Ray mode':'X-Ray ghost anatomy'}<ChevronRight size={16}/>
      </Button>"""

new_actions_chunk = """      <div className="detail-action-row">
        <button
          type="button"
          className={`action-pill-btn ${state.isolate?'active':''}`}
          onClick={()=>setState(s=>({...s,isolate:!s.isolate,explode:0}))}
          title={state.isolate?'Show surrounding anatomy':'Isolate selected structure in 3D'}
        >
          <Focus size={15}/>
          <span>{state.isolate?'Show All':'Isolate'}</span>
        </button>
        <button
          type="button"
          className={`action-pill-btn xray ${state.xray?'active':''}`}
          onClick={()=>setState(s=>({...s,xray:!s.xray}))}
          title={state.xray?'Exit X-Ray transparency mode':'Enable Bayer semi-transparent X-Ray view'}
        >
          <Scan size={15}/>
          <span>{state.xray?'Exit X-Ray':'X-Ray Ghost'}</span>
        </button>
      </div>"""

if old_actions_chunk not in c:
    old_actions_chunk = old_actions_chunk.replace('\n', '\r\n')
    new_actions_chunk = new_actions_chunk.replace('\n', '\r\n')

assert old_actions_chunk in c, 'old_actions_chunk not found in app/page.tsx'
c = c.replace(old_actions_chunk, new_actions_chunk)

with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('Successfully updated app/page.tsx with 2-column action pills!')
