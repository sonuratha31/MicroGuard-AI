import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import type { GlobeMethods } from 'react-globe.gl';
import { ArrowLeft, Compass, Expand, Minimize, Pause, Play, RotateCcw, Search, X, MapPin, Leaf, ShieldCheck, Plus, Minus } from 'lucide-react';
import { createDemoPoints, hotspots, severityColors } from '../data/hotspots';
import type { Category, Hotspot } from '../data/hotspots';
import './PollutionMap.css';

type Filter = 'All' | Category;
const categories: Filter[] = ['All','Ocean','Land','River','Coastal'];
const textureBase = '/textures/';
const texture = (name:string) => (window as Window & { MICROGUARD_TEXTURES?: Record<string,string> }).MICROGUARD_TEXTURES?.[name] ?? textureBase+name;

export default function PollutionMap() {
  const globe = useRef<GlobeMethods | undefined>(undefined);
  const container = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [dimensions,setDimensions] = useState({width:900,height:650});
  const [filter,setFilter] = useState<Filter>('All');
  const [search,setSearch] = useState('');
  const [selected,setSelected] = useState<Hotspot | null>(null);
  const [rotate,setRotate] = useState(true);
  const [full,setFull] = useState(false);
  const [ready,setReady] = useState(false);
  const [sidebar,setSidebar] = useState(true);
  const [density,setDensity] = useState(true);
  const defaultAltitude = dimensions.width<600 ? 3.2 : 2.35;

  const visible = useMemo(() => hotspots.filter(h => (filter==='All'||h.category===filter) && h.name.toLowerCase().includes(search.toLowerCase())),[filter,search]);
  const demoPoints = useMemo(() => density ? createDemoPoints(visible) : [],[density,visible]);
  const selectedVisible = selected && visible.some(h => h.id === selected.id) ? selected : null;
  useEffect(() => {
    if (!container.current) return;
    const obs = new ResizeObserver(entries => {
      const r = entries[0]?.contentRect;
      if (r) setDimensions({width:Math.max(1,Math.floor(r.width)),height:Math.max(1,Math.floor(r.height))});
    });
    obs.observe(container.current);
    return () => obs.disconnect();
  },[]);
  useEffect(() => {
    const handler = () => setFull(document.fullscreenElement===stage.current);
    document.addEventListener('fullscreenchange',handler);
    return () => document.removeEventListener('fullscreenchange',handler);
  },[]);
  useEffect(() => {
    if (!ready || !globe.current) return;
    const c=globe.current.controls();
    c.autoRotate=rotate;
    c.autoRotateSpeed=.35;
    c.enableDamping=true;
    c.minDistance=115;
    c.maxDistance=650;
  },[ready,rotate]);
  const focus = useCallback((h:Hotspot) => {
    setSelected(h);
    setSidebar(true);
    setRotate(false);
    globe.current?.pointOfView({lat:h.lat,lng:h.lng,altitude:1.55},1100);
  },[]);
  const reset = () => {setSelected(null);globe.current?.pointOfView({lat:18,lng:45,altitude:defaultAltitude},1000);};
  const zoom = (direction:number) => {
    const view=globe.current?.pointOfView();
    if(view) globe.current?.pointOfView({altitude:Math.max(.7,Math.min(4.5,view.altitude+direction*.35))},350);
  };
  const toggleFullscreen = async () => {
    if (!stage.current) return;
    try {if(document.fullscreenElement) await document.exitFullscreen();else await stage.current.requestFullscreen();}
    catch {setFull(false);}
  };
  return <main className="mg-shell">
    <header className="mg-header">
      <div className="mg-brand"><div className="mg-brand-icon"><Leaf size={20}/></div><div><strong>MICROGUARD <span>AI</span></strong><small>PLANETARY PLASTIC INTELLIGENCE</small></div></div>
      <div className="mg-header-center"><span className="mg-signal"/> GLOBAL EXPLORER <span className="mg-header-divider"/> 360° EARTH</div>
      <div className="mg-header-right"><span className="mg-online"><span/> SIMULATED DEMO</span><a href="/" className="mg-back"><ArrowLeft size={15}/> Home</a></div>
    </header>
    <section className="mg-intro"><div><div className="mg-kicker">/360VIEW / WORLDWIDE DEMO</div><h1>One planet. <em>A plastic problem.</em></h1><p>Ocean, land, river and coastal waste on a full 360° Earth. All markers, density patterns and severity labels are simulated, not live measurements.</p></div><div className="mg-count"><strong>{hotspots.length}</strong><span>DEMO LOCATIONS</span></div></section>
    <div className="mg-stage" ref={stage}>
      <div className="mg-globe-region" ref={container}>
        <Globe ref={globe} width={dimensions.width} height={dimensions.height} backgroundColor="#050e13" backgroundImageUrl={texture('night-sky.png')} globeImageUrl={texture('earth-blue-marble.jpg')} bumpImageUrl={texture('earth-topology.png')} showAtmosphere atmosphereColor="#77d6bd" atmosphereAltitude={.19} animateIn={false}
          onGlobeReady={()=>{setReady(true);globe.current?.pointOfView({lat:18,lng:45,altitude:(container.current?.clientWidth??900)<600?3.2:2.35},0);}}
          pointsData={visible} pointLat="lat" pointLng="lng" pointAltitude={.035} pointRadius={.42} pointColor={(d:object)=>severityColors[(d as Hotspot).severity]} pointLabel={(d:object)=>`${(d as Hotspot).name} · ${(d as Hotspot).category} · Simulated demo`} pointsMerge={false} onPointClick={(d:object)=>focus(d as Hotspot)}
          hexBinPointsData={demoPoints} hexBinPointLat="lat" hexBinPointLng="lng" hexBinPointWeight="weight" hexBinResolution={4} hexAltitude={.006} hexMargin={.12}
          hexTopColor={({sumWeight}: {sumWeight:number}) => sumWeight>90?'rgba(255,92,102,.6)':sumWeight>45?'rgba(255,173,85,.55)':sumWeight>18?'rgba(241,222,110,.5)':'rgba(91,226,160,.4)'} hexSideColor={()=>'rgba(0,0,0,0)'} hexBinMerge
          ringsData={visible} ringLat="lat" ringLng="lng" ringColor={(d:object)=>{const color=severityColors[(d as Hotspot).severity];return (t:number)=>`rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},${Math.max(0,1-t)*.75})`;}} ringMaxRadius={3.8} ringPropagationSpeed={.75} ringRepeatPeriod={2100}
          labelsData={visible} labelLat="lat" labelLng="lng" labelText={(d:object)=>(d as Hotspot).name} labelSize={.7} labelDotRadius={.25} labelColor={()=>'rgba(227,255,245,.94)'} labelResolution={2} onLabelClick={(d:object)=>focus(d as Hotspot)}
        />
        {!ready && <div className="mg-loading" role="status">Loading Earth...</div>}
        <div className="mg-top-left"><div className="mg-corner-label"><span className="mg-signal"/> ORBITAL EXPLORER <small>PLASTIC POLLUTION / DEMO DATA</small></div></div>
        <div className="mg-top-right"><button title="Toggle fullscreen" aria-label="Toggle fullscreen" onClick={toggleFullscreen}>{full?<Minimize size={18}/>:<Expand size={18}/>}</button><button title="Reset camera" aria-label="Reset camera" onClick={reset}><RotateCcw size={18}/></button><button title={rotate?'Pause rotation':'Start rotation'} aria-label={rotate?'Pause rotation':'Start rotation'} aria-pressed={rotate} onClick={()=>setRotate(v=>!v)}>{rotate?<Pause size={18}/>:<Play size={18}/>}</button><button title="Toggle information panel" aria-label="Toggle information panel" aria-pressed={sidebar} onClick={()=>setSidebar(v=>!v)}><Compass size={18}/></button></div>
        <div className="mg-zoom"><button title="Zoom in" aria-label="Zoom in" onClick={()=>zoom(-1)}><Plus size={18}/></button><button title="Zoom out" aria-label="Zoom out" onClick={()=>zoom(1)}><Minus size={18}/></button></div>
        <div className="mg-bottom-left"><div className="mg-status"><span className="mg-signal"/> SIMULATED POLLUTION LAYER</div><span>Demo only · Not live measurements</span></div>
        <div className="mg-bottom-center"><button onClick={()=>globe.current?.pointOfView({lat:18,lng:80,altitude:defaultAltitude},1000)}>ASIA</button><button onClick={()=>globe.current?.pointOfView({lat:5,lng:-95,altitude:defaultAltitude},1000)}>AMERICAS</button><button onClick={()=>globe.current?.pointOfView({lat:20,lng:15,altitude:defaultAltitude},1000)}>AFRICA / EUROPE</button><button onClick={()=>globe.current?.pointOfView({lat:-25,lng:150,altitude:defaultAltitude},1000)}>OCEANIA</button></div>
      </div>
      {sidebar && <aside className="mg-sidebar"><div className="mg-sidebar-top"><div><div className="mg-kicker">POLLUTION DEMO BRIEF</div><h2>{selectedVisible?selectedVisible.name:'Explore hotspots'}</h2></div><button onClick={()=>setSidebar(false)} aria-label="Close panel"><X size={17}/></button></div>
        {selectedVisible ? <div className="mg-selected" aria-live="polite"><div className="mg-severity" style={{color:severityColors[selectedVisible.severity],borderColor:severityColors[selectedVisible.severity]}}><span style={{background:severityColors[selectedVisible.severity]}}/>{selectedVisible.severity} · Simulated</div><div className="mg-location"><MapPin size={15}/> {selectedVisible.lat.toFixed(2)}°, {selectedVisible.lng.toFixed(2)}°</div><div className="mg-detail"><small>ENVIRONMENT</small><strong>{selectedVisible.category}</strong></div><div className="mg-detail"><small>EXAMPLE SOURCES</small><p>{selectedVisible.cause}</p></div><div className="mg-detail"><small>DEMO SCENARIO</small><p>{selectedVisible.fact}</p></div><div className="mg-solution"><ShieldCheck size={19}/><div><small>EXAMPLE ACTION</small><p>{selectedVisible.solution}</p></div></div><button className="mg-clear" onClick={reset}>Return to global view <RotateCcw size={14}/></button></div> : <div className="mg-demo-note"><strong>SIMULATED DATA</strong><p>Sample waste clusters across the world. Colors show invented demo severity, not measured pollution.</p></div>}
        <div className="mg-explore"><div className="mg-explore-title"><span>LOCATION DIRECTORY</span><span aria-live="polite">{visible.length} / {hotspots.length}</span></div><div className="mg-search"><Search size={16}/><input aria-label="Search pollution hotspots" placeholder="Search location..." value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<button onClick={()=>setSearch('')} aria-label="Clear search"><X size={14}/></button>}</div><div className="mg-filters" aria-label="Pollution environment">{categories.map(c=><button key={c} aria-pressed={filter===c} className={filter===c?'active':''} onClick={()=>{setFilter(c);setSelected(null);}}>{c}</button>)}</div><label className="mg-density"><input type="checkbox" checked={density} onChange={e=>setDensity(e.target.checked)}/> Simulated density layer</label><div className="mg-list">{visible.map(h=><button key={h.id} className={selectedVisible?.id===h.id?'selected':''} onClick={()=>focus(h)}><span className="mg-list-dot" style={{background:severityColors[h.severity]}}/><span><strong>{h.name}</strong><small>{h.category} · {h.severity} demo</small></span><MapPin className="mg-arrow" size={13}/></button>)}{visible.length===0&&<p className="mg-no-results" role="status">No locations match your search.</p>}</div></div>
        <div className="mg-legend"><div className="mg-kicker">SIMULATED MARKER SEVERITY</div><div>{Object.entries(severityColors).map(([name,color])=><span key={name}><i style={{background:color}}/>{name}</span>)}</div><p>Density cells indicate synthetic clustering, not plastic mass or actual waste extent.</p></div>
      </aside>}
    </div>
    <footer className="mg-footer"><span><span className="mg-signal"/> MICROGUARD AI · GLOBAL PLASTIC POLLUTION EXPLORER</span><span>Demo data only · No live feed · No scientific pollution rankings</span></footer>
  </main>;
}
