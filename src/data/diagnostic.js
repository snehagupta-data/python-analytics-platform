// 20-question diagnostic covering all areas in the brief
export const DIAGNOSTIC = [
 {q:'What is the output of print(2 + 3 * 4)?', options:['20','14','24','9'], answer:1, cat:'Python Fundamentals', explain:'* binds tighter than +: 3*4=12, +2=14.'},
 {q:'Which is the correct way to create a variable holding Sneha\'s CGPA 8.8?', options:['cgpa = 8.8','int cgpa = 8.8','cgpa := 8.8;','var cgpa = 8.8'], answer:0, cat:'Python Fundamentals', explain:'Python needs no type declaration: cgpa = 8.8.'},
 {q:'What does type(42) return?', options:['<class \'float\'>','<class \'int\'>','int','42'], answer:1, cat:'Python Fundamentals', explain:'42 is an int; type() returns the class object.'},
 {q:'What is the result of 10 // 3 and 10 % 3?', options:['3 and 1','3.33 and 1','3 and 3','4 and 0'], answer:0, cat:'Python Fundamentals', explain:'// is floor division (3), % is remainder (1).'},
 {q:'Which statement is True?', options:['[1,2] is [1,2]','[1,2] == [1,2]','"a" is "A"','None == False'], answer:1, cat:'Python Fundamentals', explain:'== compares values; is compares identity. Two separate lists are equal but not identical.'},
 {q:'What does this print? x = 5\nif x > 10:\n    print("A")\nelif x > 3:\n    print("B")\nelse:\n    print("C")', options:['A','B','C','Nothing'], answer:1, cat:'Conditions & Logic', explain:'x>10 is False, x>3 is True, so B.'},
 {q:'How many times does this loop run? for i in range(3): print(i)', options:['2','3','4','Infinite'], answer:1, cat:'Loops', explain:'range(3) yields 0, 1, 2 — three values.'},
 {q:'What does break do inside a loop?', options:['Skips one iteration','Exits the loop immediately','Restarts the loop','Pauses the loop'], answer:1, cat:'Loops', explain:'break exits the loop; continue skips to the next iteration.'},
 {q:'What is the output of len([1, 2, 2, 3]) after converting to a set?', options:['4','3','2','Error'], answer:1, cat:'Data Structures', explain:'set() removes duplicates: {1,2,3} has length 3.'},
 {q:'Which accesses the value for key "city" in d = {"city": "Mumbai"} safely if the key might be missing?', options:['d["city"]','d.get("city")','d.city','d[0]'], answer:1, cat:'Data Structures', explain:'.get() returns None (or a default) instead of raising KeyError.'},
 {q:'What does "hello world".split() return?', options:['["hello world"]','["hello", "world"]','("hello", "world")','Error'], answer:1, cat:'Strings', explain:'split() with no argument splits on whitespace.'},
 {q:'What does def f(a, b=5): return a + b  do when called as f(3)?', options:['Error','8','3','5'], answer:1, cat:'Functions', explain:'b defaults to 5, so 3+5=8.'},
 {q:'What happens when code inside try raises an error and there is a matching except?', options:['Program crashes','The except block runs','The finally block is skipped','The error is ignored silently'], answer:1, cat:'Exception Handling', explain:'The matching except block handles it; finally always runs.'},
 {q:'Which is a key OOP idea: a class defines a blueprint and an object is an instance of it?', options:['True','False — objects define classes','Only in Java','Only for games'], answer:0, cat:'OOP', explain:'Class = blueprint, object = instance. Correct.'},
 {q:'In NumPy, what is the main advantage of an array over a Python list for 150,000 numbers?', options:['Arrays can hold mixed types','Vectorized operations run in fast compiled code','Arrays use more memory','Lists cannot hold numbers'], answer:1, cat:'NumPy', explain:'Vectorization in compiled C is far faster than Python loops.'},
 {q:'In Pandas, which selects rows where revenue > 1000?', options:['df[df.revenue > 1000]','df.select(revenue > 1000)','df.filter(1000)','df[revenue > 1000]'], answer:0, cat:'Pandas', explain:'Boolean filtering: df[condition] keeps matching rows.'},
 {q:'Which Pandas method fills missing values?', options:['dropna()','fillna()','isna()','replace()'], answer:1, cat:'Data Cleaning', explain:'fillna(value) fills NaNs; dropna() removes them; isna() detects them.'},
 {q:'Which chart best shows the distribution of order values?', options:['Pie chart','Histogram','Line chart','Scatter plot'], answer:1, cat:'Visualization', explain:'A histogram shows how values are distributed across bins.'},
 {q:'What does the mean do that the median does not?', options:['It is affected by extreme outliers','It ignores outliers','It always equals the mode','It needs sorted data'], answer:0, cat:'Statistics', explain:'The mean is pulled by outliers; the median is robust to them.'},
 {q:'You see revenue rising, but order volume doubled too. What should you check first?', options:['Total revenue only','Average order value and revenue per order','The chart colours','The data source name'], answer:1, cat:'EDA & Problem Solving', explain:'Rising total revenue may just mean more orders. Check AOV / revenue per order before concluding growth in value.'},
];
export const DIAGNOSTIC_CATS = [...new Set(DIAGNOSTIC.map(d=>d.cat))];
export function diagnosticRecommendation(scores){
  // scores: {cat: pct}
  const entries = Object.entries(scores).sort((a,b)=>a[1]-b[1]);
  const worst = entries[0];
  const avg = entries.reduce((s,[,v])=>s+v,0)/entries.length;
  if(avg >= 75) return {module:'m19', label:'Strong foundations — start at NumPy (Module 19)', reason:'Your average is '+Math.round(avg)+'%. Skip ahead to data analysis and use Foundations as revision.'};
  if((scores['Python Fundamentals']??100) < 60 || (scores['Functions']??100) < 50) return {module:'m1', label:'Start at Module 1 — Getting Started', reason:'Your weakest area is ' + worst[0] + ' ('+Math.round(worst[1])+'%). Build the foundation first.'};
  if((scores['Data Structures']??100) < 60) return {module:'m6', label:'Start at Module 6 — Data Structures', reason:'Lists, dicts and sets underpin all Pandas work.'};
  if((scores['Pandas']??100) < 60 || (scores['Data Cleaning']??100) < 60) return {module:'m20', label:'Start at Module 20 — Pandas Foundations', reason:'Python is solid; Pandas is the gap. Start there.'};
  return {module:'m5', label:'Start at Module 5 — Loops', reason:'Your weakest area is ' + worst[0] + ' ('+Math.round(worst[1])+'%). Strengthen it, then move to data structures.'};
}
