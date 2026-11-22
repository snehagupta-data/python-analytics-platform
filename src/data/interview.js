// Interview questions by category (3+ each) + trainer + business cases
export const INTERVIEW_CATS = [
 {cat:'Python Basics', qs:[
  {q:'What is Python and why is it used in data analytics?', a:'Python is a high-level, interpreted language with readable syntax and a huge analytics ecosystem — Pandas, NumPy, Matplotlib. It lets analysts clean data, analyse lakhs of rows and automate reports in one language.'},
  {q:'What is the difference between a list and a tuple?', a:'A list is mutable (changeable) and a tuple is immutable. Use lists for collections that change, tuples for fixed records like coordinates. Tuples are hashable, so they can be dict keys.'},
  {q:'Explain == vs is.', a:'== compares values, is compares identity (same object in memory). Use == for values and is only for None checks.'}]},
 {cat:'Data Structures', qs:[
  {q:'When would you use a set instead of a list?', a:'When I need unique values and fast membership checks. set lookup is O(1) on average; scanning a list is O(n). E.g. unique customers from 150,000 orders.'},
  {q:'How does a dictionary work?', a:'A dict is a hash map: keys hash to storage locations, giving O(1) average lookup. I use .get(key, default) to avoid KeyError on missing keys.'},
  {q:'List vs dict for a customer lookup — which and why?', a:'A dict: customer_id → segment gives instant lookup. A list would need a scan per lookup — 150,000 scans is far too slow.'}]},
 {cat:'Functions', qs:[
  {q:'What are *args and **kwargs?', a:'*args collects extra positional arguments into a tuple; **kwargs collects extra keyword arguments into a dict. They make functions flexible, e.g. wrappers and logging.'},
  {q:'What is a lambda function? When is it a bad choice?', a:'A lambda is a small anonymous one-expression function, good for sort keys or tiny callbacks. It is bad for complex logic — use a named def for readability and testing.'},
  {q:'What happens if a function has no return statement?', a:'It returns None. That is a common bug: printing inside a function is not the same as returning a value.'}]},
 {cat:'OOP', qs:[
  {q:'What is a class and an object?', a:'A class is a blueprint; an object is an instance of it. E.g. class Customer defines attributes and methods; each customer row becomes one Customer object.'},
  {q:'What is inheritance?', a:'A child class reuses and extends a parent class. E.g. a Report class with a MonthlyReport subclass that adds month-specific formatting.'},
  {q:'Why keep OOP practical in analytics?', a:'Because most analytics work is functions + DataFrames. I use classes for reusable components — a data loader, a report builder — not for everything.'}]},
 {cat:'Exception Handling', qs:[
  {q:'What is the difference between a syntax error and a runtime error?', a:'A syntax error means the code cannot even run (e.g. missing colon). A runtime error happens while running (e.g. KeyError, ZeroDivisionError). A logical error runs fine but gives the wrong answer — the hardest to catch.'},
  {q:'When should you use try/except?', a:'For errors you can anticipate and handle — bad input, missing files, failed API calls. Never use a bare except to hide bugs.'},
  {q:'What does finally do?', a:'It always runs, whether or not an error occurred — ideal for cleanup like closing a file or database connection.'}]},
 {cat:'File Handling', qs:[
  {q:'Why use "with open(...)" instead of open() alone?', a:'with guarantees the file is closed, even if an error occurs. It is a context manager — cleanup is automatic.'},
  {q:'How do you read a large CSV without loading it all into memory?', a:'Read in chunks with pd.read_csv(..., chunksize=10000) or iterate line by line, or use a generator.'},
  {q:'CSV vs JSON — when is each better?', a:'CSV for flat tabular data; JSON for nested or API data. Pandas reads both: read_csv and read_json.'}]},
 {cat:'NumPy', qs:[
  {q:'List vs NumPy array — what is the real difference?', a:'A list holds mixed Python objects; an array holds one dtype in contiguous memory and supports vectorized operations in compiled C — far faster on large data.'},
  {q:'What is broadcasting?', a:'NumPy aligns arrays of different shapes for element-wise operations, e.g. adding a scalar to a whole array, or a per-column vector to every row.'},
  {q:'What does axis=0 vs axis=1 mean?', a:'axis=0 operates down rows (per column); axis=1 operates across columns (per row). df.sum(axis=0) gives one total per column.'}]},
 {cat:'Pandas', qs:[
  {q:'Explain loc vs iloc.', a:'loc selects by label (df.loc["Mumbai"] or df.loc[df.revenue > 1000]); iloc selects by integer position (df.iloc[0:5]). Mixing them up is a classic bug.'},
  {q:'What does groupby do?', a:'It splits data into groups by a key, applies an aggregation to each group, and combines the results — e.g. revenue by region or orders by month.'},
  {q:'When do you use merge instead of concat?', a:'merge joins DataFrames on keys, like a SQL JOIN; concat stacks them vertically or side by side. Use merge to combine orders with customers on customer_id.'}]},
 {cat:'Data Cleaning', qs:[
  {q:'How do you handle missing values?', a:'First understand why they are missing. Then drop (if few and random), fill with a sensible value (median/mode/forward-fill), or flag them. Never fill blindly — filling with 0 can fake revenue.'},
  {q:'How do you find and remove duplicates?', a:'df.duplicated() to find them, df.drop_duplicates() to remove them — but check first whether duplicates are real (e.g. two identical orders could be genuine).'},
  {q:'A city column has "Mumbai", "mumbai " and "MUMBAI". How do you fix it?', a:'df["city"] = df["city"].str.strip().str.title() — strip whitespace, normalize case — then verify with value_counts().'}]},
 {cat:'EDA', qs:[
  {q:'Walk me through your EDA process.', a:'Business understanding first, then data understanding (shape, dtypes, missing), then univariate, bivariate and multivariate analysis, outliers, correlations, and finally insights and recommendations — with a checklist so nothing is skipped.'},
  {q:'How do you detect outliers?', a:'Descriptive stats, boxplots, IQR rule (beyond Q1−1.5×IQR or Q3+1.5×IQR), and business sense — a ₹10 lakh order might be real (B2B) or a data error.'},
  {q:'Correlation vs causation — give an example.', a:'Ice-cream sales and drownings correlate in summer, but heat causes both. In analytics, a correlation is a hypothesis to test, never a conclusion.'}]},
 {cat:'Statistics', qs:[
  {q:'Mean vs median — when is the median better?', a:'When data is skewed or has outliers. ShopKart order values are right-skewed, so the median describes a "typical" order better than the mean.'},
  {q:'What is a p-value, in simple terms?', a:'The probability of seeing results at least this extreme if there were actually no effect. A small p-value (usually < 0.05) suggests the effect is real — it is not the probability that the null hypothesis is true.'},
  {q:'How would you design an A/B test?', a:'Define the metric (conversion), randomize users, run long enough for power, check for bias, then compare with a statistical test — like my ₹200 OFF vs 20% OFF test.'}]},
 {cat:'Visualization', qs:[
  {q:'How do you choose the right chart?', a:'By the question: trend over time → line; comparison across categories → bar; distribution → histogram; relationship → scatter; part-to-whole (few parts) → bar, not pie.'},
  {q:'What makes a chart misleading?', a:'Truncated axes, cherry-picked ranges, 3D effects, area used for one dimension, and missing context — e.g. showing total revenue rising while order volume doubled.'},
  {q:'What is data storytelling?', a:'Turning analysis into a narrative: context → insight → implication → recommendation. A chart is evidence; the story is what the business should do.'}]},
 {cat:'SQL + Python', qs:[
  {q:'How do you read SQL data into Pandas?', a:'With pd.read_sql(query, connection) — write the SQL, pass a connection (e.g. SQLAlchemy engine), and get a DataFrame back.'},
  {q:'Why filter in SQL instead of in Python?', a:'To move less data. Filtering and aggregating in the database is faster and uses less memory than pulling 150,000 rows and filtering locally.'},
  {q:'What is a parameterized query and why use one?', a:'A query with placeholders (e.g. %s) where values are passed separately. It prevents SQL injection and handles quoting correctly.'}]},
 {cat:'Automation', qs:[
  {q:'Give an example of automation you would build as an analyst.', a:'A monthly reporting pipeline: raw CSVs in, cleaned data, KPIs, charts and a formatted Excel report out — run on a schedule, with a log of what changed.'},
  {q:'How do you make an automation reliable?', a:'Validate inputs, log errors, never overwrite raw files, write outputs to a new folder, and add checks (e.g. row counts before/after).'},
  {q:'Script vs notebook for automation — which?', a:'Scripts: repeatable, schedulable, testable. Notebooks are for exploration. Automation belongs in .py files.'}]},
 {cat:'APIs', qs:[
  {q:'What is a REST API?', a:'A web service that exposes data over HTTP: GET to read, POST to create, with JSON responses, endpoints, and usually authentication and rate limits.'},
  {q:'How do you handle API errors and pagination?', a:'Check status codes, retry with backoff on 429/5xx, and follow pagination (page tokens / next links) until no more data. Always respect rate limits.'},
  {q:'How do you turn JSON into a DataFrame?', a:'Parse with response.json(), then pd.json_normalize() for nested structures — flattening lists and nested dicts into columns.'}]},
 {cat:'Business Analytics', qs:[
  {q:'Sales dropped 15%. How would you investigate?', a:'Define the drop precisely (revenue vs orders vs AOV), segment by region/category/channel/time, check data quality first, generate hypotheses, test each with data, and recommend actions.'},
  {q:'What is AOV and why does it matter?', a:'Average Order Value = revenue / orders. It shows whether customers spend more per order — a drop can mean discounting, mix shift, or smaller baskets.'},
  {q:'What is RFM analysis?', a:'Segmenting customers by Recency (how recently they bought), Frequency (how often) and Monetary value (how much) — to target Champions, At-Risk and Lost customers differently.'}]},
 {cat:'Project Questions', qs:[
  {q:'Explain your ShopKart project in 30 seconds.', a:'ShopKart is an e-commerce analytics project on 150,000 orders and ₹1.75B revenue. I cleaned the data, built a 12-table model and a 9-page Power BI dashboard, and found where profit was leaking — discounts and returns in specific categories.'},
  {q:'What was the hardest part of your LendX project?', a:'Defining risk consistently across 4,000 loans: handling missing income data, choosing default definitions, and making sure the risk segments were actually actionable for lending decisions.'},
  {q:'What would you do differently in your A/B test?', a:'I would pre-register the metric and sample size, check randomization balance first, and watch for novelty effects — the ₹200 OFF vs 20% OFF result depends on order value, so segment-level analysis matters.'}]},
];
export const TRAINER_PROMPTS = [
 {q:'What is the difference between a list and a tuple?', keywords:['mutable','immutable','change','list','tuple','hashable','fixed'], ideal:'A list is mutable — you can change, add or remove items after creation. A tuple is immutable — once created it cannot be changed. Tuples are hashable, so they can be used as dictionary keys, and they are slightly faster. Use lists for collections that change and tuples for fixed records like coordinates.'},
 {q:'Explain loc vs iloc in Pandas.', keywords:['loc','iloc','label','position','integer','index','row'], ideal:'loc selects by label — df.loc["Mumbai"] or a boolean mask — while iloc selects by integer position, like df.iloc[0:5]. Mixing them up is a classic bug: loc with an integer label looks up that label, iloc always counts positions.'},
 {q:'How do you handle missing values in Pandas?', keywords:['missing','fillna','dropna','isna','median','understand','why'], ideal:'First understand why values are missing — random, systematic, or a data issue. Then choose: drop if few and random, fill with median/mode or forward-fill if sensible, or flag them as a category. Never fill blindly: filling revenue NaNs with 0 invents fake zero-revenue orders.'},
];
export function scoreAnswer(text, keywords){
  const lower = (text||'').toLowerCase();
  const hits = keywords.filter(k=>lower.includes(k));
  const coverage = hits.length/keywords.length;
  const lenScore = Math.min(1, (text||'').trim().split(/\s+/).filter(Boolean).length/40);
  const score = Math.round((coverage*0.7 + lenScore*0.3)*100);
  return {score, hits, missing: keywords.filter(k=>!lower.includes(k))};
}
export const BUSINESS_CASES = [
 {id:'bc1', title:'Sales dropped 15% — investigate', context:'ShopKart revenue fell 15% month-on-month. Management wants to know why — and what to do.', steps:['Define the problem precisely','Identify the data you need','Generate hypotheses','Test each hypothesis','Communicate findings & recommend action'], model:'1) Split the drop: revenue = orders × AOV. Is it fewer orders, lower AOV, or both? 2) Segment by region, category, channel and week — a 15% total drop can hide a 40% drop in one segment. 3) Check data quality first: missing days, a broken feed, a promo ending. 4) Hypotheses: seasonality, price rise, stock-outs, competitor promo, website issue. Test each with data. 5) Recommend the top 2 actions with expected impact and an owner.'},
 {id:'bc2', title:'Customer churn increased — analyse', context:'Monthly churn rose from 4% to 7%. Retention is now the top priority.', steps:['Define churn precisely','Identify the data you need','Generate hypotheses','Test each hypothesis','Communicate findings & recommend action'], model:'1) Define churn: no order in 90 days? Cancelled subscription? 2) Compare churned vs retained on recency, frequency, spend, category, support tickets. 3) Hypotheses: price rise, delivery delays, a competitor, onboarding gaps. 4) Use cohort analysis: is churn worse for newer cohorts? 5) Recommend retention actions per segment — win-back offers for At-Risk, onboarding fixes for new customers.'},
 {id:'bc3', title:'Average order value decreased — find reasons', context:'AOV fell 12% in a quarter while order count grew. Is this good or bad?', steps:['Define the problem precisely','Identify the data you need','Generate hypotheses','Test each hypothesis','Communicate findings & recommend action'], model:'1) AOV = revenue/orders. More orders at lower value can still grow revenue — check total revenue first. 2) Segment AOV by category, customer segment, channel and discount use. 3) Hypotheses: heavy discounting (₹200 OFF vs 20% OFF mix), more low-value first orders, a popular low-price category, mix shift to a cheaper region. 4) Check discount share of revenue and AOV with/without discount. 5) Recommend: protect AOV with bundles, free-shipping thresholds, or targeted upsells — not by stopping growth.'},
];
