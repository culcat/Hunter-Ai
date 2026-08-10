# Pull Request Title: [feat/fix/test]: [Task Description]

## 🤖 Agent Metadata
- **Author Sub-Agent**: `frontend-agent` | `backend-agent` | `qa-agent` | `orchestrator-agent`
- **Worker Base Model**: **Gemini 3.6**
- **Target Branch**: `master`
- **Source Feature Branch**: `[feature|fix|test]/[domain]-[task-name]`

---

## 📝 Task Description & Motivation
[Describe the problem solved or feature implemented by this Pull Request]

---

## 🛠 Proposed Code Changes
- [File 1]: Summary of changes
- [File 2]: Summary of changes

---

## 🧪 Automated Verification & Test Results
- [x] `yarn type-check` (Passed cleanly with 0 TypeScript errors)
- [x] `yarn lint` (Passed cleanly with 0 lint violations)
- [x] `yarn test` (Unit/Integration test suite executed successfully)

```text
[Paste clean test execution logs here]
```

---

## 🔍 Opus 4.6 Code Reviewer Gate

- [ ] Reviewed by **Code-Reviewer Agent (Model: Opus 4.6)**
- [ ] Strict TypeScript verification complete (No `any` usage)
- [ ] SCSS module and design token compliance verified
- [ ] DTO validation & NestJS architecture standards met
- [ ] Security audit (Cookie storage & credentials safety) passed

**Review Decision**: `PENDING` | `APPROVED` | `CHANGES_REQUESTED`
