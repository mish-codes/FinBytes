---
layout: post
title: "CCR/XVA: Counterparty Credit Risk and the Regulatory Framework"
date: 2026-04-21
tags: [finance, ccr, xva, cva, dva, fva, pva, mva, kva, isda, csa, netting, mpor, ee, ene, pfe, epe, eepe, imm, sa-ccr, frtb, egim, basel, regulation, derivatives, wrong-way-risk, wwrr, lgd, ead, irb, cet1, ecb, pra, fca, bcbs, bis, eba, esma, fsb, ssm, emir, umr, crd, crr, ifrs, aana, occ, fed, fdic]
math: true
permalink: /private/ccr-xva-regulatory-walkthrough/
---

A self-contained walkthrough of how a large bank manages counterparty credit risk on a single derivative, from the moment the trade is priced to the moment it matures five years later. Every term you'll encounter in CCR methodology — ISDA, CSA, netting set, MPOR, EE, PFE, EEPE, CVA, DVA, FVA, SA-CCR, IMM, FRTB-CVA, EGIM, PVA, wrong-way risk — appears inside one continuous story.

**Albion Bank** is a large London-based investment bank, supervised by the ECB and the PRA. **Meridian Airlines** is a mid-sized UK airline with a USD/GBP currency mismatch it wants to hedge.

---

## 1 — The Trade

### Meridian's problem

Meridian sells tickets in GBP but pays for jet fuel and USD-denominated aircraft debt in USD. The structural mismatch means a weakening pound directly inflates their fuel bill. They want a multi-year hedge.

### The deal

Albion's Front Office pitches a **5-year cross-currency swap**:

```
Notional:          £200,000,000 vs $250,000,000
Meridian pays:     fixed GBP quarterly
Meridian receives: fixed USD quarterly
Principal exchange: at maturity, notionals are re-exchanged
Initial MtM:       ≈ £0 to both sides (priced at par)
```

On day one the swap is worth roughly zero to both parties — that's how swaps are priced. But its mark-to-market (MtM) will move as GBP/USD and the two yield curves evolve.

### Why this creates credit risk

Three years from now, if GBP has weakened materially, the swap could be worth £30m to Albion — meaning Meridian owes Albion £30m. If Meridian files for bankruptcy at that moment, Albion is an unsecured creditor for a £30m claim. Typical airline recovery rates for senior unsecured obligations are around 40%, so Albion loses approximately £18m.

This is **Counterparty Credit Risk (CCR)**: the risk that a counterparty defaults owing you a positive mark-to-market. Unlike loan credit risk, where exposure equals the outstanding balance, derivative exposure is stochastic — it wanders up and down over the life of the trade.

---

## 2 — The Legal Layer

Before the trade is booked, Albion's legal team ensures two contracts are in place.

### ISDA Master Agreement

A standardised legal contract governing all derivatives between Albion and Meridian. The critical clause is **close-out netting**: on default, all trades under the agreement collapse into a single net claim.

```
Without netting:
  Trade A (Albion in-the-money):   +£30m  → Albion is an unsecured creditor
  Trade B (Meridian in-the-money): -£20m  → Albion must pay £20m to the estate
  Worst case for Albion: pay £20m, recover 40% × £30m = £12m
  Net position:          -£8m (before the original exposure)

With netting:
  Combined net claim:              +£10m  → single unsecured claim
  Loss: (1 − 40%) × £10m = £6m
```

Netting reduces exposure across a typical bank's book by an order of magnitude. Whether netting is legally enforceable depends on the counterparty's jurisdiction — ISDA publishes legal opinions for ~70 jurisdictions, and banks can only apply netting where enforceability is opined.

### Credit Support Annex (CSA)

A bolt-on to the ISDA that introduces collateral. Meridian's CSA with Albion has these terms:

```
Threshold:               £5,000,000
MTA (Min Transfer Amt):  £500,000
Frequency:               Daily variation margin
Eligible collateral:     Cash GBP, cash USD, UK gilts, US Treasuries
Independent Amount:      None (Meridian below UMR IM threshold)
```

**How these parameters work:**

- **Threshold £5m**: collateral is only called once exposure exceeds £5m. Below £5m, Albion takes uncollateralised risk. A "zero-threshold CSA" (common between dealer banks) has no such tolerance.
- **MTA £500k**: if the top-up required is less than £500k, it's skipped to avoid operational noise.
- **Daily VM**: every business day, whoever's in the hole tops up collateral to bring the exposure back to threshold.
- **No IM**: because Meridian is a corporate below the Uncleared Margin Rules threshold (AANA < €8bn), no initial margin is required. Between two large dealer banks it would be mandatory.

The combination of {all trades under the ISDA} + {this CSA} defines a **netting set**. Every new trade between Albion and Meridian under this legal framework joins the same netting set, and exposure is computed on the net portfolio, not trade-by-trade.

---

## 3 — The Exposure Simulation Engine

From day one, the swap is loaded into Albion's CCR engine. This is the system your interview team (Group Strategic Analytics) designs and maintains. It runs overnight, every business day, across every netting set in the bank.

### What the engine does

```
Step 1: Simulate 10,000 paths of all relevant market factors out to trade maturity
        (GBP/USD, GBP rates curve, USD rates curve, FX vol, credit spreads, ...)

Step 2: On each path, at each time bucket, reprice the netting set
        (trade-level MtMs, then sum within the netting set)

Step 3: Apply CSA rules path-by-path
        (threshold, MTA, MPOR-adjusted collateral)

Step 4: Take the positive part of collateralised exposure
        E(t, path) = max(V(t, path) − C(t, path), 0)

Step 5: Aggregate across paths to produce exposure statistics
```

### The mathematics of Step 1

Each market factor is modelled as a stochastic differential equation (SDE). For FX and equities, geometric Brownian motion is typical:

```
dS/S = μ dt + σ dW
```

For interest rates, a mean-reverting model like Hull-White:

```
dr = [θ(t) − κr] dt + σ dW
```

The 10,000 paths are generated by Monte Carlo simulation: discretise time, draw Gaussian increments, step each factor forward, and correlate the increments across factors using Cholesky decomposition of a calibrated covariance matrix.

A subtle but critical point: **which probability measure?** Exposure simulation for PFE and economic capital traditionally uses the real-world measure (P), calibrated from historical data — because PFE is a risk measure asking "what could actually happen?" For CVA, the industry uses the risk-neutral measure (Q) calibrated from market-implied volatilities — because CVA is a price and must be consistent with hedges.

### The mechanics of Step 3: MPOR

If Meridian defaults on day D, Albion does not learn about it and close out the position instantly. There is a gap:

- Day D: default event
- Days D+1 to D+10: failed margin calls, legal notification, position close-out

During this gap, Meridian cannot post more collateral but the market keeps moving. The assumed length of this gap is the **Margin Period of Risk (MPOR)**.

```
Standard MPOR values:
  Cleared trades:                    5 business days
  Uncleared, daily VM:              10 business days
  Disputed or very large portfolios: 20 business days
```

MPOR is the single most impactful parameter in collateral modelling.

```
Illustrative sensitivity (typical book):
  MPOR  5 days:  Exposure = 100 (baseline)
  MPOR 10 days:  Exposure ≈ 141  (scales roughly with √t)
  MPOR 20 days:  Exposure ≈ 200
```

This is why regulators scrutinise MPOR more than almost any other methodology choice.

### Step 5: the exposure metrics

Once the engine has produced `E(t, path)` for 10,000 paths, it computes summary statistics:

```
EE(t)       = mean over paths of E(t, path)              [Expected Exposure]
PFE(t, α)   = α-quantile of E(t, path) across paths      [Potential Future Exposure]
EPE         = time-average of EE(t) over trade life      [Expected Positive Exposure]
EEE(t)      = running maximum of EE up to time t         [Effective EE — non-decreasing]
EEPE        = time-average of EEE(t) over first year     [Effective EPE — regulatory input]
```

Hypothetical outputs for the Meridian swap at trade inception:

```
EE peak:              £12m at year 2.5
PFE(95%) peak:        £47m at year 2.7
EPE:                  £8m
EEPE:                 £14m
```

These numbers scatter to different downstream users, each asking a different question of the same underlying simulation.

---

## 4 — Who Uses Which Metric

### Credit Risk team: PFE for limits

```
Meridian PFE limit:      £80m
Current peak PFE:        £47m (after Meridian swap)
Utilisation:             59%
Headroom for new trades: £33m
```

Any additional trade that would push PFE above £80m requires either a limit increase (sign-off at senior level) or an offsetting trade. This is how exposure simulation feeds directly into Front Office's ability to do more business.

### XVA desk: EE(t) for CVA pricing

The XVA desk computes Credit Valuation Adjustment by integrating EE against counterparty default probability:

```
CVA = LGD × ∫₀ᵀ EE(t) × PD(t) × D(t) dt
```

Where:
- `LGD` — loss given default, typically 60% for senior unsecured airline debt
- `EE(t)` — expected exposure from the engine
- `PD(t)` — marginal default probability derived from Meridian's CDS curve
- `D(t)` — risk-free discount factor

**Worked example.** Meridian's 5Y CDS spread is 250 bps, recovery 40%, so hazard rate λ = 0.025 / 0.60 ≈ 0.0417. Five annual buckets:

```
Year  EE(t)    PD(t-1,t)    D(t)     Bucket Contribution
                                      LGD × EE × PD × D
1     £4m      4.08%        0.95     £0.093m
2     £9m      3.92%        0.90     £0.190m
3     £12m     3.76%        0.86     £0.234m
4     £11m     3.61%        0.82     £0.196m
5     £7m      3.46%        0.78     £0.113m
                                     ─────────────────
                              CVA ≈  £0.826m
```

Albion charges Meridian approximately £0.8m upfront, embedded in the swap pricing, to cover this expected default loss.

### XVA desk: DVA

DVA is the mirror image of CVA from Meridian's perspective: Albion itself could default on its obligations to Meridian, and that possibility reduces the value of the swap from Meridian's side. By symmetry, it *increases* the value from Albion's perspective.

```
DVA = LGD_own × ∫₀ᵀ ENE(t) × PD_own(t) × D(t) dt
```

Where `ENE(t)` is Expected Negative Exposure — the expected amount Albion owes Meridian on each path — and `PD_own(t)` comes from Albion's own CDS spreads.

DVA is controversial:

- **Accounting**: IFRS 13 requires DVA to be recognised in fair value. When Albion's credit deteriorates, its DVA goes up, and it books a P&L gain. This happened across the industry in 2008.
- **Regulation**: Basel strips DVA out of regulatory capital (the "DVA filter"). So accounting fair value and regulatory fair value differ by DVA.
- **Hedging**: DVA is structurally difficult to hedge. You cannot sell CDS protection on yourself; imperfect proxies via sector CDS are the usual fallback.

### XVA desk: FVA

When Albion hedges the Meridian swap in the interbank market, it posts collateral to its hedge counterparties. That collateral must be funded at Albion's blended funding cost, which exceeds the risk-free rate by a funding spread. FVA captures the present value of that funding cost over the life of the trade:

```
FVA ≈ ∫₀ᵀ [EE(t) × s_fund(t) − ENE(t) × s_fund(t)] × D(t) dt
       ──── FCA (cost) ────    ──── FBA (benefit) ────
```

Structurally identical to CVA, with the funding spread replacing the default-adjusted spread. The same EE and ENE curves feed all three adjustments — one simulation, three valuation adjustments.

### Treasury: EEPE for IMM capital

Under the Internal Model Method, Albion's regulatory Exposure at Default is:

```
EAD = α × EEPE
    = 1.4 × £14m
    = £19.6m
```

The 1.4 alpha multiplier is a regulatory fudge factor designed to cover model-estimation error and wrong-way-risk effects not captured explicitly.

### Finance: SA-CVA sensitivities

Under FRTB-CVA's Standardised Approach (SA-CVA), Albion must produce daily sensitivities of CVA to all risk factor categories (IR delta, FX delta, credit delta, equity delta, commodity delta, and their vegas). These feed into a regulator-prescribed aggregation formula that produces CVA capital.

The methodology challenge is not producing one-day sensitivities — it's producing them *stably*. If the CVA-delta-to-EUR-rates number jumps 30% day-over-day due to a calibration artefact rather than a real market move, regulators push back hard.

### Everyone: PVA

Every number above has embedded uncertainty from modelling choices, calibration windows, and illiquid inputs. The Prudential Valuation Adjustment framework (EBA RTS) requires banks to quantify this uncertainty across nine categories (market price uncertainty, model risk, close-out costs, concentrated positions, future administrative costs, early termination, operational risk, funding, unearned credit spreads) and deduct it from CET1 capital.

**PVA on XVA** is the specific workstream of quantifying uncertainty in CVA/DVA/FVA themselves. This is frontier methodology work; approaches vary significantly across banks.

---

## 5 — The Regulatory Layer

### Two ways to compute EAD

**SA-CCR — the regulator's cookbook formula:**

```
EAD = 1.4 × (RC + PFE_addon)

RC (Replacement Cost)  = max(V − C, 0) for uncollateralised
PFE_addon              = sum across asset classes of:
                         supervisory factor × adjusted notional × supervisory delta
                         with hedging-set netting and a collateralisation multiplier
```

**IMM — the bank's own simulation:**

```
EAD = 1.4 × EEPE
```

Worked example for the Meridian swap:

```
SA-CCR EAD:  1.4 × (£0m RC + £35m PFE addon) = £49m
IMM EAD:     1.4 × £14m EEPE                 = £19.6m
```

The IMM number is materially lower — which is exactly why banks invest in IMM.

### The Basel IV output floor

Under CRR3 (EU's Basel IV implementation, in force from January 2025), internal model capital cannot fall below 72.5% of the standardised alternative:

```
SA-CCR EAD:               £49m
Floor at 72.5%:           £35.5m
IMM EAD (raw):            £19.6m
IMM EAD (after floor):    £35.5m
```

The IMM advantage on this single trade collapses from £29.4m of EAD saving to £13.5m once the output floor binds. Every major IMM bank is now asking: *for which books does IMM still pay off?*

### FRTB-CVA

CVA itself generates regulatory capital because CVA moves with counterparty credit spreads. Under FRTB-CVA, this capital is computed either by:

- **BA-CVA (Basic)**: a formulaic approach based on supervisory weights and notionals. Simpler, more punitive.
- **SA-CVA (Standardised)**: sensitivity-based, using delta and vega buckets across risk types with a regulator-prescribed aggregation formula. Lower capital, but requires regulatory approval and a CVA engine capable of producing daily stable sensitivities.

### EGIM — ongoing supervisory expectations

The ECB Guide to Internal Models is not a new set of rules — it is the ECB's detailed expectations for how existing Basel rules must be implemented. For CCR (Chapter on Counterparty Credit Risk, updated February 2024), it specifies expectations on:

- Risk factor coverage and materiality
- Historical calibration windows and stress calibration
- MPOR application and collateral dispute shocks
- Pricing-model accuracy along simulated paths
- Backtesting at portfolio and risk-factor level
- Proxy methodology and its justification
- Materiality thresholds for model changes
- Governance, documentation, and use test

When Albion proposes a methodology change, the methodology document maps the change to EGIM requirements, Model Validation reviews it against EGIM, and — if material — the ECB conducts an **Internal Model Investigation (IMI)** to assess it.

---

## 6 — Life of the Trade

### Year 1: collateral flows

GBP weakens by 8%. Swap MtM rises to £15m in Albion's favour. The CSA fires:

```
MtM:                    +£15m
Threshold:               £5m
Required collateral:     £10m
Meridian posts:          £10m cash GBP

Exposure-after-collateral: £5m (the residual threshold amount)
```

### Year 2: netting set grows

A different Albion desk adds a small sterling interest rate swap with Meridian. Because it falls under the same ISDA + CSA, it joins the same netting set. Net exposure might actually *decrease* if the IR swap's MtM moves inversely to the cross-currency swap's. This is the non-intuitive power of netting: adding a trade can reduce exposure.

### Year 3: stakeholder pressure

A salesperson wants to do a new FX option with Meridian that would push PFE above the £80m limit. Their proposed solution: tighten the MPOR assumption from 10 days to 5 days for Meridian specifically, arguing Meridian is a reliable margin-caller.

The correct response is usually no, framed constructively:

- MPOR is calibrated to regulatory minimums by product type, not by counterparty reliability.
- Weakening MPOR on a specific counterparty would fail EGIM scrutiny (ECB expects consistent application across comparable counterparties).
- Alternative: propose restructuring the netting set or offsetting positions, or formally request a limit increase.

### Year 4: CVA jumps overnight

Meridian issues a profit warning. Its 5Y CDS spread widens from 250 bps to 400 bps overnight. CVA on the netting set jumps from £0.8m to roughly £1.3m. The forensic workflow:

```
1. Verify the CDS spread move (external market data)
2. Check that EE curves are unchanged day-over-day (no engine artefact)
3. Compute ΔCVA/Δspread analytically and multiply by 150 bps
4. Confirm the delta × spread-move ≈ actual CVA jump
5. Conclude: move is genuine, not a model error
```

### Year 5: maturity

Final cashflows settle. The netting set empties. Capital against Meridian drops to zero.

---

## 7 — Wrong-Way Risk

Suppose the counterparty had been **Ferro Mineração** — a Brazilian iron-ore exporter with USD debt, hedging via a BRL/USD cross-currency swap with Albion.

Ferro's risk profile has a structural correlation:

- If BRL weakens sharply: swap MtM against Ferro grows (they owe Albion more)
- Simultaneously: Brazil is likely in a currency crisis, iron-ore demand is cratering, Ferro's USD debt service is painful
- Ferro's default probability is elevated *exactly when* their swap exposure is largest

This is **General Wrong-Way Risk (GWWR)** — the positive correlation between counterparty credit quality and exposure. The naive CVA formula assumes PD and EE are independent:

```
CVA_naive = LGD × ∫ EE(t) × PD(t) × D(t) dt
```

Under GWWR, this understates true expected loss. A proper treatment uses a joint simulation where credit spreads and market factors are correlated:

```
CVA_WWR = LGD × ∫ E[EE(t) | default at t] × PD(t) × D(t) dt
```

The conditional expectation `E[EE | default]` is higher than the unconditional `EE` under WWR, so CVA_WWR > CVA_naive.

**Specific Wrong-Way Risk (SWWR)** is a direct legal link rather than a statistical correlation. Example: a repo where the counterparty posts its own issued bonds as collateral. On default, both the unsecured claim and the collateral collapse together. Basel mandates punitive treatment (higher alpha, or explicit bilateral adjustment) for SWWR trades.

---

## 8 — How It All Connects

```
Trade booked
     ↓
ISDA + CSA define netting set and collateral rules
     ↓
CCR engine simulates 10,000 paths × all market factors
     ↓
Along each path: reprice netting set, apply collateral with MPOR
     ↓
Aggregate: EE(t), PFE(t), EPE, EEPE
     ↓
Downstream consumers:
     ├─ Credit Risk   → PFE drives limits
     ├─ XVA desk      → EE drives CVA, DVA, FVA, MVA, KVA
     ├─ Finance       → EE sensitivities drive SA-CVA capital
     ├─ Treasury      → EEPE drives IMM capital
     └─ Risk          → PVA deducts valuation uncertainty from CET1
     ↓
Regulatory oversight:
     ├─ Basel IV / CRR3 (EU) → rules on IMM, SA-CCR, output floor
     ├─ FRTB-CVA              → rules on CVA capital
     └─ EGIM                  → ECB expectations for how IMM must be implemented
     ↓
Methodology team:
     ├─ Owns every model choice along the chain
     ├─ Writes methodology docs demonstrating EGIM compliance
     ├─ Defends choices to ECB in IMIs
     └─ Remediates findings on agreed timelines
```

### The one-paragraph summary

A bank books a derivative. The ISDA and CSA define the legal container (netting set, collateral rules). The CCR engine simulates thousands of futures, reprices the portfolio along each, applies collateral with an MPOR gap, and produces exposure statistics. Those statistics scatter to different teams: PFE for limits, EE for CVA/DVA/FVA, EEPE for regulatory capital. Basel IV sets the capital rules (SA-CCR standardised vs IMM internal model, with a 72.5% output floor). FRTB-CVA sets the CVA capital rules. EGIM sets the ECB's detailed expectations for how IMM must be implemented. The methodology team owns every modelling choice along this chain and defends those choices to regulators.

---

## References

- Jon Gregory, *The xVA Challenge* (4th ed.) — the canonical practitioner reference for Sections 3–5.
- BCBS d279 — the SA-CCR standard.
- BCBS d507 — FRTB-CVA.
- ECB Guide to Internal Models, CCR chapter (February 2024 revision) — the supervisory expectations for IMM.
- EBA RTS on Prudent Valuation — for PVA mechanics including the nine AVA categories.

---

## Glossary: Regulatory Bodies and Frameworks

### Global

**BIS — Bank for International Settlements**
The central bank for central banks, based in Basel, Switzerland. BIS hosts the committees that write global rules but has no direct supervisory power over individual banks. When people say "Basel rules," the source documents are BIS publications. BIS provides the secretariat for BCBS.

**BCBS — Basel Committee on Banking Supervision**
A committee of supervisors and central banks from 28 jurisdictions, secretariat at the BIS. BCBS writes the Basel Accords — the global minimum standards for bank capital and liquidity. Key documents for CCR/XVA: BCBS d279 (SA-CCR), BCBS d507 (FRTB-CVA). BCBS standards are not law until a jurisdiction transposes them — the EU does this via CRR/CRD, the UK via the PRA Rulebook, the US via Fed/OCC rules. There are always timing gaps and local carve-outs between BCBS publication and national implementation.

**FSB — Financial Stability Board**
Monitors systemic risk and coordinates national financial authorities. Post-2008, FSB drove the G20 mandate to centrally clear OTC derivatives and impose mandatory margin on uncleared trades — which is the origin of UMR and its direct effect on MPOR and IM requirements in CCR.

---

### European

**ECB — European Central Bank**
The ECB has two distinct roles. In a methodology and capital context you almost always mean the supervisory role, not the monetary one:

1. **Monetary policy**: sets interest rates for the Eurozone. This is the role most people know.
2. **Prudential supervision (SSM)**: since November 2014, the ECB directly supervises the ~110 most significant banks in the Eurozone under the Single Supervisory Mechanism. A bank is "significant" if assets > €30bn or if it is systemically important in its home country.

In the Albion Bank story, the ECB supervises Albion because it is a significant institution. The ECB conducts Internal Model Investigations (IMIs) — deep-dive reviews of a bank's models. IMI findings become mandatory remediation items that the methodology team owns on agreed timelines.

**SSM — Single Supervisory Mechanism**
The ECB's supervisory arm, created in 2014. Directly supervises significant institutions (SIs). Less significant institutions (LSIs) — smaller banks — are supervised by national competent authorities (NCAs) such as the Bundesbank or Banca d'Italia, with the ECB in oversight.

**EBA — European Banking Authority**
An EU agency (Paris) that produces binding technical standards and guidelines applying across all EU member states. EBA sits between BCBS (global) and national supervisors. Key EBA outputs for CCR/XVA: the RTS on Prudent Valuation (nine AVA categories for PVA), RTS on IMM, and supervisory reporting templates. EBA does not supervise individual banks — it sets the technical rules that supervisors enforce.

**ESMA — European Securities and Markets Authority**
The EU securities regulator (Paris). Less central to CCR methodology than EBA, but relevant for trade reporting and clearing obligations under EMIR. EMIR is ESMA's primary rulebook for OTC derivatives.

**EGIM — ECB Guide to Internal Models**
Not a separate body — it is the ECB's supervisory guidance document for how IMM (and other internal models) must be built and maintained. The CCR chapter (updated February 2024) specifies ECB expectations on risk factor coverage, calibration, MPOR, backtesting, governance, and proxy methodology. "EGIM compliance" in practice means your methodology documentation can point to a specific EGIM paragraph for every modelling choice. A methodology change that cannot be mapped to EGIM risks generating a supervisory finding.

---

### UK

**PRA — Prudential Regulation Authority**
The UK's prudential supervisor. A subsidiary of the Bank of England (it sits inside the Bank's governance structure). The PRA authorises and supervises banks, building societies, credit unions, insurers, and major investment firms. Before Brexit, large UK banks with significant EU subsidiaries were jointly supervised by the ECB (EU entities) and the PRA (UK entity). Post-Brexit, UK entities are PRA-supervised only; EU subsidiaries fall to the ECB.

The PRA transposes Basel rules into UK law via the PRA Rulebook and Supervisory Statements (SSs). SS12/13 on IMM is the PRA's CCR-specific supervisory statement — the UK equivalent of EGIM. The UK is currently implementing Basel IV under the label "UK Basel 3.1," with a phased timeline that differs from the EU's CRR3.

**FCA — Financial Conduct Authority**
The UK's conduct regulator, a separate body from the PRA. Where the PRA cares about financial soundness (prudential), the FCA cares about how firms treat customers and whether markets are fair (conduct). For CCR/XVA methodology, FCA is not a primary stakeholder — that is the PRA. FCA matters more in retail, asset management, and market conduct contexts.

---

### US (for reference)

**Fed — Federal Reserve**
Supervises bank holding companies and state member banks; sets US capital rules (US Basel implementation, which is still catching up to FRTB).

**OCC — Office of the Comptroller of the Currency**
Supervises nationally chartered banks — those with "National" or "N.A." in their name (JPMorgan Chase N.A., Bank of America N.A.).

**FDIC — Federal Deposit Insurance Corporation**
Supervises state-chartered non-member banks. Also provides deposit insurance and handles failed-bank resolution.

---

### Key Frameworks

**Basel I / II / III / IV**
The iterative sequence of global capital accords. Basel I (1988): simple risk weights. Basel II (2004): introduced IRB and IMM. Basel III (2010–2017): post-crisis response — LCR, NSFR, leverage ratio, CVA capital, SA-CCR. Basel IV (2017 finalisation): adds the 72.5% output floor, revises SA and IRB floors, finalises FRTB. "Basel IV" is industry terminology; BCBS calls it "Basel III finalisation."

**CRR / CRD — Capital Requirements Regulation / Directive**
The EU's transposition of Basel rules into law. CRR is directly applicable across all EU member states; CRD is implemented via national legislation. CRR3/CRD VI (2024) transposes Basel IV including the output floor, phased from January 2025.

**FRTB — Fundamental Review of the Trading Book**
A comprehensive overhaul of market risk capital (BCBS d457, 2019). FRTB-CVA is the new CVA capital framework within FRTB, replacing the Basel III CVA capital charge. Two approaches: BA-CVA (formula-driven, simpler, more punitive) and SA-CVA (sensitivity-based, lower capital, requires capable CVA engine and regulatory approval).

**EMIR — European Market Infrastructure Regulation**
The EU regulation implementing the G20 OTC derivatives reforms: mandatory central clearing for standardised derivatives, mandatory margin for uncleared trades (UMR), and trade reporting. Directly affects CCR because cleared trades have lower MPOR (5 days vs 10 days uncleared), and UMR introduces mandatory IM for large counterparties.

**UMR — Uncleared Margin Rules**
Phase-in rules requiring bilateral initial margin for non-cleared OTC derivatives above an AANA (Average Aggregate Notional Amount) threshold. Phased in from 2016 to 2022 across six phases, AANA threshold falling from €3tn (Phase 1) to €8bn (Phase 6). Banks above threshold must exchange IM under ISDA's SIMM model. Meridian in the walkthrough is below Phase 6 — hence no IM required.

**IFRS 13 — Fair Value Measurement**
The accounting standard requiring CVA and DVA to be included in the fair value of derivatives. This is why DVA produces accounting P&L (a gain when a bank's own credit worsens) even though it is stripped out from regulatory capital by the "DVA filter."

---

### Quick reference table

| Acronym | Full name | What it does |
|---|---|---|
| BIS | Bank for International Settlements | Hosts BCBS; no direct supervisory power |
| BCBS | Basel Committee on Banking Supervision | Writes global capital standards |
| FSB | Financial Stability Board | Systemic risk monitoring; drove OTC derivatives reform |
| ECB | European Central Bank | Supervises ~110 significant Eurozone banks (SSM); monetary policy |
| SSM | Single Supervisory Mechanism | ECB's supervisory arm for significant institutions |
| EBA | European Banking Authority | EU technical standards (BTS, RTS); no direct supervision |
| ESMA | European Securities Markets Authority | EU securities regulation; EMIR enforcement |
| EGIM | ECB Guide to Internal Models | ECB's detailed IMM expectations document |
| PRA | Prudential Regulation Authority | UK prudential supervisor (subsidiary of Bank of England) |
| FCA | Financial Conduct Authority | UK conduct regulator (separate from PRA) |
| Fed | Federal Reserve | US monetary policy + holding company supervision |
| OCC | Office of the Comptroller of the Currency | US nationally chartered bank supervisor |
| FDIC | Federal Deposit Insurance Corporation | US state bank supervisor + deposit insurance |
| CRR/CRD | Capital Requirements Regulation/Directive | EU Basel transposition |
| FRTB | Fundamental Review of the Trading Book | Market risk + CVA capital overhaul |
| EMIR | European Market Infrastructure Regulation | EU OTC derivatives reform |
| UMR | Uncleared Margin Rules | Mandatory bilateral IM for large counterparties |
| AANA | Average Aggregate Notional Amount | Threshold metric that determines UMR applicability |
| IFRS 13 | Fair Value Measurement | Accounting standard requiring CVA/DVA in fair value |
