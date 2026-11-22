import { useState, useEffect, useMemo } from 'react';
import { MODULES, LESSONS, PHASES, lessonsOf, moduleOf } from './data/curriculum.js';
import { DIAGNOSTIC, diagnosticRecommendation } from './data/diagnostic.js';
import { QUIZZES, CODING_CHALLENGES } from './data/questions.js';
import { PROJECTS, QUALITY_CHECKLIST } from './data/projects.js';
import { INTERVIEW_CATS, TRAINER_PROMPTS, BUSINESS_CASES, scoreAnswer } from './data/interview.js';
import { loadState, saveState, masteryFor, skillScores, weakTopics, recommendedNext, nextReviewDate } from './lib/store.js';

const MISSIONS = [
 {id:'m-lesson', label:'Learn 1 lesson'},
 {id:'m-quiz', label:'Complete 5 practice questions'},
 {id:'m-code', label:'Solve 1 coding challenge'},
 {id:'m-data', label:'Do 1 dataset exercise (Playground with ShopKart numbers)'},
 {id:'m-interview', label:'Answer 5 interview questions'},
 {id:'m-revision', label:'Revise 1 weak topic / mistake'},
];
let pyodidePromise = null;
async function getPyodide(){
  if(window.pyodide) return window.pyodide;
  if(!pyodidePromise){
    pyodidePromise = new Promise((resolve,reject)=>{
      const s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
      s.onload=async()=>{ try{ const p=await window.loadPyodide(); window.pyodide=p; resolve(p);}catch(e){reject(e);} };
      s.onerror=()=>reject(new Error('Pyodide CDN failed to load — check internet connection.'));
      document.head.appendChild(s);
    });
  }
  return pyodidePromise;
}

export default function App(){
  const [state,setState]=useState(loadState);
  const [view,setView]=useState('dashboard');
  const [lessonId,setLessonId]=useState('l1');
  const [projectId,setProjectId]=useState(null);
  useEffect(()=>{ saveState(state); document.documentElement.setAttribute('data-theme', state.theme||'light'); },[state]);
  const update = fn => setState(s=>{ const n={...s}; fn(n); return n; });
  const scores = useMemo(()=>skillScores(state),[state]);
  const overall = useMemo(()=>{ const v=Object.values(scores); const nz=v.filter(x=>x>0); return nz.length? Math.round(nz.reduce((a,b)=>a+b,0)/nz.length):0; },[scores]);
  const rec = recommendedNext(state);
  const nav = [['dashboard','Dashboard'],['diagnostic','Diagnostic'],['curriculum','Curriculum & Roadmap'],['playground','Code Playground'],['projects','Projects'],['interview','Interview Prep'],['mistakes','Mistake Journal']];
  return (<>
    <header className="topbar">
      <div className="brand">Sneha's Python × Analytics<small>Personal learning platform · Navy #1F3862</small></div>
      <nav className="nav">{nav.map(([id,label])=><button key={id} className={view===id?'active':''} onClick={()=>setView(id)}>{label}</button>)}</nav>
      <button className="btn ghost small" style={{marginLeft:'auto'}} onClick={()=>update(s=>{s.theme=s.theme==='dark'?'light':'dark'})}>{state.theme==='dark'?'☀ Light':'🌙 Dark'}</button>
    </header>
    <main className="container">
      {view==='dashboard' && <Dashboard state={state} scores={scores} overall={overall} rec={rec} update={update} go={setView} setLesson={setLessonId} />}
      {view==='diagnostic' && <Diagnostic state={state} update={update} />}
      {view==='curriculum' && <Curriculum state={state} update={update} setLesson={setLessonId} goLesson={()=>setView('lesson')} />}
      {view==='lesson' && <LessonView state={state} update={update} lessonId={lessonId} setLesson={setLessonId} go={setView} />}
      {view==='playground' && <Playground state={state} update={update} initialCode={null} />}
      {view==='projects' && <Projects state={state} update={update} projectId={projectId} setProjectId={setProjectId} />}
      {view==='interview' && <Interview state={state} update={update} />}
      {view==='mistakes' && <Mistakes state={state} update={update} />}
    </main>
  </>);
}

function Dashboard({state,scores,overall,rec,update,go,setLesson}){
  const today = new Date().toISOString().slice(0,10);
  const mission = state.mission?.[today]||{};
  const toggle = id=>update(s=>{ s.mission=s.mission||{}; s.mission[today]=s.mission[today]||{}; s.mission[today][id]=!s.mission[today][id]; });
  const due = state.mistakes.filter(m=>!m.revised && m.nextReview<=today);
  const weak = weakTopics(state);
  const doneLessons = Object.keys(state.completedLessons).length;
  return (<>
    <h1>Namaste, Sneha 👋</h1>
    <p className="muted">Final-year B.Sc. Data Science · CGPA 8.8 · Target: Data / Business Analyst. Today: demonstrate skill, not hours.</p>
    <div className="grid g4">
      <div className="card"><div className="muted small">Overall progress</div><div className="progress">{overall}%</div><div className="bar"><i style={{width:overall+'%'}}/></div></div>
      <div className="card"><div className="muted small">Lessons completed</div><div className="kpi">{doneLessons} / {LESSONS.length}</div><div className="small muted">Modules 1–8 fully written; 9+ structured outlines</div></div>
      <div className="card"><div className="muted small">Interview readiness</div><div className="kpi">{scores['Interview Readiness']||0}%</div><div className="small muted">Trainer answers + interview quiz questions</div></div>
      <div className="card"><div className="muted small">Revision due today</div><div className="kpi">{due.length}</div><div className="small muted">{state.mistakes.filter(m=>!m.revised).length} open mistakes in journal</div></div>
    </div>
    <div className="grid g2">
      <div className="card"><h2>🎯 Recommended next action</h2><p><strong>{rec.title}</strong></p><p className="muted">{rec.detail}</p><button className="btn" onClick={()=>go(rec.target==='diagnostic'?'diagnostic':rec.target==='projects'?'projects':'curriculum')}>Go there →</button></div>
      <div className="card"><h2>📋 Today's Mission</h2><ul className="check">{MISSIONS.map(m=><li key={m.id}><label style={{display:'flex',gap:8,alignItems:'center',margin:0,fontWeight:400}}><input type="checkbox" checked={!!mission[m.id]} onChange={()=>toggle(m.id)} /> {m.label}</label></li>)}</ul><p className="small muted">{Object.values(mission).filter(Boolean).length} / {MISSIONS.length} done — saved for today ({today}).</p></div>
    </div>
    <div className="grid g2">
      <div className="card"><h2>📊 Skill radar (computed from your attempts)</h2>{Object.entries(scores).map(([k,v])=>(<div key={k} style={{marginBottom:8}}><div style={{display:'flex',justifyContent:'space-between'}}><span>{k}</span><strong>{v}%</strong></div><div className="bar"><i style={{width:v+'%'}}/></div></div>))}<p className="small muted">Scores come from quiz + diagnostic accuracy — not from "lesson completed". 0% means no attempts yet.</p></div>
      <div className="card"><h2>⚠️ Weak topics</h2>{weak.length? weak.map(([k,v])=>(<p key={k}>{k} — <span className="badge weak">{v}% · Weak</span></p>)) : <p className="muted">No attempts yet — take the diagnostic to find your real weak spots.</p>}
      <h2 style={{marginTop:16}}>🕒 Revision due</h2>{due.length? due.slice(0,5).map((m,i)=>(<p key={i} className="small">• {m.question} <span className="muted">({m.topic})</span></p>)) : <p className="muted small">Nothing due today. Mistakes you get wrong reappear on a 1–3–7–14–30 day schedule.</p>}
      <h2 style={{marginTop:16}}>Recent mistakes</h2>{state.mistakes.slice(-3).reverse().map((m,i)=>(<p key={i} className="small">• {m.question} — you said "{m.yourAnswer}", correct: "{m.correctAnswer}"</p>))}</div>
    </div>
    <div className="card"><h2>🗺️ Roadmap</h2><p>Python Foundations → Intermediate Python → NumPy → Pandas → Data Cleaning → Visualization → Statistics → EDA → SQL + Python → Excel + Python → Automation → APIs → Business Analytics → Advanced Analytics → Portfolio Projects → Interview Preparation</p><button className="btn" onClick={()=>go('curriculum')}>Open curriculum</button> <button className="btn ghost" onClick={()=>{setLesson('l1');go('lesson')}}>Continue learning</button></div>
  </>);
}

function Diagnostic({state,update}){
  const [answers,setAnswers]=useState({}); const [done,setDone]=useState(false);
  const [result,setResult]=useState(state.diagnostic||null);
  const submit=()=>{
    const scores={}; const counts={};
    DIAGNOSTIC.forEach((d,i)=>{ counts[d.cat]=(counts[d.cat]||0)+1; scores[d.cat]=(scores[d.cat]||0)+(answers[i]===d.answer?1:0); });
    Object.keys(scores).forEach(k=>scores[k]=Math.round(scores[k]/counts[k]*100));
    const total=Math.round(DIAGNOSTIC.filter((d,i)=>answers[i]===d.answer).length/DIAGNOSTIC.length*100);
    const rec=diagnosticRecommendation(scores);
    const r={scores,total,recommendation:rec,date:new Date().toISOString().slice(0,10)};
    setResult(r); setDone(true); update(s=>{s.diagnostic=r;});
  };
  if(done||result) return (<div className="card"><h1>Diagnostic report</h1><p>Total: <strong>{result.total}%</strong> · {result.date}</p>
    {Object.entries(result.scores).map(([k,v])=>(<div key={k} style={{marginBottom:8}}><div style={{display:'flex',justifyContent:'space-between'}}><span>{k}</span><strong>{v}%</strong></div><div className="bar"><i style={{width:v+'%'}}/></div></div>))}
    <div className="step"><strong>Recommended starting point: {result.recommendation.label}</strong><p>{result.recommendation.reason}</p></div>
    <button className="btn" onClick={()=>{setResult(null);setDone(false);setAnswers({})}}>Retake diagnostic</button></div>);
  return (<div className="card"><h1>Diagnostic test — 20 questions</h1><p className="muted">Covers Python syntax, types, operators, conditions, loops, functions, data structures, strings, exceptions, OOP, NumPy, Pandas, cleaning, visualization, statistics, EDA and problem solving. Your result sets your starting module.</p>
    {DIAGNOSTIC.map((d,i)=>(<div key={i} style={{marginBottom:16}}><strong>Q{i+1}. {d.q}</strong> <span className="badge">{d.cat}</span><div>{d.options.map((o,j)=>(<button key={j} className="opt" style={answers[i]===j?{borderColor:'var(--navy)',background:'#e8edf5'}:{}} onClick={()=>setAnswers(a=>({...a,[i]:j}))}>{o}</button>))}</div></div>))}
    <button className="btn" disabled={Object.keys(answers).length<20} onClick={submit}>Submit diagnostic ({Object.keys(answers).length}/20 answered)</button></div>);
}

function Curriculum({state,setLesson,goLesson}){
  return (<><h1>Curriculum & Roadmap</h1><p className="muted">40 modules across 13 phases + projects + interview prep. Modules 1–8 are fully written lessons; modules 9–40 have structured outlines with key points, syntax and examples. Progress is tracked per lesson — mastery comes from quiz/coding accuracy.</p>
  {PHASES.map(p=>(<div key={p.id} className="card"><h2>{p.title}</h2><p className="muted">{p.desc}</p>{MODULES.filter(m=>m.phase===p.id).map(m=>{const ls=lessonsOf(m.id); const done=ls.filter(l=>state.completedLessons[l.id]).length; return (<div key={m.id} style={{borderTop:'1px solid var(--border)',padding:'10px 0'}}><strong>Module {m.num} — {m.title}</strong> <span className="badge">{done}/{ls.length} lessons done</span><div className="small muted">{m.topics.join(' · ')}</div>{ls.map(l=>(<button key={l.id} className="btn ghost small" style={{margin:'4px 4px 0 0'}} onClick={()=>{setLesson(l.id);goLesson()}}>{state.completedLessons[l.id]?'✓ ':''}{l.title}</button>))}</div>)})}</div>))}
  </>);
}

function LessonView({state,update,lessonId,setLesson,go}){
  const lesson = LESSONS.find(l=>l.id===lessonId)||LESSONS[0];
  const mod = moduleOf(lesson.moduleId);
  const [mode,setMode]=useState('simple');
  const [note,setNote]=useState(state.notes[lesson.id]?.text||'');
  const quiz = QUIZZES[lesson.id]||[];
  const [qIdx,setQIdx]=useState(0); const [picked,setPicked]=useState(null); const [quizDone,setQuizDone]=useState(false); const [score,setScore]=useState(0);
  const modes={simple:'Explain simpler',analogy:'Give analogy',technical:'Show technical',interview:'Show interview answer'};
  const text = mode==='simple'?lesson.simple: mode==='analogy'?(lesson.analogy||lesson.simple): mode==='technical'?lesson.technical: lesson.interview;
  const markDone=()=>update(s=>{s.completedLessons[lesson.id]=true;});
  const answerQuiz=(j)=>{
    if(picked!==null) return; setPicked(j);
    const q=quiz[qIdx]; const correct=j===q.answer;
    if(correct) setScore(s=>s+1);
    update(s=>{ s.quizAttempts.push({lessonId:lesson.id,topic:lesson.title,correct,diff:q.diff,at:Date.now()});
      if(!correct){ const ex=s.mistakes.find(m=>m.question===q.q); if(ex){ex.attempt=(ex.attempt||1)+1; ex.nextReview=nextReviewDate(ex.attempt);} else s.mistakes.push({question:q.q,yourAnswer:q.options[j],correctAnswer:q.options[q.answer],topic:lesson.title,difficulty:q.diff,attempt:1,revised:false,nextReview:nextReviewDate(0)}); } });
    if(qIdx===quiz.length-1) setQuizDone(true);
  };
  const nextQ=()=>{ setQIdx(i=>i+1); setPicked(null); };
  const idx=LESSONS.findIndex(l=>l.id===lesson.id);
  return (<>
    <button className="btn ghost small" onClick={()=>go('curriculum')}>← Back to curriculum</button>
    <h1 style={{marginTop:12}}>{lesson.title}</h1><p className="muted">Module {mod?.num} — {mod?.title} · {lesson.full?'Full lesson':'Outline lesson (V2 deep content)'}</p>
    <div className="card"><h2>Explain differently</h2><div className="tabs">{Object.entries(modes).map(([k,label])=>(<button key={k} className={mode===k?'active':''} onClick={()=>setMode(k)}>{label}</button>))}</div><p>{text}</p></div>
    {lesson.syntax && <div className="card"><h2>Syntax</h2><pre>{lesson.syntax}</pre><h2>Tiny example</h2><pre>{lesson.example}</pre></div>}
    <div className="card"><h2>Real-world analytics application</h2><p>{lesson.application}</p><h2>Common mistakes</h2><ul>{lesson.mistakes.map((m,i)=><li key={i}>{m}</li>)}</ul><h2>Interview question</h2><p><strong>{lesson.interviewQ}</strong></p><h2>Key points</h2><ul>{lesson.keyPoints.map((k,i)=><li key={i}>{k}</li>)}</ul></div>
    <div className="card"><h2>📝 My notes — {lesson.title}</h2><textarea rows={4} value={note} onChange={e=>setNote(e.target.value)} placeholder="Write in your own words…" /><button className="btn small" style={{marginTop:8}} onClick={()=>update(s=>{s.notes[lesson.id]={text:note,at:Date.now()}})}>Save note</button> <span className="small muted">Saved to this browser (localStorage).</span>
    <p className="small muted" style={{marginTop:8}}>Important syntax: see Syntax above. Common mistakes &amp; interview answer: see sections above. Questions you got wrong on this lesson appear in the Mistake Journal.</p></div>
    {quiz.length>0 && <div className="card"><h2>Practice — {quiz.length} questions (3 easy · 3 medium · 2 hard · 1 debugging · 1 interview)</h2>
      {!quizDone ? (<><p><strong>Q{qIdx+1}. {quiz[qIdx].q}</strong> <span className="badge">{quiz[qIdx].diff} · {quiz[qIdx].type}</span></p>
      {quiz[qIdx].options.map((o,j)=>(<button key={j} className={'opt'+(picked!==null?(j===quiz[qIdx].answer?' correct':j===picked?' wrong':''):'')} disabled={picked!==null} onClick={()=>answerQuiz(j)}>{o}</button>))}
      {picked!==null && <><p>{picked===quiz[qIdx].answer?'✅ Correct!':'❌ Not quite.'} {quiz[qIdx].explain}</p><button className="btn" onClick={nextQ}>{qIdx===quiz.length-1?'See score':'Next question'}</button></>}</>)
      : (<><p><strong>Score: {score} / {quiz.length}</strong> — mastery for "{lesson.title}" is now <span className="badge">{masteryFor(lesson.title,state)}</span> (computed from accuracy, not completion).</p><button className="btn" onClick={()=>{setQIdx(0);setPicked(null);setQuizDone(false);setScore(0)}}>Retry quiz</button></>)}
    </div>}
    <div className="card"><h2>Try it — code playground</h2><Playground state={state} update={update} initialCode={lesson.starterCode||'# Try the lesson idea here\nprint("Hello, Sneha")'} embedded /></div>
    <div style={{display:'flex',gap:8}}><button className="btn" onClick={markDone}>{state.completedLessons[lesson.id]?'✓ Lesson completed':'Mark lesson complete'}</button>
    {idx>0 && <button className="btn ghost" onClick={()=>setLesson(LESSONS[idx-1].id)}>← Previous</button>}
    {idx<LESSONS.length-1 && <button className="btn ghost" onClick={()=>setLesson(LESSONS[idx+1].id)}>Next lesson →</button>}</div>
  </>);
}

function Playground({state,update,initialCode,embedded}){
  const [code,setCode]=useState(initialCode||'# ShopKart starter\norders = 150000\nrevenue = 1750000000\nprint("AOV: ₹", round(revenue/orders, 2))');
  const [out,setOut]=useState(''); const [loading,setLoading]=useState(false); const [err,setErr]=useState('');
  const [challenge,setChallenge]=useState(CODING_CHALLENGES[0]); const [hintsShown,setHintsShown]=useState(0); const [showSol,setShowSol]=useState(false);
  const run=async()=>{
    setLoading(true); setOut(''); setErr('');
    try{ const p=await getPyodide(); p.setStdout({batched:s=>setOut(o=>o+s+'\n')}); p.setStderr({batched:s=>setErr(e=>e+s+'\n')});
      await p.runPythonAsync(code); setOut(o=>o||'(no output — code ran successfully)');
      update(s=>{s.codingAttempts.push({challenge:challenge.id,at:Date.now()});});
    }catch(e){ setErr('Error: '+(e.message||e)); }
    setLoading(false);
  };
  return (<div className={embedded?'':'card'}>{!embedded && <><h1>Code Playground — real Python in your browser (Pyodide)</h1><p className="muted">Runs real Python via Pyodide from CDN. First run loads the runtime (~10–20s). If it fails offline, you will see an honest error — output is never faked.</p></>}
    <label>Code</label><textarea rows={10} value={code} onChange={e=>setCode(e.target.value)} style={{fontFamily:'monospace'}} />
    <div style={{marginTop:8}}><button className="btn" disabled={loading} onClick={run}>{loading?'Loading Python…':'▶ Run code'}</button> <span className="small muted">Hint usage tracked: {Object.keys(state.hintUsage||{}).length} challenges with hints used.</span></div>
    {(out||err) && <pre style={{marginTop:10}}>{out}{err?'\n'+err:''}</pre>}
    {!embedded && <><h2 style={{marginTop:20}}>Coding challenges</h2><div className="tabs">{CODING_CHALLENGES.map(c=>(<button key={c.id} className={challenge.id===c.id?'active':''} onClick={()=>{setChallenge(c);setCode(c.starter);setHintsShown(0);setShowSol(false)}}>{c.title} · {c.difficulty}</button>))}</div>
    <p><strong>{challenge.title}</strong> — {challenge.prompt}</p>
    <div>{[0,1,2].map(i=>(<div key={i}>{hintsShown>i ? (<p className="step"><strong>Hint {i+1}:</strong> {challenge.hints[i]}</p>) : (<button className="btn ghost small" onClick={()=>{setHintsShown(i+1); update(s=>{s.hintUsage=s.hintUsage||{}; s.hintUsage[challenge.id]=(s.hintUsage[challenge.id]||0)+1;})}}>Reveal Hint {i+1}</button>)}</div>))}</div>
    {showSol ? (<pre>{challenge.solution}</pre>) : (<button className="btn ghost small" onClick={()=>setShowSol(true)}>Show solution (after trying first!)</button>)}</>}
  </div>);
}

function Projects({state,update,projectId,setProjectId}){
  const p = PROJECTS.find(x=>x.id===projectId);
  const [step,setStep]=useState(0); const [myPlan,setMyPlan]=useState('');
  if(p) return (<div className="card"><button className="btn ghost small" onClick={()=>{setProjectId(null);setStep(0)}}>← All projects</button>
    <h1>Project {p.level} — {p.title}</h1><p className="muted">Skills: {p.skills.join(', ')}</p>
    <h2>Business problem</h2><p>{p.problem}</p>
    <h2>Project mentor — step by step (no full solution dumped upfront)</h2>
    <p className="small muted">Step {Math.min(step+1,p.steps.length)} of {p.steps.length}: {p.steps[Math.min(step,p.steps.length-1)]}</p>
    <label>What would YOU do at this step?</label><textarea rows={3} value={myPlan} onChange={e=>setMyPlan(e.target.value)} placeholder="Write your approach before seeing the hint…" />
    <div style={{marginTop:8}}><button className="btn" disabled={!myPlan.trim()} onClick={()=>{update(s=>{s.projectProgress[p.id]=s.projectProgress[p.id]||{}; s.projectProgress[p.id]['step'+step]=myPlan;}); setStep(s=>Math.min(s+1,p.steps.length-1)); setMyPlan('')}}>Save my approach &amp; reveal next step →</button></div>
    <p className="step"><strong>Hint:</strong> {p.hint}</p>
    <h2>Deliverables</h2><ul>{p.deliverables.map((d,i)=><li key={i}>{d}</li>)}</ul>
    <h2>Portfolio quality checklist</h2><ul className="check">{QUALITY_CHECKLIST.map((c,i)=>(<li key={i}><label style={{display:'flex',gap:8,margin:0,fontWeight:400}}><input type="checkbox" checked={!!(state.projectProgress[p.id]?.[c])} onChange={()=>update(s=>{s.projectProgress[p.id]=s.projectProgress[p.id]||{}; s.projectProgress[p.id][c]=!s.projectProgress[p.id][c];})} /> {c}</label></li>))}</ul>
    <p className="small muted">{QUALITY_CHECKLIST.filter(c=>state.projectProgress[p.id]?.[c]).length} / {QUALITY_CHECKLIST.length} checklist items done.</p></div>);
  return (<><h1>Projects — learn by building</h1><p className="muted">Projects start early, not at the end. Each one uses the mentor mode: problem → your plan → feedback → next step.</p>
  <div className="grid g2">{PROJECTS.map(pr=>(<div key={pr.id} className="card"><h2>Level {pr.level} — {pr.title}</h2><p className="muted">{pr.problem}</p><p className="small">Skills: {pr.skills.join(', ')}</p><p className="small">Deliverables: {pr.deliverables.join(' · ')}</p><button className="btn" onClick={()=>setProjectId(pr.id)}>Open project mentor →</button></div>))}</div></>);
}

function Interview({state,update}){
  const [cat,setCat]=useState(INTERVIEW_CATS[0].cat); const [open,setOpen]=useState(null);
  const [tp,setTp]=useState(0); const [ans,setAns]=useState(''); const [scored,setScored]=useState(null);
  const [bc,setBc]=useState(BUSINESS_CASES[0]); const [bcAns,setBcAns]=useState({}); const [showModel,setShowModel]=useState(false);
  const current = INTERVIEW_CATS.find(c=>c.cat===cat);
  const doScore=()=>{ const r=scoreAnswer(ans, TRAINER_PROMPTS[tp].keywords); setScored(r); update(s=>{s.trainerAnswers.push({q:TRAINER_PROMPTS[tp].q,score:r.score,at:Date.now()});}); };
  return (<><h1>Interview Preparation</h1>
  <div className="card"><h2>Interview Answer Trainer</h2><div className="tabs">{TRAINER_PROMPTS.map((t,i)=>(<button key={i} className={tp===i?'active':''} onClick={()=>{setTp(i);setAns('');setScored(null)}}>{t.q.slice(0,32)}…</button>))}</div>
  <p><strong>{TRAINER_PROMPTS[tp].q}</strong></p><textarea rows={4} value={ans} onChange={e=>setAns(e.target.value)} placeholder="Type your answer as you would say it in an interview…" />
  <button className="btn" style={{marginTop:8}} disabled={ans.trim().length<10} onClick={doScore}>Score my answer</button>
  {scored && <div style={{marginTop:10}}><p><strong>Score: {scored.score}/100</strong> — keyword coverage: {scored.hits.join(', ')||'none yet'}</p>{scored.missing.length>0 && <p className="muted">Missing ideas: {scored.missing.join(', ')}</p>}<p><strong>Ideal answer:</strong> {TRAINER_PROMPTS[tp].ideal}</p></div>}</div>
  <div className="card"><h2>Question bank — {INTERVIEW_CATS.length} categories</h2><div className="tabs">{INTERVIEW_CATS.map(c=>(<button key={c.cat} className={cat===c.cat?'active':''} onClick={()=>{setCat(c.cat);setOpen(null)}}>{c.cat}</button>))}</div>
  {current.qs.map((item,i)=>(<div key={i} style={{borderTop:'1px solid var(--border)',padding:'10px 0'}}><strong>{item.q}</strong><br/><button className="btn ghost small" onClick={()=>{setOpen(open===i?null:i); update(s=>{s.interviewDone[item.q]=true;})}}>{open===i?'Hide model answer':'Show model answer'}</button>{open===i && <p style={{marginTop:8}}>{item.a}</p>}</div>))}
  <p className="small muted">{Object.keys(state.interviewDone||{}).length} questions reviewed.</p></div>
  <div className="card"><h2>Business Case Simulator</h2><div className="tabs">{BUSINESS_CASES.map(b=>(<button key={b.id} className={bc.id===b.id?'active':''} onClick={()=>{setBc(b);setBcAns({});setShowModel(false)}}>{b.title}</button>))}</div>
  <p><strong>{bc.title}</strong> — {bc.context}</p>
  {bc.steps.map((s,i)=>(<div key={i}><label>{i+1}. {s}</label><textarea rows={2} value={bcAns[i]||''} onChange={e=>setBcAns(a=>({...a,[i]:e.target.value}))} /></div>))}
  <button className="btn" style={{marginTop:8}} onClick={()=>{update(st=>{st.businessCases[bc.id]=bcAns}); setShowModel(true)}}>Save &amp; see model approach</button>
  {showModel && <p className="step" style={{whiteSpace:'pre-line'}}><strong>Model approach:</strong> {bc.model}</p>}</div></>);
}

function Mistakes({state,update}){
  const today=new Date().toISOString().slice(0,10);
  return (<><h1>Mistake Journal &amp; Spaced Repetition</h1><p className="muted">Every wrong quiz/debugging answer is recorded automatically. Review on the due date (1 → 3 → 7 → 14 → 30 days). Mark as revised when you can answer it correctly.</p>
  {state.mistakes.length===0 ? <div className="card"><p>No mistakes yet — take a quiz or the diagnostic. Mistakes are the fastest way to learn.</p></div> :
  <div className="card"><table><thead><tr><th>Question</th><th>Your answer</th><th>Correct</th><th>Topic</th><th>Attempts</th><th>Next review</th><th>Status</th></tr></thead><tbody>{state.mistakes.map((m,i)=>(<tr key={i}><td>{m.question}</td><td>{m.yourAnswer}</td><td>{m.correctAnswer}</td><td>{m.topic}</td><td>{m.attempt}</td><td>{m.nextReview} {m.nextReview<=today && !m.revised ? '· DUE' : ''}</td><td><button className="btn ghost small" onClick={()=>update(s=>{s.mistakes[i].revised=!s.mistakes[i].revised})}>{m.revised?'✓ Revised':'Mark revised'}</button></td></tr>))}</tbody></table></div>}
  </>);
}
