# AI risk register

Drafted at Station 01 (Transformer). Fill it in for Delivery Copilot here; keep the version for your real work project private.

```
AI RISK REGISTER

ID | Risk | Category | Likelihood (L/M/H) | Impact (L/M/H) | Mitigation | Owner | Status
R1 | Model gives confident wrong answers | Quality | | | Retrieval with citations; evaluation set; human review for high-stakes cases | |
R2 | Personal or confidential data sent to a model or logged | Privacy | | | Redaction; access controls; vendor terms; retention policy | |
R3 | Inference cost exceeds budget at scale | Cost | | | Cost model; usage limits; alerts; smaller model | |
R4 | Required data unavailable or unusable | Data | | | Early data readiness check; legal review | |
R5 | Prompt injection or misuse | Security | | | Input handling; red-team tests; output filters | |
R6 | Quality drifts after launch | Operations | | | Monitoring; sampled reviews; re-evaluation cadence | |
R7 | Users over-trust the output | Adoption | | | Interface cues; training; show sources and confidence | |
R8 | Long context makes responses slow or costly | Performance | | | Chunking and retrieval; latency targets; load tests | |
```
