# Sadak Sakshi 
### "The Road That Cannot Be Cheated"

A blockchain-based accountability system for public infrastructure — following every PWD road
from the material that built it to the years it remains under a contractually defined liability
period.

---

## The Problem

Public road and infrastructure projects in India fail in two distinct, well-documented ways, both
stemming from the same root cause: there is no tamper-proof record connecting a contractor's
promises to what actually happens on the ground.

**1. Construction-stage fraud** — Contractors are sanctioned for specific material grades
(bitumen, cement, steel) but can substitute cheaper substandard material and pocket the
difference. By the time the road fails — often within a single monsoon — the contractor has
already been paid, and there is no record proving what was actually used.

**2. Post-construction maintenance neglect** — Every PWD contract legally includes a Defect
Liability Period (DLP), during which the contractor must fix defects for free. The exact duration
is contract-specific — NHAI's standard EPC agreements, as one example, typically specify 5 years
for flexible pavement roads and 10 years for rigid pavement, bridges, and tunnels. In practice,
citizen complaints get lost in bureaucracy and this window quietly expires unenforced. PWD
departments in Goa and Kerala have both taken public enforcement action against contractors over
exactly this failure in recent years.

Sadak Sakshi does not invent new bureaucracy — it automates enforcement of obligations (retention
money, performance security, defect liability) that already exist in standard PWD and CPWD
contract clauses, but are currently tracked manually and inconsistently.

---

## What Blockchain Actually Guarantees Here

> Blockchain guarantees the integrity of submitted records, not the truth of the physical world.
> Our verification layer is therefore deliberately separated from the ledger — evidence enters
> through engineers, labs, and citizens; the ledger's job is to make that evidence tamper-evident
> and tie it to contractual consequences, not to independently know whether a road has a pothole.

This is the central architectural honesty of the system, and it should be the first thing said
when someone asks "how does blockchain know the material is real?"

---

## The Contract, Modelled Properly

A real PWD contract is not one document — it is a bundle with a strict priority order: the
Schedule of Quantities, then Particular/Special specifications, then Drawings, then CPWD
specifications, then the governing Indian Standard (IS/MoRTH clauses). Road and bridge material
requirements specifically are governed by MoRTH's *Specification for Road and Bridge Works* (the
Orange Book), which fixes aggregate grading and size, material grade, and quality-test tolerances
section by section — e.g. Section 400 for sub-base and non-bituminous bases, Section 500 for
bituminous bases and surface courses.

Sadak Sakshi mirrors this structure on-chain instead of collapsing it into a single generic
"material batch" record, so every accountability check is traceable to an actual contract clause.

### Data model

| Record | What it captures | Source in the real contract |
|---|---|---|
| Schedule of Quantities item | Each individual work item (e.g. sub-base, Ch. 0+000–2+500) | The Schedule of Quantities — top of the document priority order |
| Material spec reference | Required aggregate grading/size, material grade, tolerance — set once at tender award | MoRTH clause for that work item (e.g. Section 400) |
| Material batch log | Batch cert hash, declared grading/grade — checked against the spec reference at logging time | Supplier lab certificate |
| Source inspection event | Record of an Engineer-in-Charge inspection at the quarry/plant | Contractual right of inspection at material source |
| Quality test result | LA Abrasion Value, sieve/grading analysis, compaction density, pass/fail vs. tolerance | Standard field/lab quality-control tests |
| Verification / oracle event | A signed attestation from an engineer, lab, or (later) an IoT sensor — the point where a real-world fact is admitted into the ledger | The physical-to-digital trust boundary; not a blockchain guarantee in itself |
| Defect report | Citizen-reported defects, GPS/photo, multi-source verification signal | Right to report; does not by itself establish contractor liability |
| Dispute & settlement | Challenge window, evidence submission, retest/re-verification, final authorization, then auto-release or auto-slash | Defect Liability Period + retention money / performance security clauses |

This gives the settlement logic two independent, clause-grounded triggers instead of one vague
one: material that fails its MoRTH tolerance at logging time, and defects left unresolved past the
contractually mandated DLP window — both gated by a dispute window rather than settling on a
single, potentially contested input.

---

## How It Works

1. **Tender, Schedule of Quantities & Stake** — A project is registered on-chain from the awarded
   tender data, work items from the Schedule of Quantities are linked to it, and the contractor
   posts a performance bond (stake) into a smart contract escrow. This stake is a blockchain
   representation of the retention money / performance security already mandated in real PWD
   contracts, not a legal replacement for it.
2. **Spec Registry — Clause Anchoring** — For each work item, the required aggregate
   grading/size, material grade, and tolerance are written on-chain against their governing MoRTH
   clause (e.g. Section 400 for sub-base), fixed at tender award, not set by the contractor later.
3. **Material Provenance & Verification Layer** — Material batches are logged against the project
   and checked against the Spec Registry entry for that work item. Source inspections and
   quality-test results are captured as signed attestations from engineers/labs (the "oracle"
   step), which the ledger then makes tamper-evident. Photos, certificates, and test reports live
   on IPFS; the blockchain preserves the content hash and history, so a file can be re-uploaded
   but not secretly swapped while keeping the same hash.
4. **Handover & Maintenance Timer** — On project completion, the Defect Liability Period end-date
   (read from the actual contract) is written on-chain, starting a public, tamper-proof countdown.
5. **Citizen Defect Reporting** — During the DLP, citizens report defects via photo + GPS.
   Multiple independent reports of the same defect location form a multi-source verification
   signal — evidence that a defect exists, not a determination of contractor liability, which is
   assessed separately before settlement.
6. **Dispute Resolution** — Before any stake moves, a defined challenge window lets the
   contractor dispute a finding (e.g. request a retest), submit evidence, and trigger independent
   re-verification. This is what prevents a single, potentially incorrect data point from
   triggering an irreversible financial penalty.
7. **Automatic Settlement** — Once the verification conditions are satisfied — unchallenged, or a
   dispute resolved — the stake is settled automatically: released to the contractor on compliant
   delivery, or slashed to fund third-party repair / a citizen bounty on confirmed failure. No
   manual intervention is required *after* these predefined conditions are met.

### Honest scoping note

Phase 1 (this build) uses verified manual entry for material certification — i.e., site engineers
log batch data against supplier certificates, signed as attestations. Phase 2 integrates IoT
sensors and direct lab-API feeds to automate that attestation step. This is stated openly rather
than hidden, since no blockchain system can independently verify a physical fact without a
trusted data source feeding it.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Blockchain | Polygon PoS (mainnet) / Polygon Amoy (testnet) | EVM-compatible, low gas fees, genuinely decentralised public chain — not a private ledger dressed up as one |
| Smart Contracts | Solidity + Hardhat + OpenZeppelin | Hardhat for local testing before deploy; OpenZeppelin's audited AccessControl and ReentrancyGuard modules for role permissions and fund-safety |
| Decentralised Storage | IPFS via Pinata | Stores defect photos, certificates and test reports off-chain; the blockchain preserves each file's content hash and history, so a file can be re-uploaded but not secretly swapped while keeping the same hash |
| Indexing | The Graph (Subgraph Studio) | Indexes on-chain events so the public dashboard can query project/defect history quickly |
| Off-chain Logic | Node.js + Express | Handles consensus-counting for defect reports and attestation intake before triggering on-chain calls |
| Frontend | Next.js + React + ethers.js / wagmi + Tailwind | Role-based views for PWD officials, contractors, and citizens |
| Security Auditing | Slither (static analysis) | Automated vulnerability scanning on contracts before deployment |

### Smart contract modules

| Module | Responsibility |
|---|---|
| `ProjectRegistry` | Project ID, contractor, stake amount, DLP end date |
| `SpecRegistry` | Per work-item material spec — MoRTH clause reference, grading/size, tolerance — set once at tender award |
| `MaterialLog` | Records batch certs and checks them against `SpecRegistry` at write-time; also records source inspections and quality-test results |
| `OracleAdapter` | Accepts cryptographically signed attestations from engineers/labs (and later IoT) and admits them as trusted inputs — the trust boundary between the physical world and the ledger |
| `DefectReport` | Citizen defect submissions, GPS/photo, consensus threshold, DLP-window status |
| `DisputeResolution` | Contractor challenge window, evidence submission, retest requests, independent re-verification, deadline, final settlement authorization — gates `SettlementLogic` before funds move |
| `SettlementLogic` | Executes release or slash once `DisputeResolution` confirms the outcome (or the challenge window lapses unchallenged) |

---

## Roadmap

| Phase | Milestone | Key Deliverables |
|---|---|---|
| Phase 1 (0–3 months) | Core Protocol | `ProjectRegistry` + `SpecRegistry` (MoRTH clauses seeded per work category) + staking contract; `MaterialLog` with spec-match checking; `OracleAdapter` accepting signed engineer/lab attestations (manual signing for this phase); defect reporting with GPS/photo; multi-source verification signal; a contractor dispute window with PWD-official override gating settlement; public dashboard (3 role-based views) |
| Phase 2 (3–9 months) | Verification Layer | IoT sensor / RFID integration for automated `OracleAdapter` inputs; direct lab-API feeds for test results; wallet-based reputation to reduce spam/Sybil defect reports; expanded `DisputeResolution` with independent third-party verification |
| Phase 3 (9–15 months) | Pilot Deployment | Partner with a single PWD division or municipal ward for a live pilot on real (not simulated) projects; onboard real contractors and citizen reporters; refine consensus thresholds against real-world report volume |
| Phase 4 (15–24 months) | Scale & Interoperability | Layer-2 / batched transactions to reduce gas costs at city scale; integration with CPPP / state e-procurement portals for automatic project onboarding; expand beyond roads to bridges, streetlights, and water infrastructure |

---

## Status

This README reflects the current design of the project, not a finished build. Nothing here is
deployed yet — Phase 1 above is the near-term build target.

---

**Sadak Sakshi — "The Road That Cannot Be Cheated"**
सड़क साक्षी
