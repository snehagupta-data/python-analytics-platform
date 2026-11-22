// localStorage persistence + mastery + spaced repetition
const KEY = 'py-analytics-v1';
export function loadState(){
  try { const raw = localStorage.getItem(KEY); if(raw) return JSON.parse(raw); } catch(e){}
  return { completedLessons:{}, quizAttempts:[], codingAttempts:[], mistakes:[], notes:{}, mission:{}, diagnostic:null, projectProgress:{}, businessCases:{}, trainerAnswers:[], hintUsage:{}, interviewDone:{}, theme:'light' };
}
export function saveState(s){ try{ localStorage.setItem(KEY, JSON.stringify(s)); }catch(e){} }
export function masteryFor(topic, state){
  const attempts = state.quizAttempts.filter(a=>a.topic===topic);
  if(!attempts.length) return state.completedLessons[topic] ? 'Learning' : 'Locked';
  const correct = attempts.filter(a=>a.correct).length;
  const acc = correct/attempts.length;
  if(attempts.length>=5 && acc>=0.9) return 'Mastered';
  if(acc>=0.75) return 'Strong';
  if(acc>=0.5) return 'Practicing';
  return 'Weak';
}
export const MASTERY_ORDER = ['Locked','Learning','Practicing','Weak','Strong','Mastered'];
export function nextReviewDate(perf){
  // perf: number of consecutive correct (0..) -> intervals 1,3,7,14,30 days
  const intervals=[1,3,7,14,30];
  const days = intervals[Math.min(perf, intervals.length-1)];
  const d = new Date(); d.setDate(d.getDate()+days); return d.toISOString().slice(0,10);
}
export function skillScores(state){
  // Map lesson ids to skill buckets
  const map = { l1:'Python', l2:'Python', l3:'Python', l4:'Python', l5:'Python', l6:'Python', l7:'Python', l8:'Python' };
  const buckets = { Python:[], NumPy:[], Pandas:[], 'Data Cleaning':[], Statistics:[], Visualization:[], EDA:[], 'SQL + Python':[], Automation:[], APIs:[], 'Business Analytics':[], 'Problem Solving':[], 'Interview Readiness':[] };
  state.quizAttempts.forEach(a=>{ const b = map[a.lessonId]||'Python'; (buckets[b]||buckets.Python).push(a.correct?1:0); });
  // diagnostic feeds buckets
  if(state.diagnostic){ Object.entries(state.diagnostic.scores).forEach(([cat,pct])=>{
    const b = cat.includes('Pandas')?'Pandas':cat.includes('NumPy')?'NumPy':cat.includes('Cleaning')?'Data Cleaning':cat.includes('Statistics')?'Statistics':cat.includes('Visualization')?'Visualization':cat.includes('EDA')||cat.includes('Problem')?'EDA':'Python';
    buckets[b].push(pct/100);
  });}
  const out={};
  Object.entries(buckets).forEach(([k,v])=>{ out[k]= v.length? Math.round(v.reduce((a,b)=>a+b,0)/v.length*100):0; });
  // interview readiness from trainer + interview quizzes
  const tr = state.trainerAnswers; if(tr.length) out['Interview Readiness']=Math.round(tr.reduce((s,t)=>s+t.score,0)/tr.length);
  return out;
}
export function weakTopics(state){
  const scores = skillScores(state);
  return Object.entries(scores).filter(([,v])=>v>0).sort((a,b)=>a[1]-b[1]).slice(0,5);
}
export function recommendedNext(state){
  const weak = weakTopics(state);
  if(!state.diagnostic) return {title:'Take the diagnostic test', detail:'It takes ~10 minutes and sets your starting point — no guessing.', target:'diagnostic'};
  if(weak.length && weak[0][1] < 60) return {title:`Strengthen ${weak[0][0]} (${weak[0][1]}%) before moving on`, detail:'Your weakest skill is '+weak[0][0]+'. Do a short revision + 5 questions on it before starting a new module — do not restart the whole module.', target:'curriculum'};
  const done = Object.keys(state.completedLessons).length;
  const nextLesson = ['l1','l2','l3','l4','l5','l6','l7','l8'].find(id=>!state.completedLessons[id]);
  if(nextLesson) return {title:'Continue: next lesson in Foundations', detail: done+' lessons done. Keep the streak of demonstrated skill, not hours.', target:'curriculum'};
  return {title:'Start the E-commerce Sales Analysis project', detail:'Foundations are done — apply them to ShopKart data.', target:'projects'};
}
