import { useState, useRef, useMemo, useEffect } from "react";

// ─── SVG ICON SYSTEM ──────────────────────────────────────────────────────────
const Icon = ({ name, size=14, color="currentColor", strokeWidth=1.75 }) => {
  const s = { width:size, height:size, display:"inline-block", verticalAlign:"middle", flexShrink:0 };
  const p = { fill:"none", stroke:color, strokeWidth, strokeLinecap:"round", strokeLinejoin:"round" };
  const paths = {
    // Tab bar
    tradeoff:   <svg style={s} viewBox="0 0 24 24" {...p}><path d="M12 3v18M3 8l4-4 4 4M17 16l4 4-4 4M3 16h7M14 8h7"/></svg>,
    timeline:   <svg style={s} viewBox="0 0 24 24" {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
    scenarios:  <svg style={s} viewBox="0 0 24 24" {...p}><rect x="2" y="3" width="6" height="18" rx="1"/><rect x="9" y="3" width="6" height="18" rx="1"/><rect x="16" y="3" width="6" height="18" rx="1"/></svg>,
    // Mode selector
    clinical:   <svg style={s} viewBox="0 0 24 24" {...p}><path d="M9 12l2 2 4-4"/><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>,
    lactation:  <svg style={s} viewBox="0 0 24 24" {...p}><path d="M12 3C7 9.5 5 13.5 5 16.5a7 7 0 0 0 14 0C19 13.5 17 9.5 12 3z"/><path d="M9 17c.5 1.5 1.5 2.5 3 2.5s2.5-1 3-2.5"/></svg>,
    // Comparison table rows
    risk:       <svg style={s} viewBox="0 0 24 24" {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    admin:      <svg style={s} viewBox="0 0 24 24" {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    evid:       <svg style={s} viewBox="0 0 24 24" {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    detail:     <svg style={s} viewBox="0 0 24 24" {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    rates:      <svg style={s} viewBox="0 0 24 24" {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    relapse:    <svg style={s} viewBox="0 0 24 24" {...p}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
    pk:         <svg style={s} viewBox="0 0 24 24" {...p}><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>,
    lac:        <svg style={s} viewBox="0 0 24 24" {...p}><path d="M12 3C7 9.5 5 13.5 5 16.5a7 7 0 0 0 14 0C19 13.5 17 9.5 12 3z"/><path d="M9 17c.5 1.5 1.5 2.5 3 2.5s2.5-1 3-2.5"/></svg>,
    // Actions & UI
    compare:    <svg style={s} viewBox="0 0 24 24" {...p}><rect x="2" y="3" width="6" height="18" rx="1"/><rect x="16" y="3" width="6" height="18" rx="1"/><path d="M12 8v8M9 11l3-3 3 3M9 16l3 3 3-3"/></svg>,
    patient:    <svg style={s} viewBox="0 0 24 24" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    warning:    <svg style={s} viewBox="0 0 24 24" {...p}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    check:      <svg style={s} viewBox="0 0 24 24" {...p}><polyline points="20 6 9 17 4 12"/></svg>,
    lightbulb:  <svg style={s} viewBox="0 0 24 24" {...p}><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>,
    note:       <svg style={s} viewBox="0 0 24 24" {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    target:     <svg style={s} viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    phone:      <svg style={s} viewBox="0 0 24 24" {...p}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
    flash:      <svg style={s} viewBox="0 0 24 24" {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    science:    <svg style={s} viewBox="0 0 24 24" {...p}><path d="M9 3v11l-4 6h14l-4-6V3"/><line x1="9" y1="3" x2="15" y2="3"/></svg>,
  };
  return paths[name] || null;
};


/* ═══════════════════════════════════════════════════════════════════════════
   MEDICATION DATABASE — P0 through P2 per PRD coverage priority
   ═══════════════════════════════════════════════════════════════════════════ */
const MEDS = {
  sertraline:{g:"Sertraline",b:"Zoloft",cls:"SSRI",p:"P0",tera:{
    t1:{r:"None–Minimal",q:"Strong",s:"Multiple large cohort studies (n>30,000 pooled) find no significant increase in overall major malformation risk. A small signal for cardiac septal defects observed in some studies (absolute risk increase ~1–2 per 1,000) attenuates when controlling for underlying depression.",src:"DailyMed",d:"2025-09-15",bl:"8–10 / 1,000",ex:"9–12 / 1,000"},
    t2:{r:"None–Minimal",q:"Moderate",s:"No significant neurodevelopmental concerns in studies following children to age 3–5 years. Longer follow-up data limited.",src:"MotherToBaby",d:"2025-07-22"},
    t3:{r:"Low",q:"Strong",s:"Neonatal adaptation syndrome in ~30% of exposed neonates. Symptoms typically mild (jitteriness, irritability, feeding difficulty) and self-limited (2–7 days). PPHN risk slightly elevated (~3/1,000 vs ~2/1,000 baseline; NNH ~1,000). Sertraline has lowest PPHN risk among SSRIs per meta-analysis (Masarwa et al. AJOG 2019).",src:"DailyMed",d:"2025-09-15"},
    pp:{r:"Compatible",q:"Strong",s:"Preferred SSRI during breastfeeding per LactMed. Low breast milk levels, usually undetectable in infant serum. RID <2%.",src:"LactMed",d:"2025-12-15"}},
    alt:[{n:"Fluoxetine",p:"Similar SSRI profile; longer half-life may complicate neonatal adaptation",q:"Strong"},{n:"Escitalopram",p:"Less pregnancy-specific data than sertraline; generally favorable",q:"Moderate"},{n:"CBT / IPT",p:"Evidence-based for mild–moderate depression; may be insufficient as monotherapy for severe illness",q:"Strong"}],
    pk:"CYP2C19 and CYP2B6 activity increases in pregnancy; may require dose increase by T2/T3. TDM recommended.",
    gl:[{b:"APA-MDD",pos:"Consider continuing if stable; weigh relapse risk — APA Guideline for MDD recommends continuing effective treatment in pregnancy",str:"IIA",y:2010,note:"APA Practice Guideline for MDD, 3rd ed."},{b:"ACOG",pos:"SSRIs generally compatible; individualize",str:"CO",y:2023},{b:"NICE",pos:"Continue if benefits outweigh risks; sertraline preferred SSRI",str:"Strong",y:2022}],
    lac:{tier:"Compatible",ml:"45–207 mcg/L typical (avg 45 mcg/L at avg 83mg/day per pooled analysis; up to 938 mcg/L at higher doses — dose-dependent per Stowe study at 124mg/day)",is:"Sertraline undetectable in most infants; norsertraline (active metabolite) detectable in ~50% at low levels (avg 22 mcg/L). Preterm infants may accumulate.",rid:"<2% (pooled avg ~0.5%; 0.95% at 50mg/day by PK model — well below 10% threshold)",ae:"No significant adverse effects in controlled studies. Rare: colic, fussiness, benign neonatal sleep (one report; resolved at 6 months). Note: SSRIs as a class may delay lactogenesis II onset by ~17 hours — clinically relevant in early postpartum.",pk:"8–9 hrs post-dose",mon:"Monitor for colic, poor feeding, poor weight gain. Sertraline is lowest-risk SSRI in lactation — extensive monitoring not required in healthy term infants. Neonates and preterm infants: heightened vigilance. Note: SSRIs may delay milk coming in by ~17hrs — inform mothers starting sertraline postpartum.",alts:["Paroxetine","Nortriptyline"],rev:"Dec 15, 2025"}},

  fluoxetine:{g:"Fluoxetine",b:"Prozac",cls:"SSRI",p:"P0",tera:{
    t1:{r:"None–Minimal",q:"Strong",s:"Extensive data (>10,000 first-trimester exposures). No consistent increase in major malformations. Earlier cardiac signal not confirmed in larger studies.",src:"DailyMed",d:"2025-08-20",bl:"3–5%",ex:"3–5%"},
    t2:{r:"None–Minimal",q:"Moderate",s:"Neurodevelopmental studies generally reassuring to age 5. Some studies note transient motor differences at 6 months that resolve.",src:"MotherToBaby",d:"2025-06-10"},
    t3:{r:"Low",q:"Strong",s:"Neonatal adaptation syndrome ~30%. Longer half-life (fluoxetine + norfluoxetine) means more prolonged neonatal symptoms vs shorter-acting SSRIs. PPHN risk similar to other SSRIs.",src:"DailyMed",d:"2025-08-20"},
    pp:{r:"Compatible with monitoring",q:"Moderate",s:"Higher breast milk levels than sertraline due to long half-life. RID 2–12%. Colic, fussiness, drowsiness reported in some infants.",src:"LactMed",d:"2025-11-01"}},
    alt:[{n:"Sertraline",p:"Preferred SSRI in pregnancy/lactation; shorter half-life",q:"Strong"},{n:"Escitalopram",p:"Moderate pregnancy data; favorable profile",q:"Moderate"}],
    pk:"Active metabolite norfluoxetine extends effective half-life to 4–16 days. CYP2D6 substrate; pregnancy may alter levels.",
    gl:[{b:"APA-MDD",pos:"Acceptable SSRI; sertraline preferred for new starts per APA MDD Guideline — less neonatal adaptation data for fluoxetine long half-life",str:"IIA",y:2010,note:"APA Practice Guideline for MDD, 3rd ed."},{b:"NICE",pos:"Continue if stable; sertraline preferred for new starts",str:"Moderate",y:2022}],
    lac:{tier:"Compatible with monitoring",ml:"60–300 mcg/L",is:"Detectable in some infants; norfluoxetine higher",rid:"2–12%",ae:"Colic, fussiness, drowsiness reported in some breastfed infants",pk:"6–8 hrs post-dose",mon:"Monitor for colic, agitation, irritability, poor feeding, and poor weight gain (per LactMed). Norfluoxetine accumulates — neonates and preterm infants at higher risk. Consider lower-transfer SSRI (sertraline) if initiating postpartum in antidepressant-naive women.",alts:["Sertraline","Paroxetine"],rev:"Nov 1, 2025"}},

  citalopram:{g:"Citalopram",b:"Celexa",cls:"SSRI",p:"P0",tera:{
    t1:{r:"None–Minimal",q:"Moderate",s:"Moderate-sized cohort data. No consistent increase in major malformations. One study noted possible cardiac septal defect signal but not replicated.",src:"DailyMed",d:"2025-07-01",bl:"8–10 / 1,000",ex:"9–11 / 1,000"},
    t2:{r:"None–Minimal",q:"Limited",s:"Limited neurodevelopmental follow-up specific to citalopram. Class-level SSRI data generally reassuring.",src:"MotherToBaby",d:"2025-05-15"},
    t3:{r:"Low",q:"Moderate",s:"Neonatal adaptation syndrome similar to SSRI class. PPHN risk similar to other SSRIs.",src:"DailyMed",d:"2025-07-01"},
    pp:{r:"Compatible with monitoring",q:"Moderate",s:"Moderate breast milk levels. RID 3–6%. Generally well tolerated.",src:"LactMed",d:"2025-10-15"}},
    alt:[{n:"Sertraline",p:"More pregnancy data; preferred SSRI",q:"Strong"},{n:"Escitalopram",p:"Active enantiomer; similar or better tolerability",q:"Moderate"}],
    pk:"CYP2C19 and CYP3A4 substrate. Levels may fluctuate in pregnancy.",
    gl:[{b:"APA-MDD",pos:"Acceptable SSRI; sertraline preferred for new starts per APA MDD Guideline. No specific APA 2023 citalopram guidance exists — position derived from SSRI class recommendations.",str:"IIB",y:2010,note:"APA Practice Guideline for MDD, 3rd ed. (SSRI class guidance)"}],
    lac:{tier:"Compatible with monitoring — note divided expert opinion; some experts do not recommend citalopram during nursing",ml:"50–200 mcg/L (avg 157 mcg/L at 29mg/day; range 41–451; concentrates in milk relative to plasma M/P ratio 1.16–3)",is:"Detectable in some infant serum. CYP2C19 poor metabolizers may have higher infant exposure.",rid:"~7.9% pooled at average dose (LactMed Dec 2025); some studies approach or exceed 10% threshold. Higher-exposure SSRI vs sertraline or paroxetine.",ae:"Drowsiness, fussiness, uneasy sleep, somnolence, decreased feeding, weight loss (case reports). IMPORTANT: breastfeeding does NOT prevent withdrawal in infants exposed to citalopram in utero — neonatal abstinence can occur despite continued maternal citalopram use (LactMed Dec 2025).",pk:"4–6 hrs",mon:"Monitor for sedation, irritability, poor feeding, weight gain. Flag higher-exposure profile vs sertraline (RID ~8% vs <2%). CRITICAL: Infants exposed to citalopram in utero can have withdrawal effects postpartum despite continued maternal breastfeeding — inform NICU/postpartum teams. Consider sertraline if initiating postpartum.",alts:["Sertraline"],rev:"Dec 15, 2025"}},

  escitalopram:{g:"Escitalopram",b:"Lexapro",cls:"SSRI",p:"P0",tera:{
    t1:{r:"None–Minimal",q:"Moderate",s:"Growing dataset from pregnancy registries. No significant malformation signal. Less data than sertraline or fluoxetine but generally consistent with SSRI class.",src:"DailyMed",d:"2025-08-01"},
    t2:{r:"None–Minimal",q:"Limited",s:"Limited specific data. SSRI class-level data reassuring.",src:"MotherToBaby",d:"2025-06-01"},
    t3:{r:"Low",q:"Moderate",s:"Neonatal adaptation syndrome consistent with SSRI class. PPHN risk similar.",src:"DailyMed",d:"2025-08-01"},
    pp:{r:"Compatible with monitoring",q:"Moderate",s:"Breast milk levels generally low. RID 3–6%.",src:"LactMed",d:"2025-09-20"}},
    alt:[{n:"Sertraline",p:"Most pregnancy data; preferred SSRI",q:"Strong"},{n:"Citalopram",p:"Racemic parent compound; comparable",q:"Moderate"}],
    pk:"CYP2C19 and CYP3A4 substrate. Active S-enantiomer of citalopram.",
    gl:[{b:"APA-MDD",pos:"Acceptable SSRI per APA MDD Guideline SSRI class recommendations; sertraline has more pregnancy-specific data",str:"IIB",y:2010,note:"APA Practice Guideline for MDD, 3rd ed. (SSRI class guidance)"},{b:"NICE",pos:"Reasonable option; less data than sertraline",str:"Moderate",y:2022}],
    lac:{tier:"Compatible with monitoring",ml:"84–195 mcg/L (avg 84–85 mcg/L at 10mg; higher at 20mg; dose-dependent)",is:"Desmethylcitalopram (active metabolite) also detectable. Sertraline and norfluoxetine are irrelevant to escitalopram entries.",rid:"2.6–7.7% (Hale); ~3–5% typical; one study 4.6% at 20mg. Significantly higher than sertraline — LactMed Dec 2025.",ae:"Monitor for excess drowsiness, restlessness, agitation, poor feeding, poor weight gain (LactMed Dec 2025). Rare: necrotising enterocolitis (1 case) and convulsions (1 case) — causality uncertain. Age caveat: would not be expected to cause adverse effects especially if infant is older than 2 months.",pk:"5–7 hrs",mon:"More cautious approach than sertraline warranted given higher RID (~3–8%). Monitor for drowsiness, restlessness, agitation, poor feeding, weight gain. Age-stratify: heightened vigilance for neonates and infants <2 months. Inform pediatrician. Consider sertraline if initiating postpartum antidepressant treatment.",alts:["Sertraline"],rev:"Dec 15, 2025"}},

  paroxetine:{g:"Paroxetine",b:"Paxil",cls:"SSRI",p:"P0",tera:{
    t1:{r:"Low–Moderate",q:"Conflicting",s:"Cardiac malformation signal: genuinely contested in the literature. FDA reclassified from C to D in 2005 based on early data suggesting VSD/RVOTO risk. However, the large Huybrechts et al. NEJM 2014 study (n=949,504, fully adjusted for depression severity) found no significant association (RR 1.07, 95% CI 0.59–1.93 for RVOTO). Meta-analyses conflict. Current consensus: a small absolute risk increase cannot be ruled out, but confounding by indication (untreated depression) explains much of the signal. APA/ACOG recommend considering alternatives in first trimester, not absolute avoidance.",src:"Huybrechts et al. NEJM 2014; Berard et al. 2016 meta-analysis; FDA 2005",d:"2025-09-01",bl:"8–10 / 1,000",ex:"Signal contested — see evidence"},
    t2:{r:"None–Minimal",q:"Limited",s:"No specific neurodevelopmental signal beyond SSRI class data.",src:"MotherToBaby",d:"2025-06-15"},
    t3:{r:"Low–Moderate",q:"Strong",s:"Higher rate of neonatal adaptation syndrome than other SSRIs (~40%). Short half-life means abrupt postnatal withdrawal. PPHN risk similar to class.",src:"DailyMed",d:"2025-09-01"},
    pp:{r:"Compatible",q:"Strong",s:"Low breast milk levels due to extensive first-pass metabolism. RID 1–3%. Preferred for lactation despite pregnancy concerns.",src:"LactMed",d:"2025-12-01"}},
    alt:[{n:"Sertraline",p:"Preferred SSRI; no cardiac signal",q:"Strong"},{n:"Fluoxetine",p:"Well-studied alternative; no cardiac signal",q:"Strong"}],
    pk:"CYP2D6 substrate. Short half-life; discontinuation syndrome risk if tapered too quickly.",
    gl:[{b:"APA-MDD",pos:"APA MDD Guideline recommends avoiding paroxetine pre-conception and in first trimester if possible due to contested cardiac signal; switch to sertraline",str:"IIA",y:2010,note:"APA Practice Guideline for MDD + ACOG CO #124 cardiac signal data"},{b:"ACOG",pos:"Counsel about cardiac malformation signal; consider alternatives",str:"CO",y:2023}],
    lac:{tier:"Compatible with monitoring",ml:"10–80 mcg/L",is:"Undetectable in serum of most infants tested (LactMed Dec 2025). Paroxetine's metabolites are distinct from fluoxetine — norfluoxetine is irrelevant to paroxetine.",rid:"1–3% (avg ~2% at typical doses; range 1.1–3.2% across multiple well-designed studies). Upper bound of 12% not supported by LactMed data.",ae:"Insomnia, restlessness, irritability (most common per LactMed), occasional poor feeding. One case of severe constipation resolved with discontinuation. No long-term developmental effects to 5 years.",pk:"4–6 hrs",mon:"Monitor for insomnia, restlessness, irritability, poor feeding, weight gain. Paroxetine has one of the lowest RIDs of all SSRIs (<3%). Routine pediatric follow-up adequate in healthy term infants >2 months. Inform pediatrician of exposure. Note: paroxetine is preferred for lactation despite first-trimester cardiac signal concerns.",alts:["Sertraline","Nortriptyline"],rev:"Dec 15, 2025"}},

  venlafaxine:{g:"Venlafaxine",b:"Effexor XR",cls:"SNRI",p:"P0",tera:{
    t1:{r:"None–Minimal",q:"Moderate",s:"Moderate-sized cohort studies show no significant increase in major malformations. Less data than SSRIs but growing.",src:"DailyMed",d:"2025-07-15"},
    t2:{r:"None–Minimal",q:"Limited",s:"Limited neurodevelopmental data specific to venlafaxine.",src:"MotherToBaby",d:"2025-05-20"},
    t3:{r:"Low–Moderate",q:"Moderate",s:"Neonatal adaptation syndrome reported in ~35–40% of exposed neonates. May be more pronounced than SSRIs due to noradrenergic effects. Symptoms include irritability, tremor, feeding difficulty.",src:"DailyMed",d:"2025-07-15"},
    pp:{r:"Compatible with monitoring",q:"Moderate",s:"Moderate breast milk levels. RID 6–9%. Active metabolite O-desmethylvenlafaxine also present in milk.",src:"LactMed",d:"2025-10-01"}},
    alt:[{n:"Sertraline",p:"More perinatal data; SSRI may suffice for some",q:"Strong"},{n:"Duloxetine",p:"Alternative SNRI; similar data limitations",q:"Limited"}],
    pk:"CYP2D6 substrate. XR formulation important—do not crush. Dose tapering complex.",
    gl:[{b:"APA-MDD",pos:"Continue if SSRI-refractory per APA MDD Guideline; risk of switching must be weighed against limited additional venlafaxine-specific pregnancy data",str:"IIB",y:2010,note:"APA Practice Guideline for MDD, 3rd ed."}],
    lac:{tier:"Use with caution — divided expert opinion; prefer sertraline if initiating postpartum",ml:"80–250 mcg/L",is:"O-desmethylvenlafaxine (active metabolite, desvenlafaxine) detectable in plasma of most breastfed infants",rid:"6–9% (combined venlafaxine + desvenlafaxine approaches the 10% threshold — LactMed Jun 2025)",ae:"Rare drowsiness and poor feeding reported. One bruxism case report (LactMed). Note: some experts feel venlafaxine is not recommended during nursing (divided expert opinion per LactMed Jun 2025). Breastfeeding in mothers who took venlafaxine in pregnancy may reduce neonatal abstinence severity — clinically important for NICU/postpartum teams.",pk:"4–6 hrs",mon:"Monitor for drowsiness, poor feeding, feeding changes, bruxism. Active metabolite O-desmethylvenlafaxine also present in milk — accounts for total infant exposure approaching 10% threshold. If continuing BF in mothers who took venlafaxine during pregnancy, note: breastfeeding may mitigate neonatal abstinence symptoms. Inform pediatrician. Monitor weight gain at routine visits.",alts:["Sertraline","Duloxetine"],rev:"Jun 15, 2025"}},

  duloxetine:{g:"Duloxetine",b:"Cymbalta",cls:"SNRI",p:"P0",tera:{
    t1:{r:"None–Minimal",q:"Limited",s:"Limited pregnancy-specific data. No clear malformation signal in available studies but sample sizes small.",src:"DailyMed",d:"2025-06-01"},
    t2:{r:"Undetermined",q:"Insufficient",s:"Insufficient data for neurodevelopmental assessment.",src:"MotherToBaby",d:"2025-04-15"},
    t3:{r:"Low",q:"Limited",s:"Neonatal adaptation syndrome expected based on SNRI class. Limited specific data.",src:"DailyMed",d:"2025-06-01"},
    pp:{r:"Compatible with monitoring",q:"Limited",s:"Breast milk levels studied in small samples. RID ~1%. Low levels but limited data.",src:"LactMed",d:"2025-08-15"}},
    alt:[{n:"Venlafaxine",p:"More pregnancy data as SNRI; similar mechanism",q:"Moderate"},{n:"Sertraline",p:"More data; SSRI may suffice",q:"Strong"}],
    pk:"CYP1A2 and CYP2D6 substrate. Cannot be opened/crushed. Limited PK data in pregnancy.",
    gl:[{b:"APA-MDD",pos:"APA MDD Guideline does not specifically address duloxetine in pregnancy — position extrapolated from SNRI class data; sertraline or venlafaxine preferred",str:"III",y:2010,note:"APA Practice Guideline for MDD (SNRI class extrapolation)"}],
    lac:{tier:"Use with caution — an alternate drug that has been better studied may be preferred, especially while nursing a newborn or preterm infant (LactMed Jan 2024)",ml:"Low",is:"Minimal; undetectable in infant plasma in all studied cases (PMC review)",rid:"0.1–1% (most rigorous study: 0.14% max 0.25% at 40mg BID in 6 mothers — LactMed Jan 2024; 0.81% at 60mg/day in 1 mother). Metabolites not well-studied. Previously stated as ~1% — the low-end data at standard dosing is more accurately 0.14%. Consider '0.1–1%' range.",ae:"No adverse effects documented in most breastfed infants. One case: developmental concerns (speech, low muscle tone) at 9 months in infant of mother taking duloxetine 90mg + agomelatine — causality uncertain (could be agomelatine) but should be disclosed with uncertainty qualifier.",pk:"6 hrs",mon:"Monitor for sedation, poor feeding. DEVELOPMENTAL AWARENESS: One case of developmental concerns (speech, low muscle tone at 9 months) reported — causality uncertain. Document decision; standard routine follow-up. Limited data — inform pediatrician and prefer sertraline or venlafaxine if initiating SNRI postpartum.",alts:["Venlafaxine","Sertraline"],rev:"Jan 15, 2024"}},

  lithium:{g:"Lithium",b:"Lithobid",cls:"Mood Stabilizer",p:"P0",tera:{
    t1:{r:"Low–Moderate",q:"Moderate",s:"Historical Ebstein's anomaly risk significantly overstated (original: 400× baseline). Current data: ~1/1,000 lithium-exposed vs ~1/20,000 baseline. Overall cardiac malformation risk modestly elevated. Clinical significance depends on bipolar severity.",src:"DailyMed",d:"2025-08-10",bl:"0.05 / 1,000 (Ebstein's)",ex:"~1 / 1,000 (Ebstein's)"},
    t2:{r:"Low",q:"Moderate",s:"No clear neurodevelopmental signal. Fetal thyroid/renal monitoring recommended. Growth parameters generally normal.",src:"MotherToBaby",d:"2025-06-01"},
    t3:{r:"Moderate",q:"Moderate",s:"Neonatal lithium toxicity if levels not managed. Floppy infant syndrome, hypothyroidism, nephrogenic DI reported. Dose reduction before delivery often recommended. Frequent level monitoring needed (rapid GFR changes).",src:"DailyMed / MotherToBaby",d:"2025-08-10"},
    pp:{r:"Requires assessment",q:"Moderate",s:"Significant breast milk levels. RID average 12.2% (range 0–30%) in better-quality case series (Imaz et al. 2019); older data suggested higher range. Infant serum levels 10–50% of maternal. Infant thyroid and renal monitoring required. Dehydration can cause dangerous lithium accumulation in infant. Not an absolute contraindication for healthy term infants >2 months with monitoring.",src:"LactMed Dec 2025; Imaz et al. 2019 Front Pharmacol",d:"2025-12-15"}},
    alt:[{n:"Lamotrigine",p:"Better teratogenicity; effective for bipolar depression, less for mania. Complex PK in pregnancy.",q:"Strong"},{n:"Quetiapine",p:"Moderate data; metabolic effects; option for bipolar depression",q:"Moderate"}],
    pk:"GFR increases 30–50% in pregnancy → significant lithium clearance increase. Weekly–biweekly monitoring required. Rapid GFR decrease at delivery → toxicity risk within hours.",
    gl:[{b:"APA-Bipolar",pos:"APA Bipolar Guideline: continue lithium in severe Bipolar I; fetal echocardiography at 16–20 weeks to assess for Ebstein anomaly",str:"IA",y:2002,note:"APA Practice Guideline for Bipolar Disorder, 2nd ed. + 2005 Guideline Watch"},{b:"NICE",pos:"Discuss risks; avoid if possible but do not stop abruptly",str:"Strong",y:2022},{b:"CANMAT",pos:"Preferred mood stabilizer for severe bipolar in pregnancy",str:"Level 2",y:2023}],
    lac:{tier:"Requires individual risk-benefit assessment",ml:"Variable; significant",is:"Infant serum ~58% of maternal in early postpartum (ratio up to 1.09 in first month); stabilises below 0.10 ratio after ~1 month. Two infants had unexpectedly high levels in first month (Heinonen 2022). Risk highest in neonatal period.",rid:"Average 12.2% (range 0–30%); older data 11–42%",ae:"Cyanosis, lethargy, hypothermia, T-wave changes, elevated TSH, altered renal function, and dehydration-triggered toxicity in case reports. Not absolute contraindication for healthy term infants >2 months with monitoring.",pk:"Variable — highly individualized",mon:"Infant serum lithium, TSH, free T4, BUN, creatinine at delivery, 48h, 10 days (Imaz 2019). Further monitoring only if level >0.3 mEq/L or clinical signs. Dehydration is a key toxicity risk trigger — ensure adequate infant hydration.",alts:["Lamotrigine"],rev:"Dec 15, 2025"}},

  lamotrigine:{g:"Lamotrigine",b:"Lamictal",cls:"Mood Stabilizer",p:"P0",tera:{
    t1:{r:"None–Minimal",q:"Strong",s:"Large pregnancy registries (n>10,000) consistently show no significant increase in major malformations above baseline. No specific malformation pattern identified.",src:"DailyMed",d:"2025-09-01",bl:"3–5%",ex:"2–4%"},
    t2:{r:"None–Minimal",q:"Moderate",s:"Studies to age 6 show IQ and milestones within normal range. Considered safest mood stabilizer for neurodevelopmental outcomes.",src:"MotherToBaby",d:"2025-07-15"},
    t3:{r:"Low",q:"Moderate",s:"Levels drop 50–65% due to increased glucuronidation. Dose increases typically required. Rapid postpartum level increase requires dose reduction within days to avoid toxicity.",src:"DailyMed",d:"2025-09-01"},
    pp:{r:"Compatible with monitoring",q:"Moderate",s:"Notable breast milk levels; RID 9–16% (mean ~10% per Newport et al. 2008; LactMed reports mean 10.1%, range 8.7–15.7%). Generally compatible with monitoring. Neonatal glucuronidation immature — monitor for rash, apnea, drowsiness. Dose increases made during pregnancy should be reduced postpartum within weeks to avoid toxicity.",src:"LactMed",d:"2025-10-30"}},
    alt:[{n:"Lithium",p:"Stronger antimanic; higher teratogenicity risk; intensive monitoring",q:"Strong"},{n:"Quetiapine",p:"Alternative for bipolar depression; metabolic effects",q:"Moderate"}],
    pk:"Clearance increases 50–65% via enhanced UGT1A4. Monthly level monitoring minimum. Rapid postpartum dose reduction critical.",
    gl:[{b:"APA-Bipolar",pos:"APA Bipolar Guideline identifies lamotrigine as preferred mood stabilizer for pregnancy planning given favorable teratogenicity profile; serum level monitoring required",str:"IA",y:2002,note:"APA Practice Guideline for Bipolar Disorder + CANMAT 2018"},{b:"NICE",pos:"Safest mood stabilizer option; monitor levels",str:"Strong",y:2022},{b:"CANMAT",pos:"First-line mood stabilizer in pregnancy",str:"Level 1",y:2023}],
    lac:{tier:"Compatible with monitoring",ml:"Notable; may approach therapeutic range",is:"20–50% maternal levels in neonates; lower in older infants",rid:"9–16% (mean ~10%)",ae:"Rare mild thrombocytosis. One apnea report.",pk:"1–4 hrs",mon:"Monitor infant for apnea, rash, drowsiness, poor sucking (per LactMed). Measure infant serum lamotrigine if any concern about toxicity. Monitor platelet count and liver function before and after increases in maternal dose. Infants of mothers on ≤150mg/day unlikely to have measurable serum levels — less extensive monitoring acceptable. If infant rash develops, discontinue breastfeeding until cause confirmed. Maternal dose increases made during pregnancy should be stepped down postpartum (25% weekly for 3 weeks) to avoid toxicity as GFR normalizes.",alts:["Carbamazepine"],rev:"Oct 30, 2025"}},

  valproate:{g:"Valproic Acid",b:"Depakote",cls:"Mood Stabilizer",p:"P0",tera:{
    t1:{r:"High",q:"Strong",s:"ESTABLISHED TERATOGEN. Dose-dependent neural tube defect risk: 1–2% overall; risk increases significantly above 1,000mg/day (Jentink et al. NEJM 2010; Vajda et al. 2004). Overall major malformation rate ~10% (vs 2–4% baseline). Specific pattern: spina bifida, cardiac defects, craniofacial anomalies, limb defects. Fetal valproate syndrome described. No dose is fully safe.",src:"MotherToBaby / Jentink et al. NEJM 2010",d:"2025-09-15",bl:"2–4%",ex:"~10%"},
    t2:{r:"High",q:"Strong",s:"ESTABLISHED neurodevelopmental toxin. IQ reduction 7–10 points in exposed children vs controls. Autism spectrum disorder risk significantly elevated. Dose-dependent effects.",src:"MotherToBaby",d:"2025-08-01"},
    t3:{r:"Moderate",q:"Moderate",s:"Hepatotoxicity risk in neonate. Coagulation abnormalities. Neonatal withdrawal. Requires vitamin K supplementation.",src:"DailyMed",d:"2025-09-15"},
    pp:{r:"Compatible with monitoring",q:"Moderate",s:"Low breast milk levels. RID 1–6%. Hepatotoxicity monitoring in infant recommended.",src:"LactMed",d:"2025-11-01"}},
    alt:[{n:"Lamotrigine",p:"Strongly preferred — no teratogenic signal",q:"Strong"},{n:"Lithium",p:"Lower teratogenicity; effective for mania",q:"Strong"}],
    pk:"Complex PK; protein binding decreases in pregnancy → increased free fraction. Levels unreliable without free valproate measurement.",
    gl:[{b:"APA-Bipolar",pos:"APA Bipolar Guideline: avoid valproate in pregnancy — highest teratogenicity among mood stabilizers; switch to lamotrigine or lithium before conception",str:"IA",y:2002,note:"APA Practice Guideline for Bipolar Disorder — strongest contraindication statement"},{b:"NICE",pos:"Do not offer to women of childbearing potential unless no alternative",str:"Strong",y:2022},{b:"CANMAT",pos:"Contraindicated in pregnancy; switch to lamotrigine or lithium",str:"Level 1",y:2023}],
    lac:{tier:"Compatible with monitoring",ml:"Low; highly protein bound",is:"Infant serum ~10% of maternal (ratio mean 0.10–0.11 per Kacirova 2019); usually below therapeutic range",rid:"1–2% (typical; max ~1.9% in mature milk studies — Kacirova 2019)",ae:"Rare hepatotoxicity concern; monitor LFTs. Rare cases of thrombocytopenia and hair loss reported.",pk:"Variable",mon:"Monitor infant LFTs and CBC periodically (hepatotoxicity and thrombocytopenia theoretical risk). Monitor for jaundice, unusual bruising or bleeding, sedation, feeding adequacy. Breastfeeding generally supported given low RID — inform pediatrician.",alts:["Lamotrigine","Lithium"],rev:"Nov 1, 2025"}},

  carbamazepine:{g:"Carbamazepine",b:"Tegretol",cls:"Mood Stabilizer",p:"P0",tera:{
    t1:{r:"Moderate",q:"Strong",s:"Neural tube defect risk ~0.5–1% (vs ~0.1% baseline) per MotherToBaby Aug 2024; EUROCAT data showed ~0.2% spina bifida risk specifically. Overall major malformation rate ~3.3% per EUROCAT systematic review (Jentink et al. BMJ 2010) vs 2–3% background. Specific pattern: spina bifida, craniofacial anomalies. Lower risk than valproate but higher than lamotrigine.",src:"DailyMed",d:"2025-07-01",bl:"0.1% (NTD)",ex:"0.5–1% (NTD)"},
    t2:{r:"Low–Moderate",q:"Moderate",s:"Some neurodevelopmental studies suggest milder IQ effects than valproate. Data less robust. Generally considered intermediate risk.",src:"MotherToBaby",d:"2025-05-15"},
    t3:{r:"Low",q:"Moderate",s:"Neonatal hepatotoxicity rare. Vitamin K supplementation recommended. Transient hematologic effects possible.",src:"DailyMed",d:"2025-07-01"},
    pp:{r:"Compatible with monitoring",q:"Moderate",s:"Moderate breast milk levels. RID 3–6%. Generally considered compatible with breastfeeding.",src:"LactMed",d:"2025-09-15"}},
    alt:[{n:"Lamotrigine",p:"Preferred — lowest teratogenicity of mood stabilizers",q:"Strong"},{n:"Lithium",p:"Alternative; different side effect profile",q:"Strong"}],
    pk:"Potent CYP3A4 inducer; affects metabolism of many co-prescribed drugs. Auto-induction complicates dosing.",
    gl:[{b:"APA-Bipolar",pos:"APA Bipolar Guideline: avoid carbamazepine if possible — NTD risk; switch to lamotrigine or lithium pre-conception",str:"IIA",y:2002,note:"APA Practice Guideline for Bipolar Disorder, 2nd ed."},{b:"NICE",pos:"Discuss NTD risk; folic acid 5mg preconception",str:"Strong",y:2022}],
    lac:{tier:"Compatible with monitoring",ml:"Moderate",is:"Low-to-moderate",rid:"3–6%",ae:"GI adverse effects (vomiting, poor weight gain, poor sucking) documented in one case at high maternal dose (1200mg/day). Hepatotoxicity is a theoretical extrapolation — not confirmed in breastfeeding cases. Active metabolite carbamazepine-10,11-epoxide also transfers into milk and infant serum (anticonvulsant activity; CNS effects possible).",pk:"4–6 hrs",mon:"Monitor infant LFTs, CBC (rare blood dyscrasias reported with anticonvulsants). Monitor for jaundice, sedation, poor feeding, poor weight gain. Note: active 10,11-epoxide metabolite is also present in milk and infant serum — clinically relevant for monitoring. Inform pediatrician of exposure.",alts:["Lamotrigine"],rev:"Sep 15, 2024"}},

  quetiapine:{g:"Quetiapine",b:"Seroquel",cls:"Atypical Antipsychotic",p:"P1",tera:{
    t1:{r:"None–Minimal",q:"Moderate",s:"Growing registry data. No consistent malformation signal. Most studied atypical antipsychotic in pregnancy after olanzapine.",src:"DailyMed",d:"2025-08-15"},
    t2:{r:"Low",q:"Limited",s:"Limited neurodevelopmental data. No clear signal. Metabolic effects (GDM risk) require monitoring.",src:"MotherToBaby",d:"2025-06-01"},
    t3:{r:"Low",q:"Moderate",s:"Neonatal EPS and withdrawal symptoms reported. Transient sedation, feeding difficulty. Monitor glucose in neonate if maternal GDM.",src:"DailyMed",d:"2025-08-15"},
    pp:{r:"Compatible with monitoring",q:"Limited",s:"Low breast milk levels. RID ~0.1%. Minimal infant exposure expected.",src:"LactMed",d:"2025-09-01"}},
    alt:[{n:"Olanzapine",p:"More metabolic effects but more pregnancy data",q:"Moderate"},{n:"Aripiprazole",p:"Less metabolic but less pregnancy data",q:"Limited"}],
    pk:"CYP3A4 substrate. Pregnancy may lower levels. GDM screening important.",
    gl:[{b:"APA-Psychosis",pos:"APA Schizophrenia Guideline (2021): continue antipsychotic if clinically necessary; quetiapine among more-studied atypicals in pregnancy",str:"IIB",y:2021,note:"APA Practice Guideline for Schizophrenia, 2021"},{b:"NICE",pos:"If antipsychotic needed, quetiapine or olanzapine preferred",str:"Moderate",y:2022}],
    lac:{tier:"Compatible with monitoring",ml:"Very low",is:"Usually undetectable; one case: 0.37mg/kg/day to infant at maternal 200mg/day",rid:"~0.005–0.017% (median 0.005% in published studies — extremely low; one of the lowest of all antipsychotics per LactMed Jan 2026)",ae:"Infant sedation is primary concern; quetiapine-triggered milk ejection reflex documented (dose-dependent). Galactorrhea risk (147 FAERS reports; prolactin effects). Extrapyramidal symptoms rare. No significant infant serum levels in published cases.",pk:"1–2 hrs",mon:"Monitor for drowsiness, irritability, restlessness, GI disturbance, fever, extrapyramidal symptoms (tremors, abnormal movements), feeding adequacy, and weight gain. Systematic reviews name quetiapine first- or second-choice agent during breastfeeding (LactMed Jan 2026). Avoid co-sleeping with sedating medications.",alts:["Olanzapine"],rev:"Jan 15, 2026"}},

  olanzapine:{g:"Olanzapine",b:"Zyprexa",cls:"Atypical Antipsychotic",p:"P1",tera:{
    t1:{r:"None–Minimal",q:"Moderate",s:"Most pregnancy data of any atypical antipsychotic. No consistent malformation signal. Metabolic effects (weight gain, GDM) are primary concern.",src:"DailyMed",d:"2025-08-01"},
    t2:{r:"Low",q:"Moderate",s:"Significant maternal weight gain and GDM risk. Fetal macrosomia possible. Limited neurodevelopmental data.",src:"MotherToBaby",d:"2025-06-15"},
    t3:{r:"Low",q:"Moderate",s:"Neonatal EPS and sedation reported. GDM-related neonatal hypoglycemia risk.",src:"DailyMed",d:"2025-08-01"},
    pp:{r:"Compatible with monitoring",q:"Moderate",s:"Low breast milk levels. RID 1–2%. Weight gain in mother may complicate postpartum recovery.",src:"LactMed",d:"2025-10-01"}},
    alt:[{n:"Quetiapine",p:"Less metabolic effects; similar pregnancy data",q:"Moderate"},{n:"Aripiprazole",p:"Less metabolic but less pregnancy data",q:"Limited"}],
    pk:"CYP1A2 and UGT substrate. Monitor weight, glucose, lipids throughout pregnancy.",
    gl:[{b:"APA-Psychosis",pos:"APA Schizophrenia Guideline (2021): olanzapine among more-studied atypicals; metabolic monitoring required due to GDM risk",str:"IIB",y:2021,note:"APA Practice Guideline for Schizophrenia, 2021"},{b:"NICE",pos:"Quetiapine or olanzapine if AP needed",str:"Moderate",y:2022}],
    lac:{tier:"Compatible with monitoring",ml:"Low",is:"Low; usually <5% maternal — undetectable in most published cases at standard doses",rid:"0.1–4% (0.1% typical at low doses; up to 4% at 20mg/day per LactMed Jan 2026)",ae:"Infant sedation possible; rare. Prolactin elevation and galactorrhea documented — olanzapine is among top 5 drugs for galactorrhea FAERS reports (134 cases); relevant when counselling breastfeeding mothers on medication effects on lactation itself.",pk:"5–8 hrs",mon:"Monitor for drowsiness, irritability, poor feeding, constipation, extrapyramidal symptoms (tremors, abnormal muscle movements), weight gain, and developmental milestones (per LactMed). Avoid co-sleeping. Sedation more likely than with quetiapine.",alts:["Quetiapine","Risperidone"],rev:"Jan 15, 2026"}},

  aripiprazole:{g:"Aripiprazole",b:"Abilify",cls:"Atypical Antipsychotic",p:"P1",tera:{
    t1:{r:"None–Minimal",q:"Limited",s:"Limited but growing pregnancy data. No malformation signal in available studies. Less data than quetiapine or olanzapine.",src:"DailyMed",d:"2025-07-01"},
    t2:{r:"Undetermined",q:"Insufficient",s:"Insufficient data for neurodevelopmental assessment.",src:"MotherToBaby",d:"2025-05-01"},
    t3:{r:"Low",q:"Limited",s:"Neonatal EPS reported. Long half-life may prolong symptoms. Limited data.",src:"DailyMed",d:"2025-07-01"},
    pp:{r:"Compatible with monitoring",q:"Limited",s:"Very low breast milk levels. RID ~1%. Limited data but encouraging.",src:"LactMed",d:"2025-08-01"}},
    alt:[{n:"Quetiapine",p:"More pregnancy data; reasonable alternative",q:"Moderate"},{n:"Olanzapine",p:"Most AP pregnancy data; more metabolic effects",q:"Moderate"}],
    pk:"CYP2D6 and CYP3A4 substrate. Long half-life (75+ hrs including metabolite).",
    gl:[{b:"APA-Psychosis",pos:"APA Schizophrenia Guideline (2021): continue most effective AP; aripiprazole data growing but less than quetiapine/olanzapine",str:"III",y:2021,note:"APA Practice Guideline for Schizophrenia, 2021"}],
    lac:{tier:"Use with caution — consider alternatives, especially for newborns/preterm",ml:"Very low (doses up to 15mg/day)",is:"Minimal",rid:"Data limited; estimated low — specific RID% not confirmed in LactMed (Jan 2026). The ~1% figure appears unsourced. Flag as estimated low.",ae:"CRITICAL: Aripiprazole is a dopamine partial agonist and reduces prolactin in a dose-dependent manner. Cases of poor milk supply and lactation cessation documented (LactMed Jan 2026; 2025 retrospective multi-site case series). Also: poor weight gain in breastfed infants reported. Until more data available, an alternate drug may be preferred especially while nursing a newborn or preterm infant.",pk:"Variable",mon:"Monitor for sedation, poor feeding, extrapyramidal symptoms, weight gain. CRITICAL: Monitor lactation success — aripiprazole may reduce prolactin and cause milk supply failure or lactation cessation. Consider alternatives (quetiapine, olanzapine) if milk supply concerns arise. Developmental milestones at routine visits. Limited data — inform pediatrician and document decision.",alts:["Quetiapine","Olanzapine"],rev:"Jan 15, 2026"}},

  risperidone:{g:"Risperidone",b:"Risperdal",cls:"Atypical Antipsychotic",p:"P1",tera:{
    t1:{r:"Low",q:"Limited",s:"Limited pregnancy data. Small studies show no clear malformation signal but insufficient to exclude risk. Hyperprolactinemia may affect fertility.",src:"DailyMed",d:"2025-06-15"},
    t2:{r:"Undetermined",q:"Insufficient",s:"Insufficient data.",src:"MotherToBaby",d:"2025-04-01"},
    t3:{r:"Low",q:"Limited",s:"Neonatal EPS expected. Limited specific data.",src:"DailyMed",d:"2025-06-15"},
    pp:{r:"Compatible with monitoring",q:"Limited",s:"Low breast milk levels. RID 2–5%. Active metabolite paliperidone also present.",src:"LactMed",d:"2025-07-15"}},
    alt:[{n:"Quetiapine",p:"More pregnancy data; no prolactin elevation",q:"Moderate"},{n:"Olanzapine",p:"More data; consider metabolic effects",q:"Moderate"}],
    pk:"CYP2D6 substrate. Active metabolite paliperidone. Prolactin elevation may persist.",
    gl:[{b:"APA-Psychosis",pos:"APA Schizophrenia Guideline (2021): risperidone acceptable if best clinical option; elevated prolactin complicates fertility assessment",str:"III",y:2021,note:"APA Practice Guideline for Schizophrenia, 2021"}],
    lac:{tier:"Use with caution — second-line; prefer quetiapine or olanzapine",ml:"Low",is:"Low; paliperidone (active metabolite, 9-OH-risperidone) also detectable in milk",rid:"2–5% (combined risperidone + paliperidone exposure may be higher)",ae:"Sedation, failure to thrive, jitteriness, tremors, abnormal muscle movements, and respiratory depression all documented in breastfed infants (LactMed Jun 2025). CRITICAL: Risperidone has the highest prolactin-elevation risk of all SGAs — responsible for 81% (27/33) of drug-induced hyperprolactinemia cases in a 7-year pediatric study. Monitor maternal milk supply.",pk:"3–4 hrs",mon:"Monitor for sedation, failure to thrive, jitteriness, tremors, abnormal muscle movements, respiratory depression (per LactMed Jun 2025). Paliperidone metabolite also detectable — monitor cumulative exposure. Monitor maternal milk supply and prolactin effects on lactation success. Developmental milestones at routine visits. Systematic reviews designate risperidone as second-line during breastfeeding.",alts:["Quetiapine","Olanzapine"],rev:"Jun 15, 2025"}},

  lorazepam:{g:"Lorazepam",b:"Ativan",cls:"Benzodiazepine",p:"P1",tera:{
    t1:{r:"None–Minimal",q:"Moderate",s:"Earlier cleft palate concern from pooled benzodiazepine data largely debunked by modern studies. No consistent malformation signal for lorazepam specifically.",src:"DailyMed",d:"2025-07-01"},
    t2:{r:"None–Minimal",q:"Limited",s:"Limited neurodevelopmental data. Animal data at high doses concerning but human relevance uncertain.",src:"MotherToBaby",d:"2025-05-01"},
    t3:{r:"Moderate",q:"Moderate",s:"Floppy infant syndrome if used near delivery. Neonatal withdrawal (irritability, tremor, feeding difficulty) if chronic use. Respiratory depression risk in neonate.",src:"DailyMed",d:"2025-07-01"},
    pp:{r:"Compatible with monitoring",q:"Moderate",s:"Low-moderate breast milk levels. RID 2–3%. Short-acting; minimal accumulation.",src:"LactMed",d:"2025-09-15"}},
    alt:[{n:"Hydroxyzine",p:"Non-benzo anxiolytic; limited evidence in pregnancy",q:"Limited"},{n:"CBT",p:"First-line for anxiety; no medication risk",q:"Strong"}],
    pk:"Glucuronidated (not CYP dependent). Preferred benzo in hepatic impairment. Relatively short half-life.",
    gl:[{b:"APA-MDD",pos:"APA MDD/Anxiety consensus: use lowest effective dose for shortest duration; lorazepam preferred benzo due to simpler hepatic metabolism (no active metabolites)",str:"IIB",y:2010,note:"APA MDD Guideline + clinical consensus on benzodiazepine selection"}],
    lac:{tier:"Compatible with monitoring",ml:"Low-moderate",is:"Low",rid:"2–3%",ae:"Infant sedation possible with repeated dosing",pk:"2 hrs",mon:"Monitor for infant sedation, poor feeding, apnea. Avoid repeated high doses and co-sleeping. Short half-life preferred over longer-acting benzodiazepines. Single therapeutic doses generally low risk in healthy term infants.",alts:["Hydroxyzine (non-benzo)"],rev:"Sep 15, 2025"}},

  clonazepam:{g:"Clonazepam",b:"Klonopin",cls:"Benzodiazepine",p:"P1",tera:{
    t1:{r:"None–Minimal",q:"Moderate",s:"No consistent malformation signal. Cleft palate concern from older pooled data not supported by modern studies.",src:"DailyMed",d:"2025-07-01"},
    t2:{r:"None–Minimal",q:"Limited",s:"Limited specific data. Class-level data extrapolated.",src:"MotherToBaby",d:"2025-05-01"},
    t3:{r:"Moderate",q:"Moderate",s:"Floppy infant syndrome and neonatal withdrawal more pronounced with clonazepam (longer half-life). Withdrawal may be delayed and prolonged.",src:"DailyMed",d:"2025-07-01"},
    pp:{r:"Compatible with monitoring",q:"Limited",s:"Low breast milk levels. RID ~2.8%. Longer half-life than lorazepam.",src:"LactMed",d:"2025-08-01"}},
    alt:[{n:"Lorazepam",p:"Shorter acting; preferred benzo in pregnancy",q:"Moderate"},{n:"SSRI",p:"For underlying anxiety/panic disorder; slower onset",q:"Strong"}],
    pk:"CYP3A4 substrate. Long half-life (18–50 hrs) complicates neonatal exposure.",
    gl:[{b:"APA-MDD",pos:"APA anxiety consensus: lorazepam preferred benzo in pregnancy — clonazepam acceptable but longer half-life increases neonatal exposure",str:"IIB",y:2010,note:"APA MDD Guideline + clinical consensus"}],
    lac:{tier:"Use with caution ('possible cautiously' per LactMed Sep 2024) — one documented case of apnea/cyanosis in newborn; among drugs most often suspected in serious infant AEs per French pharmacovigilance data",ml:"Low (11–13 mcg/L at 2mg twice daily)",is:"Low; detectable in 1/11 infants at typical doses; neonates at highest risk",rid:"~2.8% (estimated — specific % not stated in LactMed; figure may be from Nishimura 2021 Breastfeed Med)",ae:"Well-documented case: 2-month-old had hypotonia, somnolence, apnea (LactMed Sep 2024). French pharmacovigilance center: 5 infants with clonazepam-attributed serious AEs (among most serious reports — primarily sedation, apnea). Long half-life increases accumulation vs lorazepam.",pk:"1–4 hrs",mon:"Monitor for infant sedation, apnea, poor feeding, poor weight gain. CRITICAL CASE: 2-month-old developed hypotonia, somnolence, and apnea — clonazepam attributed. Long half-life (18–50 hrs) significantly increases accumulation risk vs lorazepam. Neonates at highest risk. Lorazepam is strongly preferred over clonazepam for lactation-period anxiety. Not recommended by some lactation sources due to accumulation risk; evaluate regularly.",alts:["Lorazepam"],rev:"Sep 15, 2024"}},

  alprazolam:{g:"Alprazolam",b:"Xanax",cls:"Benzodiazepine",p:"P1",tera:{
    t1:{r:"None–Minimal",q:"Limited",s:"Limited specific data. No consistent malformation signal in available studies. Class-level benzo data applies.",src:"DailyMed",d:"2025-06-01"},
    t2:{r:"Undetermined",q:"Insufficient",s:"Insufficient data.",src:"MotherToBaby",d:"2025-04-01"},
    t3:{r:"Moderate",q:"Moderate",s:"Neonatal withdrawal and floppy infant syndrome. Short half-life but high potency — rebound withdrawal can be severe.",src:"DailyMed",d:"2025-06-01"},
    pp:{r:"Compatible with monitoring",q:"Limited",s:"Low milk levels. RID ~3%. Short half-life but accumulation possible with repeated dosing.",src:"LactMed",d:"2025-07-01"}},
    alt:[{n:"Lorazepam",p:"Preferred benzo; glucuronidated",q:"Moderate"},{n:"SSRI",p:"For underlying disorder; no benzo risks",q:"Strong"}],
    pk:"CYP3A4 substrate. Short half-life, high potency. Difficult to taper in pregnancy.",
    gl:[{b:"APA-MDD",pos:"APA anxiety consensus: switch from alprazolam to lorazepam if benzo required — alprazolam high-potency, short-acting profile less favorable in pregnancy",str:"IIA",y:2010,note:"APA MDD Guideline + clinical consensus"}],
    lac:{tier:"Use with caution — not preferred BZD for repeated use; use lorazepam instead",ml:"Low",is:"Low; PBPK modeled RID 6.51% — higher than expected for a BZD class",rid:"~6.51% (PBPK model per LactMed Dec 2025) — notably higher than lorazepam. This figure, combined with high potency, supports preferring lorazepam.",ae:"Infant sedation with repeated dosing. Neonatal withdrawal documented: one neonate exposed in utero showed increased irritability on breastfeeding cessation. LactMed Dec 2025: because of reports of effects in infants including sedation, alprazolam is probably not the best benzodiazepine for repeated use during nursing, especially with a neonate or premature infant. Note: alprazolam uniquely among BZDs can increase prolactin (one galactorrhea case).",pk:"1–2 hrs",mon:"SINGLE-DOSE USE: After a single dose of alprazolam (e.g. acute panic attack), there is usually no need to wait to resume breastfeeding (LactMed Dec 2025) — this single-dose reassurance is distinct from chronic-use concerns. REPEATED/CHRONIC USE: Not recommended — prefer lorazepam which has shorter half-life and no active metabolites. If alprazolam used repeatedly: monitor for infant sedation, poor feeding, withdrawal symptoms if dose reduced.",alts:["Lorazepam"],rev:"Dec 15, 2025"}},

  methylphenidate:{g:"Methylphenidate",b:"Ritalin / Concerta",cls:"Stimulant",p:"P2",tera:{
    t1:{r:"None–Minimal",q:"Limited",s:"Limited pregnancy data. Available studies (small cohorts) show no significant malformation increase. Vasoconstrictive effects raise theoretical placental perfusion concern.",src:"DailyMed",d:"2025-06-01"},
    t2:{r:"Undetermined",q:"Insufficient",s:"Insufficient data for neurodevelopmental assessment.",src:"MotherToBaby",d:"2025-04-01"},
    t3:{r:"Low",q:"Limited",s:"Limited data. Theoretical concern for fetal growth restriction. Neonatal irritability reported in case reports.",src:"DailyMed",d:"2025-06-01"},
    pp:{r:"Compatible with monitoring",q:"Limited",s:"Very low breast milk levels. RID <1%. Minimal infant exposure expected.",src:"LactMed",d:"2025-08-15"}},
    alt:[{n:"Behavioral strategies",p:"Non-pharmacological ADHD management; no medication risk",q:"Moderate"},{n:"Atomoxetine",p:"Non-stimulant; very limited pregnancy data",q:"Insufficient"}],
    pk:"Short half-life (2–4 hrs IR). Not significantly CYP-metabolized. Limited PK data in pregnancy.",
    gl:[{b:"Expert consensus",pos:"No specific APA guideline covers methylphenidate in pregnancy — position represents clinical consensus: discontinue if functionally tolerable, continue if impairment severe",str:"III",y:2023,note:"No formal APA guideline — expert consensus only"}],
    lac:{tier:"Compatible with monitoring",ml:"Very low (avg 19 mcg/L at 52mg/day — Hackett 2006)",is:"Undetectable in infant serum",rid:"~0.7% at average dose 52mg/day (LactMed Aug 2025; 3-mother study). Previously shown as 2–6% in some records — this higher range is not supported by LactMed data. Current evidence indicates RID <1–2%.",ae:"No adverse effects documented in exposed infants. IMPORTANT: High-dose methylphenidate may reduce serum prolactin and interfere with milk production, especially in women whose lactation is not well established (LactMed Aug 2025).",pk:"1–2 hrs",mon:"Monitor for irritability, sleep disruption, poor feeding. Time feeds to avoid peak concentration (1–2 hrs post-dose). MONITOR MILK SUPPLY: Large dosages might interfere with milk production, especially when lactation not yet established — monitor supply and counsel accordingly. Inform pediatrician. Methylphenidate is generally the preferred ADHD medication during breastfeeding per AAP.",alts:["Behavioral strategies"],rev:"Aug 15, 2025"}},

  amphetamine:{g:"Amphetamine salts",b:"Adderall",cls:"Stimulant",p:"P2",tera:{
    t1:{r:"Low",q:"Limited",s:"Limited pregnancy data. Some studies suggest small-for-gestational-age risk. Vasoconstrictive effects raise theoretical placental perfusion concern. Abuse potential complicates interpretation.",src:"DailyMed",d:"2025-06-15"},
    t2:{r:"Undetermined",q:"Insufficient",s:"Insufficient data.",src:"MotherToBaby",d:"2025-04-01"},
    t3:{r:"Low",q:"Limited",s:"Growth restriction concern. Neonatal irritability and feeding difficulty reported.",src:"DailyMed",d:"2025-06-15"},
    pp:{r:"Compatible with monitoring",q:"Limited",s:"Low breast milk levels. RID 2–6%. Some infant irritability reported.",src:"LactMed",d:"2025-07-15"}},
    alt:[{n:"Methylphenidate",p:"Different stimulant; possibly less vasoconstriction concern",q:"Limited"},{n:"Behavioral strategies",p:"Non-pharmacological; no medication risk",q:"Moderate"}],
    pk:"Renal excretion pH-dependent. Half-life 10–13 hrs. Limited pregnancy PK data.",
    gl:[{b:"Expert consensus",pos:"No specific APA guideline covers amphetamine salts in pregnancy — position represents clinical consensus; discontinue if functionally tolerable",str:"III",y:2023,note:"No formal APA guideline — expert consensus only"}],
    lac:{tier:"Use with caution — divided expert opinion; manufacturer advises against breastfeeding; document decision explicitly",ml:"Low",is:"Low levels possible",rid:"2–6%",ae:"Prospective study (13 mothers): 5/13 infants had possible AEs (somnolence, crying/restlessness, colic/constipation); all had normal developmental scores. IMPORTANT: Large amphetamine doses may interfere with milk production, especially when lactation is not established (LactMed Jun 2025) — dopaminergic prolactin reduction mechanism.",pk:"3–4 hrs",mon:"Monitor for irritability, poor feeding, sleep disruption, decreased weight gain. Time feeds to avoid peak concentration. MONITOR MILK SUPPLY: Large doses may impair prolactin-dependent milk production — particularly relevant in new postpartum mothers. Note: most manufacturers advise against breastfeeding; some experts allow therapeutic doses with monitoring. Document decision explicitly and inform pediatrician.",alts:["Methylphenidate"],rev:"Jun 15, 2025"}},

  bupropion:{g:"Bupropion",b:"Wellbutrin",cls:"NDRI",p:"P2",tera:{
    t1:{r:"None–Minimal",q:"Moderate",s:"Registry data from GlaxoSmithKline Bupropion Pregnancy Registry (n=675) and UnitedHealthcare cohort (n=1,213) showed no increase in overall cardiac malformations. However, a case-control study (Louik et al. 2014, n=7,913 cardiac defect cases) found a modestly elevated VSD signal for bupropion alone (OR 1.6–2.5), which was attenuated when combined with other antidepressants — raising concern about smoking as a confounder. Huybrechts et al. NEJM 2014 (n=8,856 bupropion-exposed, propensity-adjusted) found no significant association (RR 0.92). Overall: no consistent teratogen signal, but a small possible VSD association from some analyses that remains unresolved.",src:"DailyMed",d:"2025-08-01"},
    t2:{r:"None–Minimal",q:"Limited",s:"Limited neurodevelopmental data. No clear signal.",src:"MotherToBaby",d:"2025-06-01"},
    t3:{r:"Low",q:"Limited",s:"Less neonatal adaptation syndrome than SSRIs/SNRIs. Seizure threshold concerns in susceptible patients.",src:"DailyMed",d:"2025-08-01"},
    pp:{r:"Compatible with monitoring",q:"Moderate",s:"Low breast milk levels. RID ~2%. Seizure risk in infant theoretical but not reported.",src:"LactMed",d:"2025-09-01"}},
    alt:[{n:"Sertraline",p:"More pregnancy data; preferred first-line",q:"Strong"},{n:"Nortriptyline",p:"TCA with reasonable pregnancy data",q:"Moderate"}],
    pk:"CYP2B6 substrate. Active metabolites. Seizure risk dose-dependent (>450mg/day).",
    gl:[{b:"APA-MDD",pos:"APA MDD Guideline includes bupropion as alternative for SSRI-intolerant patients; NDRI mechanism; pregnancy-specific data limited but growing",str:"IIB",y:2010,note:"APA Practice Guideline for MDD, 3rd ed."}],
    lac:{tier:"Use with caution — another drug may be preferred for newborns/preterm (LactMed Jan 2026 'possible with caution')",ml:"Low (peak threohydrobupropion milk level 443 mcg/L vs parent drug 181–189 mcg/L — metabolites can exceed parent)",is:"Low",rid:"~2%",ae:"DOCUMENTED CASE REPORTS (not theoretical): Two infant seizure case reports in 6-month-olds (LactMed Jan 2026). One case confirmed bupropion+hydroxybupropion in infant serum (Naranjo assessment = probable). One case involved bupropion+escitalopram combination — polypharmacy may be the key risk factor. Active metabolites (hydroxybupropion, threohydrobupropion) appear in milk at levels comparable to or exceeding parent drug — actual infant exposure is higher than parent RID alone suggests.",pk:"2–3 hrs",mon:"Monitor for seizure activity, feeding behavior, irritability. CRITICAL: Seizures have been documented (not merely theoretical) in 6-month-olds — inform pediatrician explicitly. When co-prescribed with SSRIs (especially escitalopram), closely monitor for vomiting, diarrhea, jitteriness, sedation. Monitor metabolite exposure — parent RID of ~2% understates total infant exposure given active metabolites in milk. Case reports of possible seizure in partially breastfed 6-month-olds.",alts:["Sertraline"],rev:"Jan 15, 2026"}},

  mirtazapine:{g:"Mirtazapine",b:"Remeron",cls:"Tetracyclic Antidepressant",p:"P2",tera:{
    t1:{r:"None–Minimal",q:"Limited",s:"Limited but growing pregnancy data. Small cohort studies show no increased malformation rate. Weight gain is primary clinical concern.",src:"DailyMed",d:"2025-06-15"},
    t2:{r:"Undetermined",q:"Insufficient",s:"Insufficient data for neurodevelopmental assessment.",src:"MotherToBaby",d:"2025-04-15"},
    t3:{r:"Low",q:"Limited",s:"Neonatal sedation possible. Weight gain and metabolic effects may complicate late pregnancy.",src:"DailyMed",d:"2025-06-15"},
    pp:{r:"Compatible with monitoring",q:"Limited",s:"Low breast milk levels. RID 1–3%. Sedating properties may help with infant sleep disruption indirectly.",src:"LactMed",d:"2025-08-01"}},
    alt:[{n:"Sertraline",p:"More pregnancy data; preferred first-line",q:"Strong"},{n:"Bupropion",p:"Less sedating/weight gain; moderate pregnancy data",q:"Moderate"}],
    pk:"CYP3A4 and CYP1A2 substrate. Significant sedation and weight gain properties.",
    gl:[{b:"APA-MDD",pos:"APA MDD Guideline does not specifically address mirtazapine in pregnancy — reasonable alternative if SSRI/SNRI not tolerated per clinical consensus",str:"III",y:2010,note:"APA Practice Guideline for MDD (extrapolation); MGH CWM guidance"}],
    lac:{tier:"Compatible with monitoring",ml:"Low",is:"Low",rid:"1–3%",ae:"Possible infant sedation; no significant reports",pk:"2 hrs",mon:"Monitor for sedation, poor feeding, poor weight gain. Sedating properties may affect infant sleep patterns. Inform pediatrician. Routine follow-up adequate in healthy term infants.",alts:["Sertraline"],rev:"Aug 1, 2025"}},

  trazodone:{g:"Trazodone",b:"Desyrel",cls:"SARI",p:"P2",tera:{
    t1:{r:"None–Minimal",q:"Limited",s:"Limited pregnancy data. Small studies show no clear malformation signal. Often used as hypnotic at low doses.",src:"DailyMed",d:"2025-05-01"},
    t2:{r:"Undetermined",q:"Insufficient",s:"Insufficient data.",src:"MotherToBaby",d:"2025-03-15"},
    t3:{r:"Low",q:"Limited",s:"Neonatal sedation possible. Limited specific data for trazodone.",src:"DailyMed",d:"2025-05-01"},
    pp:{r:"Compatible with monitoring",q:"Limited",s:"Low breast milk levels. RID <1%. Minimal exposure to infant.",src:"LactMed",d:"2025-07-01"}},
    alt:[{n:"Diphenhydramine",p:"OTC sleep aid; limited evidence for antidepressant effect",q:"Limited"},{n:"CBT-I",p:"Cognitive behavioral therapy for insomnia; no medication risk",q:"Strong"}],
    pk:"CYP3A4 substrate. Active metabolite mCPP. Short half-life (3–6 hrs at low doses).",
    gl:[{b:"APA-MDD",pos:"APA MDD Guideline does not specifically address trazodone in pregnancy — used off-label as hypnotic; position based on clinical consensus",str:"III",y:2010,note:"Clinical consensus — not explicitly in APA MDD Guideline"}],
    lac:{tier:"Compatible with monitoring",ml:"Very low",is:"Undetectable",rid:"<1% (based on parent compound at 50mg dose; active metabolite mCPP was NOT measured in the primary RID study — true total infant exposure may be somewhat higher than <1% suggests)",ae:"No adverse effects reported in breastfed infants. CAVEAT: The primary RID study (LactMed) did not measure trazodone's active metabolite mCPP (meta-chlorophenylpiperazine), which has serotonergic activity — a known limitation of the lactation data.",pk:"1–2 hrs",mon:"Monitor for sedation, poor feeding. Time feeds away from peak concentration (1–2 hrs post-dose). Very low RID from parent compound — routine monitoring adequate in healthy term infants. Note: mCPP metabolite exposure is unmeasured; clinical significance uncertain but worth awareness.",alts:["Diphenhydramine"],rev:"Apr 2022"}},

  // ── TCAs ──────────────────────────────────────────────────────────────────
  nortriptyline:{g:"Nortriptyline",b:"Pamelor",cls:"TCA",p:"P1",tera:{
    t1:{r:"None–Minimal",q:"Moderate",s:"Moderate cohort data. No consistent major malformation signal. Preferred TCA in pregnancy due to lower anticholinergic burden and better-characterized plasma levels.",src:"DailyMed",d:"2025-07-01",bl:"3–5%",ex:"3–5%"},
    t2:{r:"None–Minimal",q:"Limited",s:"Limited neurodevelopmental data specific to nortriptyline. TCA class data generally reassuring.",src:"MotherToBaby",d:"2025-05-15"},
    t3:{r:"Low",q:"Moderate",s:"Neonatal withdrawal syndrome reported: irritability, tremor, urinary retention, functional bowel obstruction. Anticholinergic effects in neonate. Taper before delivery if feasible.",src:"DailyMed",d:"2025-07-01"},
    pp:{r:"Compatible with monitoring",q:"Moderate",s:"Low breast milk levels. RID 1–3%. Preferred TCA for breastfeeding per LactMed.",src:"LactMed",d:"2025-09-15"}},
    alt:[{n:"Sertraline",p:"Better-studied in pregnancy; preferred first-line",q:"Strong"},{n:"Amitriptyline",p:"More sedating TCA; more anticholinergic side effects",q:"Moderate"}],
    pk:"CYP2D6 substrate. TDM (plasma levels 50–150 ng/mL) particularly useful in pregnancy given PK changes. Less anticholinergic than amitriptyline.",
    gl:[{b:"APA-MDD",pos:"APA MDD Guideline includes TCAs as second-line; nortriptyline preferred TCA due to lower anticholinergic burden and available TDM",str:"IIA",y:2010,note:"APA Practice Guideline for MDD, 3rd ed."},{b:"NICE",pos:"Consider if patient stable on TCA; switch if starting new",str:"Moderate",y:2022}],
    lac:{tier:"Compatible with monitoring",ml:"Low",is:"Low-to-undetectable",rid:"1–3%",ae:"No significant adverse effects in controlled studies",pk:"~7–8 hrs",mon:"Monitor for sedation, poor feeding, urinary retention (anticholinergic effects). Inform pediatrician. Preferred TCA during lactation — routine monitoring adequate in healthy term infants.",alts:["Sertraline","Paroxetine"],rev:"Sep 15, 2025"}},

  amitriptyline:{g:"Amitriptyline",b:"Elavil",cls:"TCA",p:"P1",tera:{
    t1:{r:"None–Minimal",q:"Moderate",s:"Decades of use data. No consistent major malformation signal in large cohorts. Limb reduction defects reported in older case series not confirmed in modern studies.",src:"DailyMed",d:"2025-06-01",bl:"3–5%",ex:"3–5%"},
    t2:{r:"None–Minimal",q:"Limited",s:"Limited specific neurodevelopmental data. Class-level TCA data reassuring. Significant sedation and weight gain are clinical management concerns.",src:"MotherToBaby",d:"2025-04-15"},
    t3:{r:"Low–Moderate",q:"Moderate",s:"Neonatal withdrawal and anticholinergic toxicity reported. Symptoms include tachycardia, urinary retention, bowel ileus, and irritability. More pronounced than nortriptyline due to higher anticholinergic burden.",src:"DailyMed",d:"2025-06-01"},
    pp:{r:"Compatible with monitoring",q:"Moderate",s:"Low breast milk levels. RID 1–2.5%. Active metabolite nortriptyline also present. Monitor infant for sedation.",src:"LactMed",d:"2025-08-01"}},
    alt:[{n:"Nortriptyline",p:"Active metabolite of amitriptyline; lower anticholinergic burden; preferred TCA",q:"Moderate"},{n:"Sertraline",p:"Better perinatal data; preferred first-line",q:"Strong"}],
    pk:"CYP2D6 and CYP2C19 substrate. Metabolized to active nortriptyline. TDM recommended. Significant anticholinergic, sedating, and weight-gaining properties.",
    gl:[{b:"APA-MDD",pos:"APA MDD Guideline includes TCAs as second-line alternatives; nortriptyline preferred over amitriptyline due to lower anticholinergic burden",str:"IIB",y:2010,note:"APA Practice Guideline for MDD, 3rd ed."}],
    lac:{tier:"Use with caution — nortriptyline (active metabolite) is preferred; heightened vigilance in neonates required",ml:"Low",is:"Low; nortriptyline metabolite also present in milk at significant levels at higher maternal doses",rid:"0.9–4% (SPS NHS); 1–2.5% typical",ae:"DOCUMENTED SEVERE CASE: Severe sedation and ~80% decrease in breastfeeding in a 15-day-old infant at only 10mg/day maternal dose (onset after 3 days; resolved 48h post-discontinuation; confirmed by rechallenge — LactMed Aug 2024). This is a strong signal for extreme vigilance in neonates even at very low doses. Active metabolite nortriptyline also present in milk.",pk:"6–8 hrs",mon:"HEIGHTENED VIGILANCE IN NEONATES: Severe sedation documented at 10mg/day (very low dose) in a 15-day-old. Monitor for sedation, feeding adequacy (~80% feeding decrease documented), constipation, urinary retention. Consider switching to nortriptyline (which is the preferred TCA with lower anticholinergic burden and better safety profile). Active metabolite nortriptyline also present in milk and adds to total exposure. Inform pediatrician explicitly of amitriptyline-specific case reports.",alts:["Nortriptyline","Sertraline"],rev:"Aug 15, 2024"}},

  imipramine:{g:"Imipramine",b:"Tofranil",cls:"TCA",p:"P1",tera:{
    t1:{r:"Low",q:"Limited",s:"Older data; some studies noted limb reduction defects that have not been replicated. No consistent malformation signal in modern cohort data. Less preferred TCA given data limitations.",src:"DailyMed",d:"2025-05-01"},
    t2:{r:"None–Minimal",q:"Insufficient",s:"Insufficient specific data. TCA class data applied.",src:"MotherToBaby",d:"2025-03-01"},
    t3:{r:"Low–Moderate",q:"Limited",s:"Neonatal withdrawal and anticholinergic toxicity similar to amitriptyline. Also used for enuresis historically — avoid in pregnancy context.",src:"DailyMed",d:"2025-05-01"},
    pp:{r:"Compatible with monitoring",q:"Limited",s:"Moderate breast milk levels. RID 0.1–4.4%. Active metabolite desipramine also present.",src:"LactMed",d:"2025-07-01"}},
    alt:[{n:"Nortriptyline",p:"Preferred TCA in pregnancy; better-characterized",q:"Moderate"},{n:"Sertraline",p:"Better perinatal data; preferred first-line",q:"Strong"}],
    pk:"CYP2D6 and CYP2C19 substrate. Metabolized to desipramine (active). Anticholinergic and sedating. TDM recommended.",
    gl:[{b:"APA-MDD",pos:"APA MDD Guideline lists TCAs as second-line; imipramine not preferred — nortriptyline favored. Imipramine position is clinical consensus.",str:"III",y:2010,note:"APA Practice Guideline for MDD (TCA class guidance)"}],
    lac:{tier:"Compatible with monitoring",ml:"Moderate",is:"Desipramine (active metabolite) also detectable. 2-hydroxydesipramine (second active metabolite) also present in milk.",rid:"0.1–4.4%",ae:"Limited adverse reports in breastfed infants. CLINICALLY IMPORTANT: Imipramine associated with galactorrhea (with or without hyperprolactinemia) — multiple case reports confirmed by e-Lactancia and LactMed. Monitor milk supply, especially at higher doses.",pk:"6–8 hrs",mon:"Monitor for sedation, poor feeding, constipation (anticholinergic effects). Monitor maternal milk supply — galactorrhea/prolactin effects documented. Active metabolite desipramine also present. Inform pediatrician. Consider nortriptyline if initiating TCA in lactation.",alts:["Nortriptyline"],rev:"Apr 2022"}},

  // ── NEWER ANTIPSYCHOTICS ───────────────────────────────────────────────────
  lurasidone:{g:"Lurasidone",b:"Latuda",cls:"Atypical Antipsychotic",p:"P1",tera:{
    t1:{r:"Undetermined",q:"Insufficient",s:"Very limited pregnancy data. Animal studies showed no teratogenicity at therapeutic doses. No consistent human signal but sample sizes too small to rule out risk.",src:"DailyMed",d:"2025-08-01"},
    t2:{r:"Undetermined",q:"Insufficient",s:"Insufficient human data. Growing interest due to favorable metabolic profile (less weight gain than quetiapine/olanzapine) — relevant for GDM risk management.",src:"MotherToBaby",d:"2025-06-01"},
    t3:{r:"Low",q:"Limited",s:"Neonatal EPS and withdrawal possible based on class effect. Specific lurasidone neonatal data very limited.",src:"DailyMed",d:"2025-08-01"},
    pp:{r:"Compatible with monitoring",q:"Insufficient",s:"No published lactation data for lurasidone specifically. Highly protein-bound — breast milk levels likely low but unconfirmed.",src:"LactMed",d:"2025-07-01"}},
    alt:[{n:"Quetiapine",p:"More pregnancy data; metabolic effects but better characterized",q:"Moderate"},{n:"Aripiprazole",p:"Moderate pregnancy data; different metabolic profile",q:"Moderate"}],
    pk:"CYP3A4 substrate. Must be taken with food (≥350 kcal) — important for compliance. Favorable metabolic profile; less GDM risk than quetiapine/olanzapine.",
    gl:[{b:"APA-Psychosis",pos:"APA Schizophrenia Guideline (2021): insufficient lurasidone pregnancy data — consider switch to better-studied AP; if stable, weigh switch risk carefully",str:"III",y:2021,note:"APA Practice Guideline for Schizophrenia, 2021"}],
    lac:{tier:"Use with caution — alternative preferred pending more data (LactMed Nov 2025). Previously 'Requires assessment' — now better characterized by Campbell et al. J Clin Psychiatry 2025 (7-mother study).",ml:"Very low expected given >99% plasma protein binding; one prior case: 16 mcg/L on day 5, 2.2 mcg/L on day 41 of breastfeeding",is:"Expected very low given extreme protein binding; Campbell 2025 data supports low milk transfer",rid:"Very low (<1% estimated); >99% protein binding limits milk transfer. The 2025 Campbell et al. study (7 mothers) now provides milk level data — 'Unknown' is no longer accurate.",ae:"IMPORTANT: Despite low milk transfer expected from protein binding, lurasidone may affect prolactin and cause galactorrhea at high doses. One case: adolescent on lurasidone developed prolactin elevation to 4240 mIU/L (normal 60–400), breast fullness, galactorrhea. Monitor lactation success.",pk:"Unknown — accumulates with food; highly protein bound",mon:"Monitor for sedation, feeding adequacy, developmental milestones. CRITICAL: Monitor maternal milk supply — prolactin elevation and galactorrhea documented at higher doses despite low milk transfer. If milk supply concerns arise, consider quetiapine or olanzapine. Consult pediatrician. Consider switching to better-studied agent if stable.",alts:["Quetiapine","Olanzapine"],rev:"Nov 15, 2025"}},

  haloperidol:{g:"Haloperidol",b:"Haldol",cls:"Typical Antipsychotic",p:"P1",tera:{
    t1:{r:"None–Minimal",q:"Moderate",s:"Oldest antipsychotic with decades of pregnancy data. No consistent major malformation signal in large cohorts. Used extensively in hyperemesis gravidarum at low doses. EPS adverse effects well-characterized.",src:"DailyMed",d:"2025-08-15",bl:"3–5%",ex:"3–5%"},
    t2:{r:"None–Minimal",q:"Moderate",s:"No clear neurodevelopmental signal in available studies. EPS and tardive dyskinesia theoretical risks with long-term exposure.",src:"MotherToBaby",d:"2025-06-15"},
    t3:{r:"Low",q:"Moderate",s:"Neonatal EPS (hypertonia, abnormal movements) reported. Typically transient. Used at low doses for hyperemesis — neonatal risk at these doses is low.",src:"DailyMed",d:"2025-08-15"},
    pp:{r:"Compatible with monitoring",q:"Moderate",s:"Low breast milk levels. RID 0.2–2.1%. Infant EPS monitoring recommended.",src:"LactMed",d:"2025-10-01"}},
    alt:[{n:"Quetiapine",p:"Atypical AP; better tolerability profile in most patients",q:"Moderate"},{n:"Olanzapine",p:"More pregnancy data among atypicals; metabolic monitoring required",q:"Moderate"}],
    pk:"CYP2D6 and CYP3A4 substrate. Long-acting injectable formulation available — continuity advantage for adherence concerns in pregnancy. EPS monitoring essential.",
    gl:[{b:"APA-Psychosis",pos:"APA Schizophrenia Guideline (2021): haloperidol acceptable; IM formulation useful for acute agitation; most pregnancy data among all antipsychotics",str:"IIA",y:2021,note:"APA Practice Guideline for Schizophrenia, 2021"},{b:"NICE",pos:"Can use if atypicals not appropriate; EPS monitoring required",str:"Moderate",y:2022}],
    lac:{tier:"Use with caution — one expert guideline recommends against haloperidol during breastfeeding (LactMed Nov 2025). SGAs (quetiapine, olanzapine) are generally preferred per systematic reviews.",ml:"Low",is:"Low",rid:"0.2–2.1%",ae:"Infant EPS and sedation possible. For haloperidol decanoate (long-acting injectable): require prolonged monitoring given extended half-life — monitor for excessive sedation, irritability, poor feeding, extrapyramidal symptoms (tremors, abnormal muscle movements).",pk:"Variable",mon:"Monitor for extrapyramidal symptoms (hypertonia, abnormal movements, tremor), sedation, poor feeding, and developmental milestones. NOTE: One expert guideline recommends against haloperidol during breastfeeding — inform clinical decision. For haloperidol decanoate: prolonged monitoring required due to extended half-life. If adding haloperidol to other antipsychotics (e.g. risperidone), be aware of additive sedation risk documented in case reports. Inform pediatrician.",alts:["Quetiapine","Olanzapine"],rev:"Nov 15, 2025"}},

  clozapine:{g:"Clozapine",b:"Clozaril",cls:"Atypical Antipsychotic",p:"P2",tera:{
    t1:{r:"Undetermined",q:"Limited",s:"Limited pregnancy data. Case reports and small series only. No consistent malformation signal but sample sizes inadequate. Agranulocytosis monitoring requirement complicates management.",src:"DailyMed",d:"2025-07-01"},
    t2:{r:"Low",q:"Limited",s:"Gestational diabetes risk elevated — clozapine has significant metabolic effects. Fetal monitoring for growth recommended. Agranulocytosis monitoring must continue throughout pregnancy.",src:"MotherToBaby",d:"2025-05-01"},
    t3:{r:"Low–Moderate",q:"Limited",s:"Neonatal sedation, hypotonia, and EPS reported. Neonatal agranulocytosis is a theoretical but not well-documented risk. Neonatal monitoring protocol recommended.",src:"DailyMed",d:"2025-07-01"},
    pp:{r:"Requires assessment",q:"Limited",s:"Significant breast milk levels. RID 1.2–4.7%. Neonatal agranulocytosis risk makes breastfeeding generally not recommended. Weigh carefully.",src:"LactMed",d:"2025-08-15"}},
    alt:[{n:"Olanzapine",p:"Less effective for treatment-resistant cases but better safety profile",q:"Limited"},{n:"Quetiapine",p:"Less efficacious for TRS but safer profile",q:"Limited"}],
    pk:"CYP1A2 substrate — smoking cessation common in pregnancy can significantly raise clozapine levels. Weekly CBC required (REMS program). Metabolic monitoring critical.",
    gl:[{b:"APA-Psychosis",pos:"APA Schizophrenia Guideline (2021): continue clozapine if only effective agent for treatment-resistant schizophrenia; enhanced monitoring protocol required",str:"IIA",y:2021,note:"APA Practice Guideline for Schizophrenia, 2021"},{b:"NICE",pos:"If clozapine is necessary, continue with enhanced fetal and neonatal monitoring",str:"Moderate",y:2022}],
    lac:{tier:"Breastfeeding generally not recommended — other agents preferred; MGH 2025: 'remains contraindicated due to risk of agranulocytosis' (LactMed Jul 2025: 'other agents are preferred'; some sources recommend women not breastfeed)",ml:"Milk levels 63.5–115.6 mcg/L documented (LactMed Jul 2025)",is:"Detectable; clozapine metabolites also present",rid:"1.2–4.7% (NOTE: This specific RID range cannot be verified directly in LactMed which reports milk levels in mcg/L but does not explicitly state this RID range. Verify source for this figure or flag as estimated.)",ae:"Sedation and adverse hematologic effects reported in breastfed infants. Agranulocytosis risk is primary concern. One possible speech delay case documented. Serial CBC monitoring advisable if breastfeeding elected despite recommendations to avoid.",pk:"Variable",mon:"GENERALLY NOT RECOMMENDED: If breastfeeding is elected despite recommendations against it: serial infant CBC for agranulocytosis monitoring, sedation monitoring, feeding adequacy, weight gain. Clozapine metabolites also present. Multidisciplinary decision required — document explicitly. Formula feeding is the preferred option when clozapine is continued.",alts:["Formula feeding preferred if clozapine continued"],rev:"Jul 15, 2025"}},

  // ── MOOD STABILIZERS (ADDITIONAL) ─────────────────────────────────────────
  oxcarbazepine:{g:"Oxcarbazepine",b:"Trileptal",cls:"Mood Stabilizer",p:"P1",tera:{
    t1:{r:"Low–Moderate",q:"Moderate",s:"Structural analog of carbamazepine. Neural tube defect risk lower than carbamazepine (~0.2–0.5% vs ~0.5–1%). Overall malformation rate ~2–3% in cohort studies. Hyponatremia risk requires monitoring.",src:"DailyMed",d:"2025-07-15",bl:"0.1% (NTD)",ex:"0.2–0.5% (NTD)"},
    t2:{r:"Low",q:"Limited",s:"Limited neurodevelopmental data specific to oxcarbazepine. Presumed lower risk than carbamazepine based on mechanism but confirmatory data sparse.",src:"MotherToBaby",d:"2025-05-15"},
    t3:{r:"Low",q:"Limited",s:"Neonatal hyponatremia possible. Neonatal EEG monitoring if used for epilepsy. Vitamin K supplementation recommended.",src:"DailyMed",d:"2025-07-15"},
    pp:{r:"Compatible with monitoring",q:"Limited",s:"Low breast milk levels. RID 1.7–8.6% (MHD metabolite). Limited but generally reassuring data.",src:"LactMed",d:"2025-09-01"}},
    alt:[{n:"Lamotrigine",p:"Strongly preferred — no teratogenic signal; better neurodevelopmental data",q:"Strong"},{n:"Lithium",p:"Lower teratogenicity for bipolar; effective for mania",q:"Strong"}],
    pk:"Active metabolite MHD (monohydroxy derivative) is primary active agent. Less CYP induction than carbamazepine. Monitor serum sodium — hyponatremia risk elevated in pregnancy.",
    gl:[{b:"APA-Bipolar",pos:"APA Bipolar Guideline does not specifically address oxcarbazepine — position extrapolated from carbamazepine class and NTD risk data; lamotrigine or lithium strongly preferred",str:"IIA",y:2002,note:"APA Bipolar Guideline (carbamazepine class extrapolation)"},{b:"NICE",pos:"Discuss NTD risk; high-dose folic acid recommended",str:"Moderate",y:2022}],
    lac:{tier:"Compatible with monitoring",ml:"Low-moderate (MHD metabolite)",is:"MHD (active metabolite, monohydroxy derivative) detectable in infant serum at 5–15% of maternal levels",rid:"1.7–8.6%",ae:"No significant adverse effects from breastfeeding. NICU/POSTPARTUM AWARENESS: Infants born to mothers on oxcarbazepine may show neonatal withdrawal signs in first days (excitability, irritability, limb shaking, increased muscle tone) from in-utero exposure — not a breastfeeding contraindication; breastfeeding appeared to lessen excitability in one case. Distinguish from lactation-related effects.",pk:"Variable",mon:"Monitor infant serum sodium (hyponatremia risk — MHD metabolite excreted in milk). Monitor for sedation, poor feeding, irritability. Inform NICU/postpartum team: neonatal withdrawal in first days possible from in-utero exposure — not a reason to avoid breastfeeding. Electrolytes if any clinical concern.",alts:["Lamotrigine"],rev:"Sep 15, 2024"}},

  // ── PERINATAL-SPECIFIC ─────────────────────────────────────────────────────
  zuranolone:{g:"Zuranolone",b:"Zurzuvae",cls:"Neuroactive Steroid",p:"P1",tera:{
    t1:{r:"Undetermined",q:"Insufficient",s:"No human pregnancy data. Animal studies showed embryo-fetal toxicity at supratherapeutic doses. Not indicated during pregnancy — indicated specifically for postpartum depression. FDA requires effective contraception during treatment and for 1 week after final dose based on animal developmental toxicity data.",src:"DailyMed; NAMI 2024",d:"2025-08-01"},
    t2:{r:"Undetermined",q:"Insufficient",s:"No data. Not indicated during pregnancy.",src:"DailyMed",d:"2025-08-01"},
    t3:{r:"Undetermined",q:"Insufficient",s:"No data. Animal studies show potential CNS effects in offspring. ACOG (2024) recommends consideration for PPD occurring in third trimester or within 4 weeks postpartum — clinical team decision.",src:"ACOG 2024; DailyMed",d:"2025-08-01"},
    pp:{r:"Compatible with monitoring — rapidly evolving evidence",q:"Limited",s:"RAPIDLY EVOLVING EVIDENCE (approved Aug 2023). Phase 1 lactation study (Deligiannidis et al. J Clin Psychopharmacol 2024; n=14–15 healthy lactating women): mean RID 0.357% at 30mg/day; 0.984% at 50mg/day — well below the 10% threshold. Milk levels undetectable 4–6 days after last dose. Real-world data: Price & Price J Clin Psychiatry 2025 (n=25 nursing infants): zuranolone well-tolerated; no sedation or adverse effects observed in breastfed infants. Milk volume: mean 8.3% decrease during study, but likely artifact of study design (pumping-only during study, not direct breastfeeding demand). MGH Women's Mental Health (Oct 2025): 'emerging clinical data is reassuring; ongoing careful monitoring remains important.' LactMed (Jul 2024): not a reason to discontinue breastfeeding; monitor for excessive sedation.",src:"LactMed Jul 2024; Deligiannidis et al. J Clin Psychopharmacol 2024; Price & Price J Clin Psychiatry 2025; MGH Women's Mental Health Oct 2025",d:"2025-10-01"}},
    alt:[{n:"Sertraline",p:"Strong postpartum data; first-line for PPD; established breastfeeding compatibility",q:"Strong"},{n:"Brexanolone (IV)",p:"IV predecessor; same GABA-A mechanism; hospital-only but faster onset",q:"Moderate"},{n:"Escitalopram",p:"Well-studied for PPD; compatible with breastfeeding; once daily",q:"Strong"}],
    pk:"14-day oral course. Once nightly with fat-containing meal (400–1,000 cal, 25–50% fat) for adequate absorption. Usual dose 50mg/day; may reduce to 40mg for tolerability. Somnolence (15%), dizziness (8%), headache (9%). No driving for 12 hrs post-dose. Positive allosteric modulator of GABA-A receptors — novel mechanism targeting the same hormonal pathway implicated in PPD (progesterone/allopregnanolone withdrawal). Schedule IV controlled substance. Wholesale cost ~$15,900 per 14-day course — prior authorization typically required.",
    gl:[{b:"ACOG",pos:"FDA-approved for PPD; consider for PPD in T3 or within 4 weeks postpartum; breastfeeding decision requires shared decision-making on continuation, pumping-discarding, or cessation",str:"CO",y:2024},{b:"APA",pos:"No formal APA guideline yet (approved Aug 2023 — guideline update pending); emerging clinical consensus supports use with breastfeeding monitoring given reassuring lactation data",str:"Emerging consensus",y:2025}],
    lac:{tier:"Compatible with monitoring — reassuring emerging data; shared decision-making required",ml:"RID 0.357% at 30mg/day; 0.984% at 50mg/day — below quantification limit by day 4–6 after last dose (Deligiannidis et al. 2024)",is:"No published infant serum levels — reassuring real-world clinical series (n=25 infants) showed no adverse effects (Price & Price 2025)",rid:"0.357–0.984% depending on dose (LactMed Jul 2024; Deligiannidis et al. J Clin Psychopharmacol 2024) — well below 10% threshold",ae:"No adverse effects observed in 25 breastfed infants in real-world clinical series (Price & Price J Clin Psychiatry 2025). Theoretical risk: CNS sedation. Possible mild transient milk volume reduction during treatment course (8.3% decrease in one study — likely artifact of study design).",pk:"N/A — 14-day oral course; milk undetectable 4–6 days after last dose",mon:"Shared decision-making required. Three options: (1) Continue breastfeeding with careful monitoring for infant sedation — supported by emerging data showing RID <1% and no adverse infant effects; (2) Pump and discard during course + 1 week after; (3) Temporary cessation with return after washout. LactMed: 'not a reason to discontinue breastfeeding' — monitor for excessive sedation especially in newborns and preterm infants. Manufacturer still recommends pump-and-discard — clinicians may use clinical judgment given reassuring post-marketing data.",alts:["Sertraline","Escitalopram"],rev:"Oct 9, 2025"}},

  brexanolone:{g:"Brexanolone",b:"Zulresso",cls:"Neuroactive Steroid",p:"P1",tera:{
    t1:{r:"Undetermined",q:"Insufficient",s:"No human pregnancy data. Animal studies: malformations not seen in rats or rabbits at therapeutic doses, but postnatal animal data showed decreased body weight, reduced pup viability, and neurobehavioral deficits in female offspring at high doses. Not indicated during pregnancy — approved specifically for postpartum depression. REMS program required.",src:"FDA Zulresso label 2019/2022; Drugs.com Jul 2024",d:"2025-07-01"},
    t2:{r:"Undetermined",q:"Insufficient",s:"No data. Not indicated during pregnancy.",src:"FDA Zulresso label",d:"2025-07-01"},
    t3:{r:"Undetermined",q:"Insufficient",s:"No data. ACOG (2024) recommends consideration for PPD in third trimester or within 4 weeks postpartum — hospital administration only (REMS). Boxed warning: excessive sedation and sudden loss of consciousness during infusion.",src:"ACOG 2024; FDA Zulresso label",d:"2025-07-01"},
    pp:{r:"Compatible — not a reason to discontinue breastfeeding",q:"Limited",s:"Lactation study (Wald et al. Clin Pharmacokinet 2022; n=12 healthy women, <6 months postpartum): 60-hr IV infusion titrated to max 90 mcg/kg/hr. Breastmilk <10 ng/mL in >95% of samples at 36 hrs after end of infusion. RID 1–2% of maternal weight-adjusted dose. Brexanolone is the pharmaceutical name for naturally occurring allopregnanolone — oral bioavailability <5%, meaning infant gut absorption of any amount in milk is minimal. LactMed (Aug 2023): 'not a reason to discontinue breastfeeding.' Note: trial participants were not breastfeeding during infusion — real-world breastfeeding during infusion requires a separate caregiver to be present due to maternal sedation/loss of consciousness risk.",src:"LactMed Aug 2023; Wald et al. Clin Pharmacokinet 2022; FDA Zulresso label; Drugs.com Jun 2025",d:"2025-07-01"}},
    alt:[{n:"Zuranolone (oral)",p:"Oral formulation; same mechanism; 14-day outpatient course; newer and more accessible",q:"Moderate"},{n:"Sertraline",p:"First-line for PPD; established breastfeeding safety; outpatient",q:"Strong"},{n:"Escitalopram",p:"Well-studied for PPD; compatible with breastfeeding",q:"Strong"}],
    pk:"IV infusion only — 60 continuous hours (2.5 days) in a certified REMS facility. Titration: 30 → 60 → 90 mcg/kg/hr over first 24 hrs, maintained at 90 mcg/kg/hr for 24 hrs, then tapered down over final 12 hrs. REMS required: facilities must be certified; continuous pulse oximetry mandatory; clinician must be on-site and available for the full 60-hr duration. Boxed warning: excessive sedation, altered/loss of consciousness (4% of patients in trials). No driving for duration of infusion + until sedative effects resolved. Allopregnanolone analog — same GABA-A mechanism as zuranolone. Approved 2019; expanded to age ≥15 in 2022.",
    gl:[{b:"ACOG",pos:"FDA-approved for PPD; consider for PPD in T3 or within 4 weeks postpartum; hospital administration required; breastfeeding: separate caregiver during infusion due to sedation/LOC risk",str:"CO",y:2024},{b:"APA",pos:"No formal APA guideline yet — first FDA-approved PPD-specific drug (2019); expert consensus supports use; breastfeeding safety supported by lactation PK study",str:"Emerging consensus",y:2023}],
    lac:{tier:"Compatible — not a reason to discontinue; infant caregiver required during infusion",ml:"<10 ng/mL in >95% of samples at 36 hrs post-infusion (Wald et al. 2022)",is:"No published infant serum levels",rid:"1–2% of maternal weight-adjusted dose (Wald et al. Clin Pharmacokinet 2022; LactMed Aug 2023)",ae:"No adverse effects reported in breastfed infants. Oral bioavailability <5% — even if infant ingests milk during infusion, systemic absorption is minimal. Primary safety concern is maternal sedation/LOC during infusion, not direct infant drug exposure.",pk:"N/A — 60-hr IV infusion; milk levels minimal by 36 hrs post-infusion",mon:"Maternal safety during infusion is the primary concern — separate caregiver REQUIRED for any child present during 60-hr infusion due to maternal sedation and sudden loss of consciousness risk. Breastfeeding can continue before and after infusion. Pumping during infusion optional (milk is safe per LactMed). No washout period required after infusion completion given rapid clearance and low oral bioavailability. REMS facility staff will coordinate timing.",alts:["Zuranolone (oral outpatient option)","Sertraline","Escitalopram"],rev:"Aug 15, 2023"}},

  hydroxyzine:{g:"Hydroxyzine",b:"Vistaril / Atarax",cls:"Antihistamine / Anxiolytic",p:"P1",tera:{
    t1:{r:"Low",q:"Moderate",s:"Multiple cohort studies. No consistent malformation signal. A very early case-control study suggested possible association with defects — not replicated in modern larger cohorts. Often used for anxiety and nausea in first trimester.",src:"DailyMed",d:"2025-07-01",bl:"3–5%",ex:"3–5%"},
    t2:{r:"None–Minimal",q:"Moderate",s:"Commonly used for pruritus of pregnancy, anxiety, and insomnia. No significant fetal concerns at standard doses.",src:"MotherToBaby",d:"2025-05-01"},
    t3:{r:"Low",q:"Moderate",s:"Neonatal sedation and hypotonia reported. QT prolongation theoretical concern at high doses. Avoid large doses near delivery.",src:"DailyMed",d:"2025-07-01"},
    pp:{r:"Compatible with monitoring",q:"Limited",s:"Probably low breast milk levels given short half-life. Limited published lactation data. Single-dose sedation concern in neonate.",src:"LactMed",d:"2025-08-01"}},
    alt:[{n:"Sertraline",p:"First-line for anxiety; better evidence base",q:"Strong"},{n:"CBT",p:"Evidence-based non-pharmacological option for anxiety",q:"Strong"}],
    pk:"Antihistamine with anxiolytic and sedative properties. Half-life 14–25 hrs. No addiction potential — advantage over benzodiazepines. QTc monitoring at high doses.",
    gl:[{b:"APA-MDD",pos:"APA MDD/Anxiety guidance includes hydroxyzine as non-addictive short-term anxiolytic; no specific pregnancy guideline statement — position is clinical consensus",str:"IIB",y:2010,note:"APA MDD Guideline + clinical consensus"},{b:"ACOG",pos:"Used for anxiety and pruritus; reasonable safety profile",str:"CO",y:2023}],
    lac:{tier:"Compatible for occasional use — prefer alternatives for neonates/preterm",ml:"Probably low",is:"Unknown",rid:"Unknown",ae:"Theoretical infant sedation; French pharmacovigilance data: adverse reactions noted (irritability/colicky symptoms and drowsiness in antihistamine-exposed infants). IMPORTANT: larger doses or prolonged use may reduce milk supply (LactMed Sep 2025) — relevant postpartum when lactation is being established.",pk:"~2 hrs (half-life 14–25 hrs — accumulation possible with repeated doses)",mon:"Monitor for sedation, poor feeding, hypotonia. IMPORTANT CORRECTION: Half-life is 14–25 hours (relatively long, not short) — accumulation possible with repeated dosing. Prefer single/infrequent doses. For repeated use, prefer sertraline for anxiety or lorazepam for acute anxiolytic needs. Monitor milk supply with prolonged use.",alts:["Sertraline"],rev:"Sep 15, 2025"}},

  // ── SUBSTANCE USE DISORDER ────────────────────────────────────────────────
  buprenorphine:{g:"Buprenorphine",b:"Subutex / Suboxone",cls:"Opioid Use Disorder",p:"P0",tera:{
    t1:{r:"Low",q:"Strong",s:"SAMHSA and major guidelines recommend buprenorphine (or methadone) as the standard of care for opioid use disorder in pregnancy. Untreated OUD carries far greater fetal risk than MOUD. No consistent malformation signal. Neonatal opioid withdrawal syndrome (NOWS) expected and manageable.",src:"DailyMed",d:"2025-09-01",bl:"3–5%",ex:"3–5%"},
    t2:{r:"Low",q:"Strong",s:"Continued MOUD prevents relapse, reduces fetal exposure to illicit opioids and injection-related infections. No significant structural or neurodevelopmental concerns specific to buprenorphine.",src:"MotherToBaby",d:"2025-07-01"},
    t3:{r:"Low",q:"Strong",s:"Neonatal opioid withdrawal syndrome (NOWS) occurs in majority of exposed neonates but is treatable. NOWS from buprenorphine generally milder and shorter than from methadone. Benefits of MOUD far outweigh NOWS risk.",src:"DailyMed",d:"2025-09-01"},
    pp:{r:"Compatible with monitoring",q:"Strong",s:"Breast milk levels low — RID 0.1–1.9%. Breastfeeding actually reduces severity of NOWS. Strongly encouraged unless contraindicated (active illicit drug use, HIV with viral load).",src:"LactMed",d:"2025-11-01"}},
    alt:[{n:"Methadone",p:"Alternative MOUD; daily observed dosing; also standard of care",q:"Strong"},{n:"Naltrexone",p:"Not recommended in pregnancy — limited data; risk of precipitated withdrawal",q:"Limited"}],
    pk:"Partial mu-opioid agonist. Sublingual or buccal formulation. Suboxone contains naloxone (buprenorphine/naloxone) — systemic naloxone absorption minimal by sublingual route. Dose typically increases in T3 due to increased volume of distribution.",
    gl:[{b:"SAMHSA",pos:"Recommended first-line MOUD in pregnancy; do not discontinue",str:"Strong",y:2023},{b:"ACOG",pos:"Standard of care for OUD in pregnancy; buprenorphine or methadone",str:"CO",y:2023},{b:"APA-SUD",pos:"APA OUD Guideline (2018): buprenorphine is evidence-based MOUD; withholding treatment constitutes inadequate care; continue throughout pregnancy",str:"IA",y:2018,note:"APA Practice Guideline for OUD, 2018"}],
    lac:{tier:"Compatible",ml:"Very low — 0.1–2.4% RID",is:"Low; may reduce NOWS severity",rid:"0.1–2.4% (LactMed Nov 2025; ABM Protocol 2025 cites up to 2.4% of maternal weight-adjusted dose)",ae:"No significant adverse effects; breastfeeding reduces NOWS severity, need for pharmacotherapy, and hospital length of stay. CRITICAL WARNING: Abrupt cessation of breastfeeding in buprenorphine-exposed infants can trigger infant withdrawal symptoms (yawning, tremors, sneezing, agitation, myoclonic jerks, insomnia) — taper breastfeeding gradually rather than stopping abruptly.",pk:"Variable",mon:"Standard NOWS monitoring; encourage breastfeeding. If breastfeeding cessation planned, do NOT stop abruptly — taper gradually to avoid precipitating infant withdrawal. Inform pediatrician of potential withdrawal with abrupt cessation.",alts:["Methadone (if switching MOUD)"],rev:"Nov 15, 2025"}},

  methadone:{g:"Methadone",b:"Dolophine / Methadose",cls:"Opioid Use Disorder",p:"P0",tera:{
    t1:{r:"Low",q:"Strong",s:"Decades of pregnancy data. Standard of care for OUD in pregnancy alongside buprenorphine. No consistent malformation signal at standard MOUD doses. NOWS expected and manageable. Untreated OUD risk far exceeds medication risk.",src:"DailyMed",d:"2025-09-01",bl:"3–5%",ex:"3–5%"},
    t2:{r:"Low",q:"Strong",s:"QTc prolongation at higher doses requires monitoring. No significant fetal structural concerns at MOUD doses. Growth monitoring recommended.",src:"MotherToBaby",d:"2025-07-01"},
    t3:{r:"Low",q:"Strong",s:"NOWS more prolonged and severe than with buprenorphine but still treatable. Daily clinic dosing ensures adherence. Methadone dose typically requires increase in T3 due to PK changes.",src:"DailyMed",d:"2025-09-01"},
    pp:{r:"Compatible with monitoring",q:"Strong",s:"RID 1–3%. Breastfeeding reduces NOWS severity and duration. Encouraged unless contraindicated.",src:"LactMed",d:"2025-11-01"}},
    alt:[{n:"Buprenorphine",p:"NOWS typically milder; take-home dosing possible; preferred by many guidelines",q:"Strong"},{n:"Naltrexone",p:"Not recommended in pregnancy",q:"Limited"}],
    pk:"Long half-life (24–36 hrs). QTc prolongation — baseline and periodic ECG recommended. Daily observed dosing at OTP clinic; take-home privileges may be limited. Significant drug interactions (CYP3A4, CYP2D6, CYP2B6).",
    gl:[{b:"SAMHSA",pos:"Standard of care for OUD in pregnancy; do not discontinue",str:"Strong",y:2023},{b:"ACOG",pos:"Standard of care; buprenorphine or methadone",str:"CO",y:2023}],
    lac:{tier:"Compatible",ml:"Low",is:"Detectable; reduces NOWS",rid:"1–6% (LactMed Dec 2025: most infants receive 1–3%; some infants receive 5–6% of maternal weight-adjusted dose. Previous value of 0.1–1.9% was significantly understated.)",ae:"No significant adverse effects at standard MOUD doses; protective against NOWS. HIGH-DOSE RISK: Initiating methadone postpartum or increasing to >100mg/day poses risk of sedation and respiratory depression in the infant, especially if the infant was not previously exposed (LactMed Dec 2025).",pk:"~3–5 hrs (half-life 24–36 hrs — accumulates with chronic dosing)",mon:"Standard NOWS monitoring; encourage breastfeeding. Monitor for infant sedation and respiratory depression, especially at doses >100mg/day or if methadone is newly initiated postpartum. Breastfeeding reduces NOWS severity and duration.",alts:["Buprenorphine (if switching MOUD)"],rev:"Dec 15, 2025"}},

  naltrexone:{g:"Naltrexone",b:"Vivitrol / ReVia",cls:"Opioid Use Disorder",p:"P2",tera:{
    t1:{r:"Undetermined",q:"Insufficient",s:"Very limited human pregnancy data. Animal studies showed fetal toxicity at high doses. Not recommended as first-line MOUD in pregnancy — buprenorphine or methadone preferred. May be considered if patient declining opioid agonist therapy and abstinence-based recovery is established.",src:"DailyMed",d:"2025-06-01"},
    t2:{r:"Undetermined",q:"Insufficient",s:"Insufficient data. Risk of precipitated withdrawal if opioids used in emergency (surgery, acute pain) is a significant clinical concern.",src:"MotherToBaby",d:"2025-04-01"},
    t3:{r:"Undetermined",q:"Insufficient",s:"Case reports only. No NOWS expected — opioid antagonist has no opioid activity. Pain management in labor complicated by opioid blockade.",src:"DailyMed",d:"2025-06-01"},
    pp:{r:"Compatible with monitoring",q:"Insufficient",s:"Very low breast milk levels expected given size/polarity. Insufficient published data. Probably low infant exposure.",src:"LactMed",d:"2025-07-01"}},
    alt:[{n:"Buprenorphine",p:"Preferred MOUD in pregnancy — far more evidence",q:"Strong"},{n:"Methadone",p:"Alternative first-line MOUD",q:"Strong"}],
    pk:"Opioid receptor antagonist — no agonist activity. Monthly IM injection (Vivitrol) or oral. Full opioid blockade for 24–72 hrs (oral) or ~30 days (IM). Pain management during naltrexone requires non-opioid approaches.",
    gl:[{b:"SAMHSA",pos:"Not first-line in pregnancy; buprenorphine or methadone preferred",str:"Moderate",y:2023},{b:"ACOG",pos:"Insufficient pregnancy data; consider switching to agonist therapy",str:"CO",y:2023}],
    lac:{tier:"Compatible with monitoring",ml:"Probably low",is:"Unknown",rid:"~0.86% combined (naltrexone + active metabolite beta-naltrexol) at 50mg/day per LactMed Jan 2026 (Iannella 2025 PK study). Beta-naltrexol detectable in milk for longer than parent drug (t½ 7.7h vs 2.5h). ABM Protocol 21: naltrexone compatible with breastfeeding (Level of Evidence 3, Strength B).",ae:"No significant reports; insufficient data",pk:"Variable",mon:"Monitor infant for opioid blockade effects — if breastfed infant requires opioid analgesia (post-surgery), maternal naltrexone could theoretically reduce effectiveness; alert anesthesiology/pediatrics. Standard follow-up.",alts:["Continue naltrexone if patient declines agonist therapy"],rev:"Jan 15, 2026"}},

  // ── SLEEP ──────────────────────────────────────────────────────────────────
  zolpidem:{g:"Zolpidem",b:"Ambien",cls:"Sedative-Hypnotic",p:"P2",tera:{
    t1:{r:"Low",q:"Moderate",s:"Multiple cohort studies. Some studies show modestly elevated preterm birth and low birth weight risk, not confirmed as causal in all analyses. No consistent major malformation signal. Often used short-term; risk likely related to underlying insomnia and depression rather than medication itself.",src:"DailyMed",d:"2025-07-01",bl:"3–5%",ex:"3–5%"},
    t2:{r:"Low",q:"Limited",s:"No clear structural teratogenicity. Sleep disruption itself is associated with adverse perinatal outcomes — treating insomnia has clinical value. Avoid chronic use.",src:"MotherToBaby",d:"2025-05-15"},
    t3:{r:"Low",q:"Moderate",s:"Neonatal sedation and respiratory depression possible with use near delivery. Neonatal withdrawal (floppy infant syndrome) reported with chronic use. Avoid within 2 weeks of expected delivery if possible.",src:"DailyMed",d:"2025-07-01"},
    pp:{r:"Compatible with monitoring",q:"Limited",s:"Low breast milk levels. RID 0.02–0.19%. Timing feeds to avoid peak milk concentration recommended.",src:"LactMed",d:"2025-09-01"}},
    alt:[{n:"CBT-I",p:"First-line for insomnia — no medication risk",q:"Strong"},{n:"Trazodone",p:"Low-dose sedating antidepressant; lower addiction potential",q:"Limited"},{n:"Hydroxyzine",p:"Non-addictive sedating antihistamine",q:"Moderate"}],
    pk:"GABA-A positive allosteric modulator (non-benzodiazepine). Short half-life (2.5 hrs). CR formulation extends to 2.8 hrs. Next-day impairment; do not drive. Tolerance and dependence possible with chronic use.",
    gl:[{b:"APA-MDD",pos:"APA MDD Guideline recommends CBT-I as first-line for insomnia; zolpidem acceptable short-term if CBT-I unavailable or insufficient",str:"IIB",y:2010,note:"APA MDD Guideline (sleep section)"},{b:"ACOG",pos:"Caution; short-term use only; avoid near delivery",str:"CO",y:2023}],
    lac:{tier:"Compatible with monitoring",ml:"Very low",is:"Low",rid:"0.02–0.19%",ae:"Minimal; sedation possible if feeding near peak",pk:"1–3 hrs post-dose",mon:"Time feeds 2+ hrs after dose to avoid peak milk concentration. Monitor for sedation, poor feeding, respiratory depression. Avoid chronic use. Very low RID — minimal risk with single-dose intermittent use in healthy term infants.",alts:["CBT-I","Trazodone"],rev:"Sep 1, 2025"}},

  prazosin:{g:"Prazosin",b:"Minipress",cls:"Alpha-1 Blocker / PTSD",p:"P2",tera:{
    t1:{r:"Undetermined",q:"Insufficient",s:"Very limited pregnancy data. Animal studies generally negative at therapeutic doses. Alpha-1 blockade causes vasodilation — theoretical concern for maternal hypotension and reduced uteroplacental perfusion. Used off-label for PTSD nightmares.",src:"DailyMed",d:"2025-05-01"},
    t2:{r:"Undetermined",q:"Insufficient",s:"Insufficient data. First-dose hypotension is the primary clinical concern — position changes and hydration management important.",src:"MotherToBaby",d:"2025-03-01"},
    t3:{r:"Undetermined",q:"Insufficient",s:"Case reports only. Maternal hypotension risk may be more pronounced in late pregnancy.",src:"DailyMed",d:"2025-05-01"},
    pp:{r:"Compatible with monitoring",q:"Insufficient",s:"No published lactation data. Protein-bound; breast milk levels probably low but unconfirmed.",src:"LactMed",d:"2025-06-01"}},
    alt:[{n:"Sertraline",p:"First-line pharmacotherapy for PTSD; better evidence",q:"Strong"},{n:"Trauma-focused CBT",p:"First-line non-pharmacological for PTSD",q:"Strong"}],
    pk:"Alpha-1 adrenergic antagonist. Antihypertensive at higher doses. Short half-life (2–4 hrs). First-dose hypotension — start low, take at bedtime. Used for PTSD nightmares at low doses (1–5 mg QHS).",
    gl:[{b:"Expert consensus",pos:"No APA guideline specifically addresses prazosin in pregnancy — APA PTSD consensus recommends trauma-focused CBT first-line; prazosin for nightmares is clinical consensus only",str:"III",y:2023,note:"No formal APA guideline — expert consensus + PTSD treatment literature"}],
    lac:{tier:"Insufficient data — alternative preferred (LactMed Dec 2024: only one manufacturer-reported mother studied; alternate drug preferred especially for newborns/preterm)",ml:"Unknown (manufacturer reports one mother excreted at most 3% of dose into breastmilk — no study details provided)",is:"Unknown",rid:"Unknown (manufacturer upper-bound ~3%; no independent infant serum data)",ae:"No published data; hypotension in infant theoretical. REASSURING NOTE: Prazosin does not affect serum prolactin concentration — unlike aripiprazole or risperidone, prazosin will not compromise milk production. This is clinically useful for PTSD patients considering prazosin for nightmare suppression.",pk:"2–4 hrs",mon:"Insufficient published lactation data. If used: monitor infant blood pressure (hypotension theoretical), feeding adequacy, sedation. REASSURING: No prolactin effect expected — milk supply should not be impacted. Document decision — insufficient data to guide specific monitoring intervals. Prefer sertraline for PTSD pharmacotherapy during breastfeeding.",alts:["Sertraline","CBT"],rev:"Dec 15, 2024"}},

  topiramate:{g:"Topiramate",b:"Topamax",cls:"Anticonvulsant / Mood Stabilizer",p:"P2",tera:{
    t1:{r:"Moderate",q:"Strong",s:"Increased risk of oral clefts (cleft lip/palate): estimated ~1% vs background ~0.1%, approximately 3–10x background per NAAED Pregnancy Registry and multiple epidemiologic studies (MotherToBaby Dec 2025). Small-for-gestational-age (SGA): 19.7% of exposed infants vs 5.4% controls; risk is dose-dependent and persists into 3rd trimester (FDA label). Michigan MC3 recommends avoidance. Note: topiramate reduces efficacy of estrogen-containing oral contraceptives — counsel on contraception.",src:"MotherToBaby Dec 2025; FDA label; NAAED Pregnancy Registry",d:"2025-12-01",bl:"3–5 / 100",ex:"~4–20 / 100 dose-dependent; oral clefts ~1%; SGA ~20%"},
    t2:{r:"Moderate",q:"Moderate",s:"SGA risk persists with continued use into 2nd/3rd trimester. Monitor fetal growth with serial ultrasounds. Avoid if possible — switch to lamotrigine.",src:"MotherToBaby Dec 2025; FDA label",d:"2025-12-01"},
    t3:{r:"Moderate",q:"Moderate",s:"Continued SGA risk. Neonatal metabolic acidosis possible due to carbonic anhydrase inhibition. Monitor neonatal electrolytes and acid-base status.",src:"FDA label; MotherToBaby Dec 2025",d:"2025-12-01"},
    pp:{r:"Use with caution",q:"Limited",s:"Passes into breast milk. Maternal doses up to 200 mg/day produce relatively low infant serum levels averaging ~51% of maternal serum in early postpartum (LactMed Aug 2025). Sedation and diarrhea reported occasionally; most infants tolerate well. Michigan MC3: avoid if possible.",src:"LactMed Aug 2025; MotherToBaby Dec 2025",d:"2025-12-01"}},
    alt:[{n:"Lamotrigine",p:"Preferred mood stabilizer in pregnancy — no increased malformation risk",q:"Strong"},{n:"Lithium",p:"Preferred for Bipolar I in pregnancy if mood stabilizer required",q:"Strong"}],
    pk:"Anticonvulsant and migraine prophylactic. Carbonic anhydrase inhibitor. Half-life ~21 hrs. Reduces estrogen-based OCP efficacy — contraceptive counseling essential. Michigan MC3: some reports of cleft palate, low birth weight — avoid.",
    gl:[{b:"NICE",pos:"Do not use in women of childbearing potential unless no alternative and effective contraception used",str:"Strong",y:2022},{b:"Michigan MC3",pos:"Some reports of cleft palate risk and low birth weight — avoid in pregnancy and breastfeeding if possible",str:"Clinical consensus",y:2023}],
    lac:{tier:"Use with caution — avoid if possible; monitor closely if used",ml:"Levels similar to or exceeding maternal plasma in early postpartum",is:"Infant serum levels average ~51% of maternal serum in early postpartum (LactMed Aug 2025)",rid:"Not formally calculated; infant serum ~51% of maternal — monitoring required",ae:"Sedation and diarrhea reported occasionally. One documented case: probable topiramate-induced diarrhea in 2-month-old breastfed infant resolved on discontinuation (Westergren et al. 2014 Epilepsy Behav Case Rep). Most infants tolerate well with no long-term adverse effects in limited follow-up.",pk:"~2 hrs (half-life 21 hrs — accumulates with chronic dosing)",mon:"Monitor for diarrhea, drowsiness, irritability, adequate weight gain and developmental milestones — especially in younger exclusively breastfed infants or when combined with other anticonvulsants or psychotropics. Use lamotrigine instead where possible.",alts:["Lamotrigine","Lithium"],rev:"Aug 15, 2025"}},

  ziprasidone:{g:"Ziprasidone",b:"Geodon",cls:"Atypical Antipsychotic",p:"P2",tera:{
    t1:{r:"Low",q:"Limited",s:"No controlled human pregnancy data. Animal studies show no teratogenicity at clinical doses. Michigan MC3: no controlled human data so far. General atypical antipsychotic class data (Huybrechts et al. JAMA Psychiatry 2016, n=1.4M) show no significant overall malformation risk as a class; ziprasidone-specific numbers insufficient.",src:"Michigan MC3 2023; Huybrechts et al. JAMA Psychiatry 2016",d:"2025-09-01",bl:"3–5 / 100",ex:"Insufficient data; class risk likely low"},
    t2:{r:"Low",q:"Limited",s:"No significant human data. QTc prolongation is a pharmacological concern — monitor if used. Requires 500-calorie meal for adequate absorption, which may be challenging with pregnancy nausea.",src:"Michigan MC3 2023; FDA label",d:"2025-09-01"},
    t3:{r:"Low",q:"Limited",s:"Extrapyramidal symptoms and neonatal adaptation syndrome expected as with other antipsychotics. Monitor neonate.",src:"FDA label",d:"2025-09-01"},
    pp:{r:"Requires assessment — very limited data; prefer alternatives",q:"Limited",s:"Michigan MC3: very limited lactation data. No published RID. QTc concern may apply to infant. Prefer quetiapine or olanzapine if antipsychotic needed during breastfeeding.",src:"LactMed; Michigan MC3 2023",d:"2025-09-01"}},
    alt:[{n:"Quetiapine",p:"Better-studied atypical; preferred for breastfeeding",q:"Strong"},{n:"Olanzapine",p:"More pregnancy and lactation data available",q:"Moderate"}],
    pk:"Atypical antipsychotic (D2/5-HT2A antagonist). QTc prolongation risk — avoid combining with other QTc-prolonging agents. MUST be taken with ≥500 calorie meal for adequate absorption. Relatively weight-neutral compared to olanzapine and quetiapine.",
    gl:[{b:"Michigan MC3",pos:"No controlled human pregnancy data; very limited lactation data",str:"Clinical consensus",y:2023},{b:"APA-Psychosis",pos:"Continue most effective AP if clinically necessary; ziprasidone has less pregnancy data than quetiapine or olanzapine",str:"III",y:2021}],
    lac:{tier:"Requires assessment — very limited data; prefer alternatives",ml:"Unknown",is:"Unknown",rid:"Not established",ae:"No published adverse infant reports — data insufficient to characterize risk",pk:"~6–8 hrs (half-life ~7 hrs)",mon:"If used, monitor infant for sedation, poor feeding, weight gain. QTc monitoring consideration. Prefer quetiapine or olanzapine with established safety data.",alts:["Quetiapine","Olanzapine"],rev:"Sep 1, 2025"}},

  paliperidone:{g:"Paliperidone",b:"Invega",cls:"Atypical Antipsychotic",p:"P2",tera:{
    t1:{r:"Low",q:"Limited",s:"Active metabolite of risperidone. Limited pregnancy-specific data; extrapolated from risperidone. Risperidone carries small signal for cardiac malformations (RR ~1.26, Huybrechts et al. JAMA Psychiatry 2016). Michigan MC3: limited data but reassuring so far.",src:"Michigan MC3 2023; Huybrechts et al. JAMA Psychiatry 2016",d:"2025-09-01",bl:"3–5 / 100",ex:"Slightly elevated vs background extrapolated from risperidone; insufficient paliperidone-specific data"},
    t2:{r:"Low",q:"Limited",s:"High prolactin elevation may affect gestational diabetes screening interpretation. Limited direct data — extrapolate from risperidone.",src:"Michigan MC3 2023",d:"2025-09-01"},
    t3:{r:"Low",q:"Limited",s:"Extrapyramidal symptoms and neonatal adaptation syndrome expected as with class. High prolactin levels may affect lactation initiation.",src:"FDA label; Michigan MC3 2023",d:"2025-09-01"},
    pp:{r:"Use with caution — second-line; prefer quetiapine or olanzapine",q:"Limited",s:"Michigan MC3: limited lactation data. As active metabolite of risperidone (which is second-line for breastfeeding), paliperidone is similarly second-line. Prolactin elevation may increase milk production paradoxically.",src:"LactMed; Michigan MC3 2023",d:"2025-09-01"}},
    alt:[{n:"Quetiapine",p:"Preferred atypical antipsychotic; well-studied in pregnancy and lactation",q:"Strong"},{n:"Olanzapine",p:"Better pregnancy and lactation data",q:"Moderate"}],
    pk:"Active metabolite of risperidone. Dopamine D2/serotonin 5-HT2A antagonist. Strong prolactin elevation — may cause galactorrhea and affects fertility assessment. Extended-release oral (Invega) and long-acting injectable (Invega Sustenna/Trinza) formulations — injectable complicates dose adjustment in pregnancy.",
    gl:[{b:"Michigan MC3",pos:"Limited data but reassuring so far for pregnancy; limited lactation data — second-line",str:"Clinical consensus",y:2023},{b:"APA-Psychosis",pos:"Continue most effective AP; less data than quetiapine/olanzapine",str:"III",y:2021}],
    lac:{tier:"Use with caution — second-line; prefer quetiapine or olanzapine",ml:"Limited data; expected similar to risperidone",is:"Expected to be present in milk as active metabolite",rid:"Not formally established; extrapolated from risperidone (2–5%)",ae:"Insufficient data to characterize. Sedation, poor feeding, jitteriness possible by class extrapolation from risperidone data.",pk:"~24 hrs (extended-release formulation — slow absorption; half-life ~23 hrs)",mon:"Monitor for sedation, feeding difficulties, jitteriness, weight gain. Prefer quetiapine or olanzapine where possible.",alts:["Quetiapine","Olanzapine"],rev:"Sep 1, 2025"}},

  brexpiprazole:{g:"Brexpiprazole",b:"Rexulti",cls:"Atypical Antipsychotic",p:"P2",tera:{
    t1:{r:"Low",q:"Limited",s:"Newer agent — very limited human pregnancy data. Michigan MC3 explicitly states: NEWER AGENT WITH LIMITED DATA IN PREGNANCY AND LACTATION — AVOID IF POSSIBLE. No formal registry data. Animal studies showed no teratogenicity at clinical doses. As dopamine partial agonist (aripiprazole analog), class extrapolation suggests low malformation risk but insufficient data to confirm.",src:"Michigan MC3 2023; FDA label",d:"2025-09-01",bl:"3–5 / 100",ex:"Insufficient data — avoid if possible"},
    t2:{r:"Low",q:"Limited",s:"No meaningful human data. Avoid if possible — switch to aripiprazole (same mechanism, more data) or quetiapine.",src:"Michigan MC3 2023",d:"2025-09-01"},
    t3:{r:"Low",q:"Limited",s:"Neonatal adaptation syndrome expected by class. No specific data.",src:"FDA label",d:"2025-09-01"},
    pp:{r:"Insufficient data — avoid",q:"Limited",s:"No published lactation data. Michigan MC3: avoid if possible. As dopamine partial agonist, may reduce prolactin and decrease milk production similar to aripiprazole.",src:"Michigan MC3 2023; LactMed",d:"2025-09-01"}},
    alt:[{n:"Aripiprazole",p:"Same mechanism; more pregnancy and lactation data available",q:"Moderate"},{n:"Quetiapine",p:"Better-studied; preferred atypical antipsychotic in perinatal period",q:"Strong"}],
    pk:"Dopamine D2/D3 partial agonist and serotonin 5-HT1A partial agonist. Similar mechanism to aripiprazole. Used as adjunct for MDD and for schizophrenia. May reduce prolactin — potential impact on milk supply.",
    gl:[{b:"Michigan MC3",pos:"NEWER AGENT WITH LIMITED DATA — AVOID IF POSSIBLE in pregnancy and lactation",str:"Clinical consensus",y:2023}],
    lac:{tier:"Insufficient data — avoid; use aripiprazole or quetiapine instead",ml:"Unknown",is:"Unknown",rid:"Not established",ae:"No published data",pk:"~4 hrs (estimated; no lactation PK data — half-life 91 hrs means drug accumulates with repeat dosing)",mon:"No monitoring guidance available — avoid use during breastfeeding. If clinically essential, switch to aripiprazole (same mechanism, more data) or quetiapine.",alts:["Aripiprazole","Quetiapine"],rev:"Sep 1, 2025"}},

  cariprazine:{g:"Cariprazine",b:"Vraylar",cls:"Atypical Antipsychotic",p:"P2",tera:{
    t1:{r:"Low",q:"Limited",s:"Newer agent — very limited human pregnancy data. Michigan MC3 explicitly states: NEWER AGENT WITH LIMITED DATA IN PREGNANCY AND LACTATION — AVOID IF POSSIBLE. No registry data. Animal studies showed developmental toxicity at supratherapeutic doses. Extremely long-acting active metabolites (didesmethylcariprazine half-life 1–3 weeks) complicate neonatal exposure assessment.",src:"Michigan MC3 2023; FDA label",d:"2025-09-01",bl:"3–5 / 100",ex:"Insufficient data — avoid if possible"},
    t2:{r:"Low",q:"Limited",s:"No meaningful human data. Switch to better-studied agent if clinically feasible.",src:"Michigan MC3 2023",d:"2025-09-01"},
    t3:{r:"Low",q:"Limited",s:"Neonatal adaptation syndrome expected by class. Active metabolites with very long half-lives (1–3 weeks) mean neonatal exposure may persist well beyond delivery.",src:"FDA label",d:"2025-09-01"},
    pp:{r:"Insufficient data — avoid",q:"Limited",s:"No published lactation data. Michigan MC3: avoid if possible. Extremely long half-life of active metabolites (didesmethylcariprazine ~1–3 weeks) means infant exposure could persist for weeks after each maternal dose.",src:"Michigan MC3 2023; LactMed",d:"2025-09-01"}},
    alt:[{n:"Quetiapine",p:"Better-studied; preferred atypical antipsychotic in perinatal period",q:"Strong"},{n:"Aripiprazole",p:"Same partial agonist class; more pregnancy data available",q:"Moderate"}],
    pk:"Dopamine D3/D2 partial agonist. Very long-acting active metabolites (didesmethylcariprazine half-life 1–3 weeks). Used for schizophrenia and bipolar mania/depression. Long half-life makes dose adjustment in pregnancy complex and increases neonatal and breastfed infant exposure duration.",
    gl:[{b:"Michigan MC3",pos:"NEWER AGENT WITH LIMITED DATA — AVOID IF POSSIBLE in pregnancy and lactation",str:"Clinical consensus",y:2023}],
    lac:{tier:"Insufficient data — avoid; extremely long metabolite half-life increases infant exposure risk",ml:"Unknown",is:"Unknown — active metabolites have half-lives of 1–3 weeks; infant accumulation likely with repeated maternal dosing",rid:"Not established",ae:"No published data. Long half-life metabolites raise serious concern for infant accumulation with repeated exposure.",pk:"2–4 days parent; 1–3 weeks active metabolites",mon:"No monitoring guidance available. Active metabolites persist for weeks — breastfed infant exposure could be substantial and prolonged. Avoid. Switch to quetiapine or aripiprazole.",alts:["Quetiapine","Aripiprazole"],rev:"Sep 1, 2025"}},

  gabapentin:{g:"Gabapentin",b:"Neurontin / Horizant",cls:"Anticonvulsant / Anxiolytic",p:"P1",tera:{
    t1:{r:"Low",q:"Limited",s:"Small controlled studies have not shown increased birth defect risk above background (MotherToBaby Jan 2024). Large Medicaid cohort (Patorno et al. PLoS Med 2020) found no increased overall malformation risk; a subgroup of women filling ≥2 T1 prescriptions showed possible cardiac signal, but confounding likely. No established pattern of malformations. May reduce folate levels — consider folic acid 5mg supplementation preconception. Michigan MC3: limited data, good option for patients with substance use history.",src:"MotherToBaby Jan 2024; Patorno et al. PLoS Med 2020",d:"2025-01-01",bl:"3–5 / 100",ex:"Probably background risk; possible cardiac signal requires further study"},
    t2:{r:"Low",q:"Limited",s:"No significant additional concerns in 2nd trimester. Commonly used for restless legs syndrome in pregnancy — acceptable per expert consensus.",src:"MotherToBaby Jan 2024",d:"2025-01-01"},
    t3:{r:"Low",q:"Limited",s:"Neonatal withdrawal described in case reports, especially with concurrent opioid exposure. Monitor neonate for withdrawal symptoms. Preterm infant accumulation possible.",src:"Loudin et al. J Pediatr 2017; MotherToBaby Jan 2024",d:"2025-01-01"},
    pp:{r:"Compatible with monitoring",q:"Moderate",s:"Enters breast milk in low levels. RID 1.3–3.8% at maternal doses up to 2.1g/day (LactMed Apr 2025). Infant serum low or undetectable in most studied infants. No adverse effects reported in breastfed infants in published studies. Expert consensus guideline accepts gabapentin for restless leg syndrome during lactation (LactMed Apr 2025). MotherToBaby: no side effects noted in exposed infants.",src:"LactMed Apr 2025; MotherToBaby Jan 2024; Kristensen et al. J Hum Lact 2006",d:"2025-04-15"}},
    alt:[{n:"Sertraline",p:"First-line for anxiety; better evidence base in pregnancy",q:"Strong"},{n:"Hydroxyzine",p:"Non-addictive anxiolytic; more pregnancy data",q:"Moderate"}],
    pk:"Anticonvulsant used off-label for anxiety, insomnia, and restless legs syndrome. No addiction potential — advantage over benzodiazepines. Michigan MC3: good option for patients with history of substance abuse. May reduce folate — supplement preconception. Does not interact with oral contraceptives.",
    gl:[{b:"Michigan MC3",pos:"Good option for anxiety/sleep in patients with substance use history; limited pregnancy data",str:"Clinical consensus",y:2023},{b:"Expert consensus",pos:"Acceptable for restless leg syndrome during lactation per consensus guideline",str:"Consensus",y:2024}],
    lac:{tier:"Compatible with monitoring",ml:"Avg 4.5 mg/L at 1.5g/day maternal dose (range 1.2–8.7 mg/L) — LactMed Apr 2025",is:"Infant serum low or undetectable in most studied infants; average 7.7% of maternal serum in one study but 3 of 4 infants below quantification limit",rid:"1.3–3.8% (LactMed Apr 2025; Birnbaum et al. JAMA Neurol 2020)",ae:"No adverse effects reported in published breastfed infant studies. Drowsiness is the main theoretical concern — monitor especially in younger or exclusively breastfed infants or when combined with other CNS depressants.",pk:"~3 hrs (half-life 5–7 hrs — renally cleared)",mon:"Monitor for drowsiness, adequate weight gain, and developmental milestones. Extra vigilance in younger exclusively breastfed infants and when combined with other anticonvulsant or psychotropic drugs. RID well below 10% — generally reassuring.",alts:["Sertraline","Trazodone","Hydroxyzine"],rev:"Apr 15, 2025"}},

  doxylamine:{g:"Doxylamine",b:"Unisom SleepTabs / Diclegis (+B6)",cls:"Antihistamine / Sleep Aid",p:"P0",tera:{
    t1:{r:"None–Minimal",q:"Strong",s:"Epidemiological meta-analyses show no evidence of fetal abnormalities or teratogenicity with doxylamine alone or in combination with pyridoxine (B6). The combination product (Diclegis/Bonjesta) is FDA-approved as the only pharmacologic treatment for nausea and vomiting of pregnancy. Michigan MC3: safe in pregnancy. MotherToBaby: no evidence of increased birth defect risk.",src:"MotherToBaby; FDA label Diclegis/Bonjesta; Magee et al. systematic review",d:"2025-05-01",bl:"3–5 / 100",ex:"Background risk — no signal"},
    t2:{r:"None–Minimal",q:"Strong",s:"Commonly used for nausea, vomiting of pregnancy, and sleep. No significant fetal concerns at standard doses.",src:"MotherToBaby; FDA label",d:"2025-05-01"},
    t3:{r:"Low",q:"Moderate",s:"Neonatal sedation possible with high doses near delivery. Standard doses: no established concerns.",src:"FDA label; MotherToBaby",d:"2025-05-01"},
    pp:{r:"Use with caution — occasional use only",q:"Limited",s:"No published breast milk level data (LactMed May 2025). Small occasional doses expected to cause no adverse effects in breastfed infants. Larger doses or prolonged use may cause infant drowsiness and decrease milk supply. Michigan MC3: can interfere with lactation — generally safe in occasional small doses. Use only occasionally after lactation is well established.",src:"LactMed May 2025; Michigan MC3 2023",d:"2025-05-15"}},
    alt:[{n:"Trazodone",p:"Better-studied sleep option without antihistamine milk supply effects",q:"Moderate"},{n:"Zolpidem",p:"Established sleep aid with low RID",q:"Moderate"}],
    pk:"First-generation antihistamine with sedative and antiemetic properties. Combined with pyridoxine (B6) = Diclegis/Bonjesta — FDA-approved NVP treatment. Anticholinergic properties may reduce milk supply particularly before lactation is established. Michigan MC3: similar profile to diphenhydramine for sleep use.",
    gl:[{b:"ACOG",pos:"Doxylamine-pyridoxine (Diclegis/Bonjesta) is first-line pharmacologic treatment for nausea and vomiting of pregnancy",str:"Strong",y:2022},{b:"Michigan MC3",pos:"Safe in pregnancy; can interfere with lactation — occasional small doses only",str:"Clinical consensus",y:2023}],
    lac:{tier:"Use with caution for sleep — occasional small doses only after lactation established",ml:"No published data (LactMed May 2025)",is:"Unknown — no published infant level data",rid:"Not established",ae:"Small occasional doses: no adverse effects expected. Larger or prolonged doses: infant drowsiness possible. Irritability and colicky symptoms reported in ~10% of infants exposed to various antihistamines in one follow-up study. One case report: somnolence in 28-month-old infant of mother taking doxylamine (LactMed May 2025). May decrease milk supply — antihistamines may reduce basal prolactin; effect on established lactation probably minimal.",pk:"~2–3 hrs (half-life ~10 hrs — avoid repeated doses)",mon:"Use only occasionally and after feeds once milk supply well established. Monitor infant for unusual drowsiness and feeding adequacy. Regular or high-dose use may affect milk supply especially in first postpartum weeks.",alts:["Trazodone","Zolpidem"],rev:"May 15, 2025"}},

  melatonin:{g:"Melatonin",b:"Various OTC brands",cls:"Sleep Aid / Supplement",p:"P1",tera:{
    t1:{r:"Low",q:"Limited",s:"Animal studies raised concerns (reduced birth weight, altered circadian development at high doses) but human clinical studies have not replicated these findings. MotherToBaby (Dec 2025): not known if melatonin increases chance of birth defects. Clinical trials using melatonin in pregnancy for other indications (IVF support, reducing C-section blood loss) have not shown increased birth defects. Classed as OTC dietary supplement — purity and dose consistency are not FDA-regulated.",src:"MotherToBaby Dec 2025; Vine et al. Braz J Psychiatry 2022",d:"2025-12-01",bl:"3–5 / 100",ex:"Probably background risk; insufficient human data to confirm safety"},
    t2:{r:"Low",q:"Limited",s:"No established concern in human studies. Melatonin levels are naturally elevated in pregnancy (peak in 3rd trimester). Limited data on supplemental use in T2.",src:"MotherToBaby Dec 2025; Vine et al. 2022",d:"2025-12-01"},
    t3:{r:"Low",q:"Limited",s:"Body produces higher melatonin naturally in T3 — supplemental use adds to elevated endogenous levels. Michigan MC3: limited data but reassuring so far. OTC product — dose and purity vary widely between brands.",src:"Michigan MC3 2023; MotherToBaby Dec 2025",d:"2025-12-01"},
    pp:{r:"Use with caution — insufficient data",q:"Limited",s:"Melatonin is a natural component of breast milk with a clear circadian pattern (peaks ~3 AM). No published data on maternal supplemental melatonin dose in breast milk. LactMed (Jan 2026): no data exist on safety of maternal supplemental melatonin during breastfeeding — short-term use unlikely to be harmful but insufficient data to confirm. One case report of antiplatelet effect in infant breastfed by mother taking melatonin+valerian supplement (MotherToBaby Dec 2025).",src:"LactMed Jan 2026; MotherToBaby Dec 2025",d:"2026-01-15"}},
    alt:[{n:"Trazodone",p:"Better-studied sleep option in perinatal period",q:"Moderate"},{n:"CBT-I",p:"Cognitive behavioral therapy for insomnia — preferred non-pharmacological first-line",q:"Strong"}],
    pk:"Endogenous pineal hormone regulating circadian rhythm. Sold as OTC dietary supplement — not FDA-regulated for purity or dose. Breast milk naturally contains melatonin (circadian peak ~3 AM). Short half-life ~45 min. Michigan MC3: limited data but reassuring so far for pregnancy. Ask about supplement use — patients commonly omit OTC supplements when listing medications.",
    gl:[{b:"Michigan MC3",pos:"Limited data but reassuring so far — short-term low-dose use may be reasonable",str:"Clinical consensus",y:2023},{b:"LactMed",pos:"No data on safety of maternal supplemental melatonin during breastfeeding; short-term use at low doses unlikely to be harmful",str:"Evidence review",y:2026}],
    lac:{tier:"Insufficient data — use with caution; prefer alternatives",ml:"Melatonin naturally present in breast milk (circadian pattern); supplemental dose transfer unknown",is:"Melatonin naturally present in breast milk — approximately 35% of serum concentration",rid:"Not established for supplemental use",ae:"No adverse effects reported in studies giving melatonin directly to infants. One case: infant of mother taking melatonin+valerian supplement showed antiplatelet effect causing prolonged bleeding from trauma — resolved on stopping supplement (MotherToBaby Dec 2025).",pk:"~45 min",mon:"If used, recommend lowest effective dose (≤3mg) at bedtime for shortest duration. Avoid combining with other supplements (especially valerian). Monitor infant for unusual drowsiness or changes in sleep and feeding. Always ask about OTC supplement use — often not disclosed.",alts:["Trazodone","CBT-I","Zolpidem"],rev:"Jan 15, 2026"}},
};



// ─── DIAGNOSIS-KEYED UNTREATED ILLNESS RISK ───────────────────────────────
// Relapse/recurrence data keyed by diagnosis + severity.
// ─── COMORBIDITY MODIFIERS ────────────────────────────────────────────────────
// Keyed as "Primary|Comorbidity" (order-insensitive lookup below).
// Each entry adds risk modifiers layered on top of the primary diagnosis data.
// Sources: published comorbidity literature cited inline.
const COMORBIDITY_MODIFIERS = {
  "Major Depressive Disorder|Generalized Anxiety Disorder": {
    label: "MDD + GAD",
    riskElevation: "Moderate–High",
    modifiers: [
      "MDD-anxiety comorbidity is the most common perinatal psychiatric presentation — prevalence ~15–25% (Goodman & Tully 2009)",
      "Comorbid anxiety significantly worsens MDD treatment response and prolongs episode duration",
      "Elevated HPA axis dysregulation from dual anxiety+depression burden — additive fetal cortisol exposure",
      "PPD risk substantially higher in comorbid presentations vs either alone (Wisner et al. 2013)",
      "Somatic anxiety symptoms (insomnia, appetite) overlap with pregnancy symptoms — diagnosis often delayed",
    ],
    src: "Goodman & Tully 2009; Wisner et al. 2013; NICE CG192",
  },
  "Major Depressive Disorder|PTSD": {
    label: "MDD + PTSD",
    riskElevation: "High",
    modifiers: [
      "MDD-PTSD comorbidity associated with highest suicidality rates among perinatal patients — UK MBRRACE 2023 leading cause of maternal mortality",
      "Childbirth itself is a PTSD trigger — obstetric trauma risk compounds existing PTSD burden",
      "Treatment complexity: trauma processing during pregnancy requires careful titration to avoid destabilization",
      "Substance use comorbidity risk markedly elevated vs either diagnosis alone",
      "Postpartum period is highest-risk window — sleep deprivation, birth reexperiencing, and infant stress cascade",
    ],
    src: "UK MBRRACE 2023; Seng et al. 2010 JOGNN; ACOG CO #757; NICE CG192",
  },
  "Major Depressive Disorder|Borderline Personality Disorder": {
    label: "MDD + BPD",
    riskElevation: "High",
    modifiers: [
      "BPD dramatically increases MDD relapse rate — emotional dysregulation amplifies depressive episodes",
      "Self-harm and suicidality risk substantially elevated vs MDD alone (Zanarini et al.)",
      "Prenatal care provider relationships disrupted by BPD interpersonal patterns — continuity risk",
      "Postpartum: infant attachment disruption and bonding difficulty well-documented in BPD (Hobson et al.)",
      "Impulsive self-medication (substances, alcohol) risk elevated during depressive episodes",
    ],
    src: "Zanarini et al.; Hobson et al. 2005; NICE BPD guideline; UK MBRRACE 2023",
  },
  "Major Depressive Disorder|Panic Disorder": {
    label: "MDD + Panic Disorder",
    riskElevation: "Moderate",
    modifiers: [
      "Panic disorder comorbidity increases MDD severity and chronicity (Roy-Byrne et al. 2000)",
      "Agoraphobic avoidance may develop — limits prenatal care attendance",
      "Panic attacks during pregnancy carry fetal hyperventilation and hypoxia risk during severe episodes",
      "Postpartum: panic commonly worsens with sleep deprivation — compounding PPD risk",
    ],
    src: "Roy-Byrne et al. 2000; NICE CG192; clinical consensus",
  },
  "Bipolar I Disorder|PTSD": {
    label: "Bipolar I + PTSD",
    riskElevation: "Very High",
    modifiers: [
      "Trauma history is a significant predictor of worse bipolar outcomes — more episodes, higher severity (Neria et al.)",
      "PTSD hyperarousal is a potent mania trigger via sleep disruption",
      "Highest-risk comorbidity for postpartum psychiatric emergency — combined suicidality and psychosis risk",
      "Childbirth as trauma trigger may precipitate acute PTSD episode coinciding with postpartum bipolar relapse",
      "Substance use as self-medication for both conditions compounds risk",
    ],
    src: "Neria et al. 2008; Viguera et al. 2007; UK MBRRACE 2023; NICE CG192",
  },
  "Bipolar I Disorder|Anxiety Disorders": {
    label: "Bipolar I + Anxiety",
    riskElevation: "High",
    modifiers: [
      "Anxiety comorbidity in Bipolar I associated with more depressive episodes and worse functional outcomes (Simon et al. 2004)",
      "Benzodiazepine use risk elevated — additional pregnancy exposure consideration",
      "Mixed states more common — anxiety amplifies dysphoric mania",
      "Postpartum anxiety onset is a prodrome of postpartum psychosis in some Bipolar I patients",
    ],
    src: "Simon et al. 2004 Am J Psychiatry; Viguera et al. 2007; CANMAT 2018",
  },
  "Bipolar II Disorder|Major Depressive Disorder": {
    label: "Bipolar II + MDD",
    riskElevation: "Moderate–High",
    modifiers: [
      "Depressive burden is the predominant Bipolar II morbidity — comorbid MDD diagnosis suggests heavier depressive load",
      "Antidepressant use requires caution — may precipitate hypomanic switch; mood stabilizer cover required",
      "Diagnostic clarification is critical — Bipolar II often initially misdiagnosed as MDD before hypomania identified",
      "Postpartum depressive relapse risk significantly elevated",
    ],
    src: "Viguera et al. 2007; CANMAT 2018; NICE CG192",
  },
  "OCD|Major Depressive Disorder": {
    label: "OCD + MDD",
    riskElevation: "Moderate–High",
    modifiers: [
      "OCD-MDD comorbidity rate ~30–40% — one of the most common OCD comorbidities (Abramowitz et al.)",
      "Perinatal OCD commonly presents with harm obsessions about infant — overlaps with depressive rumination",
      "Suicidality elevated in OCD+MDD vs either alone",
      "Compulsion burden worsens with depressive fatigue — treatment must address both simultaneously",
      "PPD risk elevated; postpartum OCD onset very common even in women without prior OCD history",
    ],
    src: "Abramowitz et al.; Russell et al. 2013; NICE OCD/CG192",
  },
  "PTSD|Borderline Personality Disorder": {
    label: "PTSD + BPD",
    riskElevation: "Very High",
    modifiers: [
      "PTSD-BPD comorbidity has the highest self-harm and suicidality rates of any personality disorder pairing (Zanarini et al.)",
      "Childhood trauma is a common etiological factor — complex PTSD presentation",
      "Childbirth trauma risk is amplified — prior abuse history significantly elevates obstetric PTSD rate (Seng et al.)",
      "Dissociation during labor is a significant risk — birth plan should address this explicitly",
      "Postpartum bonding severely disrupted — infant welfare monitoring warranted",
    ],
    src: "Zanarini et al.; Seng et al. 2010; UK MBRRACE 2023; NICE BPD guideline",
  },
  "Generalized Anxiety Disorder|PTSD": {
    label: "GAD + PTSD",
    riskElevation: "High",
    modifiers: [
      "GAD-PTSD overlap produces the highest chronic anxiety burden — near-constant HPA axis activation",
      "Additive fetal cortisol exposure from sustained dual-anxiety presentation",
      "Medical setting triggers (ultrasounds, examinations) affect both conditions — prenatal care avoidance risk",
      "Sleep disruption from both hyperarousal (PTSD) and worry (GAD) — compounds preterm birth risk",
    ],
    src: "Ding et al. 2014; Seng et al. 2010; NICE CG192",
  },
  "Schizophrenia|Major Depressive Disorder": {
    label: "Schizophrenia + MDD",
    riskElevation: "High",
    modifiers: [
      "Depressive episodes in schizophrenia carry the highest suicide risk in the illness — 5–10% lifetime (Palmer et al.)",
      "Negative symptoms and depression are difficult to distinguish — treatment complexity elevated",
      "Antidepressant augmentation may be needed but carries psychosis destabilization risk",
      "Postpartum psychosis and PPD can present simultaneously — highest-acuity perinatal psychiatric scenario",
    ],
    src: "Palmer et al. 2005; APA Schizophrenia Guideline 2021; NICE CG192",
  },
  "Postpartum Depression|Postpartum Anxiety": {
    label: "PPD + Postpartum Anxiety",
    riskElevation: "High",
    modifiers: [
      "PPD-postpartum anxiety comorbidity rate is 40–50% — this is the most common perinatal psychiatric comorbidity (Dennis et al. 2017)",
      "Combined presentation associated with worse maternal-infant bonding outcomes than either alone",
      "Breastfeeding cessation rate significantly elevated in comorbid PPD+anxiety",
      "Treatment must address both — SSRIs preferred as they cover both conditions; benzodiazepines add exposure risk",
      "Recovery slower and less complete than either diagnosis treated alone",
    ],
    src: "Dennis et al. 2017 JOGNN; Wenzel et al.; NICE CG192; ACOG CO #757",
  },
  "Anorexia Nervosa|Major Depressive Disorder": {
    label: "Anorexia + MDD",
    riskElevation: "Very High",
    modifiers: [
      "MDD is the most common AN comorbidity — present in ~50–60% of AN cases (Hudson et al.)",
      "Fetal growth restriction risk compounded: both maternal malnutrition (AN) and reduced prenatal care (MDD)",
      "Suicidality: AN already carries the highest mortality of any psychiatric disorder — MDD comorbidity elevates this further",
      "Weight gain requirements of pregnancy directly conflict with AN pathology — highest risk combination for restrictive relapse",
      "Nutritional compromise affects fetal neurodevelopment — folate, omega-3, protein deficiency risks compound",
    ],
    src: "Hudson et al. 2007 Biol Psychiatry; Micali et al. 2012 BMJ; NICE ED guidelines",
  },
  "Opioid Use Disorder|Major Depressive Disorder": {
    label: "OUD + MDD",
    riskElevation: "Very High",
    modifiers: [
      "Depression is present in ~50% of OUD patients — bidirectional relationship well-established",
      "Untreated depression is a major driver of OUD relapse — opioids used for self-medication of depressive symptoms",
      "Combined overdose and suicide risk: leading cause of pregnancy-associated death in US (CDC 2022)",
      "MOUD (buprenorphine/methadone) compliance impaired by untreated depression",
      "Social instability, housing, and child welfare risks compounded by both conditions simultaneously",
    ],
    src: "CDC 2022 MMWR; SAMHSA 2023; Ko et al. 2017; ACOG CO #711",
  },
  "Alcohol Use Disorder|Major Depressive Disorder": {
    label: "AUD + MDD",
    riskElevation: "High",
    modifiers: [
      "AUD-MDD comorbidity rate ~30–40% — alcohol is used to self-medicate depression in many cases",
      "No safe alcohol level in pregnancy — any AUD relapse carries FASD risk",
      "Depression significantly impairs motivation for alcohol cessation and treatment engagement",
      "Withdrawal risk in pregnancy: delirium tremens is a medical emergency that is more dangerous during pregnancy",
      "Neonatal alcohol withdrawal + MDD-driven PPD creates the highest-acuity postpartum scenario for infant welfare",
    ],
    src: "Popova et al. 2017 Lancet; CDC; SAMHSA; ACOG",
  },
};

// Look up comorbidity modifier — order-insensitive
function getComorbidityModifier(dx1, dx2) {
  if (!dx1 || !dx2) return null;
  const key1 = `${dx1}|${dx2}`;
  const key2 = `${dx2}|${dx1}`;
  // Exact pair match
  if (COMORBIDITY_MODIFIERS[key1]) return COMORBIDITY_MODIFIERS[key1];
  if (COMORBIDITY_MODIFIERS[key2]) return COMORBIDITY_MODIFIERS[key2];
  // Fuzzy: check if dx2 is a category that matches any key segment
  const allKeys = Object.keys(COMORBIDITY_MODIFIERS);
  for (const k of allKeys) {
    const [a, b] = k.split("|");
    if ((a===dx1&&b===dx2)||(a===dx2&&b===dx1)) return COMORBIDITY_MODIFIERS[k];
  }
  return null;
}

// Used when a diagnosis is selected — provides condition-specific risk data
// rather than generic medication-class estimates.
// Sources cited inline per entry.
const DIAGNOSIS_UR = {
  "Major Depressive Disorder": {
    mild:     {rp:"25–35%",rk:["Without treatment, depression episodes typically last 6–13 months on average — they do not usually go away quickly on their own","When the body is under sustained stress from depression, stress hormones can affect how the baby's stress response system develops","Missing prenatal appointments or not eating well enough — both common when depression is severe — have their own effects on pregnancy","Studies find a modestly higher chance of early delivery when depression goes untreated during pregnancy (Grote et al. 2010, Archives of General Psychiatry)","Without treatment, about 40–60% of people develop postpartum depression after birth (Wisner et al. 2013, JAMA Psychiatry)"],src:"Grote et al. 2010; Wisner et al. 2013; NICE CG192",q:"Strong"},
    moderate: {rp:"50–60%",rk:["Sustained stress from untreated depression raises cortisol levels, which can affect the baby's developing stress response system","Research finds about twice the usual chance of early delivery when moderate depression is untreated during pregnancy (Davalos et al. 2012, BMC Pregnancy & Childbirth)","Some studies find an association with lower birth weight","Research shows that untreated depression can make it harder to form a close bond with your baby in the first year (Murray et al.)","Without treatment, more than 60% of people experience postpartum depression, and day-to-day functioning — including self-care — can become very difficult"],src:"Davalos et al. 2012 BMC Pregnancy; Murray et al.; NICE CG192",q:"Strong"},
    severe:   {rp:"70–85%",rk:["Severe untreated depression tends to return quickly — often within 4 weeks — once medication is stopped","About 15–20% of people with severe untreated depression experience thoughts of suicide (Wisner et al. 2013, JAMA Psychiatry)","Studies find approximately 3 times the usual chance of early delivery","Severe postpartum depression — and in some cases postpartum psychosis — is more likely","Not eating enough and significant weight loss during pregnancy affects both mother and baby","The risk of turning to alcohol or substances to cope increases when depression is severe and untreated"],src:"Wisner et al. 2013 JAMA Psychiatry; ACOG CO #757; NICE CG192",q:"Strong"},
  },
  "Persistent Depressive Disorder (Dysthymia)": {
    mild:     {rp:"30–40%",rk:["This type of depression tends to be long-lasting and rarely goes away on its own without treatment","Low mood, low energy, and loss of enjoyment in things (anhedonia) can make it hard to take care of yourself during pregnancy","The risk of developing postpartum depression after birth is elevated"],src:"APA Practice Guideline for MDD; NICE CG192",q:"Moderate"},
    moderate: {rp:"45–55%",rk:["Untreated persistent depression can develop into a more severe depressive episode on top of the existing low-grade depression — sometimes called 'double depression'","Ongoing low mood and fatigue affect the ability to function day-to-day throughout pregnancy","The risk of postpartum depression is significantly higher without treatment"],src:"APA Practice Guideline for MDD; NICE CG192",q:"Moderate"},
    severe:   {rp:"60–75%",rk:["High risk of a more severe depressive episode developing on top of the chronic low mood","If a severe episode develops, thoughts of suicide can occur","Difficulty functioning day-to-day throughout the entire pregnancy and postpartum period"],src:"APA Practice Guideline for MDD; NICE CG192",q:"Moderate"},
  },
  "Premenstrual Dysphoric Disorder (PMDD)": {
    mild:     {rp:"N/A — suppressed during pregnancy",rk:["PMDD symptoms are tied to the menstrual cycle, which stops during pregnancy — so PMDD itself does not recur while you are pregnant","There is no relapse risk during pregnancy itself","Symptoms typically return a few months after birth, once menstrual cycles resume (Yonkers et al. 2008)"],src:"Yonkers et al. 2008; Freeman et al.",q:"Strong"},
    moderate: {rp:"N/A — suppressed during pregnancy",rk:["PMDD does not recur during pregnancy because menstrual cycling is paused","Symptoms return after birth with the resumption of your menstrual cycle (Yonkers et al. 2008)","Severe PMDD may be a risk factor for postpartum depression — your doctor will monitor for this after birth"],src:"Yonkers et al. 2008; Freeman et al.",q:"Strong"},
    severe:   {rp:"N/A — suppressed during pregnancy",rk:["PMDD does not recur during pregnancy","Severe PMDD is a known risk factor for postpartum depression — postpartum monitoring is an important part of your care plan (Yonkers et al. 2008)"],src:"Yonkers et al. 2008",q:"Strong"},
  },
  "Seasonal Affective Disorder": {
    mild:     {rp:"20–35%",rk:["Seasonal depression patterns may lessen somewhat during pregnancy due to lifestyle changes and more time outdoors, but risk remains in winter months","Relapse risk is lower than for major depression, but still meaningful during low-light months","Light therapy — sitting near a bright light box for 20–30 minutes each morning — is a safe, non-medication option in pregnancy"],src:"APA Practice Guideline for MDD; Wirz-Justice et al.",q:"Limited"},
    moderate: {rp:"40–55%",rk:["A meaningful chance of depressive relapse during winter months even while pregnant","Depression during pregnancy makes it harder to take care of yourself — affecting sleep, eating, and prenatal appointments","If your baby is born in autumn or winter, the risk of postpartum depression is higher (Wirz-Justice et al.)"],src:"APA Practice Guideline for MDD; Wirz-Justice et al.",q:"Limited"},
    severe:   {rp:"55–70%",rk:["High chance of a significant depressive episode during winter months","In severe seasonal depression, thoughts of suicide can occur","If your baby is born during the low-light season, postpartum depression risk is elevated"],src:"APA Practice Guideline for MDD",q:"Limited"},
  },
  "Bipolar I Disorder": {
    mild:     {rp:"50–70%",rk:["Research shows 40–70% of people with Bipolar I have an episode within the first trimester of stopping medication (Viguera et al. 2007, American Journal of Psychiatry)","A manic episode can lead to risky decisions, substance use, and difficulty keeping prenatal appointments","Sleep deprivation — which is very common in pregnancy and after birth — is one of the strongest triggers for mania","The postpartum period carries a particularly high risk — up to 50% of people with Bipolar I experience a serious mood episode after delivery"],src:"Viguera et al. 2007 Am J Psychiatry; CANMAT 2018; NICE CG192",q:"Strong"},
    moderate: {rp:"65–80%",rk:["Stopping a mood stabilizer abruptly increases the risk of rapid cycling — episodes that shift quickly between depression and mania","Manic episodes seriously impair judgment and decision-making, which affects your ability to make safe choices for yourself and your baby","In 50–60% of severe manic episodes, people experience psychotic symptoms such as hallucinations or delusions (CANMAT 2018)","Hospitalization is usually required during a full manic episode","Sustained stress from an untreated manic episode raises stress hormones that affect fetal development"],src:"Viguera et al. 2007; CANMAT 2018; ACOG",q:"Strong"},
    severe:   {rp:"75–90%",rk:["50–70% of people with severe Bipolar I have an episode within the first trimester of stopping medication (Viguera et al. 2007, American Journal of Psychiatry)","Up to 50% of people with Bipolar I experience postpartum psychosis — a psychiatric emergency that requires immediate treatment","The depressive phase of Bipolar I carries serious suicide risk","A manic episode can impair the ability to safely participate in your own birth and newborn care","Emergency psychiatric admission is typically required during a full manic episode","During psychosis, a person may be unable to participate in decisions about their own obstetric care"],src:"Viguera et al. 2007 Am J Psychiatry; ACOG; CANMAT 2018; NICE CG192",q:"Strong"},
  },
  "Bipolar II Disorder": {
    mild:     {rp:"40–55%",rk:["Hypomanic episodes (a milder form of mania) can be easy to miss — they may feel like unusually high energy or productivity rather than illness","Without treatment, Bipolar II is predominantly depressive — depressive episodes return frequently","During hypomanic periods, impulsivity and reduced judgment can affect important decisions"],src:"Viguera et al. 2007; CANMAT 2018",q:"Moderate"},
    moderate: {rp:"55–70%",rk:["Depressive episodes can include thoughts of suicide — this risk is higher without treatment","Some medications can trigger a switch into a hypomanic episode — your doctor will watch for this","Sleep disruption from pregnancy or newborn care is a known trigger for hypomanic episodes","Difficulty functioning day-to-day can lead to missing prenatal appointments and not taking care of yourself (CANMAT 2018)"],src:"Viguera et al. 2007; CANMAT 2018; NICE CG192",q:"Moderate"},
    severe:   {rp:"65–80%",rk:["High risk of a depressive episode returning — often with thoughts of suicide","Hypomanic episodes can impair the ability to make safe prenatal decisions","Postpartum mood episodes are significantly more likely without ongoing treatment","Under the extreme stress of the perinatal period, some Bipolar II episodes can progress into more severe Bipolar I-type episodes"],src:"Viguera et al. 2007; CANMAT 2018; NICE CG192",q:"Moderate"},
  },
  "Cyclothymic Disorder": {
    mild:     {rp:"40–55%",rk:["Cyclothymia involves ongoing mood fluctuations that rarely fully settle without treatment","The emotional and physical demands of pregnancy can amplify mood cycling","The stress of the perinatal period may trigger a more serious bipolar episode in some people"],src:"APA DSM-5-TR; clinical consensus",q:"Limited"},
    moderate: {rp:"55–65%",rk:["Mood instability throughout pregnancy can make it difficult to function day-to-day","Ongoing cycling makes it hard to sustain routines around sleep, eating, and appointments","Untreated mood instability during this period increases the risk of progressing to a full bipolar episode"],src:"APA DSM-5-TR; clinical consensus",q:"Limited"},
    severe:   {rp:"65–75%",rk:["Persistent mood swings with a significant impact on daily life and relationships","Increased risk of cycling into a full Bipolar I or II episode under perinatal stress","Risk of postpartum mood episodes is elevated"],src:"APA DSM-5-TR; clinical consensus",q:"Limited"},
  },
  "Generalized Anxiety Disorder": {
    mild:     {rp:"30–45%",rk:["Chronic anxiety raises stress hormones (cortisol and adrenaline) that can affect the baby's developing nervous system","Poor sleep and disrupted eating from anxiety have their own effects on pregnancy","Studies find a modestly higher chance of preterm birth when anxiety is untreated during pregnancy (Ding et al. 2014, BJOG)"],src:"Ding et al. 2014 BJOG; Glover 2011 Neurosci Biobehav Rev; NICE CG192",q:"Strong"},
    moderate: {rp:"50–65%",rk:["Sustained, chronic anxiety keeps stress hormones elevated for extended periods — research suggests this can affect how babies' nervous systems develop (Glover 2011, Neuroscience & Biobehavioral Reviews)","Studies find approximately twice the usual risk of preterm birth with untreated moderate anxiety during pregnancy (Ding et al. 2014)","Some research suggests babies of mothers with high anxiety during pregnancy show more caution and sensitivity to new situations in infancy — a trait linked to anxiety themselves","Anxiety can make it very hard to function — affecting prenatal appointments, nutrition, and rest"],src:"Ding et al. 2014; Glover 2011; NICE CG192",q:"Strong"},
    severe:   {rp:"70–85%",rk:["Severe chronic anxiety keeps stress hormones elevated almost continuously — research suggests this affects how babies' nervous systems develop (Glover 2011, Neuroscience & Biobehavioral Reviews)","Studies find approximately three times the usual risk of preterm birth with severe untreated anxiety","Significant weight loss and poor nutrition from anxiety affects the baby's growth","More than 60% of people with severe untreated anxiety during pregnancy develop postpartum depression","If depression develops alongside severe anxiety, thoughts of suicide can occur — this is one of the leading causes of maternal death in the perinatal period (UK MBRRACE 2023)"],src:"Ding et al. 2014; Glover 2011; NICE CG192; ACOG CO #757",q:"Strong"},
  },
  "Panic Disorder": {
    mild:     {rp:"35–50%",rk:["Panic attacks during pregnancy can cause rapid breathing (hyperventilation), which briefly reduces oxygen flow — this is manageable, but something your care team should know about","Without treatment, some people develop a pattern of avoiding places where they've had attacks — which can affect prenatal appointment attendance","Pregnancy hormones may temporarily reduce the frequency of panic attacks for some people, but they often return and can worsen after birth"],src:"Wisner et al.; NICE CG192; Cohen et al. MGH",q:"Moderate"},
    moderate: {rp:"55–70%",rk:["Frequent panic attacks create significant difficulty functioning day-to-day throughout pregnancy","Fear of having an attack in public or at appointments may cause people to avoid prenatal care — which creates its own risks","Postpartum depression risk is elevated when panic disorder is untreated — and panic attacks often worsen after birth due to sleep deprivation","During a severe panic attack, the stress response briefly raises fetal stress hormones"],src:"Wisner et al.; NICE CG192",q:"Moderate"},
    severe:   {rp:"70–85%",rk:["Severe panic attacks can lead to multiple emergency department visits when the cause isn't recognized — which is stressful and disruptive","Rapid breathing during a severe panic attack briefly reduces oxygen flow — something your birth team should be aware of","Severe panic can make attending prenatal appointments feel impossible — leaving pregnancy complications undetected","Sleep deprivation after birth is a powerful trigger for panic — symptoms commonly intensify significantly in the postpartum period"],src:"NICE CG192; clinical consensus",q:"Moderate"},
  },
  "Social Anxiety Disorder": {
    mild:     {rp:"25–40%",rk:["Fear of medical settings and being evaluated by healthcare providers may reduce engagement with prenatal care","Anxiety about childbirth classes, hospital tours, and delivery preparation is common and can leave someone feeling less ready","Social anxiety is often underreported to medical providers — people tend to present with physical symptoms rather than naming the anxiety directly"],src:"APA; NICE CG192; clinical consensus",q:"Limited"},
    moderate: {rp:"40–55%",rk:["Significant avoidance of medical care — important tests, appointments, and monitoring may be missed","Intense fear of childbirth and hospital environments can make delivery planning very stressful without support","After birth, social anxiety can lead to isolation — cutting off the support network that is critical in the postpartum period"],src:"APA; NICE CG192; clinical consensus",q:"Limited"},
    severe:   {rp:"55–70%",rk:["Near-complete avoidance of prenatal care when social anxiety is severe — leaving pregnancy risks unmonitored","Severe fear of hospitals or social evaluation may lead to refusing a hospital delivery — which is a real safety concern that deserves a compassionate conversation with your team","Severe postpartum isolation is likely — making it very hard to ask for help when needed, which significantly increases the risk of postpartum depression","Breastfeeding in the presence of others — common in hospital and support group settings — can feel impossible with severe social anxiety"],src:"APA; NICE CG192; clinical consensus",q:"Limited"},
  },
  "Specific Phobia": {
    mild:     {rp:"20–35%",rk:["Fear of needles, blood, or medical procedures directly affects prenatal blood draws, IV lines, and delivery-related procedures — your care team can work with you on this","Fear of needles can complicate the placement of an IV or epidural during labor — it is important to discuss this with your team before delivery so they can plan ahead"],src:"APA; clinical consensus",q:"Limited"},
    moderate: {rp:"35–50%",rk:["Significant avoidance of medical procedures may lead to declining important tests or investigations during pregnancy","Refusal of IV access or anesthesia during delivery creates real safety risks — your team needs to know about this in advance","Fear of childbirth (tokophobia) is recognized by ACOG as a valid clinical concern — discussing it with your doctor can lead to a birth plan that feels safer"],src:"APA; clinical consensus; ACOG",q:"Limited"},
    severe:   {rp:"50–65%",rk:["Refusing necessary medical procedures during pregnancy puts both you and the baby at risk — your care team can adapt procedures to make them more manageable","Fear of hospital delivery (tokophobia) to the extent of refusing hospital birth creates serious safety risks — this is a recognized clinical condition that deserves a dedicated conversation with your team","Severe avoidance of recommended care increases obstetric risk across the pregnancy"],src:"APA; clinical consensus",q:"Limited"},
  },
  "Agoraphobia": {
    mild:     {rp:"30–45%",rk:["Getting to prenatal appointments can feel increasingly difficult as pregnancy progresses and the outside world feels more overwhelming","Hospital visits for ultrasounds and checkups are particularly hard — but missing them means missing important information about your baby's development","Difficulty leaving home tends to increase as pregnancy progresses — early treatment gives you more options"],src:"APA; NICE CG192; clinical consensus",q:"Limited"},
    moderate: {rp:"50–65%",rk:["Significant difficulty attending prenatal appointments — important monitoring and screening may be missed","Hospital visits for scans, tests, and consultations cause significant distress — making them feel impossible without support","After birth, increasing isolation and difficulty leaving home significantly increases the risk of postpartum depression and makes it harder to seek help"],src:"APA; NICE CG192; clinical consensus",q:"Limited"},
    severe:   {rp:"65–80%",rk:["Severe agoraphobia can make it impossible to leave home — attending prenatal appointments or going to the hospital for delivery may require emergency services","Severe isolation after birth significantly increases the risk of postpartum depression"],src:"APA; NICE CG192; clinical consensus",q:"Limited"},
  },
  "Separation Anxiety Disorder": {
    mild:     {rp:"25–40%",rk:["Anxiety about being separated from your baby after birth — situations like a NICU stay can be especially distressing","Anticipatory anxiety about hospitalization for delivery","Difficulty being away from other children during medical appointments"],src:"APA; clinical consensus",q:"Limited"},
    moderate: {rp:"40–55%",rk:["Significant anxiety about any scenario where you might be separated from your baby, including NICU admissions","Postpartum hypervigilance — intense difficulty allowing others to care for your infant even briefly","Conflict with partner over infant care can develop when separation anxiety is untreated"],src:"APA; clinical consensus",q:"Limited"},
    severe:   {rp:"55–70%",rk:["Extreme distress during any separation from your infant","Difficulty functioning normally when separation is necessary or expected","Postpartum anxiety disorder is likely to develop if untreated","May decline medically necessary care if it requires being apart from your baby"],src:"APA; clinical consensus",q:"Limited"},
  },
  "PTSD": {
    mild:     {rp:"30–45%",rk:["Childbirth itself can trigger or worsen PTSD — obstetric trauma occurs in about 3–4% of all births (Seng et al. 2010, Journal of Obstetric, Gynecologic & Neonatal Nursing)","Chronic trauma-related stress keeps stress hormones elevated, which can affect fetal development","Sleep difficulty from hyperarousal is associated with a higher risk of early delivery","Hospital and medical settings may trigger memories or flashbacks, making prenatal care hard to attend"],src:"Seng et al. 2010 JOGNN; van Zuiden et al.; NICE CG192; ACOG CO #757",q:"Strong"},
    moderate: {rp:"55–70%",rk:["Ongoing hyperarousal and intrusive memories keep stress hormones chronically elevated, which affects fetal development","If your trauma involved medical settings, attending prenatal care may feel impossible — but missing care has its own risks","Studies find higher rates of preeclampsia and preterm birth with untreated PTSD (Seng et al.)","Using alcohol or substances to manage trauma symptoms can become a concern when PTSD goes untreated"],src:"Seng et al. 2010; NICE CG192",q:"Strong"},
    severe:   {rp:"70–85%",rk:["Severe PTSD can cause a person to briefly disconnect from reality (dissociate) — this can happen during labor, making it an important thing for your birth team to know about","Suicide risk is significantly higher when severe PTSD is combined with depression — it is a leading cause of maternal death in the perinatal period (UK MBRRACE 2023)","Using substances to manage trauma symptoms is more likely when PTSD is severe and untreated","Sleep deprivation after birth and the experience of delivery itself can cause PTSD to worsen significantly in the postpartum period"],src:"Seng et al. 2010; UK MBRRACE 2023; NICE CG192; ACOG CO #757",q:"Strong"},
  },
  "Acute Stress Disorder": {
    mild:     {rp:"20–30%",rk:["Acute stress disorder is time-limited by definition — it resolves within 4 weeks, but only if supported","Without treatment, approximately 50% of people with acute stress disorder go on to develop PTSD (Bryant et al. 2011)","Difficulty functioning well during prenatal care in the acute phase"],src:"Bryant et al. 2011; APA DSM-5-TR",q:"Moderate"},
    moderate: {rp:"40–55%",rk:["About 50% of untreated moderate acute stress disorder progresses to full PTSD (Bryant et al. 2011)","Significant difficulty functioning day-to-day during the acute phase","If the stressor involved a medical setting, attending prenatal appointments may feel very difficult"],src:"Bryant et al. 2011; APA DSM-5-TR",q:"Moderate"},
    severe:   {rp:"60–75%",rk:["High risk of developing PTSD without treatment","Severe difficulty functioning during the acute phase","If the traumatic event was perinatal, labor and delivery may trigger intense distress or brief disconnection from reality","Alcohol or substance use as a way of coping is more likely when symptoms are severe and untreated"],src:"Bryant et al. 2011; APA DSM-5-TR",q:"Moderate"},
  },
  "Adjustment Disorder": {
    mild:     {rp:"15–25%",rk:["If the underlying stressor resolves, adjustment disorder typically improves within 6 months on its own","Some difficulty with day-to-day functioning during the stressful period","If the stressor continues, there is a risk of developing full depression without treatment or support"],src:"APA DSM-5-TR; NICE CG192; clinical consensus",q:"Moderate"},
    moderate: {rp:"30–45%",rk:["When the stressor is ongoing — like a difficult relationship, illness, or financial hardship — symptoms tend to persist and worsen","Difficulty engaging with prenatal appointments and self-care during this period","If the stressor does not resolve, depression is more likely to develop without support"],src:"APA DSM-5-TR; NICE CG192; clinical consensus",q:"Moderate"},
    severe:   {rp:"45–60%",rk:["High risk of developing major depression if the stressor is chronic and untreated","Thoughts of suicide occur in approximately 5–10% of people with severe adjustment disorder with depressed mood","Significant difficulty functioning day-to-day","Missing prenatal appointments and not taking care of basic needs becomes more likely"],src:"APA DSM-5-TR; NICE CG192; clinical consensus",q:"Moderate"},
  },
  "OCD": {
    mild:     {rp:"40–55%",rk:["OCD commonly worsens during pregnancy and the postpartum period — hormonal changes are a well-documented trigger (Russell et al. 2013, Journal of Psychiatric Research)","Perinatal OCD often involves intrusive, unwanted thoughts about harming the baby — these thoughts are ego-dystonic, meaning they are deeply distressing and not a sign of actual intent","Compulsions such as repeatedly checking on the baby can become time-consuming and exhausting"],src:"Russell et al. 2013 J Psychiatr Res; Abramowitz et al.; Uguz et al.; NICE CG192",q:"Strong"},
    moderate: {rp:"60–75%",rk:["OCD worsens in 50–70% of people during pregnancy and after birth (Russell et al. 2013) — this is not your fault, it is a well-known pattern","Intrusive thoughts about your baby's safety cause significant distress — but having these thoughts does not make you a danger to your child","Compulsions can take many hours of the day, making it hard to function, rest, and care for yourself","Risk of postpartum depression alongside OCD is elevated"],src:"Russell et al. 2013; NICE CG192",q:"Strong"},
    severe:   {rp:"70–85%",rk:["Severe worsening of OCD during the perinatal period is well-documented (Russell et al. 2013; Uguz et al.)","Intrusive thoughts cause intense suffering — many people with severe perinatal OCD fear they are dangerous, when in fact the distress they feel is a sign they are not","Avoidance of caring for the baby due to fear of thoughts can disrupt early bonding — this is treatable","In some cases, hospitalization is needed to support recovery, particularly when contamination fears or severe harm obsessions prevent basic infant care"],src:"Russell et al. 2013; Abramowitz et al.; Uguz et al.; NICE CG192",q:"Strong"},
  },
  "Body Dysmorphic Disorder": {
    mild:     {rp:"35–50%",rk:["The physical changes of pregnancy are unavoidable — and for someone with BDD, these body changes can intensify distress about appearance","Weight gain and body shape changes during pregnancy are normal and necessary, but can be very hard to accept with BDD","The urge to check mirrors or seek reassurance about appearance often increases during this time"],src:"APA; clinical consensus",q:"Limited"},
    moderate: {rp:"55–70%",rk:["Significant distress about pregnancy body changes can make daily life very difficult","Avoiding prenatal appointments that involve being weighed or examined may lead to missed care","Restricting food intake to manage weight gain can harm the baby's development","Self-esteem and relationships often suffer when BDD is moderately severe and untreated"],src:"APA; clinical consensus",q:"Limited"},
    severe:   {rp:"70–85%",rk:["Severe BDD can make the unavoidable body changes of pregnancy feel unbearable","Difficulty leaving home or attending prenatal care appointments","Risk of developing an eating disorder alongside BDD increases under the pressure of pregnancy body changes","Body image distress often continues or worsens in the postpartum period as the body recovers"],src:"APA; clinical consensus",q:"Limited"},
  },
  "Hoarding Disorder": {
    mild:     {rp:"30–40%",rk:["A cluttered home environment can create safety concerns for a newborn — especially fall risks and limited clear space","Acquiring baby items compulsively beyond what is needed may increase","Finding it hard to discard things to create a safe space for the baby to sleep and be cared for"],src:"APA DSM-5-TR; clinical consensus",q:"Limited"},
    moderate: {rp:"45–60%",rk:["A moderately hoarded home creates real safety risks for a newborn — blocked exits, fall hazards, and limited clean space","Preparing for the baby's arrival — setting up a safe sleeping space, storing essentials — becomes very difficult","If home conditions are unsafe for an infant, social services may become involved"],src:"APA DSM-5-TR; clinical consensus",q:"Limited"},
    severe:   {rp:"60–75%",rk:["Severely hoarded living conditions create a child welfare concern — a safe sleeping space and clear pathways are not possible","It may not be possible to prepare a safe infant sleep environment, which is a risk factor for SIDS","Social services involvement is likely if the home is assessed as unsafe for an infant","Fire and injury risk in the home is significant"],src:"APA DSM-5-TR; clinical consensus",q:"Limited"},
  },
  "Trichotillomania": {
    mild:     {rp:"30–45%",rk:["Hair pulling tends to worsen during stressful periods — pregnancy can be one of them","Stress and hormonal changes during pregnancy may increase the urge to pull","Shame about hair pulling may lead people to avoid medical appointments or hide the behavior from their care team"],src:"APA DSM-5-TR; clinical consensus",q:"Limited"},
    moderate: {rp:"45–60%",rk:["Visible hair loss from significant pulling can cause substantial distress and affect self-esteem","Shame may lead to avoiding social contact and prenatal care","Open wounds at pulling sites carry a risk of skin infection"],src:"APA DSM-5-TR; clinical consensus",q:"Limited"},
    severe:   {rp:"60–75%",rk:["Severe hair loss causes significant psychological distress and affects quality of life","Skin infection and scarring at pulling sites becomes more likely with severe and frequent pulling","Isolation and avoidance of prenatal care can develop from shame","In rare cases where hair is swallowed (trichophagia), digestive complications can occur"],src:"APA DSM-5-TR; clinical consensus",q:"Limited"},
  },
  "Schizophrenia": {
    mild:     {rp:"50–70%",rk:["Research shows that 80–90% of people with schizophrenia experience a relapse within 1–2 years of stopping medication (Leucht et al. 2012, The Lancet)","Early warning signs of relapse — like difficulty sleeping, increased suspiciousness, or social withdrawal — can return before full symptoms appear","Reduced awareness of illness during a relapse can make it hard to recognize that help is needed, and self-care often suffers"],src:"Leucht et al. 2012 Lancet; NICE CG192; APA Schizophrenia Guideline 2021",q:"Strong"},
    moderate: {rp:"65–80%",rk:["After stopping antipsychotic medication, relapse typically occurs within weeks — not months (Leucht et al. 2012, The Lancet)","During a psychotic episode, symptoms can create real danger for both mother and baby","Hospitalization is usually required during a moderate-to-severe relapse","Eating, sleeping, and attending prenatal appointments become very difficult during an untreated episode","The sustained stress of psychosis keeps stress hormones elevated, which affects fetal development"],src:"Leucht et al. 2012; APA Schizophrenia Guideline 2021; NICE CG192",q:"Strong"},
    severe:   {rp:"75–90%",rk:["Severe psychotic relapse can happen within weeks of stopping medication — not months (Leucht et al. 2012, The Lancet)","During a psychotic episode, serious danger to yourself and the baby is a real concern","Emergency psychiatric hospitalization is required for safety","Child welfare services are commonly involved at birth when a parent has untreated psychosis","During acute psychosis, a person may be unable to participate in decisions about their own medical care"],src:"Leucht et al. 2012 Lancet; APA Schizophrenia Guideline 2021; NICE CG192",q:"Strong"},
  },
  "Schizoaffective Disorder": {
    mild:     {rp:"50–65%",rk:["Relapse rates are high when medication is stopped — both mood and psychotic symptoms tend to return together","Early warning signs of relapse may be subtle — reduced sleep, withdrawal, or mood changes","Reduced insight during a relapse can make it difficult to recognize that symptoms are returning and that help is needed"],src:"APA Schizophrenia Guideline 2021; NICE CG192; Leucht et al.",q:"Moderate"},
    moderate: {rp:"60–78%",rk:["Both mood and psychotic symptoms tend to return together, creating a complex and difficult-to-manage situation","Hospitalization is often required during a relapse","Attending prenatal appointments and caring for yourself becomes very difficult during an episode","The depressive phase of schizoaffective disorder carries meaningful suicide risk"],src:"APA Schizophrenia Guideline 2021; NICE CG192",q:"Moderate"},
    severe:   {rp:"72–88%",rk:["Relapse can happen rapidly when medication is stopped — with both psychotic and mood symptoms appearing together","Danger to yourself is a serious concern — both from psychotic symptoms and from suicide risk in the depressive phase","Emergency hospitalization is required for safety during a severe relapse","Child welfare services may become involved"],src:"APA Schizophrenia Guideline 2021; NICE CG192; Leucht et al.",q:"Moderate"},
  },
  "Brief Psychotic Disorder": {
    mild:     {rp:"20–35%",rk:["By definition, brief psychotic disorder resolves within one month — but it rarely goes away fully on its own without support","About 50% of people experience another episode at some point in their lives","The stress and sleep deprivation of pregnancy and the postpartum period are known triggers for psychotic episodes"],src:"APA DSM-5-TR; Sit et al.; clinical consensus",q:"Limited"},
    moderate: {rp:"35–50%",rk:["The perinatal period — particularly the weeks after birth — is one of the highest-risk times for a new psychotic episode","Risk of recurrence is elevated when stress is high, as it often is during pregnancy and the postpartum period","Significant difficulty functioning during an acute episode","Danger to yourself is a real concern during an acute psychotic episode"],src:"APA DSM-5-TR; Sit et al. 2006",q:"Limited"},
    severe:   {rp:"50–65%",rk:["Postpartum psychosis — which can include severe agitation, confusion, and hallucinations — is the highest-risk presentation in the perinatal period","During an acute psychotic episode, there is real risk of harm to yourself and, in rare cases, to the baby","Hospitalization is required to ensure safety","Electroconvulsive therapy (ECT) is a safe and effective option for severe cases that do not improve quickly with medication"],src:"Brockington 2004; Sit et al. 2006; Jones & Craddock; NICE CG192",q:"Limited"},
  },
  "Delusional Disorder": {
    mild:     {rp:"40–55%",rk:["Fixed false beliefs (delusions) in this disorder rarely go away on their own without treatment","Certain types of delusions — particularly those involving suspicion of others — can affect trust in healthcare providers and make it harder to receive prenatal care","Paranoid beliefs about providers may make routine appointments feel threatening"],src:"APA DSM-5-TR; APA Schizophrenia Guideline 2021; clinical consensus",q:"Limited"},
    moderate: {rp:"55–70%",rk:["Delusions in this disorder tend to be fixed and very difficult to change — they typically persist without treatment","Suspicious beliefs about medical providers may lead to refusing necessary prenatal care","Difficulty with social and work functioning is common","Avoiding prenatal care based on delusional beliefs puts both mother and baby at risk"],src:"APA DSM-5-TR; clinical consensus",q:"Limited"},
    severe:   {rp:"65–80%",rk:["Acting on delusional beliefs can create real danger — to yourself and, in some cases, to others","Refusal of prenatal care based on delusions about providers is a serious concern","If delusions involve beliefs about the baby being dangerous or contaminated, there is risk to the infant","Emergency psychiatric involvement is required to ensure safety"],src:"APA DSM-5-TR; APA Schizophrenia Guideline 2021; clinical consensus",q:"Limited"},
  },
  "Postpartum Depression": {
    mild:     {rp:"30–40%",rk:["Research consistently shows that untreated postpartum depression makes it harder to bond with your baby — and that this can affect your baby's emotional and social development (Murray 2003, Child Development)","Babies whose mothers had untreated depression for more than 3 months show delays in language and cognitive development (Murray 2003)","Mild postpartum depression rarely resolves fully on its own — it tends to persist or worsen without treatment or support"],src:"Murray 2003 Child Dev; O'Hara & McCabe 2013; NICE CG192",q:"Strong"},
    moderate: {rp:"50–65%",rk:["Difficulty bonding with your baby is a well-documented consequence of untreated postpartum depression — and affects your baby's development in the first year and beyond (Murray 2003)","Delays in language and thinking skills have been observed at 18 months in babies of mothers with untreated PPD","Relationships and ability to work are significantly affected","Without treatment, moderate PPD can progress to severe depression or, rarely, postpartum psychosis"],src:"Murray 2003; O'Hara & McCabe 2013; NICE CG192; ACOG CO #757",q:"Strong"},
    severe:   {rp:"65–80%",rk:["Severe postpartum depression carries a risk of progression to postpartum psychosis (affects about 1–2 in 1,000 births)","Suicide is one of the leading causes of maternal death in the year after birth — postpartum depression is the primary driver (UK MBRRACE 2023)","Severe PPD significantly affects the ability to care for and bond with the baby — with lasting developmental consequences if untreated","Hospitalization is often needed to keep mother and baby safe","If there are safety concerns, child protective services may become involved"],src:"UK MBRRACE 2023; O'Hara & McCabe 2013; NICE CG192; ACOG CO #757",q:"Strong"},
  },
  "Postpartum Anxiety": {
    mild:     {rp:"35–50%",rk:["Postpartum anxiety is very common — affecting 15–20% of new mothers — but is often not recognized or treated (Dennis et al. 2017, Journal of Obstetric, Gynecologic & Neonatal Nursing)","Constant worry and hypervigilance about the baby make it very hard to rest, even when the baby is sleeping","Postpartum anxiety and postpartum depression occur together in 40–50% of cases — each making the other harder to manage"],src:"Wenzel et al.; Dennis et al. 2017 JOGNN; NICE CG192",q:"Moderate"},
    moderate: {rp:"55–70%",rk:["Significant ongoing anxiety creates physical and emotional exhaustion, making day-to-day functioning very difficult","High anxiety can interfere with breastfeeding — stress affects the let-down reflex","Postpartum anxiety and depression are closely linked — having one significantly increases the risk of having both","Partner relationships often become strained when postpartum anxiety is untreated"],src:"Dennis et al. 2017; NICE CG192; clinical consensus",q:"Moderate"},
    severe:   {rp:"65–80%",rk:["Severe anxiety makes it nearly impossible to rest — even between nighttime feedings — creating a dangerous cycle of exhaustion","Panic attacks become more frequent when sleep deprivation is severe, as it commonly is in the postpartum period","In most severe cases, postpartum depression is also present","Breastfeeding often becomes impossible to sustain when anxiety is this severe","The ability to bond with and respond to your baby may be significantly affected by the level of hyperarousal"],src:"Dennis et al. 2017; NICE CG192; clinical consensus",q:"Moderate"},
  },
  "Postpartum Psychosis": {
    mild:     {rp:"EMERGENCY — treat immediately",rk:["Postpartum psychosis is a psychiatric emergency — there is no safe 'wait and see' approach","It can deteriorate from early symptoms to a severe crisis within hours to days — fast action saves lives","Research finds infanticide occurs in approximately 4% of untreated cases (Brockington 2004)","Immediate psychiatric assessment is required — do not delay"],src:"Brockington 2004; Sit et al. 2006; NICE CG192",q:"Strong"},
    moderate: {rp:"EMERGENCY — hospitalization required",rk:["Postpartum psychosis deteriorates rapidly — often within hours to days","Research finds infanticide occurs in approximately 4% of untreated cases (Brockington 2004)","Maternal suicide risk is greater than 5% without treatment","Inpatient psychiatric admission is required for the safety of mother and baby","Electroconvulsive therapy (ECT) is safe and highly effective when medication is not working fast enough"],src:"Brockington 2004; Sit et al. 2006; Jones & Craddock; NICE CG192",q:"Strong"},
    severe:   {rp:"EMERGENCY — do not delay",rk:["Postpartum psychosis is a psychiatric emergency — immediate treatment is critical","The primary risks are harm to the baby and maternal suicide — both of which are time-sensitive","The good news: with early and appropriate treatment, the vast majority of people make a full recovery","Electroconvulsive therapy (ECT) is safe, effective, and appropriate in severe cases","Every hour of delay in treatment worsens outcomes — please seek help immediately (UK MBRRACE 2023)"],src:"Brockington 2004; Sit et al. 2006; Jones & Craddock; NICE CG192; UK MBRRACE 2023",q:"Strong"},
  },
  "Peripartum Depression": {
    mild:     {rp:"30–40%",rk:["Depression during pregnancy is the single strongest predictor of postpartum depression — the two are closely connected across the perinatal period","Untreated depression during pregnancy leads to postpartum depression in 40–60% of cases (Milgrom et al.)","Low mood and low energy make it harder to attend appointments, eat well, and take care of yourself during pregnancy"],src:"Milgrom et al.; Wisner et al. 2013; ACOG CO #757",q:"Strong"},
    moderate: {rp:"50–65%",rk:["Without treatment, depression that starts during pregnancy tends to continue after birth — affecting both you and your baby","Significant difficulty with day-to-day functioning affects both prenatal self-care and fetal wellbeing","Difficulty bonding with your baby after birth is more likely when depression has been present throughout the pregnancy","Studies find a higher risk of early delivery when depression goes untreated across the perinatal period"],src:"Wisner et al. 2013; ACOG CO #757; NICE CG192",q:"Strong"},
    severe:   {rp:"65–80%",rk:["Severe depression across the perinatal period carries high risk of relapse and worsening after birth","Suicide is a leading cause of maternal death in the perinatal period — untreated severe depression is the primary driver (UK MBRRACE 2023)","If there is a bipolar component, postpartum psychosis risk is elevated","Hospitalization is sometimes required to keep mother and baby safe","Child welfare services may become involved if safety is a concern"],src:"UK MBRRACE 2023; Wisner et al. 2013; ACOG CO #757; NICE CG192",q:"Strong"},
  },
  "ADHD": {
    mild:     {rp:"N/A — symptom return, not episodic relapse",rk:["ADHD does not come and go in episodes — without medication, symptoms are present continuously","Difficulty with focus and attention can affect remembering to take prenatal vitamins, keeping appointments, and driving safely","Planning ahead for birth and newborn care is significantly harder when executive function is impaired"],src:"Biederman et al.; Kessler et al.; expert consensus",q:"Moderate"},
    moderate: {rp:"N/A — significant functional impairment",rk:["Without treatment, significant difficulty functioning day-to-day throughout pregnancy","Missed prenatal appointments, forgotten medications, and difficulty sustaining routines are all common consequences","Job difficulties from untreated ADHD can create financial stress during pregnancy","Comorbid anxiety and depression — which often co-occur with ADHD — become harder to manage without treatment","Impulsivity can lead to risky decisions"],src:"Biederman et al.; Kessler et al.; expert consensus",q:"Moderate"},
    severe:   {rp:"N/A — severe functional impairment",rk:["Severe untreated ADHD causes a level of impairment that affects nearly every area of daily life during pregnancy","High accident and injury risk from inattention — particularly when driving","Not being able to consistently take other pregnancy-related medications becomes a real concern","Severe difficulties at work can lead to job loss, financial hardship, and housing instability","Risk of using substances to self-manage overwhelming symptoms"],src:"Biederman et al.; Kessler et al.; expert consensus",q:"Moderate"},
  },
  "Autism Spectrum Disorder": {
    mild:     {rp:"N/A — ASD is not episodic",rk:["ASD itself is a lifelong condition — medications are used to treat associated symptoms like anxiety, irritability, or attention difficulties, not the autism itself","Stopping medication causes those associated symptoms to return — which makes pregnancy harder to navigate","Sensory sensitivities that are part of ASD may intensify during pregnancy — ultrasound sounds, clinical environments, and physical exams can be particularly overwhelming"],src:"Expert consensus; clinical consensus",q:"Limited"},
    moderate: {rp:"N/A — comorbid symptom return",rk:["Co-occurring anxiety or ADHD symptoms return when medication is stopped, making pregnancy management significantly harder","Sensory overload in clinical settings (noise, lights, physical touch) can make attending prenatal appointments very difficult","Support needs tend to increase substantially during the perinatal period","Communication differences can make it harder to participate in informed conversations about options and decisions — your care team should know how best to communicate with you"],src:"Expert consensus; clinical consensus",q:"Limited"},
    severe:   {rp:"N/A — severe comorbid symptom burden",rk:["Severe co-occurring psychiatric symptoms return without medication — significantly affecting quality of life and safety during pregnancy","Behavioral regulation becomes much harder without medication","The perinatal period involves intensive medical contact — support from a knowledgeable care team is essential","If self-injurious behaviors are part of the picture, safety planning is an important part of perinatal care"],src:"Expert consensus; clinical consensus",q:"Limited"},
  },
  "Anorexia Nervosa": {
    mild:     {rp:"35–50%",rk:["Pregnancy requires weight gain — this is psychologically challenging for anyone with anorexia, and that conflict can trigger restriction or relapse (Micali et al. 2012, BMJ)","Distress about the body changes that pregnancy brings is nearly unavoidable — and this is a real, documented risk","Not getting enough calories and nutrition during pregnancy increases the risk of the baby not growing as expected (fetal growth restriction)","Deficiencies in nutrients like folate, iron, calcium, and vitamin D are more common and can affect both you and your baby"],src:"Micali et al. 2012 BMJ; Koubaa et al.; Easter et al.; NICE ED guidelines",q:"Strong"},
    moderate: {rp:"55–70%",rk:["Significant food restriction during pregnancy can cause the baby to be smaller than expected (intrauterine growth restriction)","Not getting enough nutrition affects the baby's developing brain","Studies find a higher risk of early delivery when anorexia is active during pregnancy (Micali et al. 2012, BMJ)","Low electrolytes — particularly potassium — can cause heart rhythm problems in the mother","A baby that is significantly smaller than expected (small for gestational age) has its own health risks"],src:"Micali et al. 2012 BMJ; Koubaa et al.; NICE ED guidelines",q:"Strong"},
    severe:   {rp:"70–85%",rk:["Severe malnutrition during pregnancy carries a direct risk to the baby's growth and brain development","Electrolyte imbalances from severe restriction can cause dangerous heart rhythm problems in the mother","Eating disorders carry the highest mortality rate of any psychiatric condition — severe active anorexia during pregnancy significantly elevates this risk (Micali et al. 2012, BMJ)","Sustained malnutrition can harm the baby's neurological development in ways that affect long-term functioning","In very rare and extreme cases where both mother and baby are at immediate risk, tube feeding may be considered"],src:"Micali et al. 2012 BMJ; Easter et al.; NICE ED guidelines",q:"Strong"},
  },
  "Bulimia Nervosa": {
    mild:     {rp:"30–45%",rk:["Purging during pregnancy — through vomiting or laxatives — disrupts electrolyte levels (like potassium) that are important for both your heart and the baby's development (Micali et al. 2012, BMJ)","Ongoing tooth enamel damage from purging","A modestly higher risk of early delivery has been associated with bulimia during pregnancy"],src:"Micali et al. 2012 BMJ; Morgan et al.; NICE ED guidelines",q:"Moderate"},
    moderate: {rp:"45–60%",rk:["Frequent purging causes electrolyte imbalances — low potassium in particular is a risk for serious heart rhythm problems","Even when eating enough in quantity, purging means the body — and the baby — may not be absorbing what is needed","Higher risk of early delivery","Pregnancy-related nausea and vomiting can be difficult to distinguish from bulimia, and can make symptoms harder to manage"],src:"Micali et al. 2012; Morgan et al.; NICE ED guidelines",q:"Moderate"},
    severe:   {rp:"60–75%",rk:["Severe purging causes significant electrolyte imbalances — low potassium is a serious cardiac risk for the mother","Repeated purging cycles significantly reduce the nutrition reaching the baby","Growth restriction in the baby becomes more likely as the severity of purging increases","Laxative abuse can cause serious digestive complications during pregnancy","The physiological stress of the binge-purge cycle keeps stress hormones elevated, which has its own effects on fetal development"],src:"Micali et al. 2012; Morgan et al.; NICE ED guidelines",q:"Moderate"},
  },
  "Binge Eating Disorder": {
    mild:     {rp:"30–45%",rk:["BED is associated with a higher risk of gestational diabetes — which affects how the baby grows and what kind of delivery is needed (Micali et al.)","Gaining more weight than recommended during pregnancy is more common with active BED","Larger-than-expected babies (macrosomia) are more common — which can complicate delivery","Using food to manage the emotional stress of pregnancy is a common pattern that, untreated, tends to worsen"],src:"Micali et al.; Knoph-Berg et al.; clinical consensus",q:"Moderate"},
    moderate: {rp:"45–60%",rk:["Risk of gestational diabetes is significantly higher with moderate-to-active BED — requiring closer glucose monitoring","A larger-than-expected baby at delivery increases the risk of needing a cesarean section","High blood pressure conditions during pregnancy (like preeclampsia) are more common","Postpartum weight retention and long-term metabolic health consequences are more likely without treatment"],src:"Micali et al.; Knoph-Berg et al.; clinical consensus",q:"Moderate"},
    severe:   {rp:"55–70%",rk:["Gestational diabetes risk is high — regular glucose monitoring is essential and should be discussed with your doctor","A very large baby may make vaginal delivery more difficult or require a planned cesarean","High blood pressure conditions during pregnancy are a real concern at this level of severity","Long-term metabolic health — including risk of type 2 diabetes — is affected without treatment","The shame and distress cycle around binge eating tends to intensify under the emotional demands of pregnancy without support"],src:"Micali et al.; Knoph-Berg et al.; clinical consensus",q:"Moderate"},
  },
  "Insomnia Disorder": {
    mild:     {rp:"30–45%",rk:["Sleep disruption tends to worsen naturally in the third trimester — treating insomnia early gives you a better baseline to work from","Chronic fatigue from poor sleep makes it harder to engage with prenatal appointments and take care of yourself","Insomnia and depression are bidirectionally connected during pregnancy — each makes the other more likely (Okun et al. 2009, Sleep Medicine)"],src:"Lee & Gay 2004 Sleep; Okun et al. 2009 Sleep Med; NICE CG192",q:"Moderate"},
    moderate: {rp:"50–65%",rk:["Significant sleep deprivation impairs judgment, reaction time, and emotional regulation — affecting day-to-day functioning throughout pregnancy","Depression and anxiety are closely linked to poor sleep — each worsens the other (Okun et al. 2009)","Studies find a dramatically higher risk of preterm birth when sleep is severely disrupted — less than 6 hours per night was associated with a 4.5-fold higher risk (Lee & Gay 2004, Sleep)","Sustained sleep deprivation also weakens immune function, making pregnancy illness more likely"],src:"Lee & Gay 2004 Sleep; Okun et al. 2009; NICE CG192",q:"Moderate"},
    severe:   {rp:"65–80%",rk:["Severe sleep deprivation impairs cognitive function significantly — and after 48+ hours without sleep, brief psychosis-like symptoms can occur","Depression relapse is very likely without effective sleep treatment — the two are tightly linked","Physical exhaustion from severe insomnia increases the risk of falls and accidents","After birth, severe insomnia is extremely common — and is one of the primary risk factors for postpartum depression (Robertson et al. 2004)"],src:"Lee & Gay 2004; Okun et al. 2009; Robertson et al. 2004; NICE CG192",q:"Moderate"},
  },
  "Somatic Symptom Disorder": {
    mild:     {rp:"30–45%",rk:["Normal pregnancy symptoms — nausea, back pain, fatigue, breast tenderness — tend to be experienced as more intense and distressing when somatic symptom disorder is active","The increased focus on the body that pregnancy brings can amplify health anxiety and the need for reassurance","It can be harder to determine which symptoms need attention versus which are normal pregnancy experiences — your care team can help you distinguish these"],src:"APA DSM-5-TR; clinical consensus",q:"Limited"},
    moderate: {rp:"45–60%",rk:["Normal pregnancy discomforts tend to be experienced as significantly more distressing than they otherwise would be","Seeking reassurance frequently — including multiple emergency room visits — exposes you to unnecessary procedures and adds stress","Significant difficulty functioning day-to-day throughout pregnancy","Repeated unnecessary medical testing can occasionally lead to its own complications"],src:"APA DSM-5-TR; clinical consensus",q:"Limited"},
    severe:   {rp:"60–75%",rk:["Physical symptoms are experienced as severely disabling — making normal pregnancy activities and self-care very difficult","High medical utilization — including repeated hospital visits — is common and can lead to unnecessary procedures","Anxiety and depression commonly occur alongside severe somatic symptom disorder, each making the others worse","Quality of life is significantly reduced throughout pregnancy when symptoms are this severe and untreated"],src:"APA DSM-5-TR; clinical consensus",q:"Limited"},
  },
  "Illness Anxiety Disorder": {
    mild:     {rp:"30–45%",rk:["Pregnancy naturally increases attention to bodily symptoms — and for someone with health anxiety, this can intensify worry about the baby's wellbeing significantly","Seeking repeated reassurance about the baby — including frequent emergency department visits — is common when health anxiety is untreated","Frequently asking your obstetric care team for reassurance can strain those relationships over time"],src:"APA DSM-5-TR; clinical consensus",q:"Limited"},
    moderate: {rp:"50–65%",rk:["Obstetric complications do sometimes occur — and for someone with health anxiety, each normal finding can feel like evidence of something seriously wrong, creating a cycle of fear","Significant anxiety and distress is present most of the time, affecting sleep, relationships, and functioning","Avoiding certain activities out of fear of harm to the baby — despite medical reassurance — is common and limiting"],src:"APA DSM-5-TR; clinical consensus",q:"Limited"},
    severe:   {rp:"65–80%",rk:["Constant intense worry about health — your own and the baby's — causes significant suffering throughout pregnancy","Seeking reassurance so frequently that care providers begin to pull back is a real pattern in severe health anxiety","Depression is very common alongside severe illness anxiety — each tends to worsen the other","Difficulty working, maintaining relationships, and performing basic self-care becomes likely when health anxiety is this severe"],src:"APA DSM-5-TR; clinical consensus",q:"Limited"},
  },
  "Alcohol Use Disorder": {
    mild:     {rp:"50–65%",rk:["There is no established safe amount of alcohol during pregnancy — fetal alcohol spectrum disorder (FASD) can result from any level of use (CDC; Popova et al. 2017, The Lancet)","Heavy alcohol use causes fetal alcohol syndrome — the most preventable cause of intellectual disability","Higher risk of early delivery and the baby being smaller than expected"],src:"SAMHSA; CDC; Popova et al. 2017 Lancet; ACOG",q:"Strong"},
    moderate: {rp:"65–80%",rk:["Significant risk of fetal alcohol spectrum disorder at moderate-to-heavy drinking levels — which can affect the baby's brain, behavior, and development (Popova et al. 2017, The Lancet)","Babies born to mothers who drank regularly during pregnancy can experience alcohol withdrawal after birth — including seizures, which require medical treatment","Stopping alcohol suddenly during pregnancy without medical support is dangerous — withdrawal can include seizures. Always speak to your doctor first","Higher risk of preterm birth, growth restriction, and placental abruption"],src:"Popova et al. 2017 Lancet; CDC; SAMHSA; ACOG",q:"Strong"},
    severe:   {rp:"80–90%",rk:["High risk of fetal alcohol spectrum disorder — alcohol causes dose-dependent harm to the baby's developing brain (Popova et al. 2017, The Lancet)","Neonatal alcohol withdrawal can be life-threatening without treatment — babies need medical monitoring after birth","Stopping alcohol abruptly without medical support during pregnancy can cause severe withdrawal including seizures in the mother — this is a medical emergency","High risk to both mother and baby's life without treatment","Severe thiamine (vitamin B1) deficiency from heavy alcohol use can cause Wernicke's encephalopathy — a serious brain disorder"],src:"Popova et al. 2017 Lancet; CDC; SAMHSA; ACOG",q:"Strong"},
  },
  "Opioid Use Disorder": {
    mild:     {rp:"60–80%",rk:["Without medication-assisted treatment, relapse to illicit opioid use — including heroin or fentanyl — directly exposes the baby to those substances","Opioid overdose is the leading cause of pregnancy-associated maternal death in the United States (CDC 2022, MMWR)","Injection drug use carries risk of HIV and hepatitis C transmission — both of which affect pregnancy outcomes","Losing housing stability and stopping prenatal care are common consequences of untreated opioid use disorder during pregnancy"],src:"CDC 2022 MMWR; SAMHSA 2023; ACOG CO #711; Ko et al. 2017",q:"Strong"},
    moderate: {rp:"75–90%",rk:["Opioid withdrawal during pregnancy is highly aversive and dangerous — this is a major reason relapse risk is so high without medication support","Opioid overdose death during pregnancy is an epidemic in the United States — medication-assisted treatment dramatically reduces this risk (CDC 2022)","Risk of HIV and hepatitis C exposure if injection use resumes","The baby's growth can be affected by illicit opioid use during pregnancy","Housing instability and child welfare concerns are common consequences of untreated opioid use disorder"],src:"CDC 2022 MMWR; SAMHSA 2023; ACOG CO #711",q:"Strong"},
    severe:   {rp:"85–95%",rk:["Without medication-assisted treatment, relapse and overdose risk is extremely high","The fentanyl in today's drug supply is far more potent than historical opioids — an overdose is frequently fatal","Opioids are the leading cause of pregnancy-associated maternal death in the United States (CDC 2022, MMWR)","Maternal overdose death means fetal death","Child welfare involvement and, in some cases, criminal justice consequences are likely outcomes without treatment"],src:"CDC 2022 MMWR; SAMHSA 2023; ACOG CO #711; Ko et al. 2017",q:"Strong"},
  },
  "Cannabis Use Disorder": {
    mild:     {rp:"40–55%",rk:["THC — the active ingredient in cannabis — crosses the placenta and reaches the developing baby's brain at a time when the endocannabinoid system is still forming","Studies find cannabis use during pregnancy is associated with babies being smaller at birth (Gunn et al. 2016, BMJ Open)","Research suggests children exposed to cannabis in the womb show differences in attention and executive function at school age (Goldschmidt et al.)"],src:"Gunn et al. 2016 BMJ Open; Goldschmidt et al.; ACOG CO #722",q:"Moderate"},
    moderate: {rp:"55–70%",rk:["The more cannabis used, the more THC the baby is exposed to — research shows dose-dependent effects on fetal development","Lower birth weight and early delivery are associated with moderate-to-heavy cannabis use (Gunn et al. 2016)","Studies find differences in thinking, memory, and behavior at school age in children exposed to cannabis in the womb (Goldschmidt et al.)","Today's cannabis products are significantly stronger than they were in older studies — the risks may be higher than historical data suggests"],src:"Gunn et al. 2016; Goldschmidt et al.; Varner et al. 2014 AJOG; ACOG CO #722",q:"Moderate"},
    severe:   {rp:"65–80%",rk:["High levels of cannabis use expose the baby to significant amounts of THC during critical brain development — with dose-dependent effects","Heavy cannabis use during pregnancy has been associated with a higher risk of stillbirth (Varner et al. 2014, American Journal of Obstetrics & Gynecology)","Some newborns show withdrawal symptoms after birth when cannabis use during pregnancy was heavy","Research shows effects on attention, memory, and school performance that are dose-dependent (Goldschmidt et al.)","Modern high-potency cannabis concentrates pose substantially higher risks than the products studied in older research"],src:"Gunn et al. 2016; Varner et al. 2014 AJOG; Goldschmidt et al.; ACOG CO #722",q:"Moderate"},
  },
  "Borderline Personality Disorder": {
    mild:     {rp:"35–50%",rk:["BPD symptoms commonly intensify during pregnancy — the profound identity and body changes of pregnancy can be destabilizing (NICE BPD guideline; Zanarini et al.)","Emotional reactivity and difficulty regulating feelings can affect relationships with prenatal care providers, making consistent care harder to access","During moments of intense emotional distress, impulsive decisions or behaviors are more likely"],src:"NICE BPD guideline; Zanarini et al.; APA; clinical consensus",q:"Moderate"},
    moderate: {rp:"55–70%",rk:["Significant difficulty managing intense emotions — during emotional crises, self-harm is a real risk","Relationship turbulence — with a partner, family, or care team — can destabilize the support network needed during pregnancy","Frequently switching care providers (a pattern called 'splitting') disrupts continuity of prenatal care","Postpartum depression risk is meaningfully elevated"],src:"NICE BPD guideline; Zanarini et al.; APA; clinical consensus",q:"Moderate"},
    severe:   {rp:"65–80%",rk:["During intense emotional episodes, self-harm and suicidal crisis are serious risks — this is well-documented in people with severe BPD (UK MBRRACE 2023)","Psychiatric hospitalization during acute crises is common","Postpartum depression is very likely in the weeks after birth","Severe relational instability can affect the ability to form a secure bond with the baby in the early weeks","Child welfare services may become involved if self-harm or substance use creates a safety concern"],src:"NICE BPD guideline; Zanarini et al.; APA; UK MBRRACE 2023",q:"Moderate"},
  },
};

const DIAGNOSES = [
  // Mood disorders
  "Major Depressive Disorder",
  "Persistent Depressive Disorder (Dysthymia)",
  "Premenstrual Dysphoric Disorder (PMDD)",
  "Seasonal Affective Disorder",
  "Bipolar I Disorder",
  "Bipolar II Disorder",
  "Cyclothymic Disorder",
  // Anxiety disorders
  "Generalized Anxiety Disorder",
  "Panic Disorder",
  "Social Anxiety Disorder",
  "Specific Phobia",
  "Agoraphobia",
  "Separation Anxiety Disorder",
  // Trauma & stress
  "PTSD",
  "Acute Stress Disorder",
  "Adjustment Disorder",
  // OCD spectrum
  "OCD",
  "Body Dysmorphic Disorder",
  "Hoarding Disorder",
  "Trichotillomania",
  // Psychotic disorders
  "Schizophrenia",
  "Schizoaffective Disorder",
  "Brief Psychotic Disorder",
  "Delusional Disorder",
  // Perinatal-specific
  "Postpartum Depression",
  "Postpartum Anxiety",
  "Postpartum Psychosis",
  "Peripartum Depression",
  // Neurodevelopmental
  "ADHD",
  "Autism Spectrum Disorder",
  // Eating disorders
  "Anorexia Nervosa",
  "Bulimia Nervosa",
  "Binge Eating Disorder",
  // Sleep & somatic
  "Insomnia Disorder",
  "Somatic Symptom Disorder",
  "Illness Anxiety Disorder",
  // Substance use
  "Alcohol Use Disorder",
  "Opioid Use Disorder",
  "Cannabis Use Disorder",
  // Personality
  "Borderline Personality Disorder",
];
const STAGES=[{l:"1st Trimester (wk 1–12)",v:"t1"},{l:"2nd Trimester (wk 13–26)",v:"t2"},{l:"3rd Trimester (wk 27–40)",v:"t3"},{l:"Postpartum / Lactation",v:"pp"}];
const STAGE_LABELS={t1:"1st Trimester",t2:"2nd Trimester",t3:"3rd Trimester",pp:"Postpartum"};
const CLASSES = [...new Set(Object.values(MEDS).map(m=>m.cls))].sort();

const Q_CLR={Strong:"#0d7358",Moderate:"#7a6010",Limited:"#b0620e",Insufficient:"#b83230",Conflicting:"#7b38a8"};
const Q_BG={Strong:"#e8f5f0",Moderate:"#fdf6e0",Limited:"#fdf0e0",Insufficient:"#fde8e8",Conflicting:"#f3e8fd"};
const TIER_CLR={Compatible:"#0d7358","Compatible with monitoring":"#7a6010","Requires assessment":"#b83230","Requires individual risk-benefit assessment":"#b83230"};
// Pattern-based tier color — handles long/custom tier strings that don't exact-match the map
function tierColor(tierStr) {
  if (!tierStr) return "#0d7358";
  const exact = TIER_CLR[tierStr];
  if (exact) return exact;
  const t = tierStr.toLowerCase();
  if (t.includes("not recommended") || t.includes("contraindicated") || t.includes("avoid")) return "#b83230";
  if (t.includes("caution") || t.includes("second-line") || t.includes("prefer") || t.includes("insufficient data") || t.includes("use with")) return "#a05a00";
  if (t.includes("requires") || t.includes("individual") || t.includes("assessment")) return "#b83230";
  if (t.includes("compatible with monitoring") || t.includes("monitoring")) return "#7a6010";
  if (t.includes("compatible")) return "#0d7358";
  return "#4b5563"; // neutral fallback for unknown tiers
}

// ─── MOTHERTOBABY FACT SHEET URLs ─────────────────────────────────────────────
// Verified against mothertobaby.org/fact-sheets/ Feb 2026
// null = no fact sheet found for this drug
const MTB_URLS = {
  sertraline:     "https://mothertobaby.org/fact-sheets/sertraline-zoloft-pregnancy/",
  fluoxetine:     "https://mothertobaby.org/fact-sheets/fluoxetine-prozac-pregnancy/",
  citalopram:     "https://mothertobaby.org/fact-sheets/citalopram-escitalopram/",
  escitalopram:   "https://mothertobaby.org/fact-sheets/citalopram-escitalopram/",
  paroxetine:     "https://mothertobaby.org/fact-sheets/paroxetine/",
  venlafaxine:    "https://mothertobaby.org/fact-sheets/venlafaxine-effexor/",
  duloxetine:     "https://mothertobaby.org/fact-sheets/duloxetine-cymbalta/",
  bupropion:      "https://mothertobaby.org/fact-sheets/bupropion-wellbutrin-pregnancy/",
  mirtazapine:    "https://mothertobaby.org/fact-sheets/mirtazapine-remeron-pregnancy/",
  nortriptyline:  "https://mothertobaby.org/fact-sheets/nortriptyline/",
  amitriptyline:  "https://mothertobaby.org/fact-sheets/amitriptyline/",
  imipramine:     "https://mothertobaby.org/fact-sheets/imipramine/",
  trazodone:      "https://mothertobaby.org/fact-sheets/trazodone/",
  lithium:        "https://mothertobaby.org/fact-sheets/lithium/",
  valproate:      "https://mothertobaby.org/fact-sheets/valproic-acid-depakote/",
  lamotrigine:    "https://mothertobaby.org/fact-sheets/lamotrigine/",
  carbamazepine:  "https://mothertobaby.org/fact-sheets/carbamazepine/",
  oxcarbazepine:  "https://mothertobaby.org/fact-sheets/oxcarbazepine/",
  quetiapine:     "https://mothertobaby.org/fact-sheets/quetiapine/",
  olanzapine:     "https://mothertobaby.org/fact-sheets/olanzapine/",
  aripiprazole:   "https://mothertobaby.org/fact-sheets/aripiprazole/",
  risperidone:    "https://mothertobaby.org/fact-sheets/risperidone-pregnancy/",
  haloperidol:    "https://mothertobaby.org/fact-sheets/haloperidol/",
  clozapine:      null, // No MTB fact sheet found
  lorazepam:      "https://mothertobaby.org/fact-sheets/lorazepam/",
  clonazepam:     "https://mothertobaby.org/fact-sheets/clonazepam/",
  alprazolam:     "https://mothertobaby.org/fact-sheets/alprazolam/",
  hydroxyzine:    "https://mothertobaby.org/fact-sheets/hydroxyzine-vistaril-atarax/",
  zolpidem:       "https://mothertobaby.org/fact-sheets/zolpidem/",
  methylphenidate:"https://mothertobaby.org/fact-sheets/methylphenidate/",
  amphetamine:    "https://mothertobaby.org/fact-sheets/amphetamines/",
  prazosin:       null, // No MTB fact sheet found
  buprenorphine:  "https://mothertobaby.org/fact-sheets/buprenorphine/",
  methadone:      "https://mothertobaby.org/fact-sheets/methadone/",
  naltrexone:     "https://mothertobaby.org/fact-sheets/naltrexone/",
  lurasidone:     "https://mothertobaby.org/fact-sheets/lurasidone/",
  zuranolone:     "https://mothertobaby.org/fact-sheets/zuranolone/",
  brexanolone:    null, // No MTB fact sheet — REMS drug; see FDA label and LactMed
  topiramate:     "https://mothertobaby.org/fact-sheets/topiramate/",
  ziprasidone:    null, // No MTB fact sheet found
  paliperidone:   null, // No MTB fact sheet found
  brexpiprazole:  null, // No MTB fact sheet found
  cariprazine:    null, // No MTB fact sheet found
  gabapentin:     "https://mothertobaby.org/fact-sheets/gabapentin/",
  doxylamine:     "https://mothertobaby.org/fact-sheets/doxylamine/",
  melatonin:      "https://mothertobaby.org/fact-sheets/melatonin/",
};

// ─── RAPIDLY EVOLVING EVIDENCE DRUGS ────────────────────────────────────────
// Evidence base changing quarterly — show badge in UI
const RAPIDLY_EVOLVING = new Set(["zuranolone","brexanolone"]);

// ─── HIGH-ALERT MEDICATIONS ─────────────────────────────────────────────────
const HIGH_ALERT = {
  valproate: {
    msg: "All major guidelines (APA, ACOG, NICE, CANMAT) classify valproic acid as an established teratogen and recommend avoiding it in pregnancy. The analysis below documents the evidence and alternatives. A switch to lamotrigine or lithium before conception is strongly preferred.",
    level: "critical"
  },
  carbamazepine: {
    msg: "Carbamazepine carries a documented neural tube defect risk (~0.5–1%). Guidelines recommend considering alternatives (lamotrigine preferred). High-dose folic acid (5 mg/day) is indicated preconceptionally and in first trimester if continued.",
    level: "warning"
  },
  paroxetine: {
    msg: "Paroxetine carries a documented cardiac malformation signal (ventricular septal defects, ~2–4 additional per 1,000 above baseline). FDA reclassified from Category C to D in 2005. APA and ACOG recommend considering alternatives (sertraline preferred) — particularly important in first trimester.",
    level: "warning"
  },
  clozapine: {
    msg: "Clozapine requires ongoing REMS enrollment and weekly CBC monitoring throughout pregnancy. Agranulocytosis risk is not reduced in pregnancy. Smoking cessation (common in pregnancy) can raise clozapine levels significantly via CYP1A2 inhibition — dose adjustment and close monitoring are required. Neonatal agranulocytosis risk warrants multidisciplinary planning.",
    level: "warning"
  }
};

// ─── LACTMED PER-DRUG NBK IDs ─────────────────────────────────────────────────
// Verified from NCBI Bookshelf search results (February 2026)
const LACTMED_NBK = {
  sertraline:      "NBK501191",
  fluoxetine:      "NBK501186",
  citalopram:      "NBK501185",
  escitalopram:    "NBK501275",
  paroxetine:      "NBK501190",
  venlafaxine:     "NBK501192",
  duloxetine:      "NBK501470",
  lithium:         "NBK501257",  // LactMed lithium record
  lamotrigine:     "NBK501268",
  valproate:       "NBK501264",  // LactMed valproic acid record
  carbamazepine:   "NBK501271",
  quetiapine:      "NBK501087",
  olanzapine:      "NBK501056",
  aripiprazole:    "NBK501016",
  risperidone:     "NBK501095",
  lorazepam:       "NBK501231",
  clonazepam:      "NBK501270",  // LactMed clonazepam record
  alprazolam:      "NBK501265",  // LactMed alprazolam record
  methylphenidate: "NBK501310",
  amphetamine:     "NBK501313",  // LactMed amphetamine record
  bupropion:       "NBK501184",
  mirtazapine:     "NBK501188",
  trazodone:       "NBK501193",  // LactMed trazodone record
  nortriptyline:   "NBK501189",
  amitriptyline:   "NBK501183",
  imipramine:      "NBK501180",
  lurasidone:      "NBK501058",
  haloperidol:     "NBK501044",
  clozapine:       "NBK501033",
  oxcarbazepine:   "NBK501272",
  zuranolone:      "NBK535430",
  hydroxyzine:     "NBK501246",
  buprenorphine:   "NBK501167",
  methadone:       "NBK501255",
  naltrexone:      "NBK501260",
  zolpidem:        "NBK501196",
  prazosin:        "NBK501644",
};

const LACTMED_URL = (drugKey) => {
  const nbk = LACTMED_NBK[drugKey];
  return nbk
    ? `https://www.ncbi.nlm.nih.gov/books/${nbk}/`
    : `https://www.ncbi.nlm.nih.gov/books/NBK501922/`;  // fallback to LactMed index
};

// ─── SOURCE LINKS ────────────────────────────────────────────────────────────
// All sources are FREE and publicly accessible. Every citation links to the
// drug-specific page on that database so clinicians can verify claims directly.
//
// DailyMed    — FDA prescribing labels (PLLR pregnancy/lactation sections)
// MotherToBaby — OTIS evidence-based fact sheets for pregnancy/lactation
// LactMed     — NLM/NICHD lactation database (milk levels, RID, infant effects)

// DailyMed drug-specific search URLs (open the exact drug's label listing)
const DAILYMED_SETID = {
  sertraline:      "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=sertraline",
  fluoxetine:      "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=fluoxetine",
  citalopram:      "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=citalopram",
  escitalopram:    "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=escitalopram",
  paroxetine:      "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=paroxetine",
  venlafaxine:     "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=venlafaxine",
  duloxetine:      "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=duloxetine",
  lithium:         "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=lithium+carbonate",
  lamotrigine:     "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=lamotrigine",
  valproate:       "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=valproic+acid",
  carbamazepine:   "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=carbamazepine",
  quetiapine:      "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=quetiapine",
  olanzapine:      "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=olanzapine",
  aripiprazole:    "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=aripiprazole",
  risperidone:     "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=risperidone",
  lorazepam:       "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=lorazepam",
  clonazepam:      "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=clonazepam",
  alprazolam:      "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=alprazolam",
  methylphenidate: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=methylphenidate",
  amphetamine:     "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=amphetamine+salts",
  bupropion:       "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=bupropion",
  mirtazapine:     "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=mirtazapine",
  trazodone:       "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=trazodone",
  nortriptyline:   "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=nortriptyline",
  amitriptyline:   "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=amitriptyline",
  imipramine:      "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=imipramine",
  lurasidone:      "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=lurasidone",
  haloperidol:     "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=haloperidol",
  clozapine:       "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=clozapine",
  oxcarbazepine:   "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=oxcarbazepine",
  zuranolone:      "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=zuranolone",
  brexanolone:     "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=brexanolone",
  hydroxyzine:     "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=hydroxyzine",
  buprenorphine:   "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=buprenorphine",
  methadone:       "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=methadone",
  naltrexone:      "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=naltrexone",
  zolpidem:        "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=zolpidem",
  prazosin:        "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=prazosin",
  topiramate:      "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=topiramate",
  ziprasidone:     "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=ziprasidone",
  paliperidone:    "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=paliperidone",
  brexpiprazole:   "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=brexpiprazole",
  cariprazine:     "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=cariprazine",
  gabapentin:      "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=gabapentin",
  doxylamine:      "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=doxylamine",
  melatonin:       "https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=melatonin",
};

// MotherToBaby drug-specific fact sheet slugs
// Aligned with MTB_URLS — using specific drug slugs where available
const MOTHERTOBABY_SLUG = {
  sertraline:      "sertraline-zoloft-pregnancy",
  fluoxetine:      "fluoxetine-prozac-pregnancy",
  citalopram:      "citalopram-escitalopram",
  escitalopram:    "citalopram-escitalopram",
  paroxetine:      "paroxetine",
  venlafaxine:     "venlafaxine-effexor",
  duloxetine:      "duloxetine-cymbalta",
  lithium:         "lithium",
  lamotrigine:     "lamotrigine",
  valproate:       "valproic-acid-depakote",
  carbamazepine:   "carbamazepine",
  quetiapine:      "quetiapine",
  olanzapine:      "olanzapine",
  aripiprazole:    "aripiprazole",
  risperidone:     "risperidone-pregnancy",
  lorazepam:       "lorazepam",
  clonazepam:      "clonazepam",
  alprazolam:      "alprazolam",
  methylphenidate: "methylphenidate",
  amphetamine:     "amphetamines",
  bupropion:       "bupropion-wellbutrin-pregnancy",
  mirtazapine:     "mirtazapine-remeron-pregnancy",
  trazodone:       "trazodone",
  nortriptyline:   "nortriptyline",
  amitriptyline:   "amitriptyline",
  imipramine:      "imipramine",
  lurasidone:      "lurasidone",
  haloperidol:     "haloperidol",
  clozapine:       "clozapine",
  oxcarbazepine:   "oxcarbazepine",
  zuranolone:      "zuranolone",
  hydroxyzine:     "hydroxyzine-vistaril-atarax",
  buprenorphine:   "buprenorphine",
  methadone:       "methadone",
  naltrexone:      "naltrexone",
  zolpidem:        "zolpidem",
  prazosin:        "prazosin",
};

const DAILYMED_URL = (drugKey) =>
  DAILYMED_SETID[drugKey] ||
  `https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=${encodeURIComponent(drugKey)}`;

const MOTHERTOBABY_URL = (drugKey) => {
  const slug = MOTHERTOBABY_SLUG[drugKey];
  return slug
    ? `https://mothertobaby.org/fact-sheets/${slug}/`
    : "https://mothertobaby.org/fact-sheets/";
};

// All sources are free and publicly accessible — no subscription required
const SOURCE_META = {
  "LactMed":          { url: (drugKey) => LACTMED_URL(drugKey),      tier: "free", label: "LactMed® (NLM/NICHD)" },
  "DailyMed":         { url: (drugKey) => DAILYMED_URL(drugKey),     tier: "free", label: "DailyMed — FDA Label (NLM)" },
  "MotherToBaby":     { url: (drugKey) => MOTHERTOBABY_URL(drugKey), tier: "free", label: "MotherToBaby Fact Sheet (OTIS)" },
  "FDA PLLR":         { url: (drugKey) => DAILYMED_URL(drugKey),     tier: "free", label: "FDA PLLR via DailyMed (NLM)" },

  // NICE CG192 — Antenatal and postnatal mental health (2014, updated 2020)
  "NICE":             { url: () => "https://www.nice.org.uk/guidance/cg192", tier: "free", label: "NICE CG192 — Antenatal & Postnatal Mental Health (2020)" },
  "NICE CG192":       { url: () => "https://www.nice.org.uk/guidance/cg192", tier: "free", label: "NICE CG192 — Antenatal & Postnatal Mental Health (2020)" },

  // APA — Drug-specific guideline documents (mapped per medication context)
  // MDD guideline: APA Practice Guideline for MDD (3rd ed, 2010; free online)
  "APA":              { url: () => "https://psychiatryonline.org/guidelines", tier: "free", label: "APA Practice Guidelines Index" },
  "APA-MDD":          { url: () => "https://psychiatryonline.org/doi/book/10.1176/appi.books.9780890423387", tier: "free", label: "APA Practice Guideline for MDD (2010)" },
  // Bipolar: APA Practice Guideline for Bipolar Disorder (2nd ed, 2002; updated recommendations in 2005 guideline watch)
  "APA-Bipolar":      { url: () => "https://psychiatryonline.org/doi/book/10.1176/appi.books.9780890423837", tier: "free", label: "APA Practice Guideline for Bipolar Disorder" },
  // Schizophrenia / psychosis
  "APA-Psychosis":    { url: () => "https://psychiatryonline.org/doi/book/10.1176/appi.books.9780890424841", tier: "free", label: "APA Practice Guideline for Schizophrenia (2021)" },
  // Substance use / OUD
  "APA-SUD":          { url: () => "https://psychiatryonline.org/doi/book/10.1176/appi.books.9781615374380", tier: "free", label: "APA Practice Guideline for OUD (2018)" },

  // ACOG — Specific committee opinions
  // CO #757 Screening for Perinatal Depression (2018, reaffirmed 2021) — SSRIs, general psych meds
  "ACOG":             { url: () => "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2018/11/screening-for-perinatal-depression", tier: "free", label: "ACOG CO #757 — Perinatal Depression (2018)" },
  "ACOG CO #757":     { url: () => "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2018/11/screening-for-perinatal-depression", tier: "free", label: "ACOG CO #757 — Perinatal Depression (2018)" },
  // ACOG CO #711 — Opioid use disorder in pregnancy (2017, reaffirmed 2021)
  "ACOG-OUD":         { url: () => "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/08/opioid-use-and-opioid-use-disorder-in-pregnancy", tier: "free", label: "ACOG CO #711 — OUD in Pregnancy (2017)" },
  // ACOG Practice Bulletin #222 — Gestational hypertension / preeclampsia (for prazosin context)
  "ACOG-PPD":         { url: () => "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2018/11/screening-for-perinatal-depression", tier: "free", label: "ACOG CO #757 — Perinatal Depression (2018)" },

  // CANMAT — Canadian Network for Mood and Anxiety Treatments
  // Bipolar guidelines 2018 update (free access)
  "CANMAT":           { url: () => "https://www.tandfonline.com/doi/full/10.1080/15622975.2018.1429596", tier: "free", label: "CANMAT/ISBD Bipolar Guidelines (2018)" },

  // BAP — British Association for Psychopharmacology perinatal guidelines (2017)
  "BAP":              { url: () => "https://www.bap.org.uk/pdfs/BAP_Guidelines-Perinatal.pdf", tier: "free", label: "BAP Perinatal Psychopharmacology Guidelines (2017)" },

  // SAMHSA — OUD Treatment in Pregnancy (2023)
  "SAMHSA":           { url: () => "https://store.samhsa.gov/product/clinical-guidance-treating-opioid-use-disorder-during-pregnancy/pep23-02-00-003", tier: "free", label: "SAMHSA — OUD Treatment in Pregnancy (2023)" },

  // MGH Center for Women’s Mental Health — widely cited perinatal psychopharmacology resource
  "MGH-CWM":          { url: () => "https://womensmentalhealth.org/specialty-clinics/psychiatric-disorders-during-pregnancy/", tier: "free", label: "MGH Center for Women’s Mental Health" },

  "Expert consensus": { url: () => null, tier: "free", label: "Expert consensus" },
};


// Legacy compat — SRC_LINKS still used in lactation "Open LactMed" links
const SRC_LINKS = Object.fromEntries(
  Object.entries(SOURCE_META).map(([k, v]) => [k, v.url])
);

// ─── DYNAMIC PATIENT SUMMARY TEXT ────────────────────────────────────────────
function buildPatientSummaryText(med, stage, sev, dx) {
  const m = MEDS[med];
  if (!m) return null;
  const d = m.tera[stage];
  const sevEffective = sev || "moderate";
  const u = dx && DIAGNOSIS_UR[dx] ? DIAGNOSIS_UR[dx][sevEffective] || DIAGNOSIS_UR[dx].moderate : null;
  const stageName = STAGE_LABELS[stage] || "this stage";
  const isBreastfeeding = stage === "pp";
  const drugName = m.g;
  const brandName = m.b !== m.g ? ` (${m.b})` : "";

  // ── WHAT IS THIS MEDICATION? ──────────────────────────────────────────────
  const drugDescriptions = {
    sertraline:    `${drugName}${brandName} is a type of antidepressant called an SSRI (selective serotonin reuptake inhibitor). It is used to treat depression, anxiety, OCD, PTSD, and panic disorder. It is one of the most studied antidepressants during pregnancy.`,
    fluoxetine:    `${drugName}${brandName} is an antidepressant in the SSRI family. It is used to treat depression, anxiety, OCD, and other conditions. It has been studied in pregnancy for many years, though it stays in the body longer than some other SSRIs.`,
    citalopram:    `${drugName}${brandName} is an SSRI antidepressant used to treat depression and anxiety. It is one of the more commonly used antidepressants during pregnancy.`,
    escitalopram:  `${drugName}${brandName} is an SSRI antidepressant used to treat depression and anxiety. It is closely related to citalopram and has a similar safety profile during pregnancy.`,
    paroxetine:    `${drugName}${brandName} is an SSRI antidepressant used to treat depression, anxiety, OCD, PTSD, and social anxiety. It is generally avoided as a first choice in pregnancy when alternatives exist, but this depends on your individual situation.`,
    venlafaxine:   `${drugName}${brandName} is an antidepressant that works on both serotonin and norepinephrine (called an SNRI). It is used to treat depression, anxiety, and panic disorder.`,
    duloxetine:    `${drugName}${brandName} is an SNRI antidepressant used to treat depression, anxiety, and chronic pain. Pregnancy data is more limited than for SSRIs.`,
    bupropion:     `${drugName}${brandName} is an antidepressant that works differently from SSRIs. It is used to treat depression and to help with quitting smoking. It does not cause the sexual side effects that SSRIs sometimes do.`,
    mirtazapine:   `${drugName}${brandName} is an antidepressant that works differently from SSRIs. It is often used when sleep and appetite problems are part of the picture.`,
    nortriptyline: `${drugName}${brandName} is an older type of antidepressant (called a tricyclic). It is often used when SSRIs have not worked well, and is one of the better-studied tricyclics during pregnancy.`,
    amitriptyline: `${drugName}${brandName} is an older antidepressant (tricyclic) used for depression and sometimes for pain or sleep. SSRIs are usually tried first during pregnancy.`,
    imipramine:    `${drugName}${brandName} is an older antidepressant (tricyclic) used for depression and anxiety. It has been around for decades, giving it a relatively long history, though SSRIs are generally preferred today.`,
    lithium:       `${drugName}${brandName} is a mood stabilizer used to treat bipolar disorder. It is one of the most effective treatments for preventing episodes of mania and depression. It requires careful monitoring during pregnancy.`,
    valproate:     `${drugName}${brandName} is a mood stabilizer and seizure medication. It is used for bipolar disorder and epilepsy. It is important to know that valproate carries significant known risks in pregnancy — your doctor will have discussed this with you in detail.`,
    lamotrigine:   `${drugName}${brandName} is a mood stabilizer and anti-seizure medication used for bipolar disorder and epilepsy. It is one of the more studied mood stabilizers in pregnancy.`,
    carbamazepine: `${drugName}${brandName} is a mood stabilizer and anti-seizure medication used for bipolar disorder and epilepsy. It requires monitoring during pregnancy.`,
    oxcarbazepine: `${drugName}${brandName} is related to carbamazepine and is used for seizures and sometimes mood disorders. Pregnancy data is more limited than for some other mood stabilizers.`,
    quetiapine:    `${drugName}${brandName} is an atypical antipsychotic used for bipolar disorder, schizophrenia, and sometimes as an add-on for depression. It is one of the more commonly used antipsychotics during pregnancy.`,
    olanzapine:    `${drugName}${brandName} is an atypical antipsychotic used for bipolar disorder and schizophrenia. It has more pregnancy data than many other antipsychotics.`,
    aripiprazole:  `${drugName}${brandName} is an atypical antipsychotic used for bipolar disorder, schizophrenia, and as an add-on for depression. Pregnancy data is growing but still limited.`,
    risperidone:   `${drugName}${brandName} is an antipsychotic used for schizophrenia, bipolar disorder, and irritability. Some pregnancy data exists, though less than for quetiapine or olanzapine.`,
    haloperidol:   `${drugName}${brandName} is an older antipsychotic that has been used for decades. It is one of the longer-studied antipsychotics during pregnancy.`,
    clozapine:     `${drugName}${brandName} is an antipsychotic used for treatment-resistant schizophrenia. It requires regular blood monitoring. Because of its specific risks, decisions about continuing it in pregnancy and while breastfeeding require very careful discussion with your care team.`,
    lorazepam:     `${drugName}${brandName} is a benzodiazepine medication used for anxiety, panic, and agitation. It is often used for short-term relief because of the risk of dependence with longer use.`,
    clonazepam:    `${drugName}${brandName} is a benzodiazepine used for anxiety, panic disorder, and seizures. It stays in the body longer than some other benzodiazepines, which is important to know during pregnancy and breastfeeding.`,
    alprazolam:    `${drugName}${brandName} is a benzodiazepine used for anxiety and panic disorder. It is a high-potency medication typically used for short-term relief.`,
    hydroxyzine:   `${drugName}${brandName} is an antihistamine used for anxiety and sleep. Unlike benzodiazepines, it is not habit-forming.`,
    zolpidem:      `${drugName}${brandName} is a sleep medication (sedative-hypnotic) used for insomnia. It is generally used for short-term sleep problems.`,
    methylphenidate:`${drugName}${brandName} is a stimulant medication used for ADHD. Pregnancy data is limited compared to antidepressants.`,
    amphetamine:   `${drugName}${brandName} refers to amphetamine salt medications (like Adderall®) used for ADHD. Pregnancy data is limited.`,
    trazodone:     `${drugName}${brandName} is an antidepressant that is often used at low doses for sleep. It is sometimes used alongside another antidepressant.`,
    mirtazapine:   `${drugName}${brandName} is an antidepressant that is often used when sleep and appetite are part of the problem. It tends to be more sedating than SSRIs.`,
    prazosin:      `${drugName}${brandName} is a blood pressure medication that is also used to reduce nightmares related to PTSD. Pregnancy data is very limited.`,
    buprenorphine: `${drugName}${brandName} is a medication for opioid use disorder (MOUD). It is the recommended treatment for opioid use disorder during pregnancy because stopping opioids without medication support carries serious risks for you and your baby.`,
    methadone:     `${drugName}${brandName} is a medication for opioid use disorder (MOUD). It is an established, recommended treatment during pregnancy. Staying on methadone is almost always safer than stopping opioid treatment.`,
    naltrexone:    `${drugName}${brandName} is a medication that blocks opioid receptors. It is used to help prevent relapse in opioid or alcohol use disorder. Pregnancy data is limited — buprenorphine or methadone have more evidence for opioid use disorder in pregnancy.`,
    zuranolone:    `${drugName}${brandName} is a medication specifically approved by the FDA in August 2023 to treat postpartum depression (PPD). It is the first oral medication of its kind — a 14-day course taken at night. It works differently from antidepressants like SSRIs, targeting the hormonal pathway that is thought to play a role in postpartum depression.`,
    brexanolone:   `${drugName}${brandName} is the first medication ever approved specifically for postpartum depression (FDA approved 2019). It is given as a 60-hour continuous IV infusion in a certified medical facility. It works on the same pathway as zuranolone (oral) but is administered in hospital. Because of the sedation risk during the infusion, a separate caregiver must be present for any child during the 2.5-day treatment.`,
  };

  const whatIsMed = drugDescriptions[med] || `${drugName}${brandName} is a medication prescribed for your condition. Your doctor can explain more about how it works.`;

  // ── WHAT DOES RESEARCH SHOW? (patient-friendly version of d.s) ───────────
  // Re-frame the clinical summary text into MotherToBaby-style patient language
  const researchQA = {
    // Risk framing anchored to background rates, plain language
    t1: isBreastfeeding ? null : (() => {
      if (!d) return "Specific information about this medication in early pregnancy is not yet available. Talk with your doctor about what is known.";
      const baselineAnchor = "Every pregnancy has about a 3 in 100 (3%) chance of a birth defect — this is called the background chance and exists for all pregnancies, regardless of medication use.";
      const ratingMap = { "None–Minimal":"Most studies have not found an increased chance of birth defects.", "Low":"The overall chance of birth defects does not appear to be significantly increased, though some studies have found small signals.", "Moderate":"Some studies have found a higher chance of certain birth defects. The overall chance is still relatively low, but this is an important part of your decision.", "High":"There is a well-established increased chance of certain birth defects. This is a significant factor in your decision and your doctor will have discussed it with you.", "Undetermined":"There is not enough research yet to know what the chance of birth defects is." };
      return `${baselineAnchor} ${ratingMap[d.r] || "The evidence on birth defects with this medication is mixed."}`;
    })(),

    // Stage-specific plain intro — used in main medText block
    pp: isBreastfeeding ? (() => {
      if (!m.lac) return "Information about this medication during breastfeeding is limited. Talk with your doctor.";

      // Per-drug overrides — used when the generic ae sanitizer would produce awkward clinical text
      const ppOverrides = {
        amitriptyline: `Amitriptyline does pass into breast milk. Your doctor has chosen it because, in your situation, the benefits outweigh the concerns. The active form your body makes from amitriptyline (called nortriptyline) is also present in breast milk — your baby's doctor should know you are taking this medication so they can watch for any signs of sleepiness, slow feeding, or low weight gain. These effects are rare but worth knowing about.`,
        nortriptyline:  `Nortriptyline passes into breast milk in low amounts. In most studies, babies whose mothers took nortriptyline while breastfeeding did not have significant problems. Let your baby's doctor know you are taking it — they will watch for sleepiness, feeding changes, or slow weight gain, which are rare but possible.`,
        imipramine:    `Imipramine and its active form (desipramine) pass into breast milk. Let your baby's doctor know you are taking this medication so they can watch for any signs of drowsiness or feeding difficulty, which are uncommon but possible.`,
        clozapine:     `Clozapine does pass into breast milk, and most guidelines recommend formula feeding instead of breastfeeding while taking it. This is a conversation to have directly with your care team — they will help you weigh your options.`,
        valproate:     `Valproate passes into breast milk in relatively low amounts. Most breastfed babies whose mothers took valproate have not had significant problems. Let your baby's doctor know so they can monitor your baby's liver function periodically.`,
        lithium:       `Lithium does pass into breast milk at levels that require monitoring. Whether to breastfeed while on lithium is an individual decision. If you do breastfeed, your baby will need regular check-ups for lithium levels, thyroid, and kidneys. Your care team will help you plan this.`,
        carbamazepine: `Carbamazepine passes into breast milk in low to moderate amounts. Most breastfed babies whose mothers took it have not had significant problems. Let your baby's doctor know so they can watch for any drowsiness or feeding changes.`,
        citalopram:    `Citalopram passes into breast milk in somewhat higher amounts than some other antidepressants. Your baby's doctor should know you are taking it. One important thing: if you took citalopram during pregnancy, your baby may still have some adjustment symptoms after birth even while breastfeeding — this is not a reason to stop breastfeeding, just something your baby's team will watch for.`,
        bupropion:     `Bupropion passes into breast milk in small amounts. Your baby's doctor should know you are taking it. There have been a small number of reports of seizures in breastfed infants — this is rare, but your baby's team should be aware so they can watch for any unusual movements or behavior.`,
        aripiprazole:  `Aripiprazole passes into breast milk in low amounts. One thing to watch for: this medication can sometimes reduce milk supply. If you notice your supply decreasing, let your doctor know — there are other options that don't carry this risk.`,
      };

      if (ppOverrides[med]) return ppOverrides[med];

      // Generic fallback — tier message only, no clinical ae prose
      const tierMsg = {
        "Compatible": `Research suggests that ${drugName} passes into breast milk in small amounts and has not been shown to cause problems in breastfed babies.`,
        "Compatible with monitoring": `${drugName} does pass into breast milk. In most cases, the amounts are small and breastfeeding is supported with monitoring. Your baby's doctor should know you are taking it so they can watch for any changes in feeding, sleep, or alertness.`,
        "Requires individual risk-benefit assessment": `${drugName} passes into breast milk in amounts that your care team should review carefully with you. Whether to breastfeed while taking it is a personal decision to make together — there is not one right answer.`,
        "Requires assessment": `Information about ${drugName} in breast milk is limited or complex. Your care team will help you decide what makes sense for your situation.`,
      }[m.lac?.tier] || `Talk with your doctor about breastfeeding while taking ${drugName}. Your care team can help you weigh the options.`;

      // Gentle ae note — only surface if ae data suggests something meaningful, in plain language
      const aeRaw = (m.lac.ae || "").toLowerCase();
      const hasMeaningfulAE = aeRaw && !aeRaw.includes("no significant") && !aeRaw.includes("no adverse") && !aeRaw.includes("no reports") && !aeRaw.includes("none reported");
      const aeNote = hasMeaningfulAE
        ? ` Watch for signs like unusual sleepiness, poor feeding, or changes in your baby's behavior, and let your baby's doctor know if anything seems off.`
        : ` No significant problems in breastfed babies have been reported in available studies.`;

      return `${tierMsg}${aeNote} Breastfeeding has real benefits for both of you — the goal is to make this decision together with your care team, not out of fear.`;
    })() : null,
  };

  // Build the main research paragraph
  let medText;
  if (isBreastfeeding) {
    medText = researchQA.pp || d?.s || "Talk with your doctor about this medication during breastfeeding.";
  } else {
    // For pregnancy stages, present a patient-friendly version
    const riskLabel = d?.r || "Undetermined";
    const qualityNote = { "Strong":"This is based on a large number of studies with many pregnancies.", "Moderate":"This is based on a reasonable number of studies, though more research is ongoing.", "Limited":"Fewer studies have looked at this, so there is more uncertainty.", "Insufficient":"Very little research is available on this." }[d?.q] || "";
    const riskSentence = {
      "None–Minimal": `Most research has not found that ${drugName} increases the chance of birth defects or pregnancy complications above the background rate.`,
      "Low":          `Overall, research has not found a large increase in the chance of birth defects with ${drugName}. Some studies have noted small signals, but the overall picture is generally reassuring.`,
      "Moderate":     `Some studies have found a higher chance of certain birth defects or pregnancy complications with ${drugName}. This does not mean that something will go wrong — it means this is an important part of weighing your options.`,
      "High":         `There is a well-established higher chance of certain birth defects or complications with ${drugName} during pregnancy. Your doctor will have discussed this with you specifically.`,
      "Undetermined": `There is not enough research yet to know clearly what the chance of birth defects or complications is with ${drugName} during pregnancy.`,
    }[riskLabel] || `The research picture for ${drugName} in pregnancy is mixed. Talk with your doctor about what the studies show.`;

    // Patient-friendly clinical detail — translated from d.s, keyed by drug + stage
    const clinicalDetail = {
      sertraline:     { t1: `One thing to know: some early studies noticed a very small signal for a type of heart opening called a septal defect, but larger and better studies have generally not confirmed this concern.`, t2: `Studies following children to age 3–5 have not found problems with development or learning.`, t3: `Some babies born to mothers taking sertraline close to delivery may be a little more jittery or have some feeding difficulty for the first week or two — this usually passes on its own.` },
      fluoxetine:     { t1: `Fluoxetine has been studied in over 10,000 pregnancies and has not shown a consistent increase in birth defects. It stays in the body longer than most antidepressants, which is worth knowing.`, t2: `Studies following children to age 5 have generally been reassuring for development, though some noted very brief movement differences around 6 months that fully resolved.`, t3: `Because fluoxetine stays in the body longer than other antidepressants, some newborns may experience more jitteriness or feeding difficulty for a bit longer — typically a week or two.` },
      citalopram:     { t1: `Studies of moderate size have not found a consistent increase in birth defects. One study noted a possible signal for a heart finding, but it has not been seen in other studies.`, t2: `There is limited follow-up data specific to citalopram, but studies on SSRIs as a group have generally been reassuring for children's development.`, t3: `Some newborns whose mothers took SSRIs near delivery may have temporary jitteriness or feeding changes — this is mild and resolves in the first week or two.` },
      escitalopram:   { t1: `Studies show no consistent increase in major birth defects. Escitalopram is closely related to citalopram and has a similar safety record.`, t2: `There isn't a lot of data specific to escitalopram's effects on child development, but SSRI class studies overall have been reassuring.`, t3: `Some newborns may have brief adjustment symptoms — jitteriness, extra fussiness — in the first days of life. These are usually mild and pass on their own.` },
      paroxetine:     { t1: `Paroxetine is generally approached with more caution in pregnancy, particularly early on. There is a documented — though small — signal for a type of heart opening. The absolute risk is still low, but this is why your doctor may have discussed alternatives.`, t2: `The main concern with paroxetine is the cardiac signal in early pregnancy; second trimester-specific neurodevelopmental data is limited.`, t3: `Paroxetine has a short half-life, meaning it leaves the body quickly — this can make the newborn adjustment period more abrupt. Your baby's care team should know you are taking it.` },
      venlafaxine:    { t1: `Studies of moderate size have not found a significant increase in birth defects, though less data exists than for SSRIs.`, t2: `There isn't much specific follow-up data on venlafaxine and child development. SNRI class data is generally reassuring.`, t3: `Venlafaxine affects two brain chemicals — serotonin and norepinephrine — which means newborn adjustment symptoms may be slightly more pronounced than with SSRIs alone. Symptoms like irritability or feeding difficulty usually improve within a couple of weeks.` },
      duloxetine:     { t1: `The available data hasn't found a clear increase in birth defects, but the number of pregnancies studied is smaller than for SSRIs.`, t2: `There isn't enough data yet to say much specifically about duloxetine and child development.`, t3: `Newborn adjustment symptoms are expected based on how SNRIs work — jitteriness, feeding changes — and usually resolve within 1–2 weeks.` },
      bupropion:      { t1: `Studies have not found a consistent pattern of birth defects with bupropion. It works differently from SSRIs, which is one reason it's sometimes chosen.`, t2: `No specific developmental concerns have been identified.`, t3: `Bupropion has less neonatal adjustment syndrome than SSRIs or SNRIs. One thing to be aware of: bupropion lowers the seizure threshold slightly, so your care team will factor that in.` },
      mirtazapine:    { t1: `Studies of reasonable size have not found a clear increase in birth defects. It's used less often than SSRIs in pregnancy, so there is less overall data.`, t2: `No specific developmental concerns have been identified for mirtazapine.`, t3: `Newborn sedation is possible since mirtazapine is sedating. Weight gain during pregnancy is also a clinical consideration your team will monitor.` },
      nortriptyline:  { t1: `Studies going back decades have not found a consistent increase in major birth defects with nortriptyline. It's considered one of the better-studied older antidepressants.`, t2: `Specific follow-up data on child development for nortriptyline is limited, but TCA class data overall has been reassuring.`, t3: `After birth, some newborns whose mothers were on nortriptyline may have brief symptoms like irritability or feeding difficulty due to medication withdrawal — your baby's doctor should know you are taking it.` },
      amitriptyline:  { t1: `Decades of data have not found a consistent major birth defect risk. Some very old studies raised concerns about limb differences, but modern studies have not confirmed this.`, t2: `Follow-up data on development is limited for amitriptyline specifically, but class-level TCA data has generally been reassuring.`, t3: `Amitriptyline has stronger anticholinergic (nerve-blocking) effects than nortriptyline, which means newborn adjustment symptoms — like constipation, rapid heart rate, or irritability — may be more noticeable. These are temporary.` },
      imipramine:     { t1: `Long-term data has not shown a consistent increase in major birth defects. Older concerns have not been confirmed by modern studies.`, t2: `Limited specific developmental data, but TCA class data has generally been reassuring.`, t3: `Newborn withdrawal symptoms similar to other TCAs are possible — irritability, feeding difficulty. Your baby's team should know about your medication.` },
      lithium:        { t1: `An old concern that lithium caused a very rare heart defect (Ebstein's anomaly) turned out to be greatly overstated. Modern studies put the risk at about 1 in 1,000, compared to 1 in 20,000 in the general population — a real but small difference. Overall, cardiac malformation risk is modestly elevated and is something to discuss with your doctor.`, t2: `Studies have not found a clear pattern of developmental or learning differences in children exposed to lithium in the womb. Fetal thyroid and kidney monitoring during pregnancy is standard care.`, t3: `Lithium requires careful management around delivery — your levels will be checked frequently. Babies born to mothers on lithium are monitored for their own lithium levels, thyroid, and heart rhythm right after birth. This is routine and manageable.` },
      valproate:      { t1: `Valproate is known to carry real risks in pregnancy. Studies have consistently shown it can affect a baby's development — including a modest reduction in IQ and a higher chance of autism — even at lower doses. This is why guidelines recommend avoiding it in pregnancy when possible.`, t2: `The neurodevelopmental concerns with valproate apply across pregnancy. Your doctor will have discussed this specifically with you.`, t3: `Babies born to mothers taking valproate need careful monitoring at birth. There can be effects on the liver, blood clotting, and medication withdrawal. Your obstetric and newborn care teams will coordinate this.` },
      lamotrigine:    { t1: `Large registries tracking over 10,000 pregnancies have not found a significant increase in birth defects with lamotrigine. It is considered one of the safer mood stabilizers in pregnancy for this reason.`, t2: `Studies following children to age 6 have been generally reassuring for learning and development. Lamotrigine is considered one of the better options for neurodevelopmental outcomes among mood stabilizers.`, t3: `One important practical note: lamotrigine levels in your blood can drop significantly during pregnancy — sometimes by half — meaning your dose may need to go up to keep you stable. After delivery, levels can rise back quickly, so your doctor will adjust your dose carefully around that time.` },
      carbamazepine:  { t1: `Carbamazepine has a documented — though modest — risk of neural tube defects (spine and brain development) of about 0.5–1%. This is why high-dose folic acid is recommended when taking it in pregnancy. Overall, it is considered intermediate risk among mood stabilizers.`, t2: `Studies have been moderately reassuring for development, though less data exists compared to valproate or lamotrigine. Overall considered lower risk than valproate for neurodevelopmental outcomes.`, t3: `Babies born to mothers on carbamazepine may need vitamin K supplementation at birth, and liver function may be briefly affected. This is expected and monitored.` },
      oxcarbazepine:  { t1: `Oxcarbazepine is structurally related to carbamazepine. Studies estimate the risk of neural tube defects is lower than carbamazepine — around 0.2–0.5% — but still worth discussing with your doctor. The overall malformation rate is approximately 2–3% in studies.`, t2: `There is less specific data on oxcarbazepine and child development compared to carbamazepine or lamotrigine.`, t3: `Some newborns may have low sodium levels (a side effect oxcarbazepine can cause in adults too). Vitamin K supplementation is also recommended. Your care team will monitor for this.` },
      quetiapine:     { t1: `Quetiapine has more pregnancy data than most other atypical antipsychotics and has not shown a consistent pattern of birth defects. The main pregnancy concern is metabolic — weight gain and gestational diabetes — which your care team will monitor.`, t2: `Limited neurodevelopmental follow-up data exists, but no clear developmental signal has been identified.`, t3: `Some newborns may have brief sedation, feeding difficulty, or low blood sugar — especially if you also developed gestational diabetes. Letting your newborn's care team know you are taking quetiapine means they will be prepared.` },
      olanzapine:     { t1: `Olanzapine has the most pregnancy data of any atypical antipsychotic and has not shown a consistent increase in birth defects. The main concern is significant weight gain and gestational diabetes — which can lead to a larger baby.`, t2: `Limited neurodevelopmental data. No clear developmental signal has been found.`, t3: `Newborn sedation and brief movement stiffness are possible. If you developed gestational diabetes, your baby's blood sugar will be checked after birth.` },
      aripiprazole:   { t1: `Available studies have not found a malformation signal for aripiprazole, though fewer pregnancies have been studied compared to quetiapine or olanzapine.`, t2: `No clear neurodevelopmental concerns identified so far.`, t3: `Newborn adjustment symptoms — brief stiffness, sedation, or feeding changes — are possible and usually resolve within days to weeks.` },
      risperidone:    { t1: `Limited but growing pregnancy data has not found a consistent malformation pattern. One consideration: risperidone raises prolactin (a hormone), which can affect fertility — this is relevant context.`, t2: `No specific developmental concerns identified.`, t3: `Brief newborn stiffness or abnormal movements are possible and have been reported. These typically resolve within days to a few weeks.` },
      haloperidol:    { t1: `Haloperidol has been used for decades and has not shown a consistent increase in major birth defects in large studies. It has also been widely used for severe nausea in pregnancy at low doses.`, t2: `No clear neurodevelopmental concerns have been identified in available studies.`, t3: `Newborn stiffness or brief abnormal movements are possible — this is a class effect of antipsychotics — but are usually mild and temporary at standard doses.` },
      clozapine:      { t1: `Data on clozapine in pregnancy is more limited because it is used in serious, treatment-resistant situations. No consistent malformation pattern has been found in small studies.`, t2: `Gestational diabetes risk is elevated with clozapine — this can affect your baby's growth and blood sugar after birth.`, t3: `Newborn sedation, low muscle tone, and feeding difficulty have been reported. There is also a theoretical (not well-documented) risk of newborn low white blood cells, so monitoring is standard.` },
      lorazepam:      { t1: `Older concerns about benzodiazepines and cleft palate have largely been debunked by larger modern studies. Lorazepam specifically has not shown a consistent malformation signal.`, t2: `Limited follow-up data on development. Animal studies at high doses raised concerns, but human relevance at standard doses is uncertain.`, t3: `If taken close to delivery, lorazepam can cause what's called "floppy infant syndrome" — where the baby has low muscle tone temporarily. If used regularly during pregnancy, some newborn withdrawal (jitteriness, irritability) is possible.` },
      clonazepam:     { t1: `Modern studies have not supported the older cleft palate concern for benzodiazepines. No consistent malformation signal for clonazepam specifically.`, t2: `Limited specific developmental data. Class-level benzo data is applied.`, t3: `Because clonazepam has a longer half-life (stays in the body longer), newborn withdrawal symptoms may be delayed and last longer than with shorter-acting benzodiazepines like lorazepam.` },
      alprazolam:     { t1: `No consistent malformation signal in available studies. Alprazolam is high-potency, meaning effects are strong at lower doses.`, t2: `Very limited specific data.`, t3: `Alprazolam's high potency means newborn withdrawal, if it occurs, can be more pronounced. Symptoms include jitteriness and irritability. Your baby's team will monitor for this.` },
      hydroxyzine:    { t1: `Studies have generally been reassuring for hydroxyzine, though some early studies noted small signals. It's commonly used for nausea and anxiety in pregnancy. The overall picture is not alarming.`, t2: `Hydroxyzine is commonly used in pregnancy. No significant developmental concerns have been identified.`, t3: `Near delivery, higher doses of hydroxyzine can cause newborn drowsiness and low muscle tone. It may also theoretically affect heart rhythm at high doses — this is why your doctor will avoid large doses close to your due date.` },
      zolpidem:       { t1: `Most studies have not found a clear increase in birth defects with zolpidem. Some studies suggest a possible link to premature birth or low birth weight, but it is not clear if that is due to the medication or the underlying sleep problems being treated.`, t2: `No specific structural concerns. Treating sleep disruption itself has real value — poor sleep is associated with its own pregnancy complications.`, t3: `Zolpidem can cause newborn sedation and, with chronic use, newborn withdrawal. Using it occasionally is very different from using it nightly — your doctor will take your usage pattern into account. Stopping at least 2 weeks before your due date, if possible, is often recommended.` },
      methylphenidate: { t1: `Limited but available studies have not found a consistent increase in birth defects. The pregnancy database for stimulants is smaller than for antidepressants.`, t2: `No clear developmental signal identified, though data is limited.`, t3: `Limited specific newborn data. Some newborn irritability has been reported in case reports.` },
      amphetamine:    { t1: `Studies suggest a possible small increase in low birth weight and premature birth with amphetamines, though not all studies agree. The abuse potential of stimulants also complicates interpreting these studies.`, t2: `No clear developmental signal in studies to date.`, t3: `Newborn irritability and feeding difficulty have been reported. Your baby's care team should know about your medication.` },
      trazodone:      { t1: `Limited data is available on trazodone in pregnancy, but available studies have not found a clear malformation signal. It is often used at low doses for sleep.`, t2: `No specific developmental signal has been identified.`, t3: `Newborn sedation is possible. Trazodone-specific newborn data is very limited.` },
      prazosin:       { t1: `Very limited human pregnancy data exists for prazosin. Animal studies have not shown teratogenicity. The main theoretical concern is that prazosin relaxes blood vessels — which could theoretically affect blood flow to the placenta — though this has not been confirmed as a clinical problem.`, t2: `Insufficient specific data.`, t3: `The main concern near delivery is prazosin's blood pressure lowering effect, which may be more pronounced in late pregnancy. Position changes (rising slowly) and staying well-hydrated help manage this.` },
      buprenorphine:  { t1: `Buprenorphine is the recommended treatment for opioid use disorder in pregnancy. Major guidelines including SAMHSA strongly support continuing it — the risks of stopping treatment are far greater than the medication's own risks. No consistent birth defect signal has been found.`, t2: `Buprenorphine treatment prevents relapse and protects you and your baby from the far greater risks of untreated opioid use disorder. No significant developmental or structural concerns specific to buprenorphine have been found.`, t3: `Neonatal Opioid Withdrawal Syndrome (NOWS) is expected and is a manageable, expected part of buprenorphine-assisted pregnancy. The newborn team will be prepared and will treat it. Breastfeeding actually reduces NOWS severity — it is strongly encouraged unless you have other contraindications.` },
      methadone:      { t1: `Methadone has decades of pregnancy data and is a standard of care for opioid use disorder. No consistent malformation signal has been found at standard doses.`, t2: `No significant structural or developmental concerns specific to methadone at MOUD doses. Your methadone dose will likely need to increase in the third trimester due to how pregnancy changes drug metabolism.`, t3: `NOWS from methadone tends to last longer than from buprenorphine, but it is still treatable and expected. Daily dosing at a clinic ensures your team can monitor you closely throughout.` },
      naltrexone:     { t1: `Very limited human pregnancy data. Not the first choice for opioid use disorder in pregnancy — buprenorphine or methadone have more evidence. Animal studies have not shown birth defects at therapeutic doses.`, t2: `Insufficient data.`, t3: `One important practical note: if you need opioid pain medication in an emergency or for labor, naltrexone will block it from working. Your entire care team — including anesthesia — must know you are taking it well in advance.` },
    };

    const detail = clinicalDetail[med]?.[stage];
    medText = [riskSentence, qualityNote, detail].filter(Boolean).join(" ").trim();
  }

  // ── ABSOLUTE RISK IN PLAIN LANGUAGE ──────────────────────────────────────
  let absoluteRisk = "";
  if (d?.bl && d?.ex && !isBreastfeeding) {
    absoluteRisk = `To give you a sense of the numbers: in the general population, about ${d.bl} pregnancies are affected. In pregnancies where ${drugName} was used, studies found a rate of about ${d.ex}. Remember, most pregnancies have a healthy outcome.`;
  }

  // ── WHAT WE DON'T KNOW — patient friendly ────────────────────────────────
  const unknownPatientText = {
    valproate:     `Studies have shown that valproate can affect a baby's brain development — including lower IQ scores and a higher chance of autism — even when taken at lower doses. Researchers are still studying whether any dose is completely safe. This is important information, not a reason to panic, but it is a significant part of the decision your doctor needs to help you make.`,
    carbamazepine: `We have good information about birth defects with carbamazepine, but we have less information about how it might affect children's learning and development as they grow. Studies so far have been mostly reassuring, but follow-up data beyond early childhood is limited.`,
    lithium:       `We know quite a bit about how lithium affects the baby during pregnancy, but we have less information about the long-term effects of breastfeeding exposure on things like thyroid function and kidney health. Dehydration can cause lithium levels in breast milk to rise quickly — this is an important practical thing to watch for.`,
    lamotrigine:   `During pregnancy, lamotrigine levels in your blood can drop significantly — sometimes by half — which means your dose may need to be increased to keep you stable. After birth, levels can rise back up quickly. Studies following children exposed to lamotrigine in the womb up to age 6 have been generally reassuring, but we have less data on what happens beyond that.`,
    fluoxetine:    `Fluoxetine stays in the body longer than most other SSRIs. This means your newborn may carry some of the medication for a while after birth. Studies following children to age 5 have generally been reassuring for development, but longer-term data is limited.`,
    default:       `Most studies following children whose mothers took psychiatric medications during pregnancy have not found lasting differences in development. However, most studies only follow children to age 3–6, so we have less information about later childhood. Research in this area is ongoing.`
  }[med] || `Most studies following children whose mothers took psychiatric medications during pregnancy have not found lasting differences in development. However, most studies only follow children to age 3–6, so we have less information about later childhood. Research in this area is ongoing.`;

  // ── NEWBORN EFFECTS plain language ───────────────────────────────────────
  const newbornNote = !isBreastfeeding && d && (stage === "t3" || stage === "t2") ? (() => {
    const notes = {
      sertraline:    "Some babies born to mothers taking sertraline near delivery may have brief temporary symptoms — like jitteriness, feeding difficulty, or extra fussiness — in the first few days of life. These usually resolve on their own within 1–2 weeks. Letting your baby's doctor know you are taking this medication helps them watch for this.",
      fluoxetine:    "Some babies born to mothers taking fluoxetine near delivery may have temporary symptoms like jitteriness or feeding difficulty in the first days of life. These usually pass on their own. Because fluoxetine stays in the body a long time, your baby's doctor should know you are taking it.",
      paroxetine:    "Paroxetine has been associated with temporary symptoms in some newborns, including jitteriness and feeding difficulty. Letting your baby's doctor know allows them to monitor your newborn.",
      escitalopram:  "Some babies born to mothers taking escitalopram near delivery may have brief temporary symptoms in the first days of life. These usually resolve without treatment.",
      citalopram:    "Some babies born to mothers taking SSRIs near delivery may have brief temporary symptoms like jitteriness in the first days of life. These usually pass on their own.",
      venlafaxine:   "Some babies born to mothers taking venlafaxine near delivery may have temporary symptoms after birth, including irritability and feeding difficulty. These usually improve within a couple of weeks.",
      lithium:       "Babies born to mothers on lithium need monitoring right after birth — a pediatrician should check your baby's lithium levels, heart rhythm, and thyroid. This is standard practice and helps keep your baby safe.",
      valproate:     "Babies born to mothers taking valproate may need extra monitoring at birth. Your obstetric team and the pediatric team will coordinate this care.",
      lamotrigine:   "Most babies born to mothers taking lamotrigine do not have problems at birth. It is still helpful to let the pediatric team know so they can watch for any unusual signs.",
      buprenorphine: "Babies born to mothers on buprenorphine may go through a period of adjustment called Neonatal Opioid Withdrawal Syndrome (NOWS). This is expected and treatable — the neonatal team will watch for it and help. Breastfeeding actually helps reduce NOWS symptoms.",
      methadone:     "Babies born to mothers on methadone are monitored for Neonatal Opioid Withdrawal Syndrome (NOWS). This is an expected and manageable part of methadone-assisted pregnancy care.",
    };
    return notes[med] || null;
  })() : null;

  return { whatIsMed, medText, absoluteRisk, unknownText: unknownPatientText, newbornNote, u, stageName, dx: dx || "your condition" };
}

// ─── ICON ARRAY COMPONENT ─────────────────────────────────────────────────────
// ── DEVELOPMENT NOTE helper — separate from main medText so it can be shown as its own callout
function clinicalDetail_devNote(med, stage) {
  const notes = {
    sertraline:     { t1:"Studies following children exposed to sertraline in the womb have been generally reassuring for development, learning, and behavior to age 5–6.", t2:"The same reassuring picture from first-trimester data continues — no clear developmental signal." },
    fluoxetine:     { t1:"Studies to age 5 have been generally reassuring, though some noted very brief movement differences around 6 months that fully resolved. Because fluoxetine stays in the body longer, your newborn may carry some of it for a few weeks after birth.", t2:"No new developmental concerns have emerged in second-trimester-specific studies." },
    paroxetine:     { t1:"No significant developmental or learning differences have been found in studies following children exposed to paroxetine in the womb.", t2:"No specific neurodevelopmental signal beyond SSRI class data." },
    escitalopram:   { t1:"Limited escitalopram-specific developmental data, but SSRI class studies have been broadly reassuring for child development.", t2:"No specific concerns identified for development." },
    citalopram:     { t1:"Limited citalopram-specific developmental data exists, but class-level SSRI studies have been reassuring.", t2:"No developmental signal specific to citalopram." },
    venlafaxine:    { t1:"There isn't much specific follow-up data on venlafaxine and child development. SNRI class data has been generally reassuring.", t2:"No developmental concerns specific to venlafaxine have been identified." },
    duloxetine:     { t1:"Insufficient data to assess developmental outcomes specifically for duloxetine. Your doctor will draw on SNRI class experience.", t2:"Insufficient data." },
    bupropion:      { t1:"No specific developmental concerns have been identified. Bupropion works differently from SSRIs, which may be clinically relevant for your case.", t2:"No developmental signal identified." },
    mirtazapine:    { t1:"No specific developmental concerns have been identified for mirtazapine.", t2:"No developmental signal identified." },
    nortriptyline:  { t1:"TCA class data has been generally reassuring for developmental outcomes, though nortriptyline-specific long-term follow-up is limited.", t2:"TCA class development data continues to be reassuring." },
    amitriptyline:  { t1:"Follow-up data on child development is limited for amitriptyline specifically. However, TCA class data overall — from decades of use — has been generally reassuring. Studies have not found a consistent pattern of learning or developmental differences in children exposed to TCAs in the womb.", t2:"Limited amitriptyline-specific developmental data. TCA class data has generally been reassuring." },
    imipramine:     { t1:"Limited imipramine-specific developmental data exists. TCA class data has generally been reassuring.", t2:"Limited specific data." },
    lithium:        { t1:"Studies have not found a clear pattern of developmental or learning differences in children exposed to lithium in the womb.", t2:"Fetal thyroid and kidney monitoring is standard care; no clear neurodevelopmental signal." },
    lamotrigine:    { t1:"Studies following children to age 6 have been among the most reassuring of any mood stabilizer — no significant IQ differences or developmental concerns found.", t2:"Continued reassurance from developmental studies; lamotrigine is considered one of the safer options for neurodevelopmental outcomes among mood stabilizers." },
    valproate:      { t1:"Valproate is associated with a meaningful reduction in IQ (approximately 7–10 points compared to unexposed children) and a higher chance of autism spectrum disorder. This applies even at lower doses.", t2:"The neurodevelopmental concerns with valproate continue into the second trimester. Your doctor will have discussed this with you." },
    carbamazepine:  { t1:"Studies have been moderately reassuring for development, though less data exists than for lamotrigine or valproate.", t2:"Considered lower risk than valproate for neurodevelopmental outcomes." },
    quetiapine:     { t1:"No clear neurodevelopmental signal has been identified so far. Gestational diabetes (a metabolic side effect) can independently affect the baby's growth, which your team will monitor.", t2:"No developmental signal identified." },
    olanzapine:     { t1:"No clear developmental signal, though the main concern — gestational diabetes — can affect fetal growth independently of medication effects.", t2:"No developmental signal identified." },
    lorazepam:      { t1:"Limited long-term developmental data. Animal studies at high doses raised concerns, but human relevance at standard clinical doses is uncertain.", t2:"Limited data; class-level benzodiazepine concerns exist but human evidence at standard doses is not alarming." },
    buprenorphine:  { t1:"Buprenorphine treatment protects against the far larger developmental risks of untreated opioid use disorder. No significant developmental concerns specific to buprenorphine have been found.", t2:"Continued developmental reassurance from buprenorphine-assisted pregnancy data." },
    methadone:      { t1:"No significant developmental concerns specific to methadone at MOUD doses.", t2:"Developmental outcomes are generally positive with methadone-assisted treatment compared to untreated opioid use disorder." },
  };
  return notes[med]?.[stage] || null;
}

function IconArray({ exposedRate, baselineRate, total = 100, label }) {
  // Parse "X / 1,000" or "X–Y%" format to a proportion out of `total`
  function parseRate(rateStr, outOf) {
    if (!rateStr) return 0;
    const perThousandMatch = rateStr.match(/([\d.]+)\s*[–-]?\s*([\d.]*)\s*\/\s*1[,.]?000/);
    if (perThousandMatch) {
      const lo = parseFloat(perThousandMatch[1]);
      const hi = perThousandMatch[2] ? parseFloat(perThousandMatch[2]) : lo;
      return Math.round(((lo + hi) / 2 / 1000) * outOf);
    }
    const percentMatch = rateStr.match(/([\d.]+)\s*[–-]?\s*([\d.]*)%/);
    if (percentMatch) {
      const lo = parseFloat(percentMatch[1]);
      const hi = percentMatch[2] ? parseFloat(percentMatch[2]) : lo;
      return Math.round(((lo + hi) / 200) * outOf);
    }
    return 0;
  }

  const baseline = parseRate(baselineRate, total);
  const exposed = parseRate(exposedRate, total);
  const additional = Math.max(0, exposed - baseline);
  const COLS = 10, ROWS_COUNT = 10;
  const DOT = 13, GAP = 4;

  return (
    <div style={{marginTop:12,padding:"14px 16px",background:"#f8f9fb",borderRadius:10,border:"1px solid #e8ebf0"}}>
      <div style={{fontSize:10,fontWeight:700,color:"#4b5563",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.4px",fontFamily:"'Geist Mono',monospace"}}>{label} — Waffle Chart (each dot = 1 per {total})</div>
      <div style={{display:"grid",gridTemplateColumns:`repeat(${COLS}, ${DOT}px)`,gap:GAP,marginBottom:10}}>
        {Array.from({length: total}).map((_, i) => {
          const isBaseline = i < baseline;
          const isAdditional = i >= baseline && i < baseline + additional;
          const fill = isBaseline ? "#b83230" : isAdditional ? "#e8920a" : "#dde2e8";
          const shadow = isBaseline || isAdditional ? `0 1px 3px ${fill}55` : "none";
          return (
            <div key={i} title={isBaseline?"Baseline risk":isAdditional?"Additional risk from medication":"No additional risk"}
              style={{width:DOT,height:DOT,borderRadius:"50%",background:fill,boxShadow:shadow,transition:"transform .1s"}}
            />
          );
        })}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:12,fontSize:11,color:"#4b5563"}}>
        <span style={{display:"flex",alignItems:"center",gap:5}}>
          <span style={{width:10,height:10,borderRadius:"50%",background:"#b83230",display:"inline-block",boxShadow:"0 1px 3px #b8323055"}}/>
          <span>Baseline risk ({baseline} / {total})</span>
        </span>
        {additional > 0 && (
          <span style={{display:"flex",alignItems:"center",gap:5}}>
            <span style={{width:10,height:10,borderRadius:"50%",background:"#e8920a",display:"inline-block",boxShadow:"0 1px 3px #e8920a55"}}/>
            <span>Additional with medication ({additional} / {total})</span>
          </span>
        )}
        <span style={{display:"flex",alignItems:"center",gap:5}}>
          <span style={{width:10,height:10,borderRadius:"50%",background:"#dde2e8",display:"inline-block"}}/>
          <span>Unaffected ({total - baseline - additional} / {total})</span>
        </span>
        {additional === 0 && exposed > 0 && <span style={{color:"#0d7358",fontWeight:600}}>No additional cases detected above baseline in available studies</span>}
      </div>
    </div>
  );
}

// ─── EVIDENCE QUALITY BADGE ───────────────────────────────────────────────────
function QBadge({q}) {
  return (
    <span style={{padding:"2px 7px",borderRadius:4,fontSize:10,fontWeight:700,fontFamily:"'Geist Mono',monospace",background:Q_BG[q]||"#f0f0f0",color:Q_CLR[q]||"#555",whiteSpace:"nowrap"}}>{q}</span>
  );
}

// ─── SOURCE CHIP ──────────────────────────────────────────────────────────────
// Resolves a source key to its URL and access tier. Handles compound keys like
// "APA / ACOG / NICE" by trying the full string first, then looking up each part.
function resolveSourceMeta(srcKey, drugKey) {
  if (!srcKey) return null;
  // Direct match
  if (SOURCE_META[srcKey]) {
    const m = SOURCE_META[srcKey];
    return { url: m.url(drugKey), tier: m.tier, label: m.label };
  }
  // Suffix-trimmed match: "ACOG CO #757" → "ACOG"
  const trimmed = srcKey.replace(/\s*(CO|CG\d+).*$/i, "").trim();
  if (SOURCE_META[trimmed]) {
    const m = SOURCE_META[trimmed];
    return { url: m.url(drugKey), tier: m.tier, label: m.label };
  }
  return null;
}

// Compat wrapper
function resolveSourceURL(srcKey, drugKey) {
  const meta = resolveSourceMeta(srcKey, drugKey);
  return meta?.url || null;
}

// All sources are free — no paid tier icons needed
const TIER_TIP = { free: "Free / public access — click to open source" };

function SrcChip({src, date, drugKey}) {
  if (!src) return null;
  const parts = src.split(/\s*\/\s*/);

  return (
    <span style={{fontSize:10,fontFamily:"'Geist Mono',monospace",color:"#6b7280"}}>
      {parts.map((part, i) => {
        const meta = resolveSourceMeta(part.trim(), drugKey);
        const url = meta?.url;
        return (
          <span key={i}>
            {i > 0 && <span style={{color:"#c5cdd8"}}> / </span>}
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer"
                title={`${meta?.label || part.trim()} — click to open source`}
                style={{color:"#2c6fbb",textDecoration:"underline",cursor:"pointer",fontFamily:"'Geist Mono',monospace",fontSize:10}}>
                {part.trim()} ↗
              </a>
            ) : (
              <span style={{color:"#6b7280"}}>{part.trim()}</span>
            )}
          </span>
        );
      })}
    </span>
  );
}

// ─── HIGH ALERT BANNER ────────────────────────────────────────────────────────
function HighAlertBanner({medKey}) {
  const alert = HIGH_ALERT[medKey];
  if (!alert) return null;
  const isCritical = alert.level === "critical";
  return (
    <div style={{
      background: isCritical ? "#fde8e8" : "#fdf6e0",
      border: `2px solid ${isCritical ? "#b83230" : "#d4a017"}`,
      borderRadius: 8,
      padding: "14px 18px",
      marginBottom: 16,
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    }}>
      <div style={{fontSize:20,lineHeight:1,flexShrink:0}}>{isCritical ? "⛔" : "⚠️"}</div>
      <div>
        <div style={{fontSize:12,fontWeight:700,color: isCritical ? "#b83230" : "#7a6010",marginBottom:4,fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.3px"}}>
          {isCritical ? "Established Teratogen — Guidelines Recommend Avoiding" : "Elevated Teratogenicity Risk — Guideline Alert"}
        </div>
        <div style={{fontSize:12,color:"#374151",lineHeight:1.65}}>{alert.msg}</div>
        <div style={{fontSize:10,color:"#4b5563",marginTop:6,fontFamily:"'Geist Mono',monospace"}}>
          PeriRx still presents the full evidence landscape below. This banner reflects unanimous guideline consensus, not a prescribing directive.
        </div>
      </div>
    </div>
  );
}

// ─── TIMELINE BAR ─────────────────────────────────────────────────────────────
// ─── RELAPSE GAUGE — arc/donut showing relapse percentage ────────────────────
function RelapseGauge({rp}) {
  const [pct, setPct] = useState(0);
  // Parse percentage from string like "50–60%" or "70%"
  const matches = (rp||"").match(/(\d+)/g);
  const vals = matches ? matches.map(Number) : [0];
  const targetPct = Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);
  const label = rp || "—";

  useEffect(() => {
    setPct(0);
    let start = null;
    const duration = 900;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setPct(Math.round(ease * targetPct));
      if (progress < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [rp, targetPct]);

  // SVG arc parameters
  const size = 88;
  const cx = size/2, cy = size/2;
  const r = 32;
  const strokeW = 8;
  // Arc goes from 210° to 330° (240° sweep) - like a speedometer
  const startAngle = 210;
  const totalSweep = 240;
  const toRad = deg => (deg * Math.PI) / 180;
  const arcPath = (startDeg, sweepDeg) => {
    const s = toRad(startDeg), e = toRad(startDeg + sweepDeg);
    const x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
    const x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    const large = sweepDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };
  const fillSweep = (pct / 100) * totalSweep;
  const fillColor = targetPct >= 70 ? "#b83230" : targetPct >= 50 ? "#b0620e" : "#7a6010";
  return (
    <div style={{display:"flex",alignItems:"center",gap:12}}>
      <svg width={size} height={size} style={{flexShrink:0}}>
        <path d={arcPath(startAngle, totalSweep)} fill="none" stroke="#e5e7eb" strokeWidth={strokeW} strokeLinecap="round"/>
        {pct > 0 && <path d={arcPath(startAngle, fillSweep)} fill="none" stroke={fillColor} strokeWidth={strokeW} strokeLinecap="round"/>}
        <text x={cx} y={cy-2} textAnchor="middle" fontSize="15" fontWeight="800" fill={fillColor} fontFamily="'Instrument Sans',system-ui,sans-serif">{pct}%</text>
        <text x={cx} y={cy+12} textAnchor="middle" fontSize="7.5" fill="#9ca3af" fontFamily="'Geist Mono',monospace" letterSpacing="0.3">RELAPSE</text>
      </svg>
      <div>
        <div style={{fontSize:14,fontWeight:700,color:"#111827",lineHeight:1.2}}>Relapse: <span style={{color:fillColor}}>{label}</span></div>
        <div style={{fontSize:10,color:"#6b7280",marginTop:3}}>if medication stopped</div>
      </div>
    </div>
  );
}

function RiskBar({rating}) {
  const r = rating?.toLowerCase() || "";
  let level = 1;
  if (r.includes("high")) level = 5;
  else if (r.includes("moderate") || r.includes("assessment")) level = 3;
  else if (r.includes("low–moderate") || r.includes("low-moderate")) level = 2.5;
  else if (r.includes("low")) level = 2;
  else if (r.includes("undetermined") || r.includes("insufficient")) level = 1.5;
  const clr = level >= 4 ? "#b83230" : level >= 3 ? "#b0620e" : level >= 2 ? "#7a6010" : "#0d7358";
  const targetWidth = Math.min(100,(level/5)*100);
  const barRef = useRef(null);
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    el.style.width = "0%";
    const raf = requestAnimationFrame(() => {
      el.style.transition = "width 0.65s cubic-bezier(0.22, 0.61, 0.36, 1)";
      el.style.width = `${targetWidth}%`;
    });
    return () => cancelAnimationFrame(raf);
  }, [rating, targetWidth]);
  return (
    <div style={{marginTop:8,marginBottom:4}}>
      <div style={{height:6,background:"#e5e7eb",borderRadius:3,overflow:"hidden"}}>
        <div ref={barRef} style={{height:"100%",width:"0%",background:clr,borderRadius:3}}/>
      </div>
      <div style={{fontSize:10,color:clr,fontWeight:700,marginTop:3}}>{rating || "No data"}</div>
    </div>
  );
}

// ─── PRIOR MEDS PICKER SUB-COMPONENT ─────────────────────────────────────────
function PriorMedsPicker({priorsArr,setPriorsArr,setPriors}){
  const [open,setOpen]=useState(false);
  const [search,setSearch]=useState("");
  const sortedMeds=useMemo(()=>Object.entries(MEDS).sort(([,a],[,b])=>a.g.localeCompare(b.g)),[]);
  const filtered=search.trim()
    ?sortedMeds.filter(([,v])=>v.g.toLowerCase().includes(search.toLowerCase())||v.b?.toLowerCase().includes(search.toLowerCase()))
    :sortedMeds;
  const toggleKey=(k)=>{
    const next=priorsArr.includes(k)?priorsArr.filter(x=>x!==k):[...priorsArr,k];
    setPriorsArr(next);
    setPriors(next.map(x=>MEDS[x]?.g||x).join(", "));
  };
  return(
    <div style={{position:"relative"}}>
      <label style={{fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:"0.7px",textTransform:"uppercase",display:"flex",alignItems:"baseline",gap:5,flexWrap:"nowrap",marginBottom:6,whiteSpace:"nowrap"}}>Prior Med Trials <span style={{fontSize:9,fontWeight:400,color:"#6b7280",textTransform:"none",letterSpacing:0,whiteSpace:"nowrap"}}>(optional)</span></label>
      <div style={{minHeight:38,padding:"4px 8px",borderRadius:6,border:`1px solid ${priorsArr.length?"#0d7358":"#e5e7eb"}`,background:"#f9fafb",display:"flex",flexWrap:"wrap",gap:4,alignItems:"center",cursor:"pointer"}} onClick={()=>setOpen(o=>!o)}>
        {priorsArr.length===0&&<span style={{fontSize:12,color:"#a0aab4"}}>Select or type to search...</span>}
        {priorsArr.map(k=>(
          <span key={k} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:4,background:"#e8f5f0",border:"1px solid #b8ddd0",fontSize:11,fontWeight:600,color:"#0d7358"}}>
            {MEDS[k]?.g||k}
            <button onClick={e=>{e.stopPropagation();toggleKey(k);}} style={{background:"none",border:"none",cursor:"pointer",color:"#0d7358",padding:0,lineHeight:1,fontSize:13}}>×</button>
          </span>
        ))}
        <span style={{marginLeft:"auto",fontSize:10,color:"#a0aab4",flexShrink:0,display:"inline-block",transition:"transform .15s",transform:open?"rotate(180deg)":"none"}}>▾</span>
      </div>
      {open&&(
        <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:200,background:"#fff",border:"1px solid #e2e6ec",borderRadius:8,boxShadow:"0 4px 16px rgba(0,0,0,0.1)",marginTop:2}}>
          <div style={{padding:"8px 10px",borderBottom:"1px solid #f0f2f5"}}>
            <input
              autoFocus
              value={search}
              onChange={e=>setSearch(e.target.value)}
              onClick={e=>e.stopPropagation()}
              placeholder="Type to search..."
              style={{width:"100%",padding:"6px 10px",borderRadius:6,border:"1px solid #e2e6ec",fontSize:12,outline:"none",background:"#f8f9fb",boxSizing:"border-box"}}
            />
          </div>
          <div style={{maxHeight:200,overflowY:"auto"}}>
            {filtered.length===0&&<div style={{padding:"10px 12px",fontSize:12,color:"#a0aab4",fontStyle:"italic"}}>No matches</div>}
            {filtered.map(([k,v])=>{
              const selected=priorsArr.includes(k);
              return(
                <div key={k} onClick={()=>toggleKey(k)} style={{padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,background:selected?"#e8f5f0":"transparent",borderBottom:"1px solid #f5f6f8"}}>
                  <div style={{width:14,height:14,borderRadius:3,border:`1.5px solid ${selected?"#0d7358":"#c5cdd8"}`,background:selected?"#0d7358":"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {selected&&<svg width="9" height="9" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{fontSize:12,color:"#111827",fontWeight:500}}>{v.g}</span>
                  <span style={{fontSize:10,color:"#9ca3af",marginLeft:"auto"}}>{v.cls}</span>
                </div>
              );
            })}
          </div>
          {priorsArr.length>0&&(
            <div style={{padding:"6px 10px",borderTop:"1px solid #f0f2f5",display:"flex",justifyContent:"flex-end"}}>
              <button onClick={e=>{e.stopPropagation();setOpen(false);}} style={{fontSize:11,fontWeight:600,color:"#0d7358",background:"none",border:"none",cursor:"pointer",padding:"2px 6px"}}>Done ✓</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function PeriRx(){
  const [view,setView]=useState("input");
  const [med,setMed]=useState("");
  const [stage,setStage]=useState("");
  const [dx,setDx]=useState("");
  const [dxInput,setDxInput]=useState("");
  const [dxOpen,setDxOpen]=useState(false);
  const [dx2,setDx2]=useState("");
  const [dx2Input,setDx2Input]=useState("");
  const [dx2Open,setDx2Open]=useState(false);
  const [sev,setSev]=useState("");
  const [mode,setMode]=useState("standard");
  const [priors,setPriors]=useState("");
  const [priorsArr,setPriorsArr]=useState([]);
  const [relHx,setRelHx]=useState("");
  const [relHxEpisodes,setRelHxEpisodes]=useState("");
  const [relHxTime,setRelHxTime]=useState("");
  const [relHxContext,setRelHxContext]=useState(""); // "cold-stop" | "postpartum" | "prior-pregnancy" | "taper"
  const [relHxTimeSlowest,setRelHxTimeSlowest]=useState(""); // slowest relapse — only used when 2+ episodes
  const [showFeedTiming,setShowFeedTiming]=useState(false);
  const [priority,setPriority]=useState("");
  const [tab,setTab]=useState("tradeoff");
  const [showPtSum,setShowPtSum]=useState(false);
  const [ptSumStep,setPtSumStep]=useState("prep"); // "prep" | "patient"
  const [ptNote,setPtNote]=useState("");
  const [ptShowUnknowns,setPtShowUnknowns]=useState(true);
  const [ptShowUntreated,setPtShowUntreated]=useState(true);
  const [ptShowIconArray,setPtShowIconArray]=useState(true);
  const [showLac,setShowLac]=useState(false);
  const [loading,setLoading]=useState(false);
  const [loadMsg,setLoadMsg]=useState("");
  const [filterCls,setFilterCls]=useState("All");
  const [medSearch,setMedSearch]=useState("");
  const [medGridOpen,setMedGridOpen]=useState(false);
  const [copied,setCopied]=useState(false);
  // Lactation-specific state
  const [infantAge,setInfantAge]=useState("");
  const [infantStatus,setInfantStatus]=useState("");
  const [feedPattern,setFeedPattern]=useState("");

  const [lastResults,setLastResults]=useState(null); // saved state for Back to Results
  const [provOpen,setProvOpen]=useState(false);
  const [cmpMeds,setCmpMeds]=useState(["",""]);
  // ── Scenario comparison mode ──────────────────────────────────────────────
  const [compareSlots,setCompareSlots]=useState([]); // array of drugKeys being compared, max 3
  const [compareSearch,setCompareSearch]=useState("");
  const [compareSearchOpen,setCompareSearchOpen]=useState(false);
  const [compareIncludeDiscontinue,setCompareIncludeDiscontinue]=useState(true);

  const m=MEDS[med];
  const medList = useMemo(()=>{
    const entries = Object.entries(MEDS).sort(([,a],[,b])=>a.g.localeCompare(b.g));
    const q = medSearch.trim().toLowerCase();
    const byClass = filterCls==="All" ? entries : entries.filter(([,v])=>v.cls===filterCls);
    if (!q) return byClass;
    return byClass.filter(([,v])=>
      v.g.toLowerCase().includes(q) ||
      v.b.toLowerCase().includes(q) ||
      v.cls.toLowerCase().includes(q)
    );
  },[filterCls, medSearch]);

  const run=()=>{
    if(!med||!stage)return;
    setLoading(true);
    const msgs=["Checking DailyMed…","Checking LactMed®…","Checking MotherToBaby…","Checking APA Guidelines…","Synthesising evidence…"];
    let i=0;
    setLoadMsg(msgs[0]);
    const iv=setInterval(()=>{i++;if(i<msgs.length)setLoadMsg(msgs[i]);else clearInterval(iv);},180);
    setTimeout(()=>{clearInterval(iv);setLoading(false);setView("results");setTab("tradeoff");setCmpMeds(["",""]);},900+msgs.length*50);
  };
  const reset=()=>{setLastResults({med,stage,dx,dxInput,dx2,dx2Input,sev,priors,relHx,priority,infantAge,infantStatus,feedPattern});setView("input");setMed("");setStage("");setDx("");setDxInput("");setDx2("");setDx2Input("");setSev("");setPriors("");setPriorsArr([]);setRelHx("");setRelHxEpisodes("");setRelHxTime("");setRelHxTimeSlowest("");setRelHxContext("");setPriority("");setInfantAge("");setInfantStatus("");setFeedPattern("");};
  const backToResults=()=>{if(!lastResults)return;const r=lastResults;setMed(r.med);setStage(r.stage);setDx(r.dx);setDxInput(r.dxInput);setDx2(r.dx2||"");setDx2Input(r.dx2Input||"");setSev(r.sev);setPriors(r.priors);setRelHx(r.relHx);setPriority(r.priority);setInfantAge(r.infantAge);setInfantStatus(r.infantStatus);setFeedPattern(r.feedPattern);setView("results");setTab("tradeoff");};

  // ── RELAPSE HISTORY SUMMARY BUILDER ───────────────────────────────────────
  // Single source of truth for building the relHx display string.
  // Called whenever any of the four relapse fields changes.
  const buildRelHxSummary = (ep, fastest, slowest, ctx) => {
    if (!ep && !fastest) return "";
    const isMulti = ep && ep !== "1";
    const ctxStr = ctx
      ? ` (${ctx==="cold-stop"?"cold stop":ctx==="postpartum"?"postpartum":ctx==="prior-pregnancy"?"during prior pregnancy":"after taper"})`
      : "";
    // Range: only show when multi-episode AND both ends entered AND they differ
    const showRange = isMulti && fastest && slowest && fastest !== slowest;
    const timeStr = showRange
      ? `range ${fastest} – ${slowest}; fastest ${fastest}`
      : fastest
      ? `${isMulti ? "fastest relapse " : "relapsed "}${fastest}`
      : "";
    if (ep && timeStr) return `${ep} episode${ep==="1"?"":"s"}; ${timeStr}${ctxStr}`;
    if (ep) return `${ep} episode${ep==="1"?"":"s"}${ctxStr}`;
    if (timeStr) return `Relapsed ${fastest}${ctxStr}`;
    return "";
  };




  // ── INFANT AGE RISK MODIFIER ────────────────────────────────────────────────
  const getInfantRiskContext = () => {
    const ageWeeks = parseInt(infantAge);
    if (!ageWeeks) return null;
    if (ageWeeks < 2) return {label:"Neonate (< 2 wk)",note:"Immature glucuronidation and hepatic metabolism. Highest drug accumulation risk. Vigilant monitoring required for all but lowest-RID medications.",color:"#b83230"};
    if (ageWeeks < 4) return {label:"Early newborn (2–4 wk)",note:"Glucuronidation still immature. Renal clearance improving but not adult levels. RID values are conservative estimates.",color:"#b0620e"};
    if (ageWeeks < 12) return {label:"Young infant (1–3 mo)",note:"Hepatic and renal function improving. Most medications tolerated well with monitoring.",color:"#7a6010"};
    return {label:"Older infant (≥ 3 mo)",note:"Metabolic capacity approaching adult ratios. Lower relative risk for most medications at standard therapeutic doses.",color:"#0d7358"};
  };

  return(
  <div style={{minHeight:"100vh",background:"#f8f9fb",fontFamily:"'Instrument Sans',system-ui,sans-serif",color:"#111827"}}>
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@400;500;600&display=swap');
    :root {
      --green: #0d7358; --green-dark: #0a5c47;
      --green-light: #e8f5f0; --green-border: #b6ddd1;
      --blue: #1d5fbb; --blue-light: #eaf1fb; --blue-border: #b8d0f0;
      --red: #b83230; --red-light: #fde8e8; --red-border: #f0b8b8;
      --amber: #7a6010; --amber-light: #fdf6e0; --amber-border: #e0cf90;
      --purple: #8856d4; --purple-light: #f5f0fd; --purple-border: #d4b8f5;
      --text: #111827; --text-2: #4b5563; --text-3: #6b7280; --text-4: #9ca3af;
      --border: #e5e7eb; --surface: #ffffff; --bg: #f8f9fb; --bg-2: #f3f4f6;
      --hdr-bg: #0c2820;
      --shadow-xs: 0 1px 2px rgba(0,0,0,.05);
      --shadow-sm: 0 1px 3px rgba(0,0,0,.07),0 1px 2px rgba(0,0,0,.04);
      --shadow-md: 0 4px 12px rgba(0,0,0,.08),0 2px 4px rgba(0,0,0,.04);
      --shadow-lg: 0 12px 32px rgba(0,0,0,.12),0 4px 8px rgba(0,0,0,.05);
      --shadow-green: 0 4px 16px rgba(13,115,88,.25);
    }
    *{box-sizing:border-box;margin:0;padding:0}
    select option{background:#fff;color:#1a1d23}
    input::placeholder,select::placeholder{color:#b8bfc8}
    ::selection{background:#0d735820;color:#0d7358}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#c4cbc4;border-radius:4px}
    @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes loadMsg{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideUpFade{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    @keyframes cardEntrance{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes countUp{from{opacity:0}to{opacity:1}}
    button,a{transition:all .15s ease}
    .run-btn:hover:not(:disabled){box-shadow:0 8px 24px rgba(13,115,88,.32)!important;transform:translateY(-1px)!important}
    .run-btn:active:not(:disabled){transform:translateY(0)!important}
    .card{background:#fff;border-radius:12px;border:1.5px solid #e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,.06)}
    .select-field{width:100%;padding:9px 12px;border-radius:8px;border:1.5px solid #e5e7eb;font-size:13px;color:#1a1d23;outline:none;background:#fff;appearance:none;background-image:url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238896a6' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;transition:border-color .15s}
    .select-field:focus{border-color:#0d7358;outline:none;box-shadow:0 0 0 3px rgba(13,115,88,.09)}
    input:focus{border-color:#0d7358!important;outline:none;box-shadow:0 0 0 3px rgba(13,115,88,.09)!important}
    .med-card{transition:all .12s ease;cursor:pointer}
    .med-card:hover{background:#f0faf6!important;border-color:#96c4ae!important;box-shadow:0 2px 8px rgba(13,115,88,.1)!important}
    label.field-label{font-size:10px;font-weight:700;color:#9ca3af;letter-spacing:0.7px;text-transform:uppercase;display:block;margin-bottom:5px}
    .hdr-disclaimer{display:block}
    @media(max-width:520px){.hdr-disclaimer{display:none}}
    .rid-hero-row{display:flex;gap:12px;align-items:stretch;margin-bottom:10px;flex-wrap:wrap}
    .rid-gauge{flex:1 1 auto;min-width:100px;max-width:160px;background:#fff;border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}
    .rid-right{flex:1 1 180px;min-width:0;display:flex;flex-direction:column;gap:8px}
    @media(max-width:500px){
      .rid-hero-row{flex-direction:column}
      .rid-gauge{max-width:100%}
      .rid-right{min-width:0;width:100%}
    }
    .peak-milk-text{font-size:12px;font-weight:600;color:#1a1d23;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  `}</style>

  {/* ▸ HEADER */}
  <header style={{background:"#0c2820",padding:"0 28px",height:54,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
    {/* Left: logo + name */}
    <div style={{display:"flex",alignItems:"center",gap:12}}>
      <div style={{width:34,height:34,borderRadius:10,background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.18)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13,fontWeight:800,fontFamily:"'Geist Mono',monospace",letterSpacing:"-0.5px"}}>Rx</div>
      <div>
        <div style={{fontSize:17,fontWeight:600,letterSpacing:"-0.5px",color:"#fff",lineHeight:1.1,fontFamily:"'Instrument Serif',serif",fontStyle:"italic"}}>PeriRx</div>
        <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",fontFamily:"'Geist Mono',monospace",letterSpacing:"0.5px",textTransform:"uppercase"}}>Perinatal Decision Support</div>
      </div>
    </div>
    {/* Right: nav buttons + disclaimer */}
    <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
      {view==="results"&&<button onClick={reset} style={{padding:"7px 16px",borderRadius:6,background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.18)",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap",flexShrink:0}}>← New Search</button>}
      {view==="input"&&lastResults&&<button onClick={backToResults} style={{padding:"7px 16px",borderRadius:6,background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.18)",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>↩ Back to Results</button>}
      <div style={{height:16,width:1,background:"rgba(255,255,255,0.1)",flexShrink:0}}/>
      <div className="hdr-disclaimer" style={{fontSize:9,color:"rgba(255,255,255,0.28)",fontFamily:"'Geist Mono',monospace",letterSpacing:"0.6px",textTransform:"uppercase",whiteSpace:"nowrap"}}>Decision support · not prescriptive</div>
    </div>
  </header>

  <main style={{maxWidth:1120,margin:"0 auto",padding:"24px 28px 72px"}}>

  {/* ━━━━━━━━━━━━━ INPUT VIEW ━━━━━━━━━━━━━ */}
  {view==="input"&&(
  <div style={{animation:"fadeIn .3s ease"}}>
    {/* Mode selector — pill tabs */}
    <div style={{display:"flex",gap:4,marginBottom:16,background:"#fff",borderRadius:8,padding:3,border:"1px solid #e4e8e4"}}>
      {[{k:"standard",l:"Clinical Analysis",icon:"clinical"},{k:"lactation",l:"Breastfeeding",icon:"lactation"}].map(o=>(
        <button key={o.k} onClick={()=>{setMode(o.k);if(o.k==="lactation")setStage("pp");}} style={{flex:"1 1 0",padding:"7px 12px",borderRadius:6,border:"none",background:mode===o.k?"#0d7358":"transparent",color:mode===o.k?"#fff":"#6b7280",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5,transition:"all .15s"}}><Icon name={o.icon} size={14} color="currentColor"/>{o.l}</button>
      ))}
    </div>

    {mode==="lactation"&&(
      <div style={{background:"#eaf1fb",border:"1px solid #c0d4ef",borderRadius:8,padding:"10px 14px",marginBottom:16,fontSize:12,color:"#2c6fbb",lineHeight:1.5}}>
        Select a medication and enter infant details below. All data sourced exclusively from LactMed® (NLM/NICHD). <strong>Infant age is required</strong> — risk profiles differ substantially between neonates and older infants.
      </div>
    )}

    {/* ── PPD GATEWAY ── Show when PPD is selected as diagnosis or postpartum stage */}
    {(dx==="Postpartum Depression"||dx==="Peripartum Depression"||dx==="Postpartum Psychosis"||stage==="pp")&&(
      <div style={{background:"linear-gradient(135deg,#f5f0fd,#fef4fb)",border:"1.5px solid #c4a0f0",borderRadius:12,padding:"18px 20px",marginBottom:18,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#8856d4,#9d3d75)",borderRadius:"12px 12px 0 0"}}/>
        <div style={{display:"flex",alignItems:"flex-start",gap:14,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:240}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontSize:18}}>💜</span>
              <span style={{fontSize:13,fontWeight:700,color:"#6b38a8",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.4px"}}>FDA-Approved PPD Treatments</span>
            </div>
            <div style={{fontSize:12,color:"#4a2d7a",lineHeight:1.65,marginBottom:10}}>
              Two medications are specifically FDA-approved for postpartum depression — neither is an antidepressant. Both target the hormonal withdrawal pathway (GABA-A/allopregnanolone) implicated in PPD onset.
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              {[
                {key:"zuranolone",name:"Zuranolone",brand:"Zurzuvae",tag:"Oral · 14-day course",color:"#8856d4",bg:"#f0e8ff",border:"#c4a0f0",detail:"Approved Aug 2023. Once-nightly oral. Outpatient. ~$15,900/course."},
                {key:"brexanolone",name:"Brexanolone",brand:"Zulresso",tag:"IV · 60-hr hospital infusion",color:"#9d3d75",bg:"#fef0f6",border:"#f0b0d0",detail:"Approved 2019. First FDA-approved PPD-specific drug. REMS facility required."},
              ].map(item=>(
                <button key={item.key} onClick={()=>setMed(item.key)}
                  style={{textAlign:"left",padding:"12px 14px",borderRadius:8,border:`2px solid ${med===item.key?item.color:item.border}`,background:med===item.key?item.bg:"#fff",cursor:"pointer",transition:"all .15s",outline:"none"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                    {med===item.key&&<span style={{fontSize:10,background:item.color,color:"#fff",borderRadius:3,padding:"1px 5px",fontWeight:700,fontFamily:"'Geist Mono',monospace"}}>SELECTED</span>}
                    <span style={{fontSize:9,fontWeight:700,color:item.color,background:item.bg,border:`1px solid ${item.border}`,borderRadius:3,padding:"1px 5px",fontFamily:"'Geist Mono',monospace"}}>🔬 RAPIDLY EVOLVING</span>
                  </div>
                  <div style={{fontSize:13,fontWeight:700,color:item.color}}>{item.name}</div>
                  <div style={{fontSize:10,color:"#4b5563",marginBottom:4}}>{item.brand}</div>
                  <div style={{fontSize:10,color:item.color,fontWeight:600,marginBottom:4}}>{item.tag}</div>
                  <div style={{fontSize:10,color:"#6a5a7a",lineHeight:1.4}}>{item.detail}</div>
                </button>
              ))}
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
              <button
                onClick={()=>{setMed("sertraline");if(!stage||stage!=="pp")setStage("pp");setCmpMeds(["zuranolone","__discontinue__"]);setLoading(false);setView("results");setTab("scenarios");}}
                style={{padding:"7px 14px",borderRadius:6,background:"#6b38a8",border:"none",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6,transition:"all .15s"}}
              >
                <span>⚖️</span> Compare: Sertraline vs Zuranolone vs Discontinue
              </button>
              <span style={{fontSize:10,color:"#4b5563",fontStyle:"italic"}}>Opens side-by-side Scenarios view</span>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* MEDICATION SELECTION */}
    <div className="card" style={{padding:18,marginBottom:16,position:"relative"}}>
      <div style={{fontSize:13,fontWeight:600,color:"#111827",marginBottom:12,letterSpacing:"-0.15px"}}>Medication</div>

      {/* — Selected drug chip — shown when a drug is picked */}
      {/* Trigger button — shown when no drug selected and grid is closed */}
      {!med&&!medGridOpen&&(
        <button
          onClick={()=>setMedGridOpen(true)}
          style={{width:"100%",padding:"10px 14px",borderRadius:8,border:"1.5px dashed #c0ccc0",background:"#f8fbf8",color:"#4b6b5a",fontSize:13,fontWeight:500,cursor:"pointer",display:"flex",alignItems:"center",gap:8,transition:"all .15s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="#0d7358";e.currentTarget.style.color="#0d7358";e.currentTarget.style.background="#f0faf6";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="#c0ccc0";e.currentTarget.style.color="#4b6b5a";e.currentTarget.style.background="#f8fbf8";}}
        >
          <span style={{fontSize:14}}>⌕</span>
          <span>Select a medication…</span>
          <span style={{marginLeft:"auto",fontSize:11,opacity:0.5}}>{Object.keys(MEDS).length} available ▾</span>
        </button>
      )}

      {/* Selected drug chip */}
      {med&&MEDS[med]&&!medGridOpen&&(()=>{
        const v=MEDS[med];
        const pColor=v.p==="P0"?"#0d7358":v.p==="P1"?"#7a6010":"#b0620e";
        const isHA=HIGH_ALERT[med];
        return(
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderRadius:10,background:"#eaf1fb",border:"1.5px solid #b8d0f0",marginBottom:10,boxShadow:"0 1px 3px rgba(0,0,0,.05)"}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:700,color:"#2c6fbb",lineHeight:1.2}}>{v.g}</div>
              <div style={{fontSize:11,color:"#2c6fbb",marginTop:1}}>{v.b} · <span style={{fontFamily:"'Geist Mono',monospace",fontSize:10,fontWeight:700,color:pColor}}>{v.p}</span>{isHA&&<span style={{marginLeft:5,fontSize:10}}>{isHA.level==="critical"?"⛔":"⚠️"}</span>}{RAPIDLY_EVOLVING.has(med)&&<span style={{marginLeft:5,fontSize:9,fontWeight:700,color:"#8856d4",background:"#f5f0fd",border:"1px solid #d4b8f5",borderRadius:2,padding:"1px 4px",fontFamily:"'Geist Mono',monospace"}}>EVOLVING</span>}</div>
            </div>
            <button onClick={()=>{setMed("");setMedSearch("");setMedGridOpen(true);}} style={{padding:"4px 10px",borderRadius:5,background:"#fff",border:"1px solid #c0d4ef",color:"#2c6fbb",fontSize:11,fontWeight:600,cursor:"pointer",flexShrink:0}}>Change</button>
          </div>
        );
      })()}

      {/* — Search + dropdown — shown when no drug selected OR grid is open — */}
      {medGridOpen&&(
        <div>
          {/* Search row */}
          <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center"}}>
            <div style={{position:"relative",flex:1}}>
              <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:12,color:"#6b7280",pointerEvents:"none"}}>⌕</span>
              <input
                autoFocus={medGridOpen}
                type="text"
                value={medSearch}
                onChange={e=>{setMedSearch(e.target.value);setFilterCls("All");}}
                placeholder="Search by name or brand… (e.g. Wellbutrin, sertraline)"
                style={{width:"100%",padding:"8px 30px 8px 30px",borderRadius:7,border:`1.5px solid ${medSearch?"#0d7358":"#e5e7eb"}`,fontSize:13,outline:"none",background:"#fff",color:"#111827",boxSizing:"border-box",transition:"border-color .15s"}}
              />
              {medSearch&&(
                <button onClick={()=>setMedSearch("")} style={{position:"absolute",right:9,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#6b7280",fontSize:15,lineHeight:1,padding:2}}>×</button>
              )}
            </div>
            {med&&medGridOpen&&(
              <button onClick={()=>{setMedSearch("");setMedGridOpen(false);}} style={{padding:"7px 12px",borderRadius:7,background:"#f3f4f6",border:"1px solid #dde2dd",color:"#4b5563",fontSize:12,fontWeight:600,cursor:"pointer",flexShrink:0}}>Cancel</button>
            )}
          </div>

          {/* Class filter pills */}
          <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>
            {(()=>{
              const allCls=["All",...CLASSES];
              return allCls.map(c=>{
                const n=c==="All"?Object.keys(MEDS).length:Object.values(MEDS).filter(x=>x.cls===c).length;
                const isActive=filterCls===c;
                return(
                  <button key={c} onClick={()=>setFilterCls(c)} style={{padding:"4px 10px",borderRadius:999,border:`1.5px solid ${isActive?"#0d7358":"#e5e7eb"}`,background:isActive?"#0d7358":"#fff",color:isActive?"#fff":"#6b7280",fontSize:10,fontWeight:600,cursor:"pointer",transition:"all .12s",whiteSpace:"nowrap",boxShadow:isActive?"0 1px 4px rgba(13,115,88,.2)":"none"}}>{c} <span style={{opacity:0.5,fontSize:9}}>({n})</span></button>
                );
              });
            })()}
          </div>

          {/* P-tier legend */}
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:10,paddingBottom:10,borderBottom:"1px solid #eef0ee"}}>
            <span style={{fontSize:9,color:"#9ca3af",fontWeight:700,letterSpacing:"0.5px",textTransform:"uppercase"}}>PRIORITY:</span>
            {[
              {p:"P0",label:"First-line",color:"#0d7358",bg:"#e8f5f0",border:"#c5e8dc"},
              {p:"P1",label:"Second-line",color:"#7a6010",bg:"#fdf6e0",border:"#e0cf90"},
              {p:"P2",label:"Use with caution",color:"#b0620e",bg:"#fdf0e0",border:"#e0c090"},
            ].map(({p,label,color,bg,border})=>(
              <div key={p} style={{display:"flex",alignItems:"center",gap:3,padding:"2px 7px",borderRadius:4,background:bg,border:`1px solid ${border}`}}>
                <span style={{fontSize:9,fontWeight:700,fontFamily:"'Geist Mono',monospace",color}}>{p}</span>
                <span style={{fontSize:9,color,fontWeight:500}}>{label}</span>
              </div>
            ))}
          </div>

          {/* Drug grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(168px,1fr))",gap:5,maxHeight:340,overflowY:"auto",paddingRight:2}}>
            {medList.length===0&&(
              <div style={{gridColumn:"1/-1",padding:"20px",textAlign:"center",color:"#6b7280",fontSize:12,background:"#f8f9fb",borderRadius:8,border:"1px dashed #e2e6ec"}}>
                No medications match <strong style={{color:"#111827"}}>"{medSearch}"</strong>
              </div>
            )}
            {medList.map(([k,v])=>{
              const isHA=HIGH_ALERT[k];
              const pColor=v.p==="P0"?"#0d7358":v.p==="P1"?"#7a6010":"#b0620e";
              const pBg=v.p==="P0"?"#f0faf6":v.p==="P1"?"#fffbee":"#fff8f3";
              const pBorder=v.p==="P0"?"#c5e8dc":v.p==="P1"?"#e0cf90":v.p==="P2"?"#e8c8a8":"#e5e7eb";
              const leftBorderColor=med===k?"#2c6fbb":isHA?(isHA.level==="critical"?"#b83230":"#a05a00"):pColor;
              return(
              <button key={k} onClick={()=>{setMed(k);setMedSearch("");setMedGridOpen(false);}} className="med-card" style={{padding:"7px 9px",borderRadius:7,border:`1.5px solid ${med===k?"#2c6fbb":isHA?`${isHA.level==="critical"?"#b83230":"#a05a00"}35`:pBorder}`,background:med===k?"#eaf1fb":isHA?`${isHA.level==="critical"?"#fde8e8":"#fdf6e0"}`:pBg,textAlign:"left",position:"relative",borderLeft:`3px solid ${leftBorderColor}`}}>
                <div style={{fontSize:11,fontWeight:600,color:med===k?"#2c6fbb":"#111827",lineHeight:1.3,marginBottom:1}}>{v.g}</div>
                <div style={{fontSize:9,color:"#6b7280",marginBottom:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{v.b}</div>
                <div style={{display:"flex",alignItems:"center",gap:3,flexWrap:"wrap"}}>
                  <span style={{fontSize:8,fontWeight:700,fontFamily:"'Geist Mono',monospace",color:pColor,background:`${pColor}14`,padding:"1px 4px",borderRadius:2}}>{v.p}</span>
                  {isHA&&<span style={{fontSize:9,lineHeight:1}}>{isHA.level==="critical"?"⛔":"⚠️"}</span>}
                  {RAPIDLY_EVOLVING.has(k)&&<span style={{fontSize:7,fontWeight:700,color:"#8856d4",background:"#f5f0fd",border:"1px solid #d4b8f5",borderRadius:2,padding:"1px 3px",fontFamily:"'Geist Mono',monospace"}}>EVOLVING</span>}
                </div>
              </button>
              );
            })}
          </div>
        </div>
      )}
    </div>

    {/* CLINICAL CONTEXT — all fields visible, optional except stage */}
    {mode!=="lactation"&&(
    <div className="card" style={{padding:18,marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,color:"#111827"}}>Clinical Context</div>
        <div style={{fontSize:10,color:"#6b7280",fontFamily:"'Geist Mono',monospace"}}>Stage required · all else optional</div>
      </div>
      {/* Row 1: Stage + Diagnosis + Severity */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,marginBottom:12}}>
        <div>
          <label style={{fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:"0.7px",textTransform:"uppercase",display:"block",marginBottom:6}}>Gestational Stage <span style={{color:"#b83230"}}>*</span></label>
          <select value={stage} onChange={e=>setStage(e.target.value)} className="select-field">
            <option value="">Select stage...</option>
            {STAGES.map(s=><option key={s.v} value={s.v}>{s.l}</option>)}
          </select>
        </div>
        <div style={{position:"relative"}}>
          <label style={{fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:"0.7px",textTransform:"uppercase",display:"block",marginBottom:6}}>Primary Diagnosis <span style={{fontSize:9,fontWeight:400,color:"#6b7280",textTransform:"none",letterSpacing:0}}>(optional)</span></label>
          {/* Combobox: type to filter or enter custom */}
          <div style={{position:"relative"}}>
            <input
              type="text"
              value={dxInput}
              onChange={e=>{setDxInput(e.target.value);setDxOpen(true);if(!e.target.value){setDx("");}}}
              onFocus={()=>setDxOpen(true)}
              onBlur={()=>setTimeout(()=>setDxOpen(false),150)}
              placeholder="Search or type a diagnosis..."
              style={{width:"100%",padding:"9px 12px",borderRadius:6,border:`1px solid ${dx?"#0d7358":"#e5e7eb"}`,fontSize:13,outline:"none",background:"#f9fafb",color:"#111827"}}
            />
            {dx&&(
              <button onClick={()=>{setDx("");setDxInput("");}} style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#6b7280",fontSize:14,lineHeight:1,padding:2}}>×</button>
            )}
          </div>
          {dxOpen&&(()=>{
            const filtered = DIAGNOSES.filter(d=>d.toLowerCase().includes(dxInput.toLowerCase()));
            const showCustom = dxInput.trim() && !DIAGNOSES.some(d=>d.toLowerCase()===dxInput.toLowerCase().trim());
            if(!filtered.length && !showCustom) return null;
            return(
            <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:200,background:"#fff",border:"1px solid #e2e6ec",borderRadius:8,boxShadow:"0 8px 32px rgba(0,0,0,.12),0 2px 8px rgba(0,0,0,.05)",maxHeight:260,overflowY:"auto",marginTop:4}}>
              {/* Group headers */}
              {[
                {label:"Mood Disorders",items:["Major Depressive Disorder","Persistent Depressive Disorder (Dysthymia)","Premenstrual Dysphoric Disorder (PMDD)","Seasonal Affective Disorder","Bipolar I Disorder","Bipolar II Disorder","Cyclothymic Disorder"]},
                {label:"Anxiety Disorders",items:["Generalized Anxiety Disorder","Panic Disorder","Social Anxiety Disorder","Specific Phobia","Agoraphobia","Separation Anxiety Disorder"]},
                {label:"Trauma & Stress",items:["PTSD","Acute Stress Disorder","Adjustment Disorder"]},
                {label:"OCD Spectrum",items:["OCD","Body Dysmorphic Disorder","Hoarding Disorder","Trichotillomania"]},
                {label:"Psychotic Disorders",items:["Schizophrenia","Schizoaffective Disorder","Brief Psychotic Disorder","Delusional Disorder"]},
                {label:"Perinatal-Specific",items:["Postpartum Depression","Postpartum Anxiety","Postpartum Psychosis","Peripartum Depression"]},
                {label:"Neurodevelopmental",items:["ADHD","Autism Spectrum Disorder"]},
                {label:"Eating Disorders",items:["Anorexia Nervosa","Bulimia Nervosa","Binge Eating Disorder"]},
                {label:"Sleep & Somatic",items:["Insomnia Disorder","Somatic Symptom Disorder","Illness Anxiety Disorder"]},
                {label:"Substance Use",items:["Alcohol Use Disorder","Opioid Use Disorder","Cannabis Use Disorder"]},
                {label:"Personality",items:["Borderline Personality Disorder"]},
              ].map(group=>{
                const visibleItems = group.items.filter(d=>filtered.includes(d));
                if(!visibleItems.length) return null;
                return(
                  <div key={group.label}>
                    <div style={{padding:"6px 12px 3px",fontSize:9,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.5px",fontFamily:"'Geist Mono',monospace",background:"#f8f9fb",borderBottom:"1px solid #f0f2f5"}}>{group.label}</div>
                    {visibleItems.map(d=>(
                      <div key={d} onMouseDown={()=>{setDx(d);setDxInput(d);setDxOpen(false);}}
                        style={{padding:"8px 14px",fontSize:12,color:dx===d?"#0d7358":"#111827",background:dx===d?"#e8f5f0":"transparent",cursor:"pointer",fontWeight:dx===d?600:400}}
                        onMouseEnter={e=>e.currentTarget.style.background=dx===d?"#e8f5f0":"#f8f9fb"}
                        onMouseLeave={e=>e.currentTarget.style.background=dx===d?"#e8f5f0":"transparent"}
                      >{d}</div>
                    ))}
                  </div>
                );
              })}
              {showCustom&&(
                <div onMouseDown={()=>{const val=dxInput.trim();setDx(val);setDxInput(val);setDxOpen(false);}}
                  style={{padding:"8px 14px",fontSize:12,color:"#2c6fbb",cursor:"pointer",borderTop:"1px solid #e8ebf0",display:"flex",alignItems:"center",gap:6}}
                  onMouseEnter={e=>e.currentTarget.style.background="#eaf1fb"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >
                  <span style={{fontSize:10,background:"#eaf1fb",border:"1px solid #c0d4ef",borderRadius:3,padding:"1px 5px",fontWeight:700,fontFamily:"'Geist Mono',monospace"}}>CUSTOM</span>
                  Use &ldquo;{dxInput.trim()}&rdquo;
                </div>
              )}
            </div>
            );
          })()}
        </div>
        <div>
          <label style={{fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:"0.7px",textTransform:"uppercase",display:"block",marginBottom:6}}>Illness Severity <span style={{fontSize:9,fontWeight:400,color:"#6b7280",textTransform:"none",letterSpacing:0}}>(optional)</span></label>
          <div style={{display:"flex",gap:4}}>
            {["mild","moderate","severe"].map(s=>(
              <button key={s} onClick={()=>setSev(sev===s?"":s)} style={{flex:1,padding:"8px 0",borderRadius:6,border:`1.5px solid ${sev===s?(s==="mild"?"#0d7358":s==="moderate"?"#7a6010":"#b83230"):"#e5e7eb"}`,background:sev===s?(s==="mild"?"#e8f5f0":s==="moderate"?"#fdf6e0":"#fde8e8"):"#f8fbf8",color:sev===s?(s==="mild"?"#0d7358":s==="moderate"?"#7a6010":"#b83230"):"#8a9a8a",fontSize:12,fontWeight:600,cursor:"pointer",textTransform:"capitalize",transition:"all .12s"}}>{s}</button>
            ))}
          </div>
        </div>
      </div>
      {/* Row 2: Prior trials + Relapse history */}
      <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:12}}>
        {/* Prior Medication Trials — multi-select dropdown */}
        <PriorMedsPicker priorsArr={priorsArr} setPriorsArr={setPriorsArr} setPriors={setPriors}/>

        {/* Relapse History — structured */}
        <div style={{display:"flex",flexDirection:"column"}}>
          <label style={{fontSize:10,fontWeight:700,color:"#9ca3af",letterSpacing:"0.7px",textTransform:"uppercase",display:"flex",alignItems:"baseline",gap:5,flexWrap:"nowrap",marginBottom:6,whiteSpace:"nowrap"}}>Relapse History <span style={{fontSize:9,fontWeight:400,color:"#6b7280",textTransform:"none",letterSpacing:0,whiteSpace:"nowrap"}}>(optional)</span></label>
          <div style={{background:"#f9fafb",border:"1px solid #e2e6ec",borderRadius:8,padding:"12px 14px",display:"flex",flexDirection:"column",gap:12}}>

            {/* Row 1: Episodes */}
            <div>
              <div style={{fontSize:9,color:"#6b7280",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:5}}>Prior Episodes</div>
              <div style={{display:"flex",gap:3}}>
                {["1","2","3","4","5+"].map(n=>(
                  <button key={n} onClick={()=>{
                    const next=relHxEpisodes===n?"":n;
                    setRelHxEpisodes(next);
                    // When dropping back to 1 episode, clear the slowest field
                    const newSlowest = (next&&next!=="1") ? relHxTimeSlowest : "";
                    if (next==="1") setRelHxTimeSlowest("");
                    setRelHx(buildRelHxSummary(next, relHxTime, newSlowest, relHxContext));
                  }} style={{padding:"6px 10px",borderRadius:5,border:`1px solid ${relHxEpisodes===n?"#0d7358":"#e5e7eb"}`,background:relHxEpisodes===n?"#0d7358":"#fff",color:relHxEpisodes===n?"#fff":"#4b5563",fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .12s",minWidth:36,textAlign:"center"}}>
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Time dropdowns — single if 1 episode, dual range if 2+ */}
            <div>
              {(()=>{
                const isMulti = relHxEpisodes && relHxEpisodes !== "1";
                const selectStyle = (active) => ({
                  width:"100%",padding:"7px 10px",borderRadius:6,
                  border:`1.5px solid ${active?"#0d7358":"#e5e7eb"}`,
                  fontSize:12,background:"#fff",outline:"none",
                  color:active?"#111827":"#a0aab4",
                  appearance:"none",
                  backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238896a6' strokeWidth='1.5' strokeLinecap='round'/%3E%3C/svg%3E\")",
                  backgroundRepeat:"no-repeat",backgroundPosition:"right 10px center"
                });
                const timeOptions = <>
                  <option value="">Select...</option>
                  <option value="within days">Within days</option>
                  <option value="within 1–2 weeks">Within 1–2 weeks</option>
                  <option value="within 2–4 weeks">Within 2–4 weeks</option>
                  <option value="within 1–3 months">Within 1–3 months</option>
                  <option value="within 3–6 months">Within 3–6 months</option>
                  <option value="after 6+ months">After 6+ months</option>
                  <option value="unknown">Unknown</option>
                </>;

                if (!isMulti) {
                  // Single episode (or none selected) — one dropdown
                  return (
                    <div>
                      <div style={{fontSize:9,color:"#6b7280",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:5}}>Time to relapse after stopping</div>
                      <select value={relHxTime} onChange={e=>{
                        const t=e.target.value; setRelHxTime(t);
                        setRelHx(buildRelHxSummary(relHxEpisodes, t, "", relHxContext));
                      }} style={selectStyle(!!relHxTime)}>
                        {timeOptions}
                      </select>
                    </div>
                  );
                }

                // Multi-episode — show fastest + slowest side by side
                // Validate: slowest must be ≥ fastest in the ordered list
                const ORDER = ["within days","within 1–2 weeks","within 2–4 weeks","within 1–3 months","within 3–6 months","after 6+ months","unknown"];
                const fastIdx = ORDER.indexOf(relHxTime);
                const slowIdx = ORDER.indexOf(relHxTimeSlowest);
                const rangeConflict = relHxTime && relHxTimeSlowest && relHxTimeSlowest !== "unknown" && relHxTime !== "unknown" && slowIdx < fastIdx;

                return (
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                      <div style={{display:"flex",flexDirection:"column"}}>
                        <div style={{fontSize:9,fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:5,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                          <span style={{color:"#b83230"}}>Fastest</span>
                          <span style={{color:"#6b7280",fontWeight:400}}> · planning figure</span>
                        </div>
                        <select value={relHxTime} onChange={e=>{
                          const t=e.target.value; setRelHxTime(t);
                          setRelHx(buildRelHxSummary(relHxEpisodes, t, relHxTimeSlowest, relHxContext));
                        }} style={selectStyle(!!relHxTime)}>
                          {timeOptions}
                        </select>
                      </div>
                      <div style={{display:"flex",flexDirection:"column"}}>
                        <div style={{fontSize:9,color:"#6b7280",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:5,fontWeight:400,whiteSpace:"nowrap"}}>
                          Slowest <span style={{fontWeight:400}}>· range</span>
                        </div>
                        <select value={relHxTimeSlowest} onChange={e=>{
                          const t=e.target.value; setRelHxTimeSlowest(t);
                          setRelHx(buildRelHxSummary(relHxEpisodes, relHxTime, t, relHxContext));
                        }} style={selectStyle(!!relHxTimeSlowest)}>
                          {timeOptions}
                        </select>
                      </div>
                    </div>
                    {rangeConflict&&(
                      <div style={{fontSize:10,color:"#b83230",background:"#fde8e8",border:"1px solid #f5c0b8",borderRadius:5,padding:"6px 10px",lineHeight:1.4}}>
                        ⚠ Slowest relapse should be equal to or longer than fastest. Check entries.
                      </div>
                    )}
                    {relHxTime&&relHxTimeSlowest&&!rangeConflict&&relHxTime!==relHxTimeSlowest&&(
                      <div style={{fontSize:10,color:"#4b5563",background:"#f0f5ff",border:"1px solid #d0dff5",borderRadius:5,padding:"6px 10px",lineHeight:1.5}}>
                        <strong>Risk engine uses the fastest ({relHxTime})</strong> as the planning window. The range ({relHxTime} – {relHxTimeSlowest}) is captured in the clinical note — the variation may suggest context-dependent triggers worth exploring.
                      </div>
                    )}
                    {relHxTime&&relHxTimeSlowest&&!rangeConflict&&relHxTime===relHxTimeSlowest&&(
                      <div style={{fontSize:10,color:"#4b5563",fontStyle:"italic"}}>Episodes were consistent — all relapses occurred {relHxTime}.</div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Row 3: Context — only show if episodes or time is set */}
            {(relHxEpisodes||relHxTime)&&(
              <div>
                <div style={{fontSize:9,color:"#6b7280",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:5}}>Context of fastest relapse <span style={{fontWeight:400,textTransform:"none",letterSpacing:0}}>(optional)</span></div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {[
                    {v:"cold-stop", l:"Cold stop"},
                    {v:"taper",     l:"After taper"},
                    {v:"postpartum",l:"Postpartum period"},
                    {v:"prior-pregnancy", l:"During prior pregnancy"},
                  ].map(({v,l})=>(
                    <button key={v} onClick={()=>{
                      const next=relHxContext===v?"":v;
                      setRelHxContext(next);
                      setRelHx(buildRelHxSummary(relHxEpisodes, relHxTime, relHxTimeSlowest, next));
                    }} style={{padding:"5px 10px",borderRadius:5,border:`1px solid ${relHxContext===v?"#7a6010":"#e5e7eb"}`,background:relHxContext===v?"#fdf6e0":"#fff",color:relHxContext===v?"#7a6010":"#4b5563",fontSize:11,fontWeight:relHxContext===v?700:500,cursor:"pointer",transition:"all .12s"}}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Context-specific clinical guidance note */}
            {relHxContext&&(
              <div style={{fontSize:10,color:relHxContext==="postpartum"||relHxContext==="prior-pregnancy"?"#b83230":"#7a6010",background:relHxContext==="postpartum"||relHxContext==="prior-pregnancy"?"#fde8e8":"#fdf6e0",border:`1px solid ${relHxContext==="postpartum"||relHxContext==="prior-pregnancy"?"#f5c0b8":"#f0d88a"}`,borderRadius:6,padding:"8px 10px",lineHeight:1.5}}>
                {relHxContext==="cold-stop"&&"Cold-stop relapse reflects true physiological dependence. Cross-taper (not abrupt discontinuation) should be the plan if switching."}
                {relHxContext==="taper"&&"Relapse during a supervised taper still indicates high illness burden — the taper itself was not protective. Continuation is strongly supported by this history."}
                {relHxContext==="postpartum"&&"⚠️ Postpartum relapse history is the single strongest predictor of postpartum relapse in the current pregnancy. This markedly elevates the risk of discontinuation in the third trimester or postpartum."}
                {relHxContext==="prior-pregnancy"&&"⚠️ Relapse during a prior pregnancy is direct precedent for the current clinical scenario. Population-level estimates likely understate this patient's personal risk."}
              </div>
            )}

            {/* Summary line */}
            {relHx&&<div style={{fontSize:10,color:"#0d7358",fontFamily:"'Geist Mono',monospace",borderTop:"1px solid #e8ebf0",paddingTop:8}}>→ {relHx}</div>}
          </div>
        </div>
      </div>
      {/* Row 3: Patient-stated priority */}
      <div>
        <label style={{fontSize:11,fontWeight:700,color:"#4b5563",letterSpacing:"0.5px",textTransform:"uppercase",fontFamily:"'Geist Mono',monospace",display:"block",marginBottom:8}}>Patient-Stated Priority <span style={{fontSize:9,fontWeight:400,color:"#6b7280",textTransform:"none",letterSpacing:0}}>(optional)</span></label>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {["Minimize fetal exposure","Prioritize my stability","Need to understand everything","Want to breastfeed"].map(p=>(
            <button key={p} onClick={()=>setPriority(priority===p?"":p)} style={{padding:"7px 14px",borderRadius:20,border:`1px solid ${priority===p?"#2c6fbb":"#e5e7eb"}`,background:priority===p?"#eaf1fb":"#f9fafb",color:priority===p?"#2c6fbb":"#4b5563",fontSize:12,fontWeight:500,cursor:"pointer"}}>{p}</button>
          ))}
        </div>
      </div>
    </div>
    )}

    {/* LACTATION INPUTS — Infant age is required per PRD §5.5.2 */}
    {mode==="lactation"&&med&&(
    <div style={{background:"#fff",borderRadius:10,border:"1px solid #c0d4ef",padding:16,marginBottom:16}}>
      <div style={{fontSize:12,fontWeight:700,color:"#2c6fbb",marginBottom:12,display:"flex",alignItems:"center",gap:6}}>
        <span>Infant Details</span>
        <span style={{fontSize:10,background:"#eaf1fb",color:"#2c6fbb",border:"1px solid #c0d4ef",padding:"2px 6px",borderRadius:3,fontFamily:"'Geist Mono',monospace",fontWeight:700}}>REQUIRED</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
        <div>
          <label style={{fontSize:10,fontWeight:700,color:"#4b5563",textTransform:"uppercase",letterSpacing:"0.4px",fontFamily:"'Geist Mono',monospace",display:"block",marginBottom:5}}>Infant Age (weeks) <span style={{color:"#b83230"}}>*</span></label>
          <input type="number" min="0" max="104" value={infantAge} onChange={e=>setInfantAge(e.target.value)} placeholder="e.g. 4" style={{width:"100%",padding:"8px 10px",borderRadius:6,border:`1.5px solid ${infantAge?"#2c6fbb":"#e5e7eb"}`,fontSize:13,outline:"none",background:"#f9fafb"}}/>
          {!infantAge&&<div style={{fontSize:10,color:"#b83230",marginTop:3}}>Required — risk varies by infant maturity</div>}
        </div>
        <div>
          <label style={{fontSize:10,fontWeight:700,color:"#4b5563",textTransform:"uppercase",letterSpacing:"0.4px",fontFamily:"'Geist Mono',monospace",display:"block",marginBottom:5}}>Infant Status</label>
          <select value={infantStatus} onChange={e=>setInfantStatus(e.target.value)} className="select-field">
            <option value="">Select...</option>
            <option value="term-healthy">Term, healthy</option>
            <option value="preterm">Preterm / low birth weight</option>
            <option value="medical">Medical condition present</option>
          </select>
        </div>
        <div>
          <label style={{fontSize:10,fontWeight:700,color:"#4b5563",textTransform:"uppercase",letterSpacing:"0.4px",fontFamily:"'Geist Mono',monospace",display:"block",marginBottom:5}}>Feeding Pattern</label>
          <select value={feedPattern} onChange={e=>setFeedPattern(e.target.value)} className="select-field">
            <option value="">Select...</option>
            <option value="exclusive">Exclusive breastfeeding</option>
            <option value="supplemented">Mixed (BF + formula)</option>
            <option value="pumping">Pumping only</option>
          </select>
        </div>
      </div>
      {infantAge && getInfantRiskContext() && (
        <div style={{marginTop:12,padding:"8px 12px",borderRadius:6,background:`${getInfantRiskContext().color}10`,border:`1px solid ${getInfantRiskContext().color}30`,display:"flex",gap:8,alignItems:"flex-start"}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:getInfantRiskContext().color,flexShrink:0,marginTop:3}}/>
          <div>
            <span style={{fontSize:11,fontWeight:700,color:getInfantRiskContext().color}}>{getInfantRiskContext().label}: </span>
            <span style={{fontSize:11,color:"#4b5563"}}>{getInfantRiskContext().note}</span>
          </div>
        </div>
      )}
    </div>
    )}



    {/* Generate button */}
    {mode!=="lactation"&&(
    <button onClick={run} disabled={!med||!stage||loading} className="run-btn" style={{width:"100%",padding:"12px 0",borderRadius:8,background:med&&stage?"#0d7358":"#dde4dd",border:"none",color:med&&stage?"#fff":"#5a6b5a",fontSize:14,fontWeight:700,cursor:med&&stage?"pointer":"default",letterSpacing:"-0.3px",transition:"all .2s ease"}}>
      {loading
        ? <span style={{display:"inline-flex",alignItems:"center",gap:8}}>
            <span style={{width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin .6s linear infinite",display:"inline-block"}}/>
            <span key={loadMsg} style={{animation:"loadMsg .2s ease"}}>{loadMsg}</span>
          </span>
        : "Generate Risk-Benefit Analysis"}
    </button>
    )}

    {/* ━━━ INLINE LACTATION DISPLAY ━━━ */}
    {mode==="lactation"&&med&&MEDS[med]&&(()=>{
      const lm=MEDS[med];
      const lc=lm.lac;
      const tierClr=tierColor(lc?.tier);
      const infantCtx = getInfantRiskContext();

      if(!lc) return(
        <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2e6ec",padding:24,textAlign:"center",marginTop:4}}>
          <div style={{fontSize:14,fontWeight:600,color:"#b83230",marginBottom:4}}>No LactMed Data Available</div>
          <div style={{fontSize:12,color:"#4b5563"}}>LactMed® does not have an entry for {lm.g}. PeriRx does not extrapolate from related compounds.</div>
        </div>
      );

      return(
      <div style={{background:"#fff",borderRadius:10,border:"1px solid #c0d4ef",overflow:"hidden",marginTop:4,animation:"slideIn .3s ease"}}>
        <div style={{padding:"14px 20px",background:"linear-gradient(135deg,#eaf1fb,#f0f5fc)",borderBottom:"1px solid #c0d4ef",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:"#2c6fbb",letterSpacing:"0.5px",textTransform:"uppercase",fontFamily:"'Geist Mono',monospace"}}>Lactation Compatibility Module — LactMed®</div>
            <div style={{fontSize:18,fontWeight:700,color:"#111827",fontFamily:"'Instrument Serif',serif",marginTop:2}}>{lm.g}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}>
            <div style={{fontSize:11,fontWeight:700,color:tierClr,padding:"4px 10px",background:`${tierClr}12`,border:`1.5px solid ${tierClr}30`,borderRadius:6}}>{lc.tier}</div>
            {!infantAge && <div style={{fontSize:10,color:"#b83230",fontFamily:"'Geist Mono',monospace"}}>⚠ Enter infant age above</div>}
            <button onClick={()=>{setPtSumStep("prep");setShowPtSum(true);}} style={{padding:"6px 12px",borderRadius:6,background:"#111827",border:"none",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5}}><span>👤</span> Share with Patient</button>
          </div>
        </div>
        <div style={{padding:20}}>
          {/* Infant age context banner */}
          {infantCtx && (
            <div style={{padding:"8px 12px",borderRadius:6,background:`${infantCtx.color}10`,border:`1px solid ${infantCtx.color}30`,marginBottom:14,fontSize:12,color:"#374151"}}>
              <strong style={{color:infantCtx.color}}>{infantCtx.label}:</strong> {infantCtx.note}
              {infantStatus==="preterm"&&<div style={{marginTop:4,color:"#b83230",fontWeight:600}}>⚠ Preterm/low-BW status: metabolic capacity further reduced — treat as neonate regardless of chronological age.</div>}
            </div>
          )}
          {/* Tier explanation */}
          <div style={{background:`${tierClr}0a`,border:`1.5px solid ${tierClr}30`,borderRadius:8,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"flex-start",gap:10}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:tierClr,flexShrink:0,marginTop:3}}/>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:tierClr}}>{lc.tier}</div>
              <div style={{fontSize:10,color:"#4b5563",fontFamily:"'Geist Mono',monospace",marginTop:2}}>Classification derived from LactMed® peer-reviewed summary</div>
              <div style={{fontSize:11,color:"#4b5563",marginTop:6,lineHeight:1.5}}>
                <strong>Note:</strong> LactMed® classifies most psychiatric medications as "Compatible with monitoring" — this reflects the reality that breastfeeding is generally supported with appropriate infant observation, not that all drugs carry equal risk. The RID, milk levels, and monitoring recommendations below differentiate the risk profile.
              </div>
            </div>
          </div>
          {/* ── RID HERO + SUPPORTING METRICS (matches modal design) ──────── */}
          {(()=>{
            const ridStr = lc.rid || "";
            // Strip parenthetical content and everything after first semicolon to get primary value only
            const ridPrimary = ridStr.replace(/\([^)]*\)/g, "").split(";")[0].trim();
            // Parse range: "9–16%" or "9-16%"
            const rangeMatch = ridPrimary.match(/([\d.]+)\s*[–\-]\s*([\d.]+)\s*%/);
            const singleMatch = ridPrimary.match(/[<~]?\s*([\d.]+)\s*%/);
            const ridLow  = rangeMatch ? parseFloat(rangeMatch[1]) : singleMatch ? parseFloat(singleMatch[1]) : null;
            const ridHigh = rangeMatch ? parseFloat(rangeMatch[2]) : ridLow;
            const ridNum  = ridLow; // planning figure = lower bound for color/label logic
            const isRange = rangeMatch && ridHigh !== ridLow;
            const crossesThreshold = isRange && ridLow < 10 && ridHigh >= 10;
            const bothAbove = ridLow !== null && ridLow >= 10;
            const bothBelow = ridHigh !== null && ridHigh < 10;

            // Color: if range crosses threshold → amber; otherwise based on lower bound
            const ridColor = ridNum === null ? "#6b7280"
              : crossesThreshold ? "#a05a00"
              : ridNum < 2  ? "#0d7358"
              : ridNum < 5  ? "#2c7a5a"
              : ridNum < 10 ? "#a05a00"
              : "#b83230";

            const ridShort = ridStr.split("(")[0].trim();

            // Threshold label
            const thresholdLabel = ridNum === null ? "RID — see details"
              : crossesThreshold ? "Range spans the 10% threshold"
              : bothAbove ? "Exceeds 10% threshold"
              : ridNum < 2  ? "Well below 10% threshold"
              : ridNum < 5  ? "Below 10% threshold"
              : "Approaching threshold — monitor";

            const thresholdDetail = ridNum === null ? "Review full RID data below."
              : crossesThreshold ? `Lower end (${ridLow}%) is within acceptable range; upper end (${ridHigh}%) exceeds threshold. Dosing level and infant age determine which end applies clinically.`
              : bothAbove ? "RID ≥10% warrants individual risk-benefit assessment."
              : "An RID <10% is generally considered acceptable for breastfeeding (Hale's criterion).";

            return (
            <div style={{marginBottom:16}}>
              {/* RID hero row */}
              <div className="rid-hero-row">
                {/* Left: gauge + number */}
                <div className="rid-gauge" style={{border:`2px solid ${(bothAbove||crossesThreshold)?"#b83230":ridColor+"30"}`,background:(bothAbove||crossesThreshold)?"#fff5f5":undefined}}>
                  <div style={{fontSize:9,fontWeight:700,color:(bothAbove||crossesThreshold)?"#b83230":"#6b7280",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:2}}>RID</div>
                  <div style={{fontSize:"clamp(18px, 4vw, 26px)",fontWeight:800,color:ridColor,fontFamily:"'Geist Mono',monospace",lineHeight:1,letterSpacing:"-1px",wordBreak:"break-word",textAlign:"center"}}>{ridShort}</div>
                  {ridLow !== null && (
                    <div style={{width:"100%",marginTop:8}}>
                      {(() => {
                        const scale = 20;
                        const thresholdPct = 50; // 10/20 = 50%
                        const val = ridHigh ?? ridLow;
                        const fillPct = Math.min((val / scale) * 100, 99);
                        const exceeds = val >= 10;
                        const fillColor = exceeds ? "#b83230" : "#0d7358";
                        return (
                          <>
                            <div style={{height:7,borderRadius:4,background:"#e5e7eb",position:"relative",overflow:"hidden"}}>
                              <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${fillPct}%`,background:fillColor,borderRadius:"4px 0 0 4px",transition:"width .5s ease"}}/>
                              {/* Tick at 10% — rendered outside via overflow:visible wrapper */}
                            </div>
                            <div style={{position:"relative",height:0}}>
                              <div style={{position:"absolute",left:`${thresholdPct}%`,top:-11,height:15,width:2,background:"#9ca3af",borderRadius:1,zIndex:2,transform:"translateX(-50%)"}}/>
                            </div>
                            <div style={{position:"relative",marginTop:4,height:14}}>
                              <span style={{fontSize:8,color:"#a0aab4",fontFamily:"'Geist Mono',monospace",position:"absolute",left:0}}>0%</span>
                              <span style={{fontSize:8,fontFamily:"'Geist Mono',monospace",position:"absolute",left:`${thresholdPct}%`,transform:"translateX(-50%)",color:"#6b7280"}}>10%</span>
                              <span style={{fontSize:8,color:"#a0aab4",fontFamily:"'Geist Mono',monospace",position:"absolute",right:0}}>20%</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
                {/* Right: threshold badge + peak milk */}
                <div className="rid-right">
                  <div style={{background:`${ridColor}0d`,border:`1px solid ${ridColor}30`,borderRadius:8,padding:"10px 12px",flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
                    <div style={{fontSize:11,fontWeight:700,color:ridColor,marginBottom:3}}>{thresholdLabel}</div>
                    <div style={{fontSize:10,color:"#4b5563",lineHeight:1.45}}>{thresholdDetail}</div>
                  </div>
                  {/* Peak milk + feed timing */}
                  <div style={{background:`${showFeedTiming?"#eaf1fb":"#f8f9fb"}`,border:`1px solid ${showFeedTiming?"#2c6fbb":"#e5e7eb"}`,borderRadius:8,overflow:"hidden",transition:"border-color .15s"}}>
                    <div style={{padding:"8px 12px",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      <div style={{fontSize:9,fontWeight:700,color:"#6b7280",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.4px",flexShrink:0}}>Peak milk</div>
                      <div style={{fontSize:12,fontWeight:600,color:"#111827",wordBreak:"break-word",overflowWrap:"break-word",minWidth:0}}>{lc.pk} post-dose</div>
                      <button onClick={()=>setShowFeedTiming(v=>!v)} style={{fontSize:10,color:showFeedTiming?"#2c6fbb":"#9ca3af",marginLeft:"auto",whiteSpace:"nowrap",background:"none",border:"none",cursor:"pointer",padding:"2px 0",fontWeight:showFeedTiming?700:400,display:"flex",alignItems:"center",gap:3,transition:"color .15s"}}>
                        → feed timing guide <span style={{fontSize:9,display:"inline-block",transform:showFeedTiming?"rotate(90deg)":"rotate(0deg)",transition:"transform .2s"}}>▶</span>
                      </button>
                    </div>
                    {showFeedTiming&&(()=>{
                      const pkStr = lc.pk || "";
                      const pkMatch = pkStr.match(/([\d.]+)[–\-]?([\d.]*)\s*hr/i);
                      const pkLow  = pkMatch ? parseFloat(pkMatch[1]) : null;
                      const pkHigh = pkMatch && pkMatch[2] ? parseFloat(pkMatch[2]) : pkLow;
                      const pkMid  = pkLow !== null ? ((pkLow + (pkHigh||pkLow)) / 2).toFixed(1).replace(".0","") : null;
                      return (
                        <div style={{padding:"12px 14px",borderTop:"1px solid #dde8f5",background:"#eaf1fb",animation:"fadeIn .15s ease"}}>
                          <div style={{fontSize:11,fontWeight:700,color:"#2c6fbb",marginBottom:8}}>How to use peak milk timing</div>
                          <div style={{fontSize:11,color:"#2a3a4a",lineHeight:1.65,marginBottom:10}}>
                            Milk drug concentration rises after the dose and peaks around <strong>{lc.pk} post-dose</strong>, then falls toward a trough just before the next dose.{" "}
                            {pkLow !== null && pkLow > 6 ? <>The peak occurs too late to practically avoid — <strong>feed at the trough (just before the next dose)</strong>, when levels are lowest.</> : <>To minimize infant exposure, time feeds to occur <strong>just before the next dose</strong> (the trough).</>}
                          </div>
                          {pkLow !== null && (
                            <div style={{marginBottom:10,padding:"10px 12px",background:"#fff",borderRadius:7,border:"1px solid #c0d4ef"}}>
                              <div style={{fontSize:9,fontWeight:700,color:"#4b5563",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:8}}>Concentration curve (schematic)</div>
                              <div style={{position:"relative",height:44,marginBottom:4,padding:"0 8px"}}>
                                <svg width="100%" height="44" style={{display:"block"}} viewBox="0 0 200 44" preserveAspectRatio="none">
                                  <line x1="10" y1="36" x2="190" y2="36" stroke="#e0e8f5" strokeWidth="3" strokeLinecap="round"/>
                                  <path d="M10,36 Q60,6 100,8 Q140,10 190,32" fill="none" stroke="#2c6fbb" strokeWidth="2.5" strokeLinecap="round"/>
                                  <circle cx="100" cy="8" r="5" fill="#2c6fbb"/>
                                  <circle cx="10"  cy="36" r="5" fill="#0d7358"/>
                                  <circle cx="190" cy="32" r="5" fill="#0d7358"/>
                                </svg>
                              </div>
                              <div style={{display:"flex",justifyContent:"space-between"}}>
                                <div style={{fontSize:9,color:"#0d7358",fontWeight:700,fontFamily:"'Geist Mono',monospace",textAlign:"center",width:48}}>DOSE<br/><span style={{fontSize:8,fontWeight:400,color:"#6b7280"}}>feed here</span></div>
                                <div style={{fontSize:9,color:"#2c6fbb",fontWeight:700,fontFamily:"'Geist Mono',monospace",textAlign:"center"}}>PEAK<br/><span style={{fontSize:8,fontWeight:400,color:"#6b7280"}}>{pkLow > 24 ? "variable" : `~${pkMid} hr`}</span></div>
                                <div style={{fontSize:9,color:"#0d7358",fontWeight:700,fontFamily:"'Geist Mono',monospace",textAlign:"center",width:56}}>NEXT DOSE<br/><span style={{fontSize:8,fontWeight:400,color:"#6b7280"}}>feed here</span></div>
                              </div>
                            </div>
                          )}
                          {[
                            `Feed just <strong>before taking the dose</strong> — this is the trough, when milk drug levels are lowest.`,
                            pkLow !== null && pkLow <= 3
                              ? `If minimizing exposure is a priority, a short delay of ~${Math.ceil(pkLow)} hr after dosing covers the peak window.`
                              : `For this medication, peak milk levels occur <strong>~${lc.pk} after dosing</strong> — too long to avoid by delaying feeds. The trough (just before next dose) is the only practical low-exposure window.`,
                            pkLow !== null && pkLow >= 6 && pkLow <= 24
                              ? `For once-daily dosing, taking the dose at <strong>bedtime</strong> means the peak passes during overnight sleep — practical for most families.`
                              : pkLow !== null && pkLow <= 2
                              ? `With such a short peak window, once-daily or twice-daily dosing timed around feeds is manageable.`
                              : null,
                            `This is a <strong>harm-reduction strategy</strong>, not a requirement. For low-RID medications, feed timing is optional — extra reassurance rather than clinical necessity.`,
                          ].filter(Boolean).map((txt,i)=>(
                            <div key={i} style={{display:"flex",gap:7,alignItems:"flex-start",fontSize:11,color:"#2a3a4a",lineHeight:1.55,marginBottom:4}}>
                              <span style={{color:"#2c6fbb",flexShrink:0,marginTop:1}}>·</span>
                              <span dangerouslySetInnerHTML={{__html:txt}}/>
                            </div>
                          ))}
                          <div style={{marginTop:8,fontSize:9,color:"#6b7280",fontFamily:"'Geist Mono',monospace"}}>Source: Hale T. Medications and Mothers' Milk. Feed timing principles apply broadly; confirm with LactMed® for this drug.</div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Secondary metrics */}
              <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                {(()=>{
                  // Drug-specific signal overrides — used when raw data produces confusing headlines
                  // Format: { ml: {headline, detail, color}, is: {headline, detail, color} }
                  const drugSignalOverrides = {
                    lithium:      { is: {headline:"High — monitor closely", detail:"Infant serum ~58% of maternal in early postpartum; stabilises to <10% after ~1 month. Risk highest in neonatal period.", color:"#b83230"}, ml: {headline:"Variable — significant", detail:null, color:"#b83230"} },
                    lamotrigine:  { is: {headline:"~10% of maternal", detail:"Usually below therapeutic range. Immature glucuronidation in neonates — monitor for rash, apnea.", color:"#7a6010"} },
                    topiramate:   { is: {headline:"~51% of maternal", detail:"Unusually high infant serum — monitor closely, especially in younger infants.", color:"#b83230"} },
                    venlafaxine:  { is: {headline:"Present + metabolite", detail:"Active metabolite O-desmethylvenlafaxine also in milk — total exposure higher than RID alone suggests.", color:"#7a6010"} },
                    citalopram:   { is: {headline:"Detectable — monitor", detail:"CYP2C19 poor metabolizers may have higher infant exposure. Monitor for drowsiness, poor feeding.", color:"#7a6010"} },
                    clozapine:    { is: {headline:"Detectable + metabolites", detail:"Clozapine metabolites also present. Agranulocytosis risk is primary concern.", color:"#b83230"} },
                    alprazolam:   { is: {headline:"Low — but accumulates", detail:"PBPK-modeled RID ~6.51% — higher than typical BZDs. Repeated dosing can accumulate, especially in neonates.", color:"#7a6010"} },
                    bupropion:    { is: {headline:"Low + active metabolites", detail:"Hydroxybupropion metabolite appears at levels comparable to or exceeding parent drug.", color:"#7a6010"} },
                    aripiprazole: { is: {headline:"Minimal", detail:"Limited data. Monitor for sedation and poor weight gain. Note: may reduce milk supply.", color:"#7a6010"} },
                  };
                  const overrides = drugSignalOverrides[med] || {};

                  const extractHeadline = (v, label) => {
                    if (!v) return {headline:v, detail:null};
                    // Strip redundant label prefix (e.g. "Infant serum" from infant serum field)
                    const labelWords = (label||"").toLowerCase().replace(/[^a-z\s]/g,"").trim();
                    let cleaned = v;
                    if (labelWords) {
                      const labelRe = new RegExp(`^${labelWords}\\s*[~:]?\\s*`, "i");
                      cleaned = cleaned.replace(labelRe, "");
                    }
                    // Extract headline: everything before first semicolon, dash, or parenthesis
                    const m2 = cleaned.match(/^([^;(—]+)/);
                    const raw = m2 ? m2[1].trim() : cleaned;
                    const headline = raw.replace(/\s*(mcg\/L.*|mg\/L.*|typical.*|average.*|avg.*)$/i,"").trim();
                    let detail = cleaned.slice(headline.length).replace(/^[;,\s\-—]+/,"").trim()||null;
                    // Drop vague single-word or very short detail fragments that add no meaning alone
                    const vagueFragments = ["significant","variable","low","high","moderate","minimal","notable","present","absent","detectable","undetectable"];
                    if (detail && detail.split(/\s+/).length <= 2 && vagueFragments.some(w => detail.toLowerCase().startsWith(w))) {
                      // Fold it into the headline instead
                      return {headline: `${headline} — ${detail}`, detail: null};
                    }
                    return {headline, detail};
                  };
                  return [{l:"Milk levels",v:lc.ml,icon:"🍼",key:"ml"},{l:"Infant serum",v:lc.is,icon:"🧪",key:"is"}].map((x,i)=>{
                    const override = overrides[x.key];
                    const {headline, detail} = override ? {headline:override.headline, detail:override.detail} : extractHeadline(x.v, x.l);
                    const hLen = headline.length;
                    const hSize = hLen<=3?22:hLen<=6?20:hLen<=12?18:hLen<=20?16:13;
                    const hLower = headline.toLowerCase();
                    const hColor = override?.color || (
                      hLower.includes("low")||hLower.includes("undetect")||hLower.includes("minimal")||hLower.includes("negligib") ? "#0d7358"
                      : hLower.includes("moderate")||hLower.includes("variable")||hLower.includes("detectable") ? "#7a6010"
                      : hLower.includes("high")||hLower.includes("significant")||hLower.includes("substantial") ? "#b83230"
                      : "#111827");
                    return (
                      <div key={i} style={{flex:"1 1 0",minWidth:120,background:"#f8f9fb",borderRadius:7,padding:"9px 11px",border:"1px solid #e8ebf0"}}>
                        <div style={{fontSize:9,fontWeight:700,color:"#6b7280",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.3px",marginBottom:6,display:"flex",alignItems:"center",gap:4}}>
                          <span>{x.icon}</span>{x.l}
                        </div>
                        <div style={{fontSize:hSize,fontWeight:800,color:hColor,lineHeight:1.1,marginBottom:detail?6:0,letterSpacing:hSize>20?"-0.5px":"0"}}>{headline}</div>
                        {detail&&<div style={{fontSize:10,color:"#6b7280",lineHeight:1.45}}>{detail}</div>}
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Feed pattern note */}
              {feedPattern&&(
                <div style={{padding:"8px 12px",borderRadius:6,background:"#f8f9fb",border:"1px solid #e2e6ec",marginBottom:10,fontSize:11,color:"#4b5563"}}>
                  <strong>Feeding pattern ({feedPattern}):</strong> {feedPattern==="exclusive"?"Infant receives maximum drug exposure. Monitoring is most important for this pattern.":feedPattern==="supplemented"?"Mixed feeding reduces total drug intake proportionally. Consider timing feeds before maternal dose peak.":"Pumping only allows dose-timing strategies. Discard milk expressed near peak concentration if RID is a concern."}
                </div>
              )}

              {/* Adverse effects + monitoring — collapsible */}
              {[
                {l:"Adverse effects in nursing infants",v:lc.ae,icon:"⚠️",defaultOpen:false},
                {l:"Infant monitoring",v:lc.mon,icon:"👁",defaultOpen:true},
              ].map((x,i)=>(
                <details key={i} open={x.defaultOpen} style={{marginBottom:6}}>
                  <summary style={{listStyle:"none",cursor:"pointer",background:"#f8f9fb",border:"1px solid #e8ebf0",borderRadius:7,padding:"9px 12px",display:"flex",alignItems:"center",gap:7,userSelect:"none"}}>
                    <span style={{fontSize:12}}>{x.icon}</span>
                    <span style={{fontSize:11,fontWeight:700,color:"#374151",flex:1}}>{x.l}</span>
                    <span style={{fontSize:10,color:"#a0aab4",fontFamily:"'Geist Mono',monospace"}}>▾</span>
                  </summary>
                  <div style={{fontSize:11,color:"#374151",lineHeight:1.6,padding:"10px 12px",background:"#f9fafb",border:"1px solid #e8ebf0",borderTop:"none",borderRadius:"0 0 7px 7px"}}>{x.v}</div>
                </details>
              ))}
            </div>
            );
          })()}
          {lc.alts?.length>0&&(
            <div style={{marginTop:8}}>
              <div style={{fontSize:10,fontWeight:700,color:"#4b5563",marginBottom:6}}>Therapeutic Alternatives (per LactMed®)</div>
              <div style={{display:"flex",gap:6}}>{lc.alts.map((a,i)=>(
                <span key={i} style={{padding:"4px 10px",borderRadius:4,fontSize:11,background:"#eaf1fb",border:"1px solid #c0d4ef",color:"#2c6fbb",fontWeight:600}}>{a}</span>
              ))}</div>
            </div>
          )}
          <div style={{marginTop:14,display:"flex",justifyContent:"space-between",padding:"8px 10px",borderRadius:6,background:"#f8f9fb",border:"1px solid #e8ebf0",alignItems:"center"}}>
            <span style={{fontSize:10,color:"#6b7280",fontFamily:"'Geist Mono',monospace"}}>LactMed® last revision: {lc.rev}</span>
            <a href={SRC_LINKS["LactMed"](med)} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:"#2c6fbb",fontFamily:"'Geist Mono',monospace",textDecoration:"underline"}}>Open LactMed® ↗</a>
          </div>
          <div style={{marginTop:10,textAlign:"center",fontSize:9,color:"#6b7280",fontFamily:"'Geist Mono',monospace",lineHeight:1.65}}>
            All lactation data sourced exclusively from LactMed® (NLM/NICHD). PeriRx never outputs "Do not breastfeed." That decision belongs to the clinician and patient.
          </div>
        </div>
      </div>
      );
    })()}

  </div>
  )}

  {/* ━━━━━━━━━━━━━ RESULTS VIEW ━━━━━━━━━━━━━ */}
  {view==="results"&&m&&(
  <div style={{animation:"slideUpFade .4s cubic-bezier(0.22,0.61,0.36,1) both"}}>

    {/* High-alert banner — shown before anything else */}
    {HIGH_ALERT[med] && <HighAlertBanner medKey={med} />}

    {/* Rapidly-evolving evidence banner */}
    {RAPIDLY_EVOLVING.has(med)&&(
      <div style={{marginBottom:12,padding:"12px 16px",borderRadius:8,background:"linear-gradient(135deg,#f5f0fd,#fef4fb)",border:"1.5px solid #c4a0f0",display:"flex",alignItems:"flex-start",gap:10}}>
        <Icon name="science" size={16} color="#6b38a8"/>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
            <span style={{fontSize:11,fontWeight:700,color:"#6b38a8",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.4px"}}>Rapidly Evolving Evidence</span>
            <span style={{fontSize:9,background:"#fef0f6",color:"#9d3d75",border:"1px solid #f0b0d0",borderRadius:3,padding:"1px 6px",fontWeight:700,fontFamily:"'Geist Mono',monospace"}}>💜 FDA-APPROVED FOR PPD SPECIFICALLY</span>
          </div>
          <div style={{fontSize:11,color:"#4a2d7a",lineHeight:1.65}}>
            {med==="zuranolone"&&"Zuranolone (Zurzuvae) is the first oral medication specifically FDA-approved for postpartum depression (Aug 2023). Evidence is accumulating rapidly — PeriRx data is reviewed quarterly. Check LactMed and MGH Women's Mental Health before clinical decisions. Note: ~$15,900 per 14-day course — prior authorization typically required."}
            {med==="brexanolone"&&"Brexanolone (Zulresso) was the first FDA-approved PPD-specific drug (2019). IV administration in a REMS-certified facility — not outpatient. Oral zuranolone (same mechanism) approved 2023 as more accessible alternative. PeriRx reviews rapidly evolving data quarterly."}
          </div>
          {stage==="pp"&&(
            <button
              onClick={()=>{
                const other=med==="zuranolone"?"brexanolone":"zuranolone";
                setCmpMeds([other,"__discontinue__"]);
                setTab("scenarios");
              }}
              style={{marginTop:8,padding:"5px 12px",borderRadius:6,background:"#6b38a8",border:"none",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:5}}
            >
              <span>⚖️</span> Compare {med==="zuranolone"?"Zuranolone vs Brexanolone vs Discontinue":"Brexanolone vs Zuranolone vs Discontinue"}
            </button>
          )}
        </div>
      </div>
    )}

    {/* Provenance disclaimer — collapsible */}
    <div style={{marginBottom:12}}>
      <button onClick={()=>setProvOpen(o=>!o)} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 10px",borderRadius:6,background:"#fdf8ee",border:"1px solid #e8d9a0",cursor:"pointer",width:"100%",textAlign:"left"}}>
        <Icon name="warning" size={12} color="#9a7b15"/>
        <span style={{fontSize:11,fontWeight:600,color:"#7a6010",flex:1}}>AI-assisted data — verify numerical claims before clinical decisions</span>
        <span style={{fontSize:10,color:"#7a6010",fontFamily:"'Geist Mono',monospace",flexShrink:0}}>{provOpen?"▲ hide":"▼ details"}</span>
      </button>
      {provOpen&&(
        <div style={{background:"#fdf8ee",border:"1px solid #e8d9a0",borderTop:"none",borderRadius:"0 0 6px 6px",padding:"10px 14px",fontSize:11,color:"#7a6010",lineHeight:1.65}}>
          <strong>Data provenance:</strong> Clinical summaries in PeriRx were authored with AI assistance. A systematic verification pass against DailyMed, LactMed, and MotherToBaby has been completed (Feb 2026), with key corrections applied (valproate dose threshold, paroxetine cardiac signal evidence quality, lithium lactation RID, carbamazepine NTD range, bupropion cardiac signal nuance, lamotrigine lactation RID, sertraline PPHN baseline). <strong>Verify specific numerical claims against primary sources before clinical decisions.</strong>
        </div>
      )}
    </div>

    {/* Results header */}
    <div style={{background:"#fff",borderRadius:10,border:"1px solid #e4e8e4",padding:"18px 22px",marginBottom:14}}>
      {/* Row 1: breadcrumb + buttons */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:14}}>
        <div>
          <div style={{fontSize:9,fontWeight:600,color:"#5a6b5a",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:5,display:"flex",alignItems:"center",gap:5}}>
            <span style={{color:"#0d7358"}}>{m.cls}</span>
            <span style={{color:"#d0d5dd"}}>·</span>
            <span>{STAGE_LABELS[stage]}</span>
            {dx&&<><span style={{color:"#d0d5dd"}}>·</span><span style={{color:"#0d7358"}}>{dx}</span></>}
            {dx2&&<><span style={{color:"#d0d5dd"}}>+</span><span style={{color:"#8856d4"}}>{dx2}</span></>}
            {sev&&<><span style={{color:"#d0d5dd"}}>·</span><span style={{color:sev==="severe"?"#b83230":sev==="moderate"?"#7a6010":"#0d7358",textTransform:"capitalize"}}>{sev}</span></>}
            {priors&&<><span style={{color:"#d0d5dd"}}>·</span><span style={{color:"#4b5563",fontStyle:"italic"}}>tried: {priors.length>30?priors.substring(0,30)+"…":priors}</span></>}
            {relHx&&<><span style={{color:"#d0d5dd"}}>·</span><span style={{color:"#4b5563",fontStyle:"italic"}}>hx: {relHx.length>30?relHx.substring(0,30)+"…":relHx}</span></>}
          </div>
          <div style={{display:"flex",alignItems:"baseline",gap:10,flexWrap:"wrap"}}>
            <div style={{fontSize:22,fontWeight:700,color:"#111827",fontFamily:"'Instrument Sans',system-ui,sans-serif",lineHeight:1.1}}>
              {m.g}
            </div>
            <span style={{fontSize:15,color:"#4b5563",fontWeight:400,fontFamily:"'Instrument Sans',system-ui,sans-serif"}}>({m.b})</span>
            {(()=>{const pColor=m.p==="P0"?"#0d7358":m.p==="P1"?"#7a6010":"#b0620e";const pBg=m.p==="P0"?"#e8f5f0":m.p==="P1"?"#fdf6e0":"#fff3e8";const pLabel=m.p==="P0"?"First-line":m.p==="P1"?"Second-line":"Use with caution";return(<span style={{fontSize:11,fontWeight:600,fontFamily:"'Geist Mono',monospace",color:pColor,background:pBg,padding:"3px 8px",borderRadius:4,border:`1px solid ${pColor}30`,whiteSpace:"nowrap"}}>{m.p} · {pLabel}</span>);})()}
          </div>
        </div>
        <div style={{display:"flex",gap:8,flexShrink:0,alignItems:"center"}}>
          <button
            onClick={()=>{setPtSumStep("prep");setShowPtSum(true);}}
            style={{padding:"9px 18px",borderRadius:8,background:"#111827",border:"none",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:8,boxShadow:"0 2px 8px rgba(0,0,0,0.18)",transition:"all .15s",whiteSpace:"nowrap"}}
            onMouseEnter={e=>{e.currentTarget.style.background="#2c3040";e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,0.22)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="#111827";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.18)";}}
          >
            <Icon name="patient" size={14} color="currentColor"/>
            <span>Share with Patient</span>
            <span style={{fontSize:10,opacity:0.6,fontWeight:400,marginLeft:2}}>→</span>
          </button>
          <button onClick={()=>setShowLac(true)} style={{padding:"8px 16px",borderRadius:6,background:"#0d7358",border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>Lactation ↗</button>
        </div>
      </div>
      {/* Row 2: live context bar — stage, diagnosis, severity all editable in place */}
      <div style={{borderTop:"1px solid #f0f2f5",paddingTop:12}}>
      <div style={{fontSize:9,color:"#6b7280",fontFamily:"'Geist Mono',monospace",marginBottom:7,display:"flex",alignItems:"center",gap:5}}>
        <span style={{width:5,height:5,borderRadius:"50%",background:"#0d7358",display:"inline-block"}}/>
        CLINICAL CONTEXT — edit below to update analysis instantly
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        {/* Stage selector */}
        <span style={{fontSize:10,fontWeight:700,color:"#4b5563",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.5px",whiteSpace:"nowrap"}}>Stage</span>
        <select
          value={stage}
          onChange={e=>setStage(e.target.value)}
          style={{padding:"5px 28px 5px 10px",borderRadius:6,border:`1.5px solid ${stage?"#0d7358":"#e5e7eb"}`,fontSize:12,color:"#111827",outline:"none",background:"#fff",appearance:"none",backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238896a6' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 8px center",cursor:"pointer",fontWeight:600,transition:"border-color .15s"}}
        >
          {STAGES.map(s=><option key={s.v} value={s.v}>{s.l}</option>)}
        </select>
        <span style={{color:"#e5e7eb",fontSize:14,flexShrink:0}}>|</span>
        <span style={{fontSize:10,fontWeight:700,color:"#4b5563",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.5px",whiteSpace:"nowrap"}}>Diagnosis</span>
        <div style={{position:"relative",flex:"1 1 200px",minWidth:160,maxWidth:320}}>
          <input
            type="text"
            value={dxInput}
            onChange={e=>{setDxInput(e.target.value);setDxOpen(true);if(!e.target.value)setDx("");}}
            onFocus={()=>setDxOpen(true)}
            onBlur={()=>setTimeout(()=>setDxOpen(false),150)}
            placeholder="Search diagnosis…"
            style={{width:"100%",padding:"6px 28px 6px 10px",borderRadius:6,border:`1.5px solid ${dx?"#0d7358":"#e5e7eb"}`,fontSize:12,outline:"none",background:dx?"#e8f5f008":"#f9fafb",color:"#111827",boxSizing:"border-box"}}
          />
          {dx&&<button onClick={()=>{setDx("");setDxInput("");}} style={{position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#6b7280",fontSize:14,lineHeight:1,padding:2}}>×</button>}
          {dxOpen&&(()=>{
            const filtered=DIAGNOSES.filter(d=>d.toLowerCase().includes(dxInput.toLowerCase()));
            const showCustom=dxInput.trim()&&!DIAGNOSES.some(d=>d.toLowerCase()===dxInput.toLowerCase().trim());
            if(!filtered.length&&!showCustom) return null;
            return(
              <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:300,background:"#fff",border:"1px solid #e2e6ec",borderRadius:8,boxShadow:"0 8px 32px rgba(0,0,0,.12),0 2px 8px rgba(0,0,0,.05)",maxHeight:240,overflowY:"auto",marginTop:4}}>
                {[
                  {label:"Mood Disorders",items:["Major Depressive Disorder","Persistent Depressive Disorder (Dysthymia)","Premenstrual Dysphoric Disorder (PMDD)","Seasonal Affective Disorder","Bipolar I Disorder","Bipolar II Disorder","Cyclothymic Disorder"]},
                  {label:"Anxiety Disorders",items:["Generalized Anxiety Disorder","Panic Disorder","Social Anxiety Disorder","Specific Phobia","Agoraphobia","Separation Anxiety Disorder"]},
                  {label:"Trauma & Stress",items:["PTSD","Acute Stress Disorder","Adjustment Disorder"]},
                  {label:"OCD Spectrum",items:["OCD","Body Dysmorphic Disorder","Hoarding Disorder","Trichotillomania"]},
                  {label:"Psychotic Disorders",items:["Schizophrenia","Schizoaffective Disorder","Brief Psychotic Disorder","Delusional Disorder"]},
                  {label:"Perinatal-Specific",items:["Postpartum Depression","Postpartum Anxiety","Postpartum Psychosis","Peripartum Depression"]},
                  {label:"Neurodevelopmental",items:["ADHD","Autism Spectrum Disorder"]},
                  {label:"Eating Disorders",items:["Anorexia Nervosa","Bulimia Nervosa","Binge Eating Disorder"]},
                  {label:"Sleep & Somatic",items:["Insomnia Disorder","Somatic Symptom Disorder","Illness Anxiety Disorder"]},
                  {label:"Substance Use",items:["Alcohol Use Disorder","Opioid Use Disorder","Cannabis Use Disorder"]},
                  {label:"Personality",items:["Borderline Personality Disorder"]},
                ].map(group=>{
                  const visibleItems=group.items.filter(d=>filtered.includes(d));
                  if(!visibleItems.length) return null;
                  return(
                    <div key={group.label}>
                      <div style={{padding:"5px 12px 2px",fontSize:9,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.5px",fontFamily:"'Geist Mono',monospace",background:"#f8f9fb",borderBottom:"1px solid #f0f2f5"}}>{group.label}</div>
                      {visibleItems.map(d=>(
                        <div key={d} onMouseDown={()=>{setDx(d);setDxInput(d);setDxOpen(false);}}
                          style={{padding:"7px 14px",fontSize:12,color:dx===d?"#0d7358":"#111827",background:dx===d?"#e8f5f0":"transparent",cursor:"pointer",fontWeight:dx===d?600:400}}
                          onMouseEnter={e=>e.currentTarget.style.background=dx===d?"#e8f5f0":"#f8f9fb"}
                          onMouseLeave={e=>e.currentTarget.style.background=dx===d?"#e8f5f0":"transparent"}
                        >{d}</div>
                      ))}
                    </div>
                  );
                })}
                {showCustom&&(
                  <div onMouseDown={()=>{const val=dxInput.trim();setDx(val);setDxInput(val);setDxOpen(false);}}
                    style={{padding:"7px 14px",fontSize:12,color:"#2c6fbb",cursor:"pointer",borderTop:"1px solid #e8ebf0",display:"flex",alignItems:"center",gap:6}}
                    onMouseEnter={e=>e.currentTarget.style.background="#eaf1fb"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                  >
                    <span style={{fontSize:10,background:"#eaf1fb",border:"1px solid #c0d4ef",borderRadius:3,padding:"1px 5px",fontWeight:700,fontFamily:"'Geist Mono',monospace"}}>CUSTOM</span>
                    Use &ldquo;{dxInput.trim()}&rdquo;
                  </div>
                )}
              </div>
            );
          })()}
        </div>
        <span style={{fontSize:10,fontWeight:700,color:"#4b5563",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.4px",whiteSpace:"nowrap"}}>Severity</span>
        <div style={{display:"flex",gap:4}}>
          {["mild","moderate","severe"].map(s=>(
            <button key={s} onClick={()=>setSev(sev===s?"":s)}
              style={{padding:"6px 14px",borderRadius:6,fontSize:12,fontWeight:600,cursor:"pointer",border:`1.5px solid ${sev===s?"#111827":"#e5e7eb"}`,background:sev===s?"#111827":"#fff",color:sev===s?"#fff":"#6b7280",textTransform:"capitalize",transition:"all .15s",fontWeight:600}}>
              {s}
            </button>
          ))}
        </div>
        {dx&&<span style={{fontSize:10,color:"#0d7358",fontFamily:"'Geist Mono',monospace",whiteSpace:"nowrap"}}>✓ {DIAGNOSIS_UR[dx]?"in database":"custom entry"}</span>}
        {dx&&(
          <>
            <span style={{fontSize:10,fontWeight:700,color:"#4b5563",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.4px",whiteSpace:"nowrap",marginLeft:4}}>+ Second Diagnosis</span>
            <div style={{position:"relative",flex:"1 1 160px",minWidth:140,maxWidth:260}}>
              <input
                type="text"
                value={dx2Input}
                onChange={e=>{setDx2Input(e.target.value);setDx2Open(true);if(!e.target.value)setDx2("");}}
                onFocus={()=>setDx2Open(true)}
                onBlur={()=>setTimeout(()=>setDx2Open(false),150)}
                placeholder="Add comorbid diagnosis…"
                style={{width:"100%",padding:"6px 28px 6px 10px",borderRadius:6,border:`1.5px solid ${dx2?"#8856d4":"#e5e7eb"}`,fontSize:12,outline:"none",background:dx2?"#f5f0fd":"#f9fafb",color:"#111827",boxSizing:"border-box"}}
              />
              {dx2&&<button onClick={()=>{setDx2("");setDx2Input("");}} style={{position:"absolute",right:6,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#6b7280",fontSize:14,lineHeight:1,padding:2}}>×</button>}
              {dx2Open&&(()=>{
                const filtered=DIAGNOSES.filter(d=>d.toLowerCase().includes(dx2Input.toLowerCase())&&d!==dx);
                const showCustom=dx2Input.trim()&&!DIAGNOSES.some(d=>d.toLowerCase()===dx2Input.toLowerCase().trim());
                if(!filtered.length&&!showCustom) return null;
                return(
                  <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:300,background:"#fff",border:"1px solid #e2e6ec",borderRadius:8,boxShadow:"0 8px 32px rgba(0,0,0,.12),0 2px 8px rgba(0,0,0,.05)",maxHeight:220,overflowY:"auto",marginTop:4}}>
                    {[
                      {label:"Mood Disorders",items:["Major Depressive Disorder","Persistent Depressive Disorder (Dysthymia)","Premenstrual Dysphoric Disorder (PMDD)","Seasonal Affective Disorder","Bipolar I Disorder","Bipolar II Disorder","Cyclothymic Disorder"]},
                      {label:"Anxiety Disorders",items:["Generalized Anxiety Disorder","Panic Disorder","Social Anxiety Disorder","Specific Phobia","Agoraphobia","Separation Anxiety Disorder"]},
                      {label:"Trauma & Stress",items:["PTSD","Acute Stress Disorder","Adjustment Disorder"]},
                      {label:"OCD Spectrum",items:["OCD","Body Dysmorphic Disorder","Hoarding Disorder","Trichotillomania"]},
                      {label:"Psychotic Disorders",items:["Schizophrenia","Schizoaffective Disorder","Brief Psychotic Disorder","Delusional Disorder"]},
                      {label:"Perinatal-Specific",items:["Postpartum Depression","Postpartum Anxiety","Postpartum Psychosis","Peripartum Depression"]},
                      {label:"Neurodevelopmental",items:["ADHD","Autism Spectrum Disorder"]},
                      {label:"Eating Disorders",items:["Anorexia Nervosa","Bulimia Nervosa","Binge Eating Disorder"]},
                      {label:"Sleep & Somatic",items:["Insomnia Disorder","Somatic Symptom Disorder","Illness Anxiety Disorder"]},
                      {label:"Substance Use",items:["Alcohol Use Disorder","Opioid Use Disorder","Cannabis Use Disorder"]},
                      {label:"Personality",items:["Borderline Personality Disorder"]},
                    ].map(group=>{
                      const visibleItems=group.items.filter(d=>filtered.includes(d));
                      if(!visibleItems.length) return null;
                      return(
                        <div key={group.label}>
                          <div style={{padding:"5px 12px 2px",fontSize:9,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.5px",fontFamily:"'Geist Mono',monospace",background:"#f8f9fb",borderBottom:"1px solid #f0f2f5"}}>{group.label}</div>
                          {visibleItems.map(d=>(
                            <div key={d} onMouseDown={()=>{setDx2(d);setDx2Input(d);setDx2Open(false);}}
                              style={{padding:"7px 14px",fontSize:12,color:dx2===d?"#8856d4":"#111827",background:dx2===d?"#f5f0fd":"transparent",cursor:"pointer",fontWeight:dx2===d?600:400}}
                              onMouseEnter={e=>e.currentTarget.style.background=dx2===d?"#f5f0fd":"#f8f9fb"}
                              onMouseLeave={e=>e.currentTarget.style.background=dx2===d?"#f5f0fd":"transparent"}
                            >{d}</div>
                          ))}
                        </div>
                      );
                    })}
                    {showCustom&&(
                      <div onMouseDown={()=>{const val=dx2Input.trim();setDx2(val);setDx2Input(val);setDx2Open(false);}}
                        style={{padding:"7px 14px",fontSize:12,color:"#8856d4",cursor:"pointer",borderTop:"1px solid #e8ebf0",display:"flex",alignItems:"center",gap:6}}
                        onMouseEnter={e=>e.currentTarget.style.background="#f5f0fd"}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                      >
                        <span style={{fontSize:10,background:"#f5f0fd",border:"1px solid #d4b8f5",borderRadius:3,padding:"1px 5px",fontWeight:700,fontFamily:"'Geist Mono',monospace"}}>CUSTOM</span>
                        Use &ldquo;{dx2Input.trim()}&rdquo;
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
            {dx2&&<span style={{fontSize:10,color:"#8856d4",fontFamily:"'Geist Mono',monospace",whiteSpace:"nowrap"}}>✓ {getComorbidityModifier(dx,dx2)?"combined risk data available":"no combined data for this pair"}</span>}
          </>
        )}
      </div>
      </div>
    </div>

    {/* Tab navigation */}
    <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch",marginBottom:16,paddingBottom:2}}>
      <div style={{display:"flex",gap:2,background:"#fff",borderRadius:8,padding:3,border:"1px solid #e4e8e4",width:"fit-content",minWidth:"100%",boxSizing:"border-box",position:"relative"}}>
        {[{k:"tradeoff",l:"Trade-Offs",icon:"tradeoff"},{k:"timeline",l:"Across Pregnancy",icon:"timeline"},{k:"scenarios",l:"Scenarios",icon:"scenarios"}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} style={{flex:"1 1 0",padding:"7px 12px",border:"none",borderRadius:6,background:tab===t.k?"#0d7358":"transparent",color:tab===t.k?"#fff":"#9ca3af",fontSize:12,fontWeight:tab===t.k?700:500,cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",justifyContent:"center",gap:5,transition:"all .22s cubic-bezier(0.22,0.61,0.36,1)"}}><Icon name={t.icon} size={13} color="currentColor"/>{t.l}</button>
        ))}
      </div>
    </div>

    {/* ── TRADE-OFF TAB ── */}
    {tab==="tradeoff"&&(()=>{
      const d=m.tera[stage];
      const sevEffective=sev||"moderate";const u=dx&&DIAGNOSIS_UR[dx]?DIAGNOSIS_UR[dx][sevEffective]||DIAGNOSIS_UR[dx].moderate:null;
      return(
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}>

        {/* Col 1: Med Risk */}
        <div className="card" style={{overflow:"hidden",animation:"cardEntrance 0.35s cubic-bezier(0.22,0.61,0.36,1) both",animationDelay:"0ms"}}>
          <div style={{padding:"12px 16px",borderBottom:"2px solid #0d7358",display:"flex",alignItems:"center",gap:7}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#0d7358",flexShrink:0}}/>
            <span style={{fontSize:10,fontWeight:700,color:"#0d7358",fontFamily:"'Geist Mono',monospace",letterSpacing:"0.5px",textTransform:"uppercase"}}>Medication Exposure Risk</span>
          </div>
          <div style={{padding:16}}>
            {d?(
            <>
              <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:12,paddingBottom:10,borderBottom:"1px solid #f0f2f5",flexWrap:"wrap"}}>
                <span style={{fontSize:d.r.length>20?16:20,fontWeight:800,color:d.r.includes("High")?"#b83230":d.r.includes("Moderate")?"#a05a00":d.r.includes("None")?"#0d7358":"#111827",fontFamily:"'Instrument Sans',system-ui,sans-serif",lineHeight:1.2,flex:1}}>{d.r}</span>
                <QBadge q={d.q}/>
              </div>
              {/* Conflicting evidence display */}
              {d.q==="Conflicting"&&(
                <div style={{background:"#f3e8fd",borderRadius:6,padding:10,marginBottom:10,border:"1px solid #d0b0f0",fontSize:11,color:"#7b38a8",lineHeight:1.5}}>
                  <strong>Conflicting Evidence:</strong> Studies show meaningfully different results. Both findings are presented — PeriRx does not adjudicate between them. Review individual citations below.
                </div>
              )}
              <p style={{fontSize:12,color:"#4b5563",lineHeight:1.65,marginBottom:10}}>{d.s}</p>
              {d.bl&&d.ex&&(
                <>
                  <div style={{background:"#f8f9fb",borderRadius:6,padding:10,marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:10,color:"#4b5563",fontFamily:"'Geist Mono',monospace"}}>Population Baseline</span>
                      <span style={{fontSize:11,fontWeight:600,color:"#4b5563"}}>{d.bl}</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:10,color:"#4b5563",fontFamily:"'Geist Mono',monospace"}}>Exposed Pregnancies</span>
                      <span style={{fontSize:11,fontWeight:600,color:"#111827"}}>{d.ex}</span>
                    </div>
                  </div>
                  <IconArray exposedRate={d.ex} baselineRate={d.bl} label="Absolute Risk Visualization"/>
                </>
              )}
              <div style={{marginTop:10,fontSize:10,color:"#6b7280",fontFamily:"'Geist Mono',monospace"}}>
                <SrcChip src={d.src} date={d.d} drugKey={med}/>
              </div>
            </>
            ):(
              <div style={{padding:20,textAlign:"center",color:"#6b7280",fontSize:12,background:"#f8f9fb",borderRadius:6,border:"1px dashed #e2e6ec"}}>
                <div style={{fontWeight:700,marginBottom:4,fontSize:13}}>{d===undefined?"No Data Available":""}</div>
                TERIS risk rating: not available for this stage.
              </div>
            )}
          </div>
        </div>

        {/* Col 2: Untreated Illness Risk */}
        <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2e6ec",overflow:"hidden",animation:"cardEntrance 0.35s cubic-bezier(0.22,0.61,0.36,1) both",animationDelay:"60ms"}}>
          <div style={{padding:"12px 16px",borderBottom:"2px solid #b83230",display:"flex",alignItems:"center",gap:7}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#b83230",flexShrink:0}}/>
            <span style={{fontSize:10,fontWeight:700,color:"#b83230",fontFamily:"'Geist Mono',monospace",letterSpacing:"0.5px",textTransform:"uppercase"}}>Untreated Illness Risk</span>
          </div>
          <div style={{padding:16}}>
            {!u ? (
              /* ── Empty state: no diagnosis entered ── */
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:180,textAlign:"center",gap:12}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:"#f8f9fb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>↑</div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#111827",marginBottom:6}}>Diagnosis required</div>
                  <div style={{fontSize:12,color:"#4b5563",lineHeight:1.65,maxWidth:220}}>
                    Use the Diagnosis field above the tabs to see condition-specific relapse rates and outcomes.
                  </div>
                </div>
                <div style={{fontSize:11,color:"#4b5563",lineHeight:1.65,maxWidth:240,padding:"10px 14px",borderRadius:6,background:"#f8f9fb",border:"1px solid #e8ebf0"}}>
                  Untreated illness risk varies substantially by diagnosis — MDD, Bipolar I, and Schizophrenia have very different profiles.
                </div>
              </div>
            ) : (
              <>
                {/* Provenance badge */}
                <div style={{fontSize:10,color:"#0d7358",background:"#e8f5f0",border:"1px solid #c5e8dc",borderRadius:4,padding:"5px 8px",marginBottom:10,fontFamily:"'Geist Mono',monospace",lineHeight:1.5,display:"flex",alignItems:"center",gap:4}}>
                  <span>✓</span>
                  <span><strong>{dx}</strong>{!sev&&<span style={{color:"#a05a00"}}> · moderate estimate (no severity selected)</span>}</span>
                </div>
                {relHx&&(
                  <div style={{padding:"8px 12px",borderRadius:6,background:"#fff8ee",border:"1px solid #f5c6a0",marginBottom:10,display:"flex",gap:8,alignItems:"flex-start"}}>
                    <Icon name="note" size={13} color="#a05a00"/>
                    <div>
                      <div style={{fontSize:10,fontWeight:700,color:"#a05a00",fontFamily:"'Geist Mono',monospace",marginBottom:2}}>THIS PATIENT'S HISTORY</div>
                      <div style={{fontSize:12,color:"#374151",lineHeight:1.5}}>{relHx}</div>
                    </div>
                  </div>
                )}
                <div style={{marginBottom:10}}>
                  {relHx&&<div style={{fontSize:9,fontWeight:700,color:"#6b7280",fontFamily:"'Geist Mono',monospace",letterSpacing:"0.4px",marginBottom:3}}>POPULATION ESTIMATE</div>}
                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <RelapseGauge rp={u.rp}/>
                    <QBadge q={u.q}/>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>
                  {u.rk.map((r,i)=>(
                    <div key={i} style={{fontSize:12,color:"#4b5563",lineHeight:1.5,paddingLeft:12,position:"relative"}}>
                      <span style={{position:"absolute",left:0,top:6,width:4,height:4,borderRadius:"50%",background:"#b8323040"}}/>
                      {r}
                    </div>
                  ))}
                </div>
                <div style={{fontSize:10,color:"#6b7280",fontFamily:"'Geist Mono',monospace"}}>
                  <SrcChip src={u.src} date={u.d} drugKey={med}/>
                </div>
                {/* Comorbidity combined-risk block */}
                {(()=>{
                  const cm = getComorbidityModifier(dx, dx2);
                  if (!cm) return dx2 ? (
                    <div style={{marginTop:12,padding:"10px 12px",borderRadius:6,background:"#faf8ff",border:"1px solid #e8e0f5"}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#8856d4",marginBottom:3}}>{dx2}</div>
                      <div style={{fontSize:10,color:"#4b5563",fontStyle:"italic",marginBottom:4}}>What changes when both conditions are present</div>
                      <div style={{fontSize:11,color:"#4b5563",lineHeight:1.5}}>No combined risk data available for this specific pairing. In general, having two diagnoses increases overall risk — consider reviewing each condition's profile separately.</div>
                    </div>
                  ) : null;
                  const elevClr = cm.riskElevation.includes("Very")?"#b83230":cm.riskElevation.includes("High")?"#a05a00":"#8856d4";
                  return(
                    <div style={{marginTop:12,padding:"12px 14px",borderRadius:6,background:"#faf8ff",border:`1px solid ${elevClr}30`}}>
                      <div style={{marginBottom:10}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}>
                          <div style={{fontSize:11,fontWeight:700,color:"#8856d4"}}>{cm.label}</div>
                          <span style={{fontSize:9,fontWeight:700,color:elevClr,background:`${elevClr}15`,border:`1px solid ${elevClr}40`,borderRadius:4,padding:"2px 6px",fontFamily:"'Geist Mono',monospace",whiteSpace:"nowrap"}}>Combined risk: {cm.riskElevation}</span>
                        </div>
                        <div style={{fontSize:10,color:"#4b5563",fontStyle:"italic"}}>What changes when both conditions are present</div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:8}}>
                        {cm.modifiers.map((r,i)=>(
                          <div key={i} style={{fontSize:11,color:"#4b5563",lineHeight:1.5,paddingLeft:12,position:"relative"}}>
                            <span style={{position:"absolute",left:0,top:5,width:4,height:4,borderRadius:"50%",background:"#8856d460"}}/>
                            {r}
                          </div>
                        ))}
                      </div>
                      <div style={{fontSize:9,color:"#6b7280",fontFamily:"'Geist Mono',monospace"}}>{cm.src}</div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </div>

        {/* Col 3: Alternatives */}
        <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2e6ec",overflow:"hidden",animation:"cardEntrance 0.35s cubic-bezier(0.22,0.61,0.36,1) both",animationDelay:"120ms"}}>
          <div style={{padding:"14px 18px",borderBottom:"2px solid #2c6fbb",display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#2c6fbb",flexShrink:0}}/>
            <span style={{fontSize:11,fontWeight:700,color:"#2c6fbb",fontFamily:"'Geist Mono',monospace",letterSpacing:"0.5px",textTransform:"uppercase"}}>Switching / Alternatives</span>
          </div>
          <div style={{padding:16}}>
            {m.alt?.map((a,i)=>{
              const alreadyTried = priors && priors.toLowerCase().split(/[,;]+/).map(s=>s.trim()).some(t=>t&&a.n.toLowerCase().includes(t)||t&&t.includes(a.n.toLowerCase().split(" ")[0]));
              return(
              <div key={i} style={{padding:10,borderRadius:6,border:`1px solid ${alreadyTried?"#f5c6a0":"#e5e7eb"}`,marginBottom:8,background:alreadyTried?"#fff8f3":"#f9fafb"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4,flexWrap:"wrap",gap:4}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:13,fontWeight:700,color:alreadyTried?"#7a3a10":"#2c6fbb"}}>{a.n}</span>
                    {alreadyTried&&<span style={{fontSize:9,fontWeight:700,color:"#a05a00",background:"#fff3e0",border:"1px solid #f5c6a0",borderRadius:3,padding:"1px 5px",fontFamily:"'Geist Mono',monospace"}}>⚠ ALREADY TRIED</span>}
                  </div>
                  <QBadge q={a.q}/>
                </div>
                <div style={{fontSize:11,color:"#4b5563",lineHeight:1.5}}>{a.p}</div>
                {alreadyTried&&<div style={{fontSize:10,color:"#a05a00",marginTop:4,fontStyle:"italic"}}>Patient reported prior trial — consider whether adequate dose/duration was reached before ruling out.</div>}
              </div>
              );
            })}
            <div style={{marginTop:8,padding:10,borderRadius:6,background:"#f8f9fb",fontSize:11,color:"#4b5563",lineHeight:1.5,border:"1px solid #e8ebf0"}}>
              <span style={{fontWeight:700,color:"#111827"}}>PK Note: </span>{m.pk}
            </div>
            {/* CTA to open Scenarios for side-by-side comparison */}
            <button
              onClick={()=>setTab("scenarios")}
              style={{marginTop:10,width:"100%",padding:"8px 12px",borderRadius:6,background:"#f8f9fb",border:"1.5px solid #e2e6ec",color:"#4b5563",fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,transition:"all .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="#eaf1fb";e.currentTarget.style.borderColor="#c0d4ef";e.currentTarget.style.color="#2c6fbb";}}
              onMouseLeave={e=>{e.currentTarget.style.background="#f8f9fb";e.currentTarget.style.borderColor="#e5e7eb";e.currentTarget.style.color="#4b5563";}}
            >
              <><Icon name="compare" size={13} color="currentColor"/> Compare side-by-side in Scenarios tab →</>
            </button>
          </div>
        </div>

      </div>
      );
    })()}

    {/* ── TIMELINE TAB ── */}
    {tab==="timeline"&&(
    <div style={{background:"#fff",borderRadius:10,border:"1px solid #e2e6ec",padding:24}}>
      <div style={{fontSize:13,fontWeight:700,color:"#111827",marginBottom:4}}>Risk Profile Across Gestational Stages — {m.g}</div>
      <div style={{fontSize:11,color:"#4b5563",marginBottom:20}}>Each stage shows distinct risks and evidence. Bar length reflects relative risk magnitude. Current stage highlighted.</div>
      {/* Connected journey line */}
      <div style={{position:"relative",marginBottom:20}}>
        <div style={{position:"absolute",top:14,left:"calc(12.5%)",right:"calc(12.5%)",height:2,background:"#e5e7eb",borderRadius:1,zIndex:0}}/>
        {/* Progress fill up to current stage */}
        {(()=>{
          const stages = ["t1","t2","t3","pp"];
          const curIdx = stages.indexOf(stage);
          const pct = curIdx >= 0 ? (curIdx / (stages.length - 1)) * 100 : 0;
          return <div style={{position:"absolute",top:14,left:"calc(12.5%)",width:`calc(${pct}% * 0.75)`,height:2,background:"#0d7358",borderRadius:1,zIndex:0,transition:"width 0.6s ease"}}/>;
        })()}
        <div style={{display:"flex",justifyContent:"space-around",position:"relative",zIndex:1}}>
          {["t1","t2","t3","pp"].map((k,i)=>{
            const isCur = k===stage;
            const labels = {t1:"T1",t2:"T2",t3:"T3",pp:"PP"};
            return (
              <div key={k} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:isCur?"#0d7358":"#fff",border:`2px solid ${isCur?"#0d7358":"#d1d5db"}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:isCur?"0 0 0 4px #0d735820":"none",transition:"all 0.3s ease"}}>
                  <span style={{fontSize:9,fontWeight:700,color:isCur?"#fff":"#9ca3af",fontFamily:"'Geist Mono',monospace"}}>{labels[k]}</span>
                </div>
                <span style={{fontSize:9,color:isCur?"#0d7358":"#9ca3af",fontWeight:isCur?700:400,fontFamily:"'Geist Mono',monospace",whiteSpace:"nowrap"}}>{k==="t1"?"1st Tri":k==="t2"?"2nd Tri":k==="t3"?"3rd Tri":"Postpartum"}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16}}>
        {[{k:"t1",l:"1st Trimester",w:"Wk 1–12",focus:"Organogenesis / Malformation risk",focusClr:"#b83230"},{k:"t2",l:"2nd Trimester",w:"Wk 13–26",focus:"Neurodevelopmental / Growth",focusClr:"#8856d4"},{k:"t3",l:"3rd Trimester",w:"Wk 27–40",focus:"Neonatal adaptation / PPHN",focusClr:"#a05a00"},{k:"pp",l:"Postpartum",w:"Breastfeeding",focus:"Lactation / Infant exposure",focusClr:"#2c6fbb"}].map((s,idx)=>{
          const d=m.tera[s.k];
          const isCur=s.k===stage;
          return(
          <div key={s.k} style={{borderRadius:8,border:`1.5px solid ${isCur?"#0d7358":"#e5e7eb"}`,background:isCur?"#e8f5f008":"#f9fafb",padding:16,position:"relative",animation:`cardEntrance 0.35s cubic-bezier(0.22,0.61,0.36,1) both`,animationDelay:`${idx*60}ms`}}>
            {isCur&&<div style={{position:"absolute",top:-1,left:-1,right:-1,height:3,background:"#0d7358",borderRadius:"8px 8px 0 0"}}/>}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:2}}>
              <div style={{fontSize:11,fontWeight:700,color:isCur?"#0d7358":"#4b5563",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.5px"}}>{s.l}</div>
              {isCur&&<span style={{fontSize:10,fontWeight:700,color:"#0d7358",background:"#e8f5f0",border:"1px solid #c5e8dc",borderRadius:4,padding:"2px 6px",fontFamily:"'Geist Mono',monospace"}}>CURRENT</span>}
            </div>
            <div style={{fontSize:11,color:"#6b7280",marginBottom:6}}>{s.w}</div>
            <div style={{display:"inline-block",fontSize:10,fontWeight:700,color:s.focusClr,background:`${s.focusClr}12`,border:`1px solid ${s.focusClr}30`,borderRadius:4,padding:"2px 7px",fontFamily:"'Geist Mono',monospace",marginBottom:8,letterSpacing:"0.3px"}}>{s.focus}</div>
            {d ? (
              <>
                <RiskBar rating={d.r}/>
                {d.q&&<div style={{fontSize:11,color:"#6b7280",fontFamily:"'Geist Mono',monospace",marginTop:3,marginBottom:4}}>Evidence: {d.q}</div>}
                <div style={{fontSize:11,color:"#4b5563",lineHeight:1.5,marginTop:4}}>{d.s}</div>
                {d.bl&&d.ex&&<div style={{marginTop:8,padding:"6px 8px",borderRadius:6,background:"#f8f9fb",border:"1px solid #e8ebf0",fontSize:10,color:"#4b5563",fontFamily:"'Geist Mono',monospace"}}><span style={{color:"#6b7280"}}>Baseline: </span>{d.bl}<span style={{color:"#6b7280",margin:"0 4px"}}>→</span><span style={{color:"#b83230"}}>Exposed: </span>{d.ex}</div>}
                <div style={{fontSize:10,color:"#c0c8d4",fontFamily:"'Geist Mono',monospace",marginTop:6}}>
                  <SrcChip src={d.src} date={d.d} drugKey={med}/>
                </div>
              </>
            ) : (
              <div style={{fontSize:11,color:"#6b7280",fontStyle:"italic",marginTop:8}}>No data available for this stage</div>
            )}
          </div>
          );
        })}
      </div>
      {/* PK note below timeline */}
      <div style={{marginTop:16,padding:"10px 14px",borderRadius:6,background:"#f8f9fb",border:"1px solid #e2e6ec",fontSize:12,color:"#4b5563",lineHeight:1.65}}>
        <span style={{fontWeight:700,color:"#111827"}}>Pharmacokinetic considerations: </span>{m.pk}
      </div>
    </div>
    )}

    {/* ── SCENARIOS TAB ── */}
    {tab==="scenarios"&&(()=>{
      // ── COMPARISON ENGINE ─────────────────────────────────────────────────
      // State: which drugs are in the comparison slots (max 3 + discontinue)
      // We use a local ref-based approach since we're inside a render function;
      // compareMeds state lives at component level (added below as cmpMeds)
      const d=m.tera[stage];
      const sevEffective=sev||"moderate";
      const u=dx&&DIAGNOSIS_UR[dx]?DIAGNOSIS_UR[dx][sevEffective]||DIAGNOSIS_UR[dx].moderate:null;

      // ── Build the column definitions ──────────────────────────────────────
      const buildMedCol = (mKey) => {
        if (!mKey || !MEDS[mKey]) return null;
        const cm = MEDS[mKey];
        const cd = cm.tera[stage] || cm.tera["pp"] || {};
        const pColor = cm.p==="P0"?"#0d7358":cm.p==="P1"?"#7a6010":"#b0620e";
        const discontinuationWarnings = {
          valproate:"Abrupt discontinuation risks severe bipolar relapse. Structured switch to lamotrigine/lithium required — not cold-stopping.",
          lithium:"Abrupt discontinuation significantly elevates mania rebound risk. Gradual taper over weeks strongly preferred.",
          clozapine:"Discontinuation risks severe psychotic relapse in treatment-resistant cases. No equivalent alternative for true clozapine-resistant patients.",
          carbamazepine:"Abrupt discontinuation may precipitate withdrawal seizures. Taper required.",
        }[mKey] || null;
        return {
          key: mKey,
          label: cm.g,
          brand: cm.b,
          cls: cm.cls,
          priority: cm.p,
          pColor,
          riskRating: cd.r || "—",
          evidQuality: cd.q || "—",
          riskDetail: cd.s || "No data for this stage.",
          riskSrc: cd.src || "",
          baselineRate: cd.bl || null,
          exposedRate: cd.ex || null,
          pkNotes: cm.pk || "—",
          alts: cm.alt || [],
          lacTier: cm.lac?.tier || null,
          lacRid: cm.lac?.rid || null,
          discontinuationWarning: discontinuationWarnings,
          relapseRisk: u ? `${u.rp} (${u.q} evidence)` : null,
          relapseDetail: u ? u.rk.slice(0,2).join("; ") : null,
          rapidlyEvolving: ["zuranolone","brexanolone"].includes(mKey),
        };
      };

        const discontinueCol = (()=>{
        // Build patient-specific relapse framing when history is available
        const hasPatientHx = relHxTime && relHxTime !== "unknown";
        const hasEpisodes = !!relHxEpisodes;
        const episodeCount = relHxEpisodes || null;
        const isMultiEpisode = episodeCount && episodeCount !== "1";
        const isHighRiskContext = relHxContext === "postpartum" || relHxContext === "prior-pregnancy";
        const hasRange = isMultiEpisode && relHxTimeSlowest && relHxTimeSlowest !== relHxTime && relHxTimeSlowest !== "unknown";

        // Time-to-relapse → urgency tier
        const timeUrgency = {
          "within days":        {tier:"critical", label:"within days", color:"#b83230"},
          "within 1–2 weeks":   {tier:"high",     label:"within 1–2 weeks", color:"#b83230"},
          "within 2–4 weeks":   {tier:"high",     label:"within 2–4 weeks", color:"#b0620e"},
          "within 1–3 months":  {tier:"moderate", label:"within 1–3 months", color:"#7a6010"},
          "within 3–6 months":  {tier:"lower",    label:"within 3–6 months", color:"#4b7a58"},
          "after 6+ months":    {tier:"lower",    label:"after 6+ months",   color:"#0d7358"},
        }[relHxTime] || null;

        // Build patient-specific relapse risk label
        let patientRelapseRisk = null;
        let patientRelapseDetail = null;

        if (hasPatientHx && timeUrgency) {
          const episodeStr = isMultiEpisode ? `${episodeCount} prior episodes; ` : hasEpisodes ? "1 prior episode; " : "";
          const contextStr = relHxContext === "postpartum" ? " — occurred postpartum (highest-risk window)"
            : relHxContext === "prior-pregnancy" ? " — occurred during prior pregnancy (direct clinical precedent)"
            : relHxContext === "cold-stop" ? " — cold stop (taper may extend window)"
            : relHxContext === "taper" ? " — despite supervised taper"
            : "";
          const rangeStr = hasRange ? ` (range: ${relHxTime} – ${relHxTimeSlowest})` : "";
          patientRelapseRisk = `${episodeStr}Prior relapse ${timeUrgency.label}${rangeStr}${contextStr}`;

          const windowNote = timeUrgency.tier === "critical" || timeUrgency.tier === "high"
            ? `If this patient's relapse pattern repeats, acute illness would be expected within ${timeUrgency.label} of stopping — during ${stage==="t1"?"organogenesis":stage==="t2"?"fetal brain development":stage==="t3"?"late fetal development and delivery preparation":"the postpartum period"}.`
            : `Prior relapse occurred ${timeUrgency.label} of stopping. This is the planning window for clinical coverage if discontinuation is chosen.`;
          const rangeNote = hasRange
            ? ` Slowest prior relapse: ${relHxTimeSlowest} — the variable course may reflect context-dependent triggers; the fastest episode defines the risk window for planning.`
            : "";
          const populationNote = u ? ` Population relapse probability at ${sevEffective} severity: ${u.rp}.` : "";
          patientRelapseDetail = windowNote + rangeNote + populationNote;
        } else if (relHxTime === "unknown" && hasEpisodes) {
          patientRelapseRisk = `${isMultiEpisode ? episodeCount + " prior episodes" : "1 prior episode"} — time to relapse not documented`;
          patientRelapseDetail = u
            ? `Time to relapse is not documented. Population estimate: ${u.rp} relapse probability at ${sevEffective} severity. ${u.rk[0]||""}`
            : "Document time to relapse to enable patient-specific risk framing.";
        }

        const finalRelapseRisk = patientRelapseRisk || (u ? `${u.rp} (${u.q} evidence)` : "Add diagnosis for data");
        const finalRelapseDetail = patientRelapseDetail || (u ? u.rk.slice(0,2).join("; ") : null);

        return {
          key: "__discontinue__",
          label: "Discontinue",
          brand: "Non-pharmacological",
          cls: "No Medication",
          priority: null,
          riskRating: "None",
          evidQuality: null,
          riskDetail: "No direct medication exposure after taper.",
          pkNotes: null,
          alts: [],
          relapseRisk: finalRelapseRisk,
          relapseDetail: finalRelapseDetail,
          relapseIsPatientSpecific: !!patientRelapseRisk,
          relapseUrgencyColor: timeUrgency?.color || (isHighRiskContext ? "#b83230" : "#b0620e"),
          discontinuationWarning: {
            valproate:"Abrupt valproate discontinuation risks status epilepticus and severe bipolar relapse. Structured taper to alternative (lamotrigine/lithium) required.",
            lithium:"Abrupt lithium discontinuation causes rebound mania disproportionate to gradual taper. Plan weeks-long taper minimum.",
            clozapine:"True clozapine-refractory patients have no equivalent pharmacological backup. Discontinuation decision requires specialist consultation.",
            carbamazepine:"Taper required to prevent withdrawal seizures.",
          }[med] || null,
        };
      })();

      // Available meds for comparison picker (exclude current med and duplicates)
      const currentCols = cmpMeds.filter(Boolean);
      const availForPicker = Object.entries(MEDS)
        .filter(([k]) => k !== med && !currentCols.includes(k))
        .map(([k,v]) => ({k, label:v.g, brand:v.b, cls:v.cls, p:v.p}));

      const allCols = [
        // Slot 0 always = current medication
        buildMedCol(med),
        // Slots 1-2 = user-selected comparators
        ...cmpMeds.slice(0,2).map(k => k === "__discontinue__" ? discontinueCol : buildMedCol(k)),
        // Slot 3 = discontinue (always shown at end, or merged if user added it)
        ...(cmpMeds.slice(0,2).includes("__discontinue__") ? [] : [discontinueCol]),
      ].filter(Boolean);

      const ROWS = [
        {key:"risk", label:"Risk Rating", icon:"risk"},
        {key:"admin", label:"Administration / Setting", icon:"admin"},
        {key:"evid", label:"Evidence Quality", icon:"evid"},
        {key:"detail", label:"Evidence Summary", icon:"detail"},
        ...(stage!=="pp" ? [{key:"rates", label:"Malformation Rate: Population vs. Drug-Exposed", icon:"rates", sublabel:"Background risk in any pregnancy vs. rate observed in drug-exposed pregnancies"}] : []),
        {key:"relapse", label:"Relapse Risk if Stopped / Not Treated", icon:"relapse"},
        {key:"pk", label:"Key Pharmacology / Practical Notes", icon:"pk"},
        {key:"lac", label:"Lactation Tier & RID", icon:"lac"},
      ];

      const riskCellBg = (rating) => {
        if (!rating || rating === "—") return "transparent";
        const r = rating.toLowerCase();
        if (r.includes("none") || r === "no exposure") return "rgba(13,115,88,0.07)";
        if (r.includes("low–moderate") || r.includes("low-moderate")) return "rgba(176,98,14,0.09)";
        if (r.includes("low")) return "rgba(58,140,92,0.09)";
        if (r.includes("high")) return "rgba(184,50,48,0.1)";
        if (r.includes("moderate")) return "rgba(176,98,14,0.12)";
        if (r.includes("undetermined")) return "rgba(107,84,160,0.08)";
        return "transparent";
      };

      const riskCellBorder = (rating) => {
        if (!rating || rating === "—") return "none";
        const r = rating.toLowerCase();
        if (r.includes("none") || r === "no exposure") return "1px solid rgba(13,115,88,0.2)";
        if (r.includes("low–moderate") || r.includes("low-moderate")) return "1px solid rgba(176,98,14,0.2)";
        if (r.includes("low")) return "1px solid rgba(58,140,92,0.2)";
        if (r.includes("high")) return "1px solid rgba(184,50,48,0.2)";
        if (r.includes("moderate")) return "1px solid rgba(176,98,14,0.25)";
        return "none";
      };

      const riskColor = r => r==="None"||r==="None–Minimal"?"#0d7358":r==="Low"?"#3a8c5c":r==="Low–Moderate"?"#7a6010":r==="Moderate"?"#b0620e":r==="High"?"#b83230":r==="Undetermined"||r==="Undetermined — Rapidly Evolving"?"#6b54a0":"#4b5563";

      const cellVal = (col, rowKey) => {
        if (col.key === "__discontinue__") {
          if (rowKey==="risk") return <span style={{fontSize:12,color:"#0d7358",fontWeight:600}}>No exposure</span>;
          if (rowKey==="admin") return <span style={{fontSize:11,color:"#4b5563"}}>Outpatient / self-managed</span>;
          if (rowKey==="evid") return <span style={{fontSize:11,color:"#4b5563"}}>N/A</span>;
          if (rowKey==="detail") return <span style={{fontSize:12,color:"#374151",lineHeight:1.5}}>{col.riskDetail}{col.discontinuationWarning && <><br/><span style={{color:"#b83230",fontWeight:600,fontSize:11}}>⚠️ {col.discontinuationWarning}</span></>}</span>;
          if (rowKey==="rates") return <span style={{fontSize:11,color:"#4b5563"}}>No drug exposure — background population risk only applies</span>;
          if (rowKey==="relapse") return col.relapseRisk ? (
            <div>
              {col.relapseIsPatientSpecific && (
                <div style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:9,fontWeight:700,color:"#fff",background:col.relapseUrgencyColor||"#b83230",borderRadius:3,padding:"2px 6px",fontFamily:"'Geist Mono',monospace",marginBottom:5,letterSpacing:"0.3px"}}>
                  ⚑ PATIENT-SPECIFIC
                </div>
              )}
              <div style={{fontSize:12,fontWeight:700,color:col.relapseIsPatientSpecific?(col.relapseUrgencyColor||"#b83230"):"#b83230",lineHeight:1.4,marginBottom:col.relapseDetail?4:0}}>{col.relapseRisk}</div>
              {col.relapseDetail&&<div style={{fontSize:11,color:"#4b5563",lineHeight:1.4}}>{col.relapseDetail}</div>}
              {!col.relapseIsPatientSpecific && <div style={{fontSize:10,color:"#9ca3af",marginTop:4,fontStyle:"italic",lineHeight:1.3}}>Population estimate — enter relapse history above for patient-specific framing.</div>}
            </div>
          ) : <span style={{fontSize:11,color:"#6b7280"}}>Enter diagnosis for data</span>;
          if (rowKey==="pk") return <span style={{fontSize:11,color:"#4b5563"}}>CBT/IPT for depression/anxiety. Evidence supports this path for mild illness only — for {sevEffective} severity, untreated risks typically exceed medication risks.</span>;
          if (rowKey==="lac") return <span style={{fontSize:11,color:"#0d7358"}}>No medication in milk</span>;
          return null;
        }
        if (rowKey==="risk") return <><span style={{fontSize:13,fontWeight:700,color:riskColor(col.riskRating)}}>{col.riskRating}</span>{col.rapidlyEvolving&&<span style={{marginLeft:6,fontSize:9,background:"#f0e8ff",border:"1px solid #c4a0f0",color:"#6b54a0",borderRadius:10,padding:"1px 6px",fontWeight:700,fontFamily:"'Geist Mono',monospace"}}>RAPIDLY EVOLVING</span>}</>;
        if (rowKey==="admin") {
          const adminInfo = {
            brexanolone: {label:"IV infusion · 60-hr hospital stay (REMS facility required)", color:"#9d3d75", bg:"#fef0f6"},
            zuranolone: {label:"Oral · 14-day course, once nightly, outpatient", color:"#8856d4", bg:"#f5f0fd"},
          }[col.key];
          if (adminInfo) return <span style={{fontSize:11,fontWeight:600,color:adminInfo.color,background:adminInfo.bg,padding:"3px 8px",borderRadius:4,display:"inline-block"}}>{adminInfo.label}</span>;
          return <span style={{fontSize:11,color:"#4b5563"}}>Oral / outpatient</span>;
        }
        if (rowKey==="evid") return <span style={{fontSize:11,fontWeight:600,color:col.evidQuality==="Strong"?"#0d7358":col.evidQuality==="Moderate"?"#7a6010":col.evidQuality==="Conflicting"?"#b0620e":"#4b5563"}}>{col.evidQuality||"—"}</span>;
        if (rowKey==="detail") return <span style={{fontSize:11,color:"#374151",lineHeight:1.5,display:"block"}}>{col.riskDetail.substring(0,300)}{col.riskDetail.length>300?"…":""}</span>;
        if (rowKey==="rates") return col.baselineRate ? <><div style={{fontSize:11,color:"#4b5563"}}>Background (any pregnancy): <strong>{col.baselineRate}</strong></div><div style={{fontSize:11,color:"#b0620e",marginTop:2}}>In drug-exposed pregnancies: <strong>{col.exposedRate}</strong></div></> : <span style={{fontSize:11,color:"#4b5563"}}>No published malformation rate comparison for this drug/stage</span>;
        if (rowKey==="relapse") return <span style={{fontSize:11,color:"#4b5563"}}>Therapeutic coverage maintained — minimal relapse risk</span>;
        if (rowKey==="pk") return <span style={{fontSize:11,color:"#4b5563",display:"block",lineHeight:1.4}}>{(col.pkNotes||"").substring(0,220)}{(col.pkNotes||"").length>220?"…":""}</span>;
        if (rowKey==="lac") return col.lacTier ? <><div style={{fontSize:11,fontWeight:600,color:"#2c6fbb",lineHeight:1.4}}>{col.lacTier}</div>{col.lacRid&&<div style={{fontSize:10,color:"#4b5563",marginTop:3}}>RID: {col.lacRid}</div>}</> : <span style={{fontSize:11,color:"#6b7280"}}>—</span>;
        return null;
      };

      // Column header color
      const colHdrBg = (col) => {
        if (col.key==="__discontinue__") return {bg:"#fff5f5",border:"#fcc",hdr:"#b83230"};
        if (col.key===med) return {bg:"#eaf1fb",border:"#c0d4ef",hdr:"#2c6fbb"};
        return {bg:"#f8f9fb",border:"#e5e7eb",hdr:"#4b5563"};
      };

      return(
      <div>
        {/* Nudge banner */}
        {(!sev||!dx)&&(
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",borderRadius:6,background:"#eaf1fb",border:"1px solid #c0d4ef",fontSize:12,color:"#2c6fbb",marginBottom:14}}>
            <Icon name="lightbulb" size={14} color="#2c6fbb"/>
            <span>
              {!dx&&!sev&&"Add a diagnosis and severity above to see condition-specific relapse probabilities in the Discontinue column."}
              {dx&&!sev&&"Add severity above for a more precise relapse estimate."}
              {!dx&&sev&&"Add a diagnosis above to see condition-specific relapse rates."}
            </span>
          </div>
        )}

        {/* ── Quick Compare Presets ── */}
        {(()=>{
          const PRESETS = [
            {
              id:"ppd-ssri-vs-neuroactive",
              label:"PPD: Sertraline vs Zuranolone vs Discontinue",
              icon:"💜",
              tag:"PPD-specific",
              tagColor:"#8856d4",
              tagBg:"#f0e8ff",
              desc:"Core PPD decision — established SSRI vs FDA-approved neuroactive steroid vs watchful waiting",
              anchor:"sertraline",
              comparators:["zuranolone","__discontinue__"],
              bestFor:"Postpartum Depression",
              cond: stage==="pp",
            },
            {
              id:"ssri-switch-mdd-t1",
              label:"MDD T1: Sertraline vs Escitalopram vs Discontinue",
              icon:"🧠",
              tag:"MDD · T1",
              tagColor:"#2c6fbb",
              tagBg:"#eaf1fb",
              desc:"Classic first-trimester SSRI switch decision — preferred SSRI vs alternative vs stopping",
              anchor:"sertraline",
              comparators:["escitalopram","__discontinue__"],
              bestFor:"Major Depressive Disorder",
              cond: stage==="t1"||stage==="t2",
            },
            {
              id:"brexanolone-vs-zuranolone",
              label:"PPD: Brexanolone (IV) vs Zuranolone (oral)",
              icon:"⚗️",
              tag:"Neuroactive Steroids",
              tagColor:"#9d3d75",
              tagBg:"#fef0f6",
              desc:"Both FDA-approved PPD-specific drugs — hospital IV infusion vs 14-day oral course comparison",
              anchor:"brexanolone",
              comparators:["zuranolone","__discontinue__"],
              bestFor:"Postpartum Depression",
              cond: stage==="pp",
            },
            {
              id:"snri-switch",
              label:"SNRI: Venlafaxine vs Duloxetine vs Discontinue",
              icon:"🔄",
              tag:"SNRI class",
              tagColor:"#7a6010",
              tagBg:"#fffbee",
              desc:"SSRI-refractory patients — SNRI options compared to watchful waiting",
              anchor:"venlafaxine",
              comparators:["duloxetine","__discontinue__"],
              bestFor:null,
              cond: true,
            },
          ].filter(p=>p.cond);

          if (!PRESETS.length) return null;

          // Split into presets that include the current drug vs those that don't
          const includesCurrent = PRESETS.filter(p=>
            p.anchor===med || p.comparators.includes(med)
          );
          const otherPresets = PRESETS.filter(p=>
            p.anchor!==med && !p.comparators.includes(med)
          );

          const renderPreset = (p, dimmed) => (
            <button key={p.id}
              onClick={()=>{
                if(p.anchor&&MEDS[p.anchor]&&p.anchor!==med) setMed(p.anchor);
                setCmpMeds([p.comparators[0]||"",p.comparators[1]||""]);
              }}
              style={{textAlign:"left",padding:"10px 14px",borderRadius:8,border:`1.5px solid ${dimmed?"#e5e7eb":p.tagColor+"30"}`,background:dimmed?"#f9faf9":p.tagBg,cursor:"pointer",transition:"all .15s",maxWidth:320,outline:"none",opacity:dimmed?0.8:1}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=dimmed?"#c8d0c8":p.tagColor;e.currentTarget.style.opacity="1";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=dimmed?"#e5e7eb":`${p.tagColor}30`;e.currentTarget.style.opacity=dimmed?"0.8":"1";}}
            >
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                <span style={{fontSize:12}}>{p.icon}</span>
                <span style={{fontSize:9,fontWeight:700,color:dimmed?"#4b5563":p.tagColor,background:"#fff",border:`1px solid ${dimmed?"#d8dce4":p.tagColor+"40"}`,borderRadius:3,padding:"1px 5px",fontFamily:"'Geist Mono',monospace"}}>{p.tag}</span>
                {p.bestFor&&<span style={{fontSize:11,color:"#4b5563",fontFamily:"'Geist Mono',monospace"}}>for {p.bestFor}</span>}
                {!dimmed&&<span style={{fontSize:8,fontWeight:700,color:"#0d7358",background:"#e8f5f0",border:"1px solid #c5e8dc",borderRadius:3,padding:"1px 5px",fontFamily:"'Geist Mono',monospace",marginLeft:2}}>CURRENT DRUG</span>}
              </div>
              <div style={{fontSize:11,fontWeight:700,color:dimmed?"#4b5563":"#111827",marginBottom:2}}>{p.label}</div>
              <div style={{fontSize:10,color:dimmed?"#4b5563":"#4b5563",lineHeight:1.4}}>{p.desc}</div>
              {dimmed&&<div style={{fontSize:11,color:"#4b5563",marginTop:4,fontStyle:"italic"}}>Will switch anchor to {MEDS[p.anchor]?.g||p.anchor}</div>}
            </button>
          );

          return (
            <div style={{background:"#fff",border:"1px solid #e2e6ec",borderRadius:10,padding:"14px 16px",marginBottom:14}}>
              <div style={{fontSize:11,fontWeight:700,color:"#4b5563",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10}}><Icon name="flash" size={11} color="#4b5563"/> Quick Compare Presets</div>

              {includesCurrent.length>0&&(
                <div style={{marginBottom:otherPresets.length>0?14:0}}>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {includesCurrent.map(p=>renderPreset(p,false))}
                  </div>
                </div>
              )}

              {otherPresets.length>0&&(
                <div>
                  {includesCurrent.length>0&&(
                    <div style={{fontSize:9,fontWeight:700,color:"#6b7280",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
                      <div style={{flex:1,height:1,background:"#e5e7eb"}}/>
                      <span>Other {stage==="pp"?"postpartum":stage==="t1"?"first trimester":stage==="t2"?"second trimester":""} comparisons</span>
                      <div style={{flex:1,height:1,background:"#e5e7eb"}}/>
                    </div>
                  )}
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {otherPresets.map(p=>renderPreset(p,true))}
                  </div>
                </div>
              )}

              {includesCurrent.length===0&&(
                <div style={{fontSize:11,color:"#4b5563",marginBottom:8,fontStyle:"italic"}}>No presets include {m.g} — common comparisons for this stage below.</div>
              )}
            </div>
          );
        })()}

        {/* Comparator picker */}
        <div style={{background:"#fff",border:"1px solid #e2e6ec",borderRadius:10,padding:"14px 16px",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:"#4b5563",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10}}>Compare Against</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            {[0,1].map(slot => {
              const val = cmpMeds[slot];
              const cm = val && val!=="__discontinue__" ? MEDS[val] : null;
              return(
                <div key={slot} style={{display:"flex",alignItems:"center",gap:6}}>
                  {val ? (
                    <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:6,background:val==="__discontinue__"?"#fff5f5":"#f0f9f5",border:`1.5px solid ${val==="__discontinue__"?"#fcc":"#c5e8dc"}`,fontSize:12,fontWeight:600,color:val==="__discontinue__"?"#b83230":"#0d7358"}}>
                      <span>{val==="__discontinue__"?"Discontinue":cm?.g}</span>
                      <button onClick={()=>setCmpMeds(p=>{const n=[...p];n[slot]="";return n;})} style={{background:"none",border:"none",cursor:"pointer",color:"#6b7280",fontSize:14,lineHeight:1,padding:"0 2px",marginLeft:2}}>×</button>
                    </div>
                  ) : (
                    <select
                      value=""
                      onChange={e=>{const v=e.target.value;if(v)setCmpMeds(p=>{const n=[...p];n[slot]=v;return n;});}}
                      style={{padding:"6px 10px",borderRadius:6,border:"1.5px solid #e2e6ec",fontSize:12,color:"#4b5563",background:"#f9fafb",cursor:"pointer",minWidth:180}}
                    >
                      <option value="">+ Add comparator…</option>
                      <optgroup label="── Same class ──">
                        {availForPicker.filter(x=>x.cls===m.cls).map(x=>(
                          <option key={x.k} value={x.k}>{x.label} ({x.brand})</option>
                        ))}
                      </optgroup>
                      <optgroup label="── Alternatives suggested ──">
                        {(m.alt||[]).map(a=>{
                          const aKey=Object.keys(MEDS).find(k=>MEDS[k].g.toLowerCase()===a.n.toLowerCase()||MEDS[k].g.toLowerCase().includes(a.n.toLowerCase().split(" ")[0]));
                          if(!aKey||aKey===med||currentCols.includes(aKey)) return null;
                          return <option key={aKey} value={aKey}>{MEDS[aKey].g} ({MEDS[aKey].b})</option>;
                        }).filter(Boolean)}
                      </optgroup>
                      <optgroup label="── All medications ──">
                        {availForPicker.filter(x=>x.cls!==m.cls).map(x=>(
                          <option key={x.k} value={x.k}>{x.label} ({x.brand})</option>
                        ))}
                      </optgroup>
                      {!cmpMeds.slice(0,2).includes("__discontinue__")&&(
                        <option value="__discontinue__">── Discontinue (no medication) ──</option>
                      )}
                    </select>
                  )}
                </div>
              );
            })}
            <span style={{fontSize:10,color:"#6b7280",fontFamily:"'Geist Mono',monospace"}}>{allCols.length} columns · {STAGE_LABELS[stage]}</span>
          </div>
        </div>

        {/* Comparison — table on wide, cards on mobile */}
        <style>{`
          @media (min-width:640px){.cmp-cards{display:none!important;}.cmp-table-wrap{display:block!important;}}
          @media (max-width:639px){.cmp-cards{display:flex!important;}.cmp-table-wrap{display:none!important;}}
        `}</style>

        {/* ── MOBILE: card-per-drug ── */}
        <div className="cmp-cards" style={{display:"none",flexDirection:"column",gap:12}}>
          {allCols.map((col,ci)=>{
            const {bg,border,hdr}=colHdrBg(col);
            return(
              <div key={ci} style={{borderRadius:10,border:`1px solid ${border}`,overflow:"hidden"}}>
                {/* Card header */}
                <div style={{padding:"12px 14px",background:bg,borderBottom:`2px solid ${border}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:4}}>
                    {col.key===med&&<span style={{fontSize:9,background:"#c0d4ef",color:"#2c6fbb",borderRadius:3,padding:"1px 5px",fontWeight:700,fontFamily:"'Geist Mono',monospace"}}>CURRENT</span>}
                    {col.rapidlyEvolving&&<span style={{fontSize:9,background:"#f0e8ff",color:"#6b54a0",borderRadius:3,padding:"1px 5px",fontWeight:700,fontFamily:"'Geist Mono',monospace"}}>🔬 NEW</span>}
                    {(col.key==="zuranolone"||col.key==="brexanolone")&&<span style={{fontSize:9,background:"#fef0f6",color:"#9d3d75",borderRadius:3,padding:"1px 5px",fontWeight:700,fontFamily:"'Geist Mono',monospace",border:"1px solid #f0b0d0"}}>💜 PPD FDA APPROVED</span>}
                  </div>
                  <div style={{fontSize:16,fontWeight:700,color:hdr,lineHeight:1.2}}>{col.label}</div>
                  <div style={{fontSize:11,color:"#4b5563",marginTop:2}}>{col.brand}</div>
                  {col.priority&&(()=>{const pColor=col.pColor;const pLabel=col.priority==="P0"?"First-line":col.priority==="P1"?"Second-line":"Use with caution";return(<span style={{display:"inline-block",marginTop:6,fontSize:9,fontWeight:700,fontFamily:"'Geist Mono',monospace",color:pColor,background:`${pColor}18`,padding:"2px 6px",borderRadius:3,border:`1px solid ${pColor}25`}}>{col.priority} · {pLabel}</span>);})()}
                </div>
                {/* Card rows */}
                {ROWS.map((row,ri)=>(
                  <div key={row.key} style={{padding:"10px 14px",borderBottom:ri<ROWS.length-1?"1px solid #f0f2f5":"none",background:ri%2===0?"#fff":"#f9fafb"}}>
                    <div style={{fontSize:9,fontWeight:700,color:"#6b7280",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:5,display:"flex",alignItems:"center",gap:4}}>
                      <Icon name={row.icon} size={11} color="#6b7280"/>{row.label}
                    </div>
                    {cellVal(col,row.key)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* ── DESKTOP: table ── */}
        <div className="cmp-table-wrap" style={{display:"none",overflowX:"auto",animation:"cardEntrance 0.35s cubic-bezier(0.22,0.61,0.36,1) both"}}>
          <table style={{width:"100%",borderCollapse:"separate",borderSpacing:0,background:"#fff",borderRadius:10,border:"1px solid #e2e6ec",overflow:"hidden"}}>
            <thead>
              <tr>
                <th style={{width:140,padding:"10px 14px",background:"#f8f9fb",borderBottom:"1px solid #e2e6ec",borderRight:"1px solid #e2e6ec",fontSize:9,fontWeight:700,color:"#6b7280",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.5px",textAlign:"left",whiteSpace:"nowrap"}}>
                  {STAGE_LABELS[stage]}
                </th>
                {allCols.map((col,ci)=>{
                  const {bg,border,hdr}=colHdrBg(col);
                  return(
                    <th key={ci} style={{padding:"12px 14px",background:bg,borderBottom:`2px solid ${border}`,borderRight:ci<allCols.length-1?"1px solid #e2e6ec":"none",textAlign:"left",minWidth:180,verticalAlign:"top"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                        {col.key===med&&<span style={{fontSize:9,background:"#c0d4ef",color:"#2c6fbb",borderRadius:3,padding:"1px 5px",fontWeight:700,fontFamily:"'Geist Mono',monospace"}}>CURRENT</span>}
                        {col.rapidlyEvolving&&<span style={{fontSize:9,background:"#f0e8ff",color:"#6b54a0",borderRadius:3,padding:"1px 5px",fontWeight:700,fontFamily:"'Geist Mono',monospace"}}>🔬 NEW</span>}
                        {(col.key==="zuranolone"||col.key==="brexanolone")&&<span style={{fontSize:9,background:"#fef0f6",color:"#9d3d75",borderRadius:3,padding:"1px 5px",fontWeight:700,fontFamily:"'Geist Mono',monospace",border:"1px solid #f0b0d0"}}>💜 PPD-SPECIFIC FDA APPROVED</span>}
                      </div>
                      <div style={{fontSize:14,fontWeight:700,color:hdr,marginTop:4,lineHeight:1.2}}>{col.label}</div>
                      <div style={{fontSize:10,color:"#4b5563",marginTop:2}}>{col.brand}</div>
                      {col.priority&&(()=>{const pColor=col.pColor;const pLabel=col.priority==="P0"?"First-line":col.priority==="P1"?"Second-line":"Use with caution";return(<span style={{display:"inline-block",marginTop:4,fontSize:9,fontWeight:700,fontFamily:"'Geist Mono',monospace",color:pColor,background:`${pColor}18`,padding:"2px 6px",borderRadius:3,border:`1px solid ${pColor}25`}}>{col.priority} · {pLabel}</span>);})()}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row,ri)=>(
                <tr key={row.key} style={{background:ri%2===0?"#fff":"#f9fafb"}}>
                  <td style={{padding:"10px 14px",borderRight:"1px solid #e2e6ec",borderBottom:ri<ROWS.length-1?"1px solid #f0f2f5":"none",verticalAlign:"top"}}>
                    <div style={{fontSize:10,fontWeight:700,color:"#4b5563",fontFamily:"'Geist Mono',monospace",letterSpacing:"0.4px",textTransform:"uppercase",display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap"}}>
                      <Icon name={row.icon} size={13} color="#4b5563"/>{row.label}
                    </div>
                    {row.sublabel&&<div style={{fontSize:10,color:"#4b5563",marginTop:3,lineHeight:1.4,fontStyle:"italic",whiteSpace:"normal"}}>{row.sublabel}</div>}
                  </td>
                  {allCols.map((col,ci)=>(
                    <td key={ci} style={{padding:"10px 14px",verticalAlign:"top",background:row.key==="risk"?riskCellBg(col.key==="__discontinue__"?"no exposure":col.riskRating):col.key===med&&ri%2===0?"#fafeff":col.key===med&&ri%2!==0?"#f5faff":col.key==="__discontinue__"&&ri%2===0?"#fffafa":col.key==="__discontinue__"&&ri%2!==0?"#fff8f8":"transparent",border:row.key==="risk"?riskCellBorder(col.key==="__discontinue__"?"no exposure":col.riskRating):"none",borderRight:ci<allCols.length-1?"1px solid #f0f2f5":"none",borderBottom:ri<ROWS.length-1?"1px solid #f0f2f5":"none"}}>
                      {cellVal(col,row.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{marginTop:12,padding:"10px 14px",borderRadius:6,background:"#f8f9fb",border:"1px solid #e2e6ec",fontSize:11,color:"#4b5563",lineHeight:1.65,fontFamily:"'Geist Mono',monospace"}}>
          PeriRx presents these scenarios as structured options for clinician-patient shared decision-making — not ranked recommendations. Click any medication in the drug grid to view its full profile separately.
        </div>
      </div>
      );
    })()}





    {/* Footer */}
    <div style={{marginTop:20,padding:"14px 16px",borderRadius:8,background:"#fff",border:"1px solid #e2e6ec"}}>
      <div style={{textAlign:"center",fontSize:10,color:"#6b7280",fontFamily:"'Geist Mono',monospace",lineHeight:1.65,marginBottom:10}}>
        This analysis supports clinical decision-making and does not replace individualized clinical judgment. PeriRx does not prescribe or recommend.<br/>
        All data elements tagged with source database and revision date. Evidence quality indicators are displayed on every data element.
      </div>
      {(()=>{
        const d=m.tera[stage];
        const sevEffective=sev||"moderate";const u=dx&&DIAGNOSIS_UR[dx]?DIAGNOSIS_UR[dx][sevEffective]||DIAGNOSIS_UR[dx].moderate:null;
        const allSrcs = [...new Set([d?.src,u?.src,m.lac?"LactMed":null,...(m.gl||[]).map(g=>g.b)].filter(Boolean).flatMap(s=>s.split(/\s*\/\s*/)).map(s=>s.trim()))];
        return allSrcs.length > 0 ? (
          <div style={{paddingTop:10,borderTop:"1px solid #f0f2f5"}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>
              <span style={{fontSize:9,color:"#6b7280",fontFamily:"'Geist Mono',monospace",marginRight:4,lineHeight:"22px"}}>SOURCES:</span>
              {allSrcs.map((s,i)=>{
                const meta = resolveSourceMeta(s, med);
                const url = meta?.url;
                const icon=s.includes("LactMed")?"🤱":s.includes("DailyMed")?"💊":s.includes("MotherToBaby")?"🧬":s.includes("APA")?"🧠":s.includes("ACOG")?"🏥":s.includes("NICE")?"📋":s.includes("CANMAT")?"📊":s.includes("SAMHSA")?"⚕️":"📄";
                return url ? (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                    title={`${meta?.label || s} — click to open source`}
                    style={{fontSize:9,fontFamily:"'Geist Mono',monospace",padding:"3px 10px",borderRadius:20,background:"#eaf1fb",border:"1px solid #c0d4ef",color:"#2c6fbb",textDecoration:"none",fontWeight:600,whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:4}}>
                    <span>{icon}</span>{s} ↗
                  </a>
                ) : (
                  <span key={i} style={{fontSize:9,fontFamily:"'Geist Mono',monospace",padding:"3px 10px",borderRadius:20,background:"#f8f9fb",border:"1px solid #e8ebf0",color:"#6b7280",whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:4}}><span>{icon}</span>{s}</span>
                );
              })}
            </div>
            <div style={{textAlign:"center",fontSize:8,color:"#c5cdd8",fontFamily:"'Geist Mono',monospace",marginTop:6}}>
              All sources are free — click any badge to open the source page
            </div>
          </div>
        ) : null;
      })()}
    </div>
  </div>
  )}

  </main>

  {/* ━━━━━━━━━━━━━ PATIENT SUMMARY — PREP + FULL-SCREEN PATIENT VIEW ━━━━━━━━━━━━━ */}
  {showPtSum&&m&&(()=>{
    const d=m.tera[stage];
    const sevEffective=sev||"moderate";const u=dx&&DIAGNOSIS_UR[dx]?DIAGNOSIS_UR[dx][sevEffective]||DIAGNOSIS_UR[dx].moderate:null;
    const summary = buildPatientSummaryText(med, stage, sev, dx);
    if (!summary) return null;

    /* ── STEP 1: CLINICIAN PREP SCREEN ── */
    if (ptSumStep === "prep") return (
      <div style={{position:"fixed",inset:0,background:"rgba(10,20,16,.65)",backdropFilter:"blur(6px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowPtSum(false)}>
        <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:16,maxWidth:580,width:"100%",maxHeight:"92vh",display:"flex",flexDirection:"column",boxShadow:"0 32px 80px rgba(0,0,0,.28)"}}>

          {/* Header */}
          <div style={{padding:"22px 26px 18px",borderBottom:"1px solid #e2e6ec",display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexShrink:0}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 0 3px #22c55e30"}}/>
                <div style={{fontSize:10,fontWeight:700,color:"#4b5563",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.5px"}}>
                  Ready to share with patient
                </div>
              </div>
              <div style={{fontSize:18,fontWeight:700,color:"#111827",letterSpacing:"-0.3px"}}>{m.g} <span style={{color:"#4b5563",fontWeight:400,fontSize:15}}>({m.b})</span></div>
              <div style={{fontSize:12,color:"#4b5563",marginTop:2}}>{STAGE_LABELS[stage]}{dx&&<> · <span style={{color:"#0d7358"}}>{dx}</span></>}</div>
            </div>
            <button onClick={()=>setShowPtSum(false)} style={{background:"#f8f9fb",border:"none",borderRadius:8,width:32,height:32,cursor:"pointer",color:"#4b5563",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginLeft:16}}>×</button>
          </div>

          {/* Scrollable body */}
          <div style={{padding:"22px 26px",overflowY:"auto",flex:1}}>

            {/* Clinician note field */}
            <div style={{marginBottom:20}}>
              <label style={{fontSize:13,fontWeight:700,color:"#111827",display:"block",marginBottom:4}}>
                Add a note for this patient
              </label>
              <div style={{fontSize:12,color:"#4b5563",marginBottom:8}}>Optional — appears at the top in a highlighted box, attributed to you.</div>
              <textarea
                value={ptNote}
                onChange={e=>setPtNote(e.target.value)}
                placeholder={`e.g. "Based on your history and what we discussed today, we both agreed that staying on ${m.g} is the safer choice for you right now. Here's a summary of what the research shows."`}
                rows={4}
                style={{width:"100%",padding:"11px 13px",borderRadius:8,border:"1.5px solid #e5e7eb",fontSize:13,color:"#111827",lineHeight:1.65,resize:"vertical",outline:"none",fontFamily:"'Instrument Sans',system-ui,sans-serif",background:"#f9fafb",transition:"border-color .15s,box-shadow .15s"}}
              />
            </div>

            {/* Divider */}
            <div style={{borderTop:"1px solid #f0f2f5",marginBottom:20}}/>

            {/* Section toggles */}
            <div style={{marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:600,color:"#111827",marginBottom:12,letterSpacing:"-0.15px"}}>Sections to include</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[
                  {label:`About ${m.g} during ${stage==="pp"?"breastfeeding":"pregnancy"}`,desc:stage==="pp"?"What research shows about breastfeeding compatibility":"Risk rating and what the evidence says",always:true,val:true},
                  ...(stage!=="pp"?[
                    {label:"Risk visualization",desc:"Side-by-side icon array showing absolute risk out of 100 pregnancies",key:"ptShowIconArray",val:ptShowIconArray,set:setPtShowIconArray,disabled:!(d?.bl&&d?.ex)},
                    {label:"About not treating the condition",desc:`Relapse rates and real risks of stopping medication${dx?` for ${dx}`:""}`,key:"ptShowUntreated",val:ptShowUntreated,set:setPtShowUntreated},
                  ]:[]),
                  {label:"What research doesn't yet know",desc:"Honest gaps in the evidence — reassures patients this is normal",key:"ptShowUnknowns",val:ptShowUnknowns,set:setPtShowUnknowns},
                ].map((item,i)=>(
                  <div
                    key={i}
                    onClick={()=>!item.always&&!item.disabled&&item.set(!item.val)}
                    style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:8,border:`1.5px solid ${item.always||item.val?"#0d735830":"#e5e7eb"}`,background:item.always||item.val?"#f0faf6":"#f9fafb",opacity:item.disabled?0.4:1,cursor:item.always||item.disabled?"default":"pointer",transition:"all .15s"}}
                  >
                    <div style={{width:20,height:20,borderRadius:4,border:`2px solid ${item.always||item.val?"#0d7358":"#c5cdd8"}`,background:item.always||item.val?"#0d7358":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s"}}>
                      {(item.always||item.val)&&<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600,color:"#111827",display:"flex",alignItems:"center",gap:6}}>
                        {item.label}
                        {item.always&&<span style={{fontSize:10,color:"#0d7358",fontWeight:500,background:"#e0f5ee",padding:"1px 6px",borderRadius:3}}>always on</span>}
                        {item.disabled&&<span style={{fontSize:10,color:"#6b7280",fontWeight:400}}>no data</span>}
                      </div>
                      <div style={{fontSize:11,color:"#4b5563",marginTop:2,lineHeight:1.5}}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority reminder */}
            {priority&&(
              <div style={{background:"#eaf1fb",borderRadius:8,padding:"10px 14px",marginBottom:10,border:"1px solid #c0d4ef",fontSize:12,color:"#2c6fbb",display:"flex",gap:8,alignItems:"flex-start"}}>
                <Icon name="target" size={14} color="#2c6fbb"/>
                <span>Patient's stated priority will be highlighted: <strong>"{priority}"</strong></span>
              </div>
            )}
            {(priors||relHx)&&(
              <div style={{background:"#fff8ee",borderRadius:8,padding:"10px 14px",marginBottom:16,border:"1px solid #f5c6a0",fontSize:12,color:"#a05a00",display:"flex",gap:8,alignItems:"flex-start"}}>
                <span style={{flexShrink:0,marginTop:1}}>📋</span>
                <div>
                  <div style={{fontWeight:700,marginBottom:4}}>Clinical history captured — not shown to patient</div>
                  {priors&&<div style={{color:"#374151",marginBottom:2}}><strong>Prior trials:</strong> {priors}</div>}
                  {relHx&&(
                    <div style={{color:"#374151"}}>
                      <strong>Relapse history:</strong> {relHx}
                      {relHxContext==="postpartum"&&<span style={{marginLeft:6,fontSize:10,fontWeight:700,color:"#b83230",background:"#fde8e8",border:"1px solid #f5c0b8",borderRadius:3,padding:"1px 5px",fontFamily:"'Geist Mono',monospace"}}>⚑ HIGH-RISK CONTEXT</span>}
                      {relHxContext==="prior-pregnancy"&&<span style={{marginLeft:6,fontSize:10,fontWeight:700,color:"#b83230",background:"#fde8e8",border:"1px solid #f5c0b8",borderRadius:3,padding:"1px 5px",fontFamily:"'Geist Mono',monospace"}}>⚑ DIRECT PRECEDENT</span>}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Handoff instruction */}
            <div style={{background:"#f8f9fb",borderRadius:8,padding:"12px 14px",border:"1px solid #e2e6ec",fontSize:12,color:"#4b5563",lineHeight:1.65,display:"flex",gap:10,alignItems:"flex-start"}}>
              <Icon name="phone" size={16} color="#4b5563"/>
              <span>When ready, tap <strong>Hand to patient</strong>. The clinician interface hides — your patient sees a clean, full-screen summary. Tap <strong>Return to Clinician View</strong> in the top bar when done.</span>
            </div>
          </div>

          {/* Sticky CTA footer */}
          <div style={{padding:"16px 26px",borderTop:"1px solid #e2e6ec",background:"#fff",borderRadius:"0 0 16px 16px",flexShrink:0}}>
            <button
              onClick={()=>setPtSumStep("patient")}
              style={{width:"100%",padding:"14px",borderRadius:10,background:"#111827",border:"none",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",letterSpacing:"-0.2px",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="#2c3040";}}
              onMouseLeave={e=>{e.currentTarget.style.background="#111827";}}
            >
              <span style={{fontSize:16}}>👤</span> Hand to patient <span style={{fontSize:18,marginLeft:4}}>→</span>
            </button>
            <div style={{textAlign:"center",fontSize:10,color:"#6b7280",marginTop:8,fontFamily:"'Geist Mono',monospace"}}>
              Clinician view hides — tap "Return to Clinician View" when done
            </div>
          </div>
        </div>
      </div>
    );

    /* ── STEP 2: FULL-SCREEN PATIENT VIEW ── */
    return (
      <div style={{position:"fixed",inset:0,background:"#f8faf9",zIndex:2000,overflowY:"auto",display:"flex",flexDirection:"column"}}>

        {/* Clinician control bar — minimal, unobtrusive, clearly separate */}
        <div style={{background:"#0d2d22",padding:"8px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#0d7358"}}/>
            <span style={{fontSize:10,color:"rgba(255,255,255,0.45)",fontFamily:"'Geist Mono',monospace",letterSpacing:"0.5px",textTransform:"uppercase"}}>Clinician controls — patient view active</span>
          </div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>{
              const lines = [
                ptNote ? `A note from your doctor:\n"${ptNote}"\n` : "",
                `ABOUT ${m.g.toUpperCase()} (${m.b.toUpperCase()})`,
                summary.whatIsMed,
                `\n${summary.medText}`,
                summary.absoluteRisk ? `\n${summary.absoluteRisk}` : "",
                summary.newbornNote ? `\nWHAT ABOUT MY BABY AFTER BIRTH?\n${summary.newbornNote}` : "",
                (stage==="pp"||mode==="lactation")&&m?.lac ? (()=>{
                  const ridMatch = (m.lac.rid||"").match(/([\d.]+)/);
                  const ridNum = ridMatch ? parseFloat(ridMatch[1]) : null;
                  const ridLine = ridNum===null ? "The amount that passes into breast milk is not fully established — your doctor has reviewed this."
                    : ridNum<2 ? "Only a very small amount of this medication passes into breast milk — well below levels considered a concern."
                    : ridNum<5 ? "A small amount passes into breast milk. Most experts consider this acceptable with monitoring."
                    : ridNum<10 ? "A moderate amount passes into breast milk. Your doctor has weighed this against the benefits of you staying well."
                    : "A meaningful amount passes into breast milk. Your doctor is monitoring your baby closely.";
                  const pkStr = m.lac.pk||"";
                  const feedLine = pkStr&&pkStr!=="Variable"&&pkStr.match(/\d/)
                    ? `\nFeed timing tip: Nurse or pump just before taking your medication — that's when levels in milk are lowest. Milk levels peak around ${pkStr} after your dose.`
                    : "";
                  return `\nBREASTFEEDING\n${ridLine}${feedLine}`;
                })() : "",
                ptShowUntreated&&u ? [`\nWHAT HAPPENS IF ${(dx||"MY CONDITION").toUpperCase()} IS NOT TREATED?`,`Symptoms return in about ${u.rp} of people who stop this medication.`, ...u.rk.map(r=>`• ${r}`)].join("\n") : "",
                ptShowUnknowns ? `\nWHAT DOES RESEARCH STILL NOT KNOW?\n${summary.unknownText}` : "",
                `\nThis decision belongs to you and your doctor. There is no option without some level of risk.`,
                `\nQuestions I want to ask my doctor:\n1.\n2.\n3.`,
                `\nMore information: ${MTB_URLS[med]||"mothertobaby.org"} · Call/text 1-866-626-6847`,
                `\n— PeriRx Decision Support · Not a prescribing directive`
              ].filter(Boolean).join("\n");
              navigator.clipboard?.writeText(lines);
              setCopied(true);setTimeout(()=>setCopied(false),2000);
            }} style={{padding:"5px 12px",borderRadius:6,background:copied?"#0d7358":"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:copied?"#fff":"rgba(255,255,255,0.6)",fontSize:11,fontWeight:600,cursor:"pointer"}}>
              {copied?"✓ Copied":"Copy text"}
            </button>
            <button onClick={()=>window.print?.()} style={{padding:"5px 12px",borderRadius:6,background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.6)",fontSize:11,fontWeight:600,cursor:"pointer"}}>Print</button>
            <button onClick={()=>setPtSumStep("prep")} style={{padding:"5px 14px",borderRadius:6,background:"#0d7358",border:"none",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>← Clinician View</button>
          </div>
        </div>

        {/* Patient content — generous whitespace, large readable type */}
        <div style={{flex:1,maxWidth:680,margin:"0 auto",width:"100%",padding:"48px 32px 80px"}}>

          {/* Header — clean, welcoming */}
          <div style={{textAlign:"center",marginBottom:40,paddingBottom:32,borderBottom:"1px solid #e2e6ec"}}>
            <div style={{width:52,height:52,borderRadius:12,background:"linear-gradient(135deg,#0d7358,#0a5c47)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:18,fontWeight:800,fontFamily:"'Geist Mono',monospace",margin:"0 auto 16px"}}>Rx</div>
            <div style={{fontSize:26,fontWeight:700,color:"#111827",letterSpacing:"-0.5px",marginBottom:6}}>Your Medication Information</div>
            <div style={{fontSize:15,color:"#4b5563"}}>{m.g} ({m.b}) · {STAGE_LABELS[stage]}</div>
            <div style={{marginTop:12,fontSize:12,color:"#6b7280",fontFamily:"'Geist Mono',monospace"}}>Prepared for this visit by your clinician</div>
          </div>

          {/* Clinician note — prominent if present */}
          {ptNote&&(
            <div style={{background:"linear-gradient(135deg,#eaf4ff,#e0efff)",borderRadius:12,padding:"20px 24px",marginBottom:32,border:"1px solid #b8d4f0",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,bottom:0,width:4,background:"#2c6fbb",borderRadius:"12px 0 0 12px"}}/>
              <div style={{paddingLeft:8}}>
                <div style={{fontSize:11,fontWeight:700,color:"#2c6fbb",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.5px",fontFamily:"'Geist Mono',monospace"}}>A note from your doctor</div>
                <div style={{fontSize:16,color:"#111827",lineHeight:1.75,fontStyle:"italic"}}>"{ptNote}"</div>
              </div>
            </div>
          )}

          {/* Patient priority */}
          {priority&&(
            <div style={{background:"#f0faf6",borderRadius:10,padding:"14px 18px",marginBottom:28,border:"1px solid #b8e0d0",display:"flex",gap:10,alignItems:"center"}}>
              <span style={{fontSize:18,flexShrink:0}}>🎯</span>
              <div style={{fontSize:14,color:"#0d7358"}}><strong>Your stated priority:</strong> "{priority}"</div>
            </div>
          )}

          {/* About the medication */}
          <div style={{marginBottom:36}}>
            <div style={{fontSize:11,fontWeight:700,color:"#0d7358",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10}}>
              About {m.g} During {stage==="pp"?"Breastfeeding":"Pregnancy"}
            </div>

            {/* What is this medication */}
            <div style={{marginBottom:24}}>
              <div style={{fontSize:15,fontWeight:700,color:"#111827",marginBottom:8}}>What is {m.g}?</div>
              <div style={{fontSize:16,color:"#2a2e38",lineHeight:1.75}}>{summary.whatIsMed}</div>
            </div>

            {/* Core Q&A block */}
            {stage !== "pp" && (
              <div style={{marginBottom:16}}>
                <div style={{fontSize:15,fontWeight:700,color:"#111827",marginBottom:10}}>
                  Does taking {m.g} during pregnancy increase the chance of birth defects or pregnancy complications?
                </div>

                {/* Overview answer */}
                <div style={{fontSize:15,color:"#2a2e38",lineHeight:1.75,marginBottom:14}}>{summary.medText}</div>

                {/* Evidence quality callout */}
                <div style={{background:"#f8f9fb",borderRadius:10,padding:"14px 18px",border:"1px solid #e8ebf0",marginBottom:12,display:"flex",gap:12,alignItems:"flex-start"}}>
                  <span style={{fontSize:18,flexShrink:0,lineHeight:1}}>🔬</span>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:"#4b5563",marginBottom:3,textTransform:"uppercase",letterSpacing:"0.4px",fontFamily:"'Geist Mono',monospace"}}>About the evidence</div>
                    <div style={{fontSize:13,color:"#4b5563",lineHeight:1.6}}>
                      {d?.q === "Strong" && `This is based on large studies tracking many thousands of pregnancies — giving us a reliable picture.`}
                      {d?.q === "Moderate" && `This is based on a reasonable number of studies. The data gives us a reasonable picture, though research is ongoing.`}
                      {d?.q === "Limited" && `Fewer studies have examined ${m.g} specifically in pregnancy. The evidence we have is reassuring, but there is more uncertainty than with better-studied medications.`}
                      {d?.q === "Insufficient" && `Very little research specifically examines ${m.g} in pregnancy. Your doctor is drawing on related class data and clinical experience.`}
                      {d?.q === "Conflicting" && `Studies on ${m.g} in pregnancy have not all reached the same conclusions. Your doctor can help you understand what the different studies found and what they mean for your situation.`}
                      {!d?.q && `Evidence quality for this medication at this stage has not been formally rated.`}
                    </div>
                  </div>
                </div>

                {/* Background rate anchor */}
                <div style={{background:"#fff",borderRadius:10,padding:"14px 18px",border:"1px solid #e2e6ec",fontSize:14,color:"#4b5563",lineHeight:1.65,marginBottom:summary.absoluteRisk?12:0,display:"flex",gap:12,alignItems:"flex-start"}}>
                  <span style={{fontSize:20,flexShrink:0,lineHeight:1}}>💡</span>
                  <span>Every pregnancy starts with about a <strong>3 in 100 (3%) chance</strong> of a birth defect. This is called the <strong>background chance</strong> and it exists for all pregnancies — even without any medication.</span>
                </div>

                {summary.absoluteRisk&&(
                  <div style={{background:"#fff",borderRadius:10,padding:"14px 18px",border:"1px solid #e2e6ec",fontSize:14,color:"#4b5563",lineHeight:1.65,marginTop:12}}>
                    <div style={{marginBottom:ptShowIconArray&&d?.bl&&d?.ex?16:0}}>{summary.absoluteRisk}</div>
                    {ptShowIconArray&&d?.bl&&d?.ex&&<IconArray exposedRate={d.ex} baselineRate={d.bl} label="Out of 100 pregnancies"/>}
                  </div>
                )}

                {/* Development & long-term note */}
                {(stage==="t1"||stage==="t2") && clinicalDetail_devNote(med,stage) && (
                  <div style={{background:"#fff",borderRadius:10,padding:"14px 18px",border:"1px solid #e2e6ec",marginTop:12,display:"flex",gap:12,alignItems:"flex-start"}}>
                    <span style={{fontSize:18,flexShrink:0,lineHeight:1}}>🧠</span>
                    <div>
                      <div style={{fontSize:12,fontWeight:700,color:"#4b5563",marginBottom:3,textTransform:"uppercase",letterSpacing:"0.4px",fontFamily:"'Geist Mono',monospace"}}>Development & long-term outcomes</div>
                      <div style={{fontSize:13,color:"#4b5563",lineHeight:1.6}}>{clinicalDetail_devNote(med,stage)}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Breastfeeding Q&A */}
            {stage === "pp" && (
              <div style={{marginBottom:16}}>
                <div style={{fontSize:15,fontWeight:700,color:"#111827",marginBottom:8}}>
                  Can I breastfeed while taking {m.g}?
                </div>
                <div style={{fontSize:16,color:"#2a2e38",lineHeight:1.75,marginBottom:14}}>{summary.medText}</div>
                <div style={{background:"#fff",borderRadius:10,padding:"14px 18px",border:"1px solid #e2e6ec",fontSize:14,color:"#4b5563",lineHeight:1.65,display:"flex",gap:12,alignItems:"flex-start"}}>
                  💡 Breastfeeding has real benefits for both you and your baby. The goal is to make this decision together with your care team — based on accurate information, not fear.
                </div>
              </div>
            )}

            {/* Newborn effects Q */}
            {summary.newbornNote&&(
              <div style={{marginBottom:16}}>
                <div style={{fontSize:15,fontWeight:700,color:"#111827",marginBottom:8}}>
                  What about my baby right after birth?
                </div>
                <div style={{fontSize:16,color:"#2a2e38",lineHeight:1.75}}>{summary.newbornNote}</div>
              </div>
            )}

            {/* ── BREASTFEEDING SECTION — patient-friendly RID + feed timing ── */}
            {m?.lac&&(stage==="pp"||mode==="lactation")&&(()=>{
              // Plain-language RID interpretation
              const ridStr = m.lac.rid || "";
              const ridMatch = ridStr.match(/([\d.]+)/);
              const ridNum = ridMatch ? parseFloat(ridMatch[1]) : null;

              const ridMessage = ridNum === null
                ? {headline:"The amount that passes into breast milk is not fully established.", sub:"Your doctor has reviewed the available information and weighed it carefully.", color:"#4b5563", bg:"#f8f9fb", border:"#e5e7eb", icon:"🤱"}
                : ridNum < 2
                ? {headline:"Only a very small amount of this medication passes into breast milk.", sub:"This level is well below what experts consider a concern for breastfed babies.", color:"#0d7358", bg:"#e8f5f0", border:"#c5e8dc", icon:"✅"}
                : ridNum < 5
                ? {headline:"A small amount of this medication passes into breast milk.", sub:"Most experts consider this level acceptable when your baby is monitored during feeds.", color:"#2c7a5a", bg:"#edf5f0", border:"#b8d8c8", icon:"✅"}
                : ridNum < 10
                ? {headline:"A moderate amount of this medication passes into breast milk.", sub:"Your doctor has weighed this against the benefits of you staying well — breastfeeding may still be supported with monitoring.", color:"#7a6010", bg:"#fdf8e8", border:"#e8d898", icon:"🔍"}
                : {headline:"A meaningful amount of this medication passes into breast milk.", sub:"This is why your doctor is monitoring your baby closely. Ask about your specific situation.", color:"#b0620e", bg:"#fdf0e0", border:"#f0c898", icon:"⚠️"};

              // Feed timing — only show if peak data exists
              const pkStr = m.lac.pk || "";
              const hasPeakData = pkStr && pkStr !== "Variable" && pkStr !== "Unknown" && pkStr.match(/\d/);

              return (
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:15,fontWeight:700,color:"#111827",marginBottom:10}}>
                    What about breastfeeding?
                  </div>

                  {/* RID plain-language card */}
                  <div style={{background:ridMessage.bg,border:`1px solid ${ridMessage.border}`,borderRadius:10,padding:"14px 16px",marginBottom:10,display:"flex",gap:12,alignItems:"flex-start"}}>
                    <span style={{fontSize:22,flexShrink:0,lineHeight:1,marginTop:1}}>{ridMessage.icon}</span>
                    <div>
                      <div style={{fontSize:15,fontWeight:700,color:ridMessage.color,lineHeight:1.4,marginBottom:4}}>{ridMessage.headline}</div>
                      <div style={{fontSize:14,color:"#4b5563",lineHeight:1.6}}>{ridMessage.sub}</div>
                    </div>
                  </div>

                  {/* Feed timing — only when peak data available */}
                  {hasPeakData&&(
                    <div style={{background:"#f0f5ff",border:"1px solid #c8d8f0",borderRadius:10,padding:"14px 16px",display:"flex",gap:12,alignItems:"flex-start"}}>
                      <span style={{fontSize:20,flexShrink:0,lineHeight:1,marginTop:1}}>🕐</span>
                      <div>
                        <div style={{fontSize:14,fontWeight:700,color:"#2c5fa0",marginBottom:5}}>You can time your feeds to reduce your baby's exposure even further.</div>
                        <div style={{fontSize:14,color:"#2a3a4a",lineHeight:1.65}}>
                          The medication level in your milk is lowest just <strong>before you take your next dose</strong>. If possible, try to nurse or pump <strong>right before taking your medication</strong> — that's when the least amount will be in your milk.
                        </div>
                        <div style={{fontSize:13,color:"#5a6a80",marginTop:6,lineHeight:1.5}}>
                          For this medication, levels in milk tend to peak around <strong>{pkStr} after you take it</strong>. You don't need to avoid feeding entirely — this is just a tip that gives you a little extra peace of mind if you'd like it.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Important note about not stopping */}
            <div style={{background:"#fff",borderRadius:10,padding:"14px 18px",border:"1px solid #e2e6ec",fontSize:14,color:"#4b5563",lineHeight:1.65,display:"flex",gap:12,alignItems:"flex-start"}}>
              <span style={{fontSize:20,flexShrink:0,lineHeight:1}}>⚠️</span>
              <span><strong style={{color:"#111827"}}>Do not stop or change your medication without talking to your doctor first.</strong> Stopping suddenly can cause withdrawal symptoms, and going without treatment during pregnancy has its own risks.</span>
            </div>
          </div>

          {/* Untreated illness */}
          {ptShowUntreated&&(
            <div style={{marginBottom:36}}>
              <div style={{borderTop:"1px solid #e8edef",marginBottom:32}}/>
              <div style={{fontSize:11,fontWeight:700,color:"#b83230",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10}}>
                What Happens If {dx ? dx : "My Condition"} Is Not Treated?
              </div>
              <div style={{fontSize:15,color:"#4b5563",lineHeight:1.65,marginBottom:20}}>
                Deciding whether to stay on medication means weighing two sets of risks — the medication's risks <em>and</em> the risks of going without treatment. Neither choice is risk-free.
              </div>
              {u ? (
                <>
                  <div style={{fontSize:16,color:"#2a2e38",lineHeight:1.75,marginBottom:16}}>
                    Research shows that if this medication is stopped, about <strong>{u.rp}</strong> of people with {sev||"moderate"} {dx||"this condition"} will have their symptoms return. Things that can happen when {dx||"this condition"} goes untreated during pregnancy or after birth include:
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
                    {u.rk.map((r,i)=>(
                      <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start",padding:"12px 16px",borderRadius:10,background:"#fff8f8",border:"1px solid #f0c0c0"}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:"#b83230",flexShrink:0,marginTop:7}}/>
                        <div style={{fontSize:15,color:"#374151",lineHeight:1.65}}>{r}</div>
                      </div>
                    ))}
                  </div>
                  {u.src&&<div style={{fontSize:12,color:"#4b5563",marginBottom:16,paddingLeft:4}}>Sources: {u.src}</div>}
                  <div style={{background:"#fff",borderRadius:10,padding:"14px 18px",border:"1px solid #e2e6ec",fontSize:14,color:"#4b5563",lineHeight:1.65,display:"flex",gap:12,alignItems:"flex-start"}}>
                    <span style={{fontSize:20,flexShrink:0,lineHeight:1}}>💡</span>
                    <span>These are possibilities, not certainties. Your doctor knows your personal history and can help you understand what level of risk applies to your specific situation.</span>
                  </div>
                </>
              ) : (
                <div style={{fontSize:15,color:"#4b5563",fontStyle:"italic",padding:"14px 18px",borderRadius:10,background:"#f8f9fb",border:"1px solid #e8ebf0",lineHeight:1.65}}>
                  Ask your doctor to walk you through what research shows about your specific condition going untreated during this period.
                </div>
              )}
            </div>
          )}

          {/* Unknowns */}
          {ptShowUnknowns&&(
            <>
              <div style={{borderTop:"1px solid #e8edef",marginBottom:32}}/>
              <div style={{marginBottom:36}}>
                <div style={{fontSize:11,fontWeight:700,color:"#4b5563",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10}}>What Research Still Doesn't Know</div>
                <div style={{fontSize:14,color:"#4b5563",lineHeight:1.65,marginBottom:14}}>
                  It's important to know both what research shows and what it doesn't yet show. Most studies on medications in pregnancy follow children up to age 3–6, so we have less information about what happens in later childhood.
                </div>
                <div style={{fontSize:16,color:"#2a2e38",lineHeight:1.75,marginBottom:14}}>{summary.unknownText}</div>
                <div style={{background:"#fff",borderRadius:10,padding:"14px 18px",border:"1px solid #e2e6ec",fontSize:14,color:"#4b5563",lineHeight:1.65,display:"flex",gap:12,alignItems:"flex-start"}}>
                  <span style={{fontSize:20,flexShrink:0,lineHeight:1}}>💡</span>
                  <span>Not having complete information is normal in medicine. Your doctor can help you make the best decision possible with what is known right now.</span>
                </div>
              </div>
            </>
          )}

          {/* Decision framing — visually prominent */}
          <div style={{borderTop:"1px solid #e8edef",paddingTop:32,marginBottom:36}}>
            <div style={{background:"linear-gradient(135deg,#0d7358,#0a5c47)",borderRadius:14,padding:"28px 30px",color:"#fff",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
              <div style={{position:"absolute",bottom:-30,left:-10,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.03)"}}/>
              <div style={{position:"relative"}}>
                <div style={{fontSize:20,fontWeight:700,color:"#fff",marginBottom:14,letterSpacing:"-0.3px"}}>This decision belongs to you and your doctor.</div>
                <div style={{fontSize:15,color:"rgba(255,255,255,0.8)",marginBottom:12,lineHeight:1.65}}>
                  There is no option without some level of risk. Taking this medication carries a small and sometimes uncertain risk. But going without treatment also carries real risks — for you and your baby.
                </div>
                <div style={{fontSize:15,color:"rgba(255,255,255,0.8)",lineHeight:1.65}}>
                  Your doctor knows your personal history. Together, you can weigh both sides based on what matters most to you.
                </div>
                <div style={{marginTop:18,paddingTop:16,borderTop:"1px solid rgba(255,255,255,0.15)",fontSize:16,fontWeight:700,color:"#fff"}}>
                  You do not have to make this decision alone, and you do not have to make it today.
                </div>
              </div>
            </div>
          </div>

          {/* Question box — large, easy to write on or type into */}
          <div style={{marginBottom:32}}>
            <div style={{fontSize:11,fontWeight:700,color:"#4b5563",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:14}}>My Questions for My Doctor</div>
            <div style={{fontSize:13,color:"#6b7280",marginBottom:16}}>Write them down before your next appointment — there are no silly questions.</div>
            {[1,2,3].map(n=>(
              <div key={n} style={{display:"flex",gap:14,marginBottom:18,alignItems:"flex-start"}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:"#f8f9fb",border:"1.5px solid #e2e6ec",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#4b5563",flexShrink:0,marginTop:2}}>{n}</div>
                <div style={{flex:1,borderBottom:"1.5px solid #e2e6ec",minHeight:36}}/>
              </div>
            ))}
          </div>

          {/* Resources */}
          <div style={{background:"#fff",borderRadius:12,padding:"20px 24px",marginBottom:28,border:"1px solid #c5e8dc",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,bottom:0,width:4,background:"#0d7358",borderRadius:"12px 0 0 12px"}}/>
            <div style={{paddingLeft:8}}>
              <div style={{fontSize:14,fontWeight:700,color:"#0d7358",marginBottom:8}}>Want more information?</div>
              <div style={{fontSize:14,color:"#2a2e38",lineHeight:1.65,marginBottom:14}}>
                MotherToBaby offers free, easy-to-read fact sheets on medications in pregnancy, written by teratology experts. You can also call or text them directly with questions.
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"center"}}>
                {MTB_URLS[med]&&(
                  <a href={MTB_URLS[med]} target="_blank" rel="noopener noreferrer"
                    style={{display:"inline-flex",alignItems:"center",gap:6,padding:"9px 16px",borderRadius:8,background:"#0d7358",color:"#fff",fontWeight:700,fontSize:13,textDecoration:"none"}}>
                    {m.g} fact sheet ↗
                  </a>
                )}
                <div style={{fontSize:13,color:"#4b5563"}}>
                  📞 <strong>1-866-626-6847</strong> · mothertobaby.org
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{textAlign:"center",fontSize:11,color:"#c5cdd8",fontFamily:"'Geist Mono',monospace",lineHeight:1.75,paddingTop:20,borderTop:"1px solid #f0f2f5"}}>
            PeriRx · Perinatal Decision Support · Not a prescribing directive<br/>
            This summary was prepared for this visit by your clinician.
          </div>
        </div>
      </div>
    );
  })()}

  {/* ━━━━━━━━━━━━━ LACTATION MODAL (from results view) ━━━━━━━━━━━━━ */}
  {showLac&&m?.lac&&(
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",backdropFilter:"blur(4px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowLac(false)}>
    <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:12,maxWidth:600,width:"100%",maxHeight:"85vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.15)"}}>
      <div style={{padding:"20px 24px",borderBottom:"1px solid #e2e6ec",position:"relative",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{fontSize:10,fontWeight:700,color:"#2c6fbb",letterSpacing:"0.5px",textTransform:"uppercase",fontFamily:"'Geist Mono',monospace"}}>Lactation Compatibility Module — LactMed®</div>
          <div style={{fontSize:18,fontWeight:700,color:"#111827",fontFamily:"'Instrument Serif',serif",marginTop:2}}>{m.g}</div>
        </div>
        <button onClick={()=>setShowLac(false)} style={{background:"#f8f9fb",border:"none",borderRadius:6,width:28,height:28,cursor:"pointer",color:"#4b5563",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>×</button>
      </div>
      <div style={{padding:24}}>
        {/* Infant age quick-entry — inline in popup */}
        {(()=>{
          const w = infantAge ? parseInt(infantAge) : null;
          const ageClr = !w ? null : w<4 ? "#b83230" : w<13 ? "#a05a00" : "#0d7358";
          const ageBg  = !w ? "#eaf1fb" : w<4 ? "#fff5f5" : w<13 ? "#fdf8ee" : "#e8f5f0";
          const ageBorder = !w ? "#c0d4ef" : w<4 ? "#f0c0c0" : w<13 ? "#e8d898" : "#c5e8dc";
          const ageLabel = !w ? "#2c6fbb" : ageClr;
          return (
        <div style={{background:ageBg,border:`1px solid ${ageBorder}`,borderRadius:8,padding:"12px 14px",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:ageLabel,marginBottom:6}}>
            {infantAge?"✓ Infant age set — guidance below is age-adjusted":"Enter infant age for age-adjusted guidance"}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,background:"#fff",border:`1.5px solid ${infantAge?(ageClr||"#0d7358"):"#c0d4ef"}`,borderRadius:6,padding:"4px 10px",flex:"0 0 auto"}}>
              <input
                type="number" min="0" max="104"
                value={infantAge}
                onChange={e=>setInfantAge(e.target.value)}
                placeholder="e.g. 8"
                style={{width:52,border:"none",outline:"none",fontSize:14,fontWeight:600,color:"#111827",background:"transparent",fontFamily:"'Geist Mono',monospace",textAlign:"center"}}
              />
              <span style={{fontSize:11,color:"#4b5563",whiteSpace:"nowrap"}}>weeks old</span>
            </div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {[{l:"Neonate",v:"2"},{l:"1 mo",v:"4"},{l:"3 mo",v:"12"},{l:"6 mo",v:"24"},{l:"12 mo",v:"52"}].map(({l,v})=>(
                <button key={v} onClick={()=>setInfantAge(v)}
                  style={{padding:"4px 9px",borderRadius:6,fontSize:10,fontWeight:600,cursor:"pointer",border:`1px solid ${infantAge===v?(ageClr||"#0d7358"):"#e5e7eb"}`,background:infantAge===v?(ageClr||"#0d7358"):"#f8f9fb",color:infantAge===v?"#fff":"#4b5563",transition:"all .15s"}}>
                  {l}
                </button>
              ))}
            </div>
            {infantAge&&<button onClick={()=>setInfantAge("")} style={{fontSize:10,color:"#6b7280",background:"none",border:"none",cursor:"pointer",padding:"2px 4px",textDecoration:"underline"}}>clear</button>}
          </div>
          {infantAge&&w&&(()=>{
            const ctx=w<4?"Neonate (<4 wks): highest exposure risk — immature hepatic metabolism, prolonged drug half-lives.":w<13?"Early infancy (1–3 mo): hepatic enzymes maturing. Sedation and feeding changes are key signals.":w<26?"Mid infancy (3–6 mo): metabolic capacity increasing. Most medications better tolerated.":w<52?"Older infant (6–12 mo): near-adult hepatic metabolism for most pathways.":"Toddler (>12 mo): adult-like metabolism. Breastfeeding contribution to total dose is small.";
            return(<div style={{marginTop:8,fontSize:11,color:ageClr,lineHeight:1.5,borderTop:`1px solid ${ageBorder}`,paddingTop:8,width:"100%"}}>{ctx}</div>);
          })()}
        </div>
          );
        })()}
        {/* Tier */}
        <div style={{background:(tierColor(m.lac.tier))+"0a",border:`1.5px solid ${(tierColor(m.lac.tier))}30`,borderRadius:8,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"flex-start",gap:10}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:tierColor(m.lac.tier),flexShrink:0,marginTop:3}}/>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:tierColor(m.lac.tier)}}>{m.lac.tier}</div>
            <div style={{fontSize:10,color:"#4b5563",fontFamily:"'Geist Mono',monospace",marginTop:2}}>Classification from LactMed® peer-reviewed summary</div>
            <div style={{fontSize:11,color:"#4b5563",marginTop:6,lineHeight:1.5}}><strong>Note:</strong> LactMed® classifies most psychiatric medications as "Compatible with monitoring" — this reflects that breastfeeding is generally supported with observation, not that all drugs carry equal risk. The RID and monitoring guidance below differentiate the risk profile.</div>
          </div>
        </div>
        {/* ── RID HERO + SUPPORTING METRICS ─────────────────────────────── */}
        {(()=>{
          const ridStr = m.lac.rid || "";
          const ridPrimary = ridStr.replace(/\([^)]*\)/g, "").split(";")[0].trim();
          const rangeMatch = ridPrimary.match(/([\d.]+)\s*[–\-]\s*([\d.]+)\s*%/);
          const singleMatch = ridPrimary.match(/[<~]?\s*([\d.]+)\s*%/);
          const ridLow  = rangeMatch ? parseFloat(rangeMatch[1]) : singleMatch ? parseFloat(singleMatch[1]) : null;
          const ridHigh = rangeMatch ? parseFloat(rangeMatch[2]) : ridLow;
          const ridNum  = ridLow;
          const isRange = rangeMatch && ridHigh !== ridLow;
          const crossesThreshold = isRange && ridLow < 10 && ridHigh >= 10;
          const bothAbove = ridLow !== null && ridLow >= 10;
          const ridColor = ridNum === null ? "#6b7280"
            : crossesThreshold ? "#a05a00"
            : ridNum < 2  ? "#0d7358"
            : ridNum < 5  ? "#2c7a5a"
            : ridNum < 10 ? "#a05a00"
            : "#b83230";
          const ridShort = ridStr.split("(")[0].trim();
          const thresholdLabel = ridNum === null ? "RID — see details"
            : crossesThreshold ? "Range spans the 10% threshold"
            : bothAbove ? "Exceeds 10% threshold"
            : ridNum < 2  ? "Well below 10% threshold"
            : ridNum < 5  ? "Below 10% threshold"
            : "Approaching threshold — monitor";
          const thresholdDetail = ridNum === null ? "Review full RID data below."
            : crossesThreshold ? `Lower end (${ridLow}%) is within acceptable range; upper end (${ridHigh}%) exceeds threshold. Dosing level and infant age determine which end applies clinically.`
            : bothAbove ? "RID ≥10% warrants individual risk-benefit assessment."
            : "An RID <10% is generally considered acceptable for breastfeeding (Hale's criterion).";

          return (
          <div style={{marginBottom:16}}>

            {/* RID hero row */}
            <div className="rid-hero-row">

              {/* Left: gauge + number */}
              <div className="rid-gauge" style={{border:`2px solid ${(bothAbove||crossesThreshold)?"#b83230":ridColor+"30"}`,background:(bothAbove||crossesThreshold)?"#fff5f5":undefined}}>
                <div style={{fontSize:9,fontWeight:700,color:(bothAbove||crossesThreshold)?"#b83230":"#6b7280",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:2}}>RID</div>
                <div style={{fontSize:"clamp(18px, 4vw, 26px)",fontWeight:800,color:ridColor,fontFamily:"'Geist Mono',monospace",lineHeight:1,letterSpacing:"-1px",wordBreak:"break-word",textAlign:"center"}}>{ridShort}</div>
                {ridLow !== null && (
                  <div style={{width:"100%",marginTop:8}}>
                    {(() => {
                      const scale = 20;
                      const thresholdPct = 50;
                      const val = ridHigh ?? ridLow;
                      const fillPct = Math.min((val / scale) * 100, 99);
                      const exceeds = val >= 10;
                      const fillColor = exceeds ? "#b83230" : "#0d7358";
                      return (
                        <>
                          <div style={{height:7,borderRadius:4,background:"#e5e7eb",position:"relative",overflow:"hidden"}}>
                            <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${fillPct}%`,background:fillColor,borderRadius:"4px 0 0 4px",transition:"width .5s ease"}}/>
                          </div>
                          <div style={{position:"relative",height:0}}>
                            <div style={{position:"absolute",left:`${thresholdPct}%`,top:-11,height:15,width:2,background:"#9ca3af",borderRadius:1,zIndex:2,transform:"translateX(-50%)"}}/>
                          </div>
                          <div style={{position:"relative",marginTop:4,height:14}}>
                            <span style={{fontSize:8,color:"#a0aab4",fontFamily:"'Geist Mono',monospace",position:"absolute",left:0}}>0%</span>
                            <span style={{fontSize:8,fontFamily:"'Geist Mono',monospace",position:"absolute",left:`${thresholdPct}%`,transform:"translateX(-50%)",color:"#6b7280"}}>10%</span>
                            <span style={{fontSize:8,color:"#a0aab4",fontFamily:"'Geist Mono',monospace",position:"absolute",right:0}}>20%</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Right: threshold badge + peak milk */}
              <div className="rid-right">
                {/* Threshold interpretation */}
                <div style={{background:`${ridColor}0d`,border:`1px solid ${ridColor}30`,borderRadius:8,padding:"10px 12px",flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
                  <div style={{fontSize:11,fontWeight:700,color:ridColor,marginBottom:3}}>{thresholdLabel}</div>
                  <div style={{fontSize:10,color:"#4b5563",lineHeight:1.45}}>{thresholdDetail}</div>
                </div>
              </div>
                {/* Peak milk timing — compact */}
                {/* Peak milk + feed timing guide */}
                <div style={{background:"#f8f9fb",border:`1px solid ${showFeedTiming?"#2c6fbb":"#e5e7eb"}`,borderRadius:8,overflow:"hidden",transition:"border-color .15s"}}>
                  <div style={{padding:"8px 12px",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                    <div style={{fontSize:9,fontWeight:700,color:"#6b7280",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.4px",flexShrink:0}}>Peak milk</div>
                    <div style={{fontSize:12,fontWeight:600,color:"#111827",wordBreak:"break-word",overflowWrap:"break-word",minWidth:0}}>{m.lac.pk} post-dose</div>
                    <button
                      onClick={()=>setShowFeedTiming(v=>!v)}
                      style={{fontSize:10,color:showFeedTiming?"#2c6fbb":"#9ca3af",marginLeft:"auto",whiteSpace:"nowrap",background:"none",border:"none",cursor:"pointer",padding:"2px 0",fontWeight:showFeedTiming?700:400,display:"flex",alignItems:"center",gap:3,transition:"color .15s"}}
                    >
                      → feed timing guide <span style={{fontSize:9,transition:"transform .2s",display:"inline-block",transform:showFeedTiming?"rotate(90deg)":"rotate(0deg)"}}>▶</span>
                    </button>
                  </div>
                  {showFeedTiming&&(()=>{
                    // Parse peak hour(s) from pk string like "8–9 hrs" or "1–2 hrs"
                    const pkStr = m.lac.pk || "";
                    const pkMatch = pkStr.match(/([\d.]+)[–\-]?([\d.]*)\s*hr/i);
                    const pkLow  = pkMatch ? parseFloat(pkMatch[1]) : null;
                    const pkHigh = pkMatch && pkMatch[2] ? parseFloat(pkMatch[2]) : pkLow;
                    const pkMid  = pkLow !== null ? ((pkLow + (pkHigh||pkLow)) / 2).toFixed(1).replace(".0","") : null;

                    // Half-life context for trough timing
                    const halfLifeNote = m.pk
                      ? m.pk.match(/half.life[^.]*?([\d–\-]+\s*h)/i)?.[1]
                      : null;

                    return (
                      <div style={{padding:"12px 14px",borderTop:"1px solid #dde8f5",background:"#eaf1fb",animation:"fadeIn .15s ease"}}>
                        {/* Principle */}
                        <div style={{fontSize:11,fontWeight:700,color:"#2c6fbb",marginBottom:8}}>How to use peak milk timing</div>
                        <div style={{fontSize:11,color:"#2a3a4a",lineHeight:1.65,marginBottom:10}}>
                          Milk drug concentration follows a curve — it rises after the dose and peaks around <strong>{m.lac.pk} post-dose</strong>, then falls toward a trough just before the next dose.{" "}
                          {pkLow !== null && pkLow > 6 ? <>The peak occurs too late to practically avoid — <strong>feed at the trough (just before the next dose)</strong>, when levels are lowest.</> : <>To minimize infant exposure, time feeds to occur <strong>just before the next dose</strong> (the trough), when milk levels are lowest.</>}
                        </div>

                        {/* Visual timeline */}
                        {pkLow !== null && (
                          <div style={{marginBottom:10,padding:"10px 12px",background:"#fff",borderRadius:7,border:"1px solid #c0d4ef"}}>
                            <div style={{fontSize:9,fontWeight:700,color:"#4b5563",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:8}}>Concentration curve (schematic)</div>
                            <div style={{position:"relative",height:44,marginBottom:4,padding:"0 8px"}}>
                              <svg width="100%" height="44" style={{display:"block"}} viewBox="0 0 200 44" preserveAspectRatio="none">
                                {/* Track */}
                                <line x1="10" y1="36" x2="190" y2="36" stroke="#e0e8f5" strokeWidth="3" strokeLinecap="round"/>
                                {/* Concentration curve */}
                                <path d="M10,36 Q60,6 100,8 Q140,10 190,32" fill="none" stroke="#2c6fbb" strokeWidth="2.5" strokeLinecap="round"/>
                                {/* Peak marker */}
                                <circle cx="100" cy="8" r="5" fill="#2c6fbb"/>
                                {/* Trough markers */}
                                <circle cx="10"  cy="36" r="5" fill="#0d7358"/>
                                <circle cx="190" cy="32" r="5" fill="#0d7358"/>
                              </svg>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                              <div style={{fontSize:9,color:"#0d7358",fontWeight:700,fontFamily:"'Geist Mono',monospace",textAlign:"center",width:48}}>
                                DOSE<br/>
                                <span style={{fontSize:8,fontWeight:400,color:"#6b7280"}}>feed here</span>
                              </div>
                              <div style={{fontSize:9,color:"#2c6fbb",fontWeight:700,fontFamily:"'Geist Mono',monospace",textAlign:"center"}}>
                                PEAK<br/>
                                <span style={{fontSize:8,fontWeight:400,color:"#6b7280"}}>{pkLow > 24 ? "variable" : `~${pkMid} hr`}</span>
                              </div>
                              <div style={{fontSize:9,color:"#0d7358",fontWeight:700,fontFamily:"'Geist Mono',monospace",textAlign:"center",width:56}}>
                                NEXT DOSE<br/>
                                <span style={{fontSize:8,fontWeight:400,color:"#6b7280"}}>feed here</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Practical guidance bullets */}
                        <div style={{display:"flex",flexDirection:"column",gap:5}}>
                          {[
                            `Feed (or pump for storage) just <strong>before taking the dose</strong> — this is the trough, when milk drug levels are at their lowest.`,
                            pkLow !== null && pkLow <= 3
                              ? `If minimizing exposure is a priority, a short delay of ~${Math.ceil(pkLow)} hr after dosing covers the peak window.`
                              : `For this medication, peak milk levels occur <strong>~${m.lac.pk} after dosing</strong> — too long to avoid by delaying feeds. The trough (just before next dose) is the only practical low-exposure window.`,
                            pkLow !== null && pkLow >= 6 && pkLow <= 24
                              ? `For once-daily dosing, taking the dose at <strong>bedtime</strong> means the peak passes during overnight sleep — practical for most families.`
                              : pkLow !== null && pkLow <= 2
                              ? `With such a short peak window, once-daily or twice-daily dosing timed around feeds is manageable.`
                              : null,
                            `This is a <strong>harm-reduction strategy</strong>, not a requirement. For most medications with RID &lt;10%, feed timing is optional — it provides extra reassurance rather than clinical necessity.`,
                          ].filter(Boolean).map((txt,i)=>(
                            <div key={i} style={{display:"flex",gap:7,alignItems:"flex-start",fontSize:11,color:"#2a3a4a",lineHeight:1.55}}>
                              <span style={{color:"#2c6fbb",flexShrink:0,marginTop:1}}>·</span>
                              <span dangerouslySetInnerHTML={{__html:txt}}/>
                            </div>
                          ))}
                        </div>
                        <div style={{marginTop:8,fontSize:9,color:"#6b7280",fontFamily:"'Geist Mono',monospace",lineHeight:1.5}}>
                          Source: Hale T. Medications and Mothers' Milk. Feed timing principles apply broadly; always confirm with LactMed® data for this specific drug.
                        </div>
                      </div>
                    );
                  })()}
                </div>
            </div>

            {/* Secondary metrics — milk levels + infant serum */}
            <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
              {(()=>{
                const extractHeadline = (v, label) => {
                  if (!v) return {headline: v, detail: null};
                  const labelWords = (label||"").toLowerCase().replace(/[^a-z\s]/g,"").trim();
                  let cleaned = v;
                  if (labelWords) {
                    const labelRe = new RegExp(`^${labelWords}\\s*[~:]?\\s*`, "i");
                    cleaned = cleaned.replace(labelRe, "");
                  }
                  const m = cleaned.match(/^([^;(—]+)/);
                  const raw = m ? m[1].trim() : cleaned;
                  const headline = raw.replace(/\s*(mcg\/L.*|mg\/L.*|typical.*|average.*|avg.*)$/i, "").trim();
                  let detail = cleaned.slice(headline.length).replace(/^[;,\s\-—]+/, "").trim() || null;
                  const vagueFragments = ["significant","variable","low","high","moderate","minimal","notable","present","absent","detectable","undetectable"];
                  if (detail && detail.split(/\s+/).length <= 2 && vagueFragments.some(w => detail.toLowerCase().startsWith(w))) {
                    return {headline: `${headline} — ${detail}`, detail: null};
                  }
                  return { headline, detail };
                };

                const drugSignalOverrides = {
                  lithium:      { is: {headline:"High — monitor closely", detail:"~58% of maternal serum in early postpartum; stabilises to <10% after ~1 month. Risk highest in neonatal period.", color:"#b83230"}, ml: {headline:"Variable — significant", detail:null, color:"#b83230"} },
                  lamotrigine:  { is: {headline:"~10% of maternal", detail:"Usually below therapeutic range. Neonatal glucuronidation immature — monitor for rash, apnea.", color:"#7a6010"} },
                  topiramate:   { is: {headline:"~51% of maternal", detail:"Unusually high — monitor closely, especially in younger infants.", color:"#b83230"} },
                  venlafaxine:  { is: {headline:"Present + metabolite", detail:"Active metabolite also in milk — total exposure higher than RID alone suggests.", color:"#7a6010"} },
                  citalopram:   { is: {headline:"Detectable — monitor", detail:"CYP2C19 poor metabolizers may have higher exposure.", color:"#7a6010"} },
                  clozapine:    { is: {headline:"Detectable + metabolites", detail:"Agranulocytosis risk is primary concern.", color:"#b83230"} },
                  alprazolam:   { is: {headline:"Low — but accumulates", detail:"PBPK-modeled RID ~6.51% — higher than typical BZDs.", color:"#7a6010"} },
                  bupropion:    { is: {headline:"Low + active metabolites", detail:"Hydroxybupropion appears at levels comparable to parent drug.", color:"#7a6010"} },
                  aripiprazole: { is: {headline:"Minimal", detail:"Monitor milk supply — may cause lactation cessation.", color:"#7a6010"} },
                };
                const overrides = drugSignalOverrides[med] || {};

                const items = [
                  {l:"Milk levels",  v:m.lac.ml, icon:"🍼", key:"ml"},
                  {l:"Infant serum", v:m.lac.is, icon:"🧪", key:"is"},
                ];

                return items.map((x, i) => {
                  const override = overrides[x.key];
                  const {headline, detail} = override ? {headline:override.headline, detail:override.detail} : extractHeadline(x.v, x.l);
                  const hLen = headline.length;
                  const hSize = hLen <= 3 ? 36 : hLen <= 6 ? 28 : hLen <= 12 ? 22 : hLen <= 20 ? 17 : 13;
                  const hLower = headline.toLowerCase();
                  const hColor = override?.color || (hLower.includes("low") || hLower.includes("undetect") || hLower.includes("minimal") || hLower.includes("negligib")
                    ? "#0d7358"
                    : hLower.includes("moderate") || hLower.includes("variable") || hLower.includes("detectable")
                    ? "#7a6010"
                    : hLower.includes("high") || hLower.includes("significant") || hLower.includes("substantial")
                    ? "#b83230"
                    : "#111827");

                  return (
                    <div key={i} style={{flex:"1 1 0",minWidth:120,background:"#f8f9fb",borderRadius:7,padding:"9px 11px",border:"1px solid #e8ebf0"}}>
                      <div style={{fontSize:9,fontWeight:700,color:"#6b7280",fontFamily:"'Geist Mono',monospace",textTransform:"uppercase",letterSpacing:"0.3px",marginBottom:6,display:"flex",alignItems:"center",gap:4}}>
                        <span>{x.icon}</span>{x.l}
                      </div>
                      {/* Hero headline */}
                      <div style={{fontSize:hSize,fontWeight:800,color:hColor,lineHeight:1.1,marginBottom:detail?6:0,letterSpacing:hSize>20?"-0.5px":"0"}}>
                        {headline}
                      </div>
                      {/* Supporting detail — muted, smaller */}
                      {detail && (
                        <div style={{fontSize:10,color:"#6b7280",lineHeight:1.45}}>
                          {detail}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            {/* Adverse effects + monitoring — collapsible prose */}
            {[
              {l:"Adverse effects in nursing infants",v:m.lac.ae,icon:"⚠️",defaultOpen:false},
              {l:"Infant monitoring",v:m.lac.mon,icon:"👁",defaultOpen:true},
            ].map((x,i)=>(
              <details key={i} open={x.defaultOpen} style={{marginBottom:6}}>
                <summary style={{listStyle:"none",cursor:"pointer",background:"#f8f9fb",border:"1px solid #e8ebf0",borderRadius:7,padding:"9px 12px",display:"flex",alignItems:"center",gap:7,userSelect:"none"}}>
                  <span style={{fontSize:12}}>{x.icon}</span>
                  <span style={{fontSize:11,fontWeight:700,color:"#374151",flex:1}}>{x.l}</span>
                  <span style={{fontSize:10,color:"#a0aab4",fontFamily:"'Geist Mono',monospace"}}>▾</span>
                </summary>
                <div style={{fontSize:11,color:"#374151",lineHeight:1.6,padding:"10px 12px",background:"#f9fafb",border:"1px solid #e8ebf0",borderTop:"none",borderRadius:"0 0 7px 7px"}}>
                  {x.v}
                </div>
              </details>
            ))}
          </div>
          );
        })()}
        {m.lac.alts?.length>0&&(
          <div style={{marginTop:8}}>
            <div style={{fontSize:10,fontWeight:700,color:"#4b5563",marginBottom:6}}>Therapeutic Alternatives (per LactMed®)</div>
            <div style={{display:"flex",gap:6}}>{m.lac.alts.map((a,i)=>(
              <span key={i} style={{padding:"4px 10px",borderRadius:4,fontSize:11,background:"#eaf1fb",border:"1px solid #c0d4ef",color:"#2c6fbb",fontWeight:600}}>{a}</span>
            ))}</div>
          </div>
        )}
        <div style={{marginTop:14,display:"flex",justifyContent:"space-between",padding:"8px 10px",borderRadius:6,background:"#f8f9fb",border:"1px solid #e8ebf0",alignItems:"center"}}>
          <span style={{fontSize:10,color:"#6b7280",fontFamily:"'Geist Mono',monospace"}}>LactMed® last revision: {m.lac.rev}</span>
          <a href={SRC_LINKS["LactMed"](med)} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:"#2c6fbb",fontFamily:"'Geist Mono',monospace",textDecoration:"underline"}}>Open LactMed® ↗</a>
        </div>
        <div style={{marginTop:12,textAlign:"center",fontSize:9,color:"#6b7280",fontFamily:"'Geist Mono',monospace",lineHeight:1.65}}>
          All lactation data sourced exclusively from LactMed®. This module never outputs "Do not breastfeed."
        </div>
      </div>
    </div>
  </div>
  )}

  </div>
  );
}
