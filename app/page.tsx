import {flushSync} from 'react-dom';
import {registerAtlasTools} from './agent-tools';
import {useEffect,useMemo,useRef,useState} from 'react';
import {Activity,ArrowUpRight,ChevronRight,Focus,Info,Layers3,Pause,RotateCcw,RotateCw,Search,X,Wind,Shield,HeartPulse,Zap,Heart,Syringe,Scan,Eye,GraduationCap,BookOpen,HelpCircle,CheckCircle2} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Slider} from '@/components/ui/slider';
import {Switch} from '@/components/ui/switch';
import {Sheet,SheetContent,SheetTitle,SheetDescription} from '@/components/ui/sheet';
import {Combobox,ComboboxInput,ComboboxContent,ComboboxList,ComboboxItem,ComboboxEmpty} from '@/components/ui/combobox';
import AnatomyScene from './scene';
import {DEFAULT_VISIBLE,SYSTEMS,EXPLANATIONS,explanation,type Atlas,type Concept,type SceneState,type SystemId,type View} from './anatomy';
import {CLINICAL_PRESETS,getAnesthesiaPearl,type ClinicalPreset} from './anesthesia-presets';
import {getPGTopic,OSCE_SPOTTERS,type PGTopicData,type OSCESpotter} from './pg-exam-data';
import {resolveAssetUrl} from '@/lib/utils';

const initial:SceneState={explode:0,visible:DEFAULT_VISIBLE,selected:[],isolate:false,xray:false,autoFocus:true,view:'three-quarter',rotate:false,reset:0};

export default function Home(){
 const detailTitle=useRef<HTMLHeadingElement>(null);
 const [atlas,setAtlas]=useState<Atlas|null>(null);
 const [state,setState]=useState(initial);
 const [progress,setProgress]=useState(0);
 const [error,setError]=useState('');
 const [panel,setPanel]=useState<'layers'|'search'|null>(null);
 const [details,setDetails]=useState(false);
 const [about,setAbout]=useState(false);
 const [query,setQuery]=useState('');
 const [chosen,setChosen]=useState<Concept|null>(null);
 const [activePreset,setActivePreset]=useState<string>('all');
 const [activeDetailTab,setActiveDetailTab]=useState<'clinical'|'viva'>('clinical');
 const [spotterIndex,setSpotterIndex]=useState<number|null>(null);
 const [showSpotterAnswer,setShowSpotterAnswer]=useState<boolean>(false);

 useEffect(()=>{
  const abort=new AbortController();
  setProgress(0);
  setError('');
  setAtlas(null);
  setChosen(null);
  setDetails(false);
  setState({...initial,visible:DEFAULT_VISIBLE});
  fetch(resolveAssetUrl('/models/atlas.json'),{signal:abort.signal})
    .then(r=>{if(!r.ok)throw new Error('The anatomy catalogue could not be loaded.');return r.json();})
    .then(data=>setAtlas(data as Atlas))
    .catch(e=>{if(e.name!=='AbortError')setError(e.message);});
  return()=>abort.abort();
 },[]);

 useEffect(()=>{
  const key=(e:KeyboardEvent)=>{
    if(e.key==='/'&&!(e.target instanceof HTMLInputElement)&&!(e.target instanceof HTMLTextAreaElement)){
      e.preventDefault();
      setPanel('search');
      setDetails(false);
    }
  };
  window.addEventListener('keydown',key);
  return()=>window.removeEventListener('keydown',key);
 },[]);

 const parts=useMemo(()=>new Map(atlas?.parts.map(p=>[p.id,p])),[atlas]);
 const counts=useMemo(()=>Object.fromEntries(SYSTEMS.map(s=>[s.id,atlas?.parts.filter(p=>p.system===s.id).length??0])),[atlas]);
 const activeSystems=SYSTEMS.filter(s=>counts[s.id]>0);
 const selectedParts=state.selected.map(id=>parts.get(id)).filter(p=>!!p),selected=selectedParts[0],system=SYSTEMS.find(s=>s.id===selected?.system);
 const visibleCount=atlas?.parts.filter(p=>state.isolate?state.selected.includes(p.id):state.visible.includes(p.system)||state.selected.includes(p.id)).length??0;

 const results=useMemo(()=>{
  if(!atlas)return[];
  const term=query.toLowerCase().trim();
  if(!term)return ['cricoid cartilage','trachea','thyroid cartilage','epiglottis','spinal cord','sacrum','internal jugular vein','subclavian vein','radial artery','femoral artery'].map(name=>atlas.concepts.find(c=>c.name.toLowerCase()===name)).filter((x):x is Concept=>!!x);
  return atlas.concepts.filter(c=>c.name.toLowerCase().includes(term)||c.id.toLowerCase().includes(term)).sort((a,b)=>a.name.length-b.name.length).slice(0,80);
 },[atlas,query]);

 const choose=(c:Concept)=>{
  setChosen(c);
  setState(s=>({...s,selected:c.elements,isolate:false,rotate:false}));
  setDetails(true);
  setPanel(null);
  setSpotterIndex(null);
  setActiveDetailTab('clinical');
 };

 useEffect(()=>{
  if(!atlas)return;
  return registerAtlasTools(atlas,c=>flushSync(()=>choose(c)));
 },[atlas]);

 const choosePart=(id:string)=>{
  const p=parts.get(id);
  if(!p)return;
  setChosen({id:p.conceptId,name:p.name,elements:[id]});
  setState(s=>({...s,selected:[id],isolate:false,rotate:false}));
  setDetails(true);
  setPanel(null);
  setSpotterIndex(null);
  setActiveDetailTab('clinical');
 };

 const toggle=(id:SystemId)=>{
  setDetails(false);
  setState(s=>({...s,selected:[],isolate:false,visible:s.visible.includes(id)?s.visible.filter(x=>x!==id):[...s.visible,id]}));
 };

 const reset=()=>{
  setState(s=>({...initial,visible:DEFAULT_VISIBLE,reset:s.reset+1,xray:false}));
  setChosen(null);
  setDetails(false);
  setPanel(null);
  setActivePreset('all');
  setSpotterIndex(null);
 };

 const openPanel=(next:'layers'|'search')=>{
  setDetails(false);
  setPanel(p=>p===next?null:next);
 };

 const applyPreset=(preset:ClinicalPreset)=>{
  setActivePreset(preset.id);
  setDetails(false);
  setPanel(null);
  setSpotterIndex(null);
  setState(s=>({
    ...s,
    visible:preset.systems,
    view:preset.view,
    explode:preset.explode??0,
    selected:[],
    isolate:false,
    reset:s.reset+1,
    rotate:false
  }));
 };

 const startSpotter=(index:number)=>{
  const spotter=OSCE_SPOTTERS[index];
  if(!spotter||!atlas)return;
  const found=atlas.concepts.find(c=>c.name.toLowerCase()===spotter.targetStructureName.toLowerCase())
    ||atlas.parts.find(p=>p.name.toLowerCase().includes(spotter.targetStructureName.toLowerCase()));
  if(found){
    const elements='elements' in found?found.elements:[found.id];
    setChosen('elements' in found?found:{id:found.conceptId,name:found.name,elements:[found.id]});
    setState(s=>({
      ...s,
      selected:elements,
      isolate:false,
      xray:true,
      rotate:false,
      reset:s.reset+1
    }));
  }
  setSpotterIndex(index);
  setShowSpotterAnswer(false);
  setDetails(false);
  setPanel(null);
 };

 const currentPreset=CLINICAL_PRESETS.find(p=>p.id===activePreset);
 const pearl=chosen?getAnesthesiaPearl(chosen.name):null;
 const pgData=chosen?getPGTopic(chosen.name):null;
 const currentSpotter=spotterIndex!==null?OSCE_SPOTTERS[spotterIndex]:null;

 return <main className="studio">
  {atlas&&<AnatomyScene atlas={atlas} state={{...state,inspectorOpen:details&&selectedParts.length>0}} onSelect={choosePart} onProgress={n=>{setProgress(n);if(n===100)setError('');}} onError={setError}/>}
  <div className="vignette"/>
  
  <header className="identity">
   <div className="eyebrow"><span className="status-dot"/> ANESTHESIA PG STUDY & EXAM PORTAL</div>
   <h1>AnesthesiaHub<Badge variant="outline" className="edition">MD/DNB Edition</Badge></h1>
   <div className="identity-meta">3D Clinical Atlas <span>·</span> Sourced from Ganga Hospital & DNB Koushik</div>
  </header>

  <div className="clinical-presets-bar glass" aria-label="Clinical Anesthesia Presets">
   {CLINICAL_PRESETS.map(p=>(
    <button
      key={p.id}
      type="button"
      className={`clinical-preset-btn ${activePreset===p.id?'active':''}`}
      onClick={()=>applyPreset(p)}
      title={p.description}
    >
      <span>{p.name}</span>
      <span className="preset-badge">{p.badge}</span>
    </button>
   ))}
  </div>

  {currentPreset&&currentPreset.id!=='all'&&spotterIndex===null&&(
   <div className="clinical-guide-banner glass">
    <div>
      <strong>{currentPreset.name} Guide</strong>
      <span>{currentPreset.guide}</span>
    </div>
    <Button
      variant="ghost"
      className="icon-button"
      style={{minWidth:22,minHeight:22,padding:0,marginLeft:'auto'}}
      onClick={()=>applyPreset(CLINICAL_PRESETS[0])}
      title="Dismiss guide"
    >
      <X size={14}/>
    </Button>
   </div>
  )}

  {currentSpotter&&(
   <div className="spotter-station-card glass" role="dialog" aria-label="OSCE Spotter Station">
    <div className="spotter-header">
      <span className="spotter-station-badge">OSCE STATION {spotterIndex!+1} OF {OSCE_SPOTTERS.length}</span>
      <Button
        variant="ghost"
        className="icon-button"
        style={{minWidth:24,minHeight:24,padding:0}}
        onClick={()=>{setSpotterIndex(null);setState(s=>({...s,selected:[],xray:false}));}}
        title="Exit OSCE Spotter"
      >
        <X size={15}/>
      </Button>
    </div>
    <div className="spotter-title">{currentSpotter.title}</div>
    <div className="spotter-prompt">{currentSpotter.prompt}</div>
    <div className="spotter-q-box">
      {currentSpotter.questions.map((q,idx)=>(
        <div key={idx} className="spotter-q-item">{q}</div>
      ))}
    </div>
    {showSpotterAnswer&&(
      <div className="spotter-ans-container">
        <div style={{fontSize:11,fontWeight:700,color:'#145e72',textTransform:'uppercase',letterSpacing:'0.06em',display:'flex',alignItems:'center',gap:5}}>
          <CheckCircle2 size={13}/> Model Exam Answers
        </div>
        {currentSpotter.modelAnswers.map((ans,idx)=>(
          <div key={idx} className="spotter-ans-item">{ans}</div>
        ))}
        <div style={{fontSize:11,color:'#8c4a12',background:'#fff7ed',padding:'6px 8px',borderRadius:5,marginTop:4}}>
          <strong>High-Yield Viva Tip: </strong>{currentSpotter.highYieldTip}
        </div>
      </div>
    )}
    <div className="spotter-actions">
      <button
        type="button"
        className="spotter-btn-reveal"
        onClick={()=>setShowSpotterAnswer(!showSpotterAnswer)}
      >
        {showSpotterAnswer?'Hide Answers':'Reveal Model Answer'}
      </button>
      <button
        type="button"
        className="spotter-btn-next"
        onClick={()=>startSpotter((spotterIndex!+1)%OSCE_SPOTTERS.length)}
      >
        Next Station →
      </button>
    </div>
   </div>
  )}

  <nav className="top-actions" aria-label="Explorer panels">
   <Button
     variant="ghost"
     className={`pg-quiz-btn ${spotterIndex!==null?'active':''}`}
     style={{background:spotterIndex!==null?'#195b70':'#ffffffd9',color:spotterIndex!==null?'#ffffff':'#1e384b',border:'1px solid #18253620',borderRadius:10,padding:'0 12px',height:42,display:'flex',alignItems:'center',gap:7,fontSize:12,fontWeight:600}}
     onClick={()=>{
       if(spotterIndex!==null){
         setSpotterIndex(null);
         setState(s=>({...s,selected:[],xray:false}));
       } else {
         startSpotter(0);
       }
     }}
     title="Interactive PG OSCE Spotter Exam Stations"
   >
     <GraduationCap size={18}/>
     <span>PG OSCE Quiz</span>
   </Button>
   <Button variant="ghost" className={panel==='search'?'active':''} onClick={()=>openPanel('search')} aria-label="Search anatomy">
    <Search size={18}/><span>Find clinical structure</span><kbd>/</kbd>
   </Button>
   <Button variant="ghost" className="icon-button" aria-label="About this atlas" onClick={()=>{setDetails(false);setPanel(null);setAbout(true);}}>
    <Info size={18}/>
   </Button>
  </nav>

  <section className={`layers-panel glass ${panel==='layers'?'mobile-open':''}`} aria-label="Anatomical layers">
   <div className="panel-heading">
    <span>Systems</span>
    <Button variant="ghost" className="mobile-only icon-button" onClick={()=>setPanel(null)} aria-label="Close systems"><X size={18}/></Button>
    <Badge variant="secondary" className="desktop-only small-number">{activeSystems.length}</Badge>
   </div>
   <div className="layer-presets">
    <Button variant="ghost" aria-pressed={activeSystems.every(x=>state.visible.includes(x.id))} onClick={()=>setState(s=>({...s,selected:[],isolate:false,visible:activeSystems.map(x=>x.id)}))}>All</Button>
    <Button variant="ghost" aria-pressed={state.visible.length===1&&state.visible[0]==='skeletal'} onClick={()=>setState(s=>({...s,selected:[],isolate:false,visible:['skeletal']}))}>Skeleton</Button>
    <Button variant="ghost" aria-pressed={state.visible.length===6&&['cardiac','respiratory','digestive','urinary','endocrine','reproductive'].every(id=>state.visible.includes(id as SystemId))} onClick={()=>setState(s=>({...s,selected:[],isolate:false,visible:['cardiac','respiratory','digestive','urinary','endocrine','reproductive']}))}>Organs</Button>
   </div>
   <div className="system-list">
    {activeSystems.map(s=>(
      <div className={`system-row ${state.visible.includes(s.id)?'enabled':''}`} key={s.id}>
        <Button variant="ghost" className="system-name" title={`Show only ${s.name.toLowerCase()}`} onClick={()=>setState(v=>({...v,visible:[s.id],isolate:false,selected:[]}))}>
          <span className="system-dot" style={{background:s.color}}/>{s.name}
          <span className="system-count">{counts[s.id]}</span>
        </Button>
        <Switch checked={state.visible.includes(s.id)} onCheckedChange={()=>toggle(s.id)} aria-label={`Show ${s.name.toLowerCase()}`} />
      </div>
    ))}
   </div>
   <div className="panel-foot">
    <span>{visibleCount.toLocaleString()} pieces visible</span>
    <Button variant="ghost" onClick={()=>setState(s=>({...s,visible:[],selected:[],isolate:false}))}>Hide all</Button>
   </div>
  </section>

  {panel==='search'&&(
   <section className="search-panel glass" aria-label="Find anatomy">
    <div className="panel-heading">
      <span>Find clinical structure</span>
      <Button variant="ghost" className="icon-button" onClick={()=>setPanel(null)} aria-label="Close search"><X size={18}/></Button>
    </div>
    <Combobox<Concept>
      items={results}
      value={null}
      onValueChange={value=>{if(value)choose(value);}}
      inputValue={query}
      onInputValueChange={setQuery}
      itemToStringLabel={c=>c.name}
      filter={null}
      open
      onOpenChange={open=>{if(!open)setPanel(null);}}
    >
      <ComboboxInput autoFocus placeholder="Cricoid, trachea, jugular, spinal cord…" aria-label="Search named anatomical structures" showTrigger={false}/>
      <ComboboxContent className="anatomy-search-results">
        <ComboboxEmpty>No structures match your search.</ComboboxEmpty>
        <ComboboxList>
          {(c:Concept)=>(
            <ComboboxItem key={c.id} value={c}>
              <span className="search-result-name">{c.name}</span>
              <span className="small-number">{c.elements.length} {c.elements.length===1?'piece':'pieces'}</span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
    {!query&&(
      <div className="quick-search-chips">
        <span style={{fontSize:11,color:'#78838f',width:'100%',marginTop:4}}>High-Yield Anesthesia Landmarks:</span>
        {['Cricoid cartilage','Trachea','Thyroid cartilage','Epiglottis','Spinal cord','Sacrum','Internal jugular vein','Subclavian vein','Radial artery','Femoral artery'].map(item=>(
          <button
            key={item}
            type="button"
            className="search-chip"
            onClick={()=>{
              const found=atlas?.concepts.find(c=>c.name.toLowerCase()===item.toLowerCase());
              if(found)choose(found);
              else setQuery(item);
            }}
          >
            {item}
          </button>
        ))}
      </div>
    )}
    <p className="search-note">{query?'Showing up to 80 matches. Refine your search to find smaller structures.':'Click a high-yield landmark above, or search any named structure.'}</p>
   </section>
  )}

  <nav className="view-controls glass" aria-label="Camera controls">
   {(['three-quarter','front','side','back'] as View[]).map((v,i)=>(
    <Button variant="ghost" key={v} className={state.view===v?'active':''} aria-pressed={state.view===v} disabled={state.explode>.8&&v!=='front'} onClick={()=>setState(s=>({...s,view:v,reset:s.reset+1,rotate:false}))} title={`${v} view`} aria-label={`${v} view`}>
      <span>{['¾','F','S','B'][i]}</span>
    </Button>
   ))}
   <i/>
   <Button variant="ghost" disabled={state.explode>=.4} aria-label={state.rotate?'Pause rotation':'Rotate body'} title="Auto rotate" className={state.rotate?'active':''} onClick={()=>setState(s=>({...s,rotate:!s.rotate}))}>
    {state.rotate?<Pause size={17}/>:<RotateCw size={18}/>}
   </Button>
   <Button variant="ghost" aria-label="Toggle X-Ray ghosting" title="X-Ray Ghost Mode" className={state.xray?'active':''} onClick={()=>setState(s=>({...s,xray:!s.xray}))}>
    <Scan size={17}/>
   </Button>
   <Button variant="ghost" aria-label="Reset view and layers" title="Reset" onClick={reset}>
    <RotateCcw size={17}/>
   </Button>
  </nav>

  <div className="scene-caption">
   <span className="caption-line"/>
   <span>{state.isolate?(chosen?.name??'SELECTED STRUCTURE'):state.explode>.95?'ANATOMICAL INVENTORY':state.explode>.05?'SEPARATED STRUCTURES':spotterIndex!==null?`OSCE STATION ${spotterIndex+1}`:currentPreset?.id!=='all'?currentPreset?.name.toUpperCase():'ADULT HUMAN · CLINICAL REFERENCE'}</span>
   <span className="caption-line"/>
  </div>

  <div className="bottom-dock glass">
   <Button variant="ghost" className="mobile-only dock-layers" onClick={()=>openPanel('layers')} aria-label="Open system layers">
    <Layers3 size={20}/><span>Systems</span>
   </Button>
   <div className="explode-control">
    <div className="explode-label">
      <label id="explode-label">Explode anatomy</label>
      <output>{Math.round(state.explode*100)}<span>%</span></output>
    </div>
    <Slider
      aria-labelledby="explode-label"
      min={0}
      max={100}
      step={1}
      value={[state.explode*100]}
      onValueChange={v=>setState(s=>({...s,explode:(Array.isArray(v)?v[0]:v)/100,view:(Array.isArray(v)?v[0]:v)>80?'front':s.view,rotate:false}))}
    />
    <div className="slider-endpoints"><span>Assembled</span><span>Every piece</span></div>
   </div>
   <Button variant="ghost" className="dock-reset" onClick={reset} aria-label="Assemble and reset">
    <RotateCcw size={18}/><span>Reset</span>
   </Button>
  </div>

  <footer className="studio-footer">
   <span>{state.explode>.8?'Drag to pan':'Drag to orbit'} <b>·</b> Pinch to zoom <b>·</b> Tap to inspect</span>
   <Button variant="ghost" onClick={()=>{setDetails(false);setPanel(null);setAbout(true);}}>
    AnesthesiaHub PG Guide & Credits <ArrowUpRight size={12}/>
   </Button>
  </footer>

  {progress<100&&!error&&(
   <div className="loading glass" role="status">
    <Activity size={18}/>
    <div>
      <strong>Preparing 3D Clinical Anatomy</strong>
      <span>{progress}% · Loading {atlas?.parts.length.toLocaleString()??'2,234'} pieces</span>
      <div className="loading-track"><i style={{width:`${progress}%`}}/></div>
    </div>
   </div>
  )}

  {error&&(
   <div className="loading glass error" role="alert">
    <p>{error}</p>
    <Button variant="ghost" onClick={()=>location.reload()}>Reload viewer</Button>
   </div>
  )}

  <Sheet open={details&&selectedParts.length>0} modal={false} disablePointerDismissal onOpenChange={setDetails}>
   <SheetContent initialFocus={detailTitle} className={`detail-sheet glass ${state.isolate?'is-isolated':''}`} showCloseButton={true}>
    <div className="detail-header">
      <div className="detail-accent" style={{background:system?.color}}/>
      <div className="eyebrow">{system?.name??'ANATOMY'}</div>
      <SheetTitle ref={detailTitle} tabIndex={-1} className="structure-title">{chosen?.name}</SheetTitle>
    </div>

    {pgData&&(
      <div className="pg-tab-bar">
        <button
          type="button"
          className={`pg-tab-btn ${activeDetailTab==='clinical'?'active':''}`}
          onClick={()=>setActiveDetailTab('clinical')}
        >
          Clinical Guide
        </button>
        <button
          type="button"
          className={`pg-tab-btn ${activeDetailTab==='viva'?'active':''}`}
          onClick={()=>setActiveDetailTab('viva')}
        >
          🎓 PG Viva ({pgData.vivaQuestions.length} Qs)
        </button>
      </div>
    )}

    <div className="detail-scroll" key={`${chosen?.id}-${state.isolate}-${activeDetailTab}`}>
      {activeDetailTab==='clinical'?(
        <>
          <SheetDescription className="structure-description">
            {chosen&&selected?explanation(chosen.name,selected.system):''}
          </SheetDescription>
          {chosen&&!EXPLANATIONS[chosen.name.toLowerCase()]&&(
            <span className="context-note">System overview · structure identified from source anatomy</span>
          )}

          {pearl&&(
            <div className="clinical-pearl-box">
              <div className="pearl-header">
                <div className="pearl-title"><Syringe size={14}/> Anesthesia Clinical Pearl</div>
              </div>
              <div className="pearl-procedure">{pearl.procedure}</div>
              <div className="pearl-section">
                <span className="pearl-section-label">Technique & Landmarks</span>
                <div>{pearl.technique}</div>
              </div>
              <div className="pearl-safety">
                <span className="pearl-section-label" style={{color:'#8c2a22'}}>Safety & Pitfalls</span>
                <div>{pearl.safety}</div>
              </div>
              {pearl.ultrasoundTip&&(
                <div className="pearl-ultrasound">
                  <span className="pearl-section-label" style={{color:'#1b6338'}}>Ultrasound Landmark</span>
                  <div>{pearl.ultrasoundTip}</div>
                </div>
              )}
            </div>
          )}

          {pgData?.sonoanatomy&&(
            <div className="sono-grid">
              <div style={{fontSize:11,fontWeight:700,color:'#185368',letterSpacing:'0.06em',textTransform:'uppercase'}}>
                🩺 Ganga Hospital Sonoanatomy Guide
              </div>
              <div className="sono-row">
                <span className="sono-label">Transducer & Probe</span>
                <span className="sono-val">{pgData.sonoanatomy.probe}</span>
              </div>
              <div className="sono-row">
                <span className="sono-label">Needle Approach</span>
                <span className="sono-val">{pgData.sonoanatomy.needle}</span>
              </div>
              <div className="sono-row">
                <span className="sono-label">Acoustic Landmarks</span>
                <span className="sono-val">{pgData.sonoanatomy.acousticLandmarks}</span>
              </div>
              <div className="sono-row">
                <span className="sono-label">Target Pattern</span>
                <span className="sono-val">{pgData.sonoanatomy.targetPattern}</span>
              </div>
              <div className="sono-row">
                <span className="sono-label">Volume & Local Anesthetic</span>
                <span className="sono-val">{pgData.sonoanatomy.volumeAndDrugs}</span>
              </div>
            </div>
          )}

          <div className="structure-meta">
            <span>Atlas reference<strong>{chosen?.id}</strong></span>
            <span>Selected pieces<strong>{state.selected.length.toLocaleString()}</strong></span>
          </div>

          {selectedParts.length>1&&(
            <div className="member-list">
              <h3>Included structures</h3>
              {selectedParts.slice(0,50).map(p=>(
                <Button variant="ghost" key={p.id} onClick={()=>choosePart(p.id)}>
                  <span>{p.name}</span><ChevronRight size={14}/>
                </Button>
              ))}
              {selectedParts.length>50&&<p>And {selectedParts.length-50} more modeled pieces.</p>}
            </div>
          )}
        </>
      ):(
        <>
          {pgData&&(
            <div className="viva-list">
              <div style={{background:'#edf6f9',border:'1px solid #c2e2eb',borderRadius:8,padding:'10px 12px'}}>
                <div style={{fontSize:11,fontWeight:700,color:'#114e61',textTransform:'uppercase',letterSpacing:'0.06em'}}>
                  📚 Reference: {pgData.sourceBooks.join(' · ')}
                </div>
                <div style={{fontSize:12,color:'#374c5a',marginTop:4,lineHeight:1.5}}>
                  {pgData.examSummary}
                </div>
              </div>

              <div style={{fontSize:12,fontWeight:700,color:'#1e3444',marginTop:6,display:'flex',alignItems:'center',gap:6}}>
                <HelpCircle size={15}/> MD/DNB Table Viva Voce Questions
              </div>

              {pgData.vivaQuestions.map((vq,idx)=>(
                <div key={idx} className="viva-card">
                  <div className="viva-q">Q{idx+1}: {vq.question}</div>
                  <div className="viva-a">
                    <strong>Model Answer: </strong>{vq.answer}
                  </div>
                  <span className="textbook-badge">Source: {vq.source}</span>
                </div>
              ))}

              {pgData.troubleshooting&&(
                <div style={{marginTop:8}}>
                  <div style={{fontSize:12,fontWeight:700,color:'#9a4e0c',marginBottom:6}}>
                    ⚠️ Troubleshooting (Ganga Hospital Manual)
                  </div>
                  <div className="trouble-list">
                    {pgData.troubleshooting.map((tr,idx)=>(
                      <div key={idx} className="trouble-item">
                        <strong>Problem: {tr.problem}</strong>
                        <div>• <em>Reason:</em> {tr.reason}</div>
                        <div>• <em>Solution:</em> {tr.solution}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pgData.highYieldPearls.length>0&&(
                <div style={{background:'#f7f9fa',border:'1px solid #d9e2e8',borderRadius:8,padding:'10px 12px',marginTop:8}}>
                  <div style={{fontSize:11,fontWeight:700,color:'#2c4355',marginBottom:6,textTransform:'uppercase'}}>
                    ⭐ High-Yield Exam Pearls
                  </div>
                  <ul style={{margin:0,paddingLeft:16,fontSize:11.5,lineHeight:1.6,color:'#445766'}}>
                    {pgData.highYieldPearls.map((hl,idx)=>(
                      <li key={idx} style={{marginBottom:4}}>{hl}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <a className="source-link" href="https://lifesciencedb.jp/bp3d/" target="_blank" rel="noreferrer">
        View anatomical source <ArrowUpRight size={14}/>
      </a>
    </div>

    <div className="detail-actions">
      <Button className={`primary-action ${state.isolate?'active':''}`} onClick={()=>setState(s=>({...s,isolate:!s.isolate,explode:0}))}>
        <Focus size={18}/>{state.isolate?'Show surrounding anatomy':'Isolate structure'}<ChevronRight size={16}/>
      </Button>
      <Button className={`primary-action ${state.xray?'active':''}`} style={{background:state.xray?'#135364':'#ffffff',color:state.xray?'#ffffff':'#233644',border:'1px solid #18253620'}} onClick={()=>setState(s=>({...s,xray:!s.xray}))}>
        <Scan size={18}/>{state.xray?'Exit X-Ray mode':'X-Ray ghost anatomy'}<ChevronRight size={16}/>
      </Button>
      <Button variant="ghost" className="secondary-action" onClick={()=>{setState(s=>({...s,selected:[],isolate:false,xray:false}));setDetails(false);}}>
        Clear selection
      </Button>
    </div>
   </SheetContent>
  </Sheet>

  <Sheet open={about} onOpenChange={setAbout}>
   <SheetContent className="about-sheet glass">
    <div className="eyebrow">ANESTHESIAHUB · MD/DNB EXAM PORTAL</div>
    <SheetTitle className="structure-title">Clinical Anatomy in 3D</SheetTitle>
    <SheetDescription>Interactive 3D human anatomy atlas tailored for anesthesiology postgraduates, airway management, neuraxial landmarks, and ultrasound-guided regional anesthesia.</SheetDescription>
    <div className="about-copy">
      <p><strong>Textbook Integration & Sources</strong><br/>
      Content synthesized from the premier anesthesia reference library in <code>Path to Medal\Books</code>:
      <br/>• <strong>Ganga Hospital Manual of Regional Anesthesia</strong> (Sonoanatomy, probe placement, troubleshooting)
      <br/>• <strong>Anesthesia Review for DNB by Dr. Koushik</strong> (Viva questions, theory summaries, OSCE spotters)
      <br/>• <strong>Barash Clinical Anesthesiology</strong> (Airway algorithms, hemodynamics, physiology)
      <br/>• <strong>Dorsch & Dorsch</strong> (Airway equipment, laryngoscopes, needle physics)
      <br/>• <strong>Oxford Drugs in Anesthesia & ICU</strong> (Local anesthetic safety & Lipid Rescue Protocol)
      </p>
      <p><strong>Dataset & References</strong><br/>
      Powered by 2,234 individual meshes and 3,432 named concepts from the open BodyParts3D adult male reference anatomy (licensed under CC BY 4.0).</p>
      <h3>Source & Attribution</h3>
      <p>BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.</p>
      <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html" target="_blank" rel="noreferrer">Dataset license <ArrowUpRight size={14}/></a>
      <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html" target="_blank" rel="noreferrer">Original geometry & metadata <ArrowUpRight size={14}/></a>
      <a href="https://academic.oup.com/nar/article/37/suppl_1/D782/1000752" target="_blank" rel="noreferrer">Read the source publication <ArrowUpRight size={14}/></a>
    </div>
   </SheetContent>
  </Sheet>
 </main>;
}
