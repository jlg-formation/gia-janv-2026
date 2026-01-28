---
id: "002"
slug: "langage-normalise"
status: "cloture"
created_at: "2026-01-28T11:00:00Z"
updated_at: "2026-01-28T11:30:00Z"
related_docs:
  - "04-decisions-architectures"
  - "05-specifications-techniques"
  - "06-codage-guidelines"
original_source: "001-langage.md"
---

# Clarification : Choix du langage de développement

## Contexte

Une clarification utilisateur (format libre) a été détectée dans `001-langage.md` indiquant :

> « Le langage de développement est Typescript React »

Cependant, le document `04-decisions-architectures.md` (ADR-001) a déjà décidé **Python 3.11+** comme langage principal.

Cette clarification est **postérieure** à l'ADR-001 (numéro de séquence 002 > 001 implicite de l'ADR). Selon la règle **C7 - Précédence**, elle **prévaut** sur la décision antérieure.

## Impact

Si TypeScript/React est confirmé, les documents suivants doivent être mis à jour :
- `04-decisions-architectures.md` : ADR-001 à modifier (langage)
- `04-decisions-architectures.md` : ADR-003 (embedding) et ADR-004 (LLM) à adapter
- `05-specifications-techniques.md` : stack technique à adapter

## Question 1 : Confirmez-vous le changement de langage vers TypeScript/React ?

- [x] **A) Oui, TypeScript React** — Le frontend et potentiellement le backend (Node.js) seront en TypeScript
- [ ] **B) Non, conserver Python** — Ignorer la clarification 001-langage.md, Python reste le choix
- [ ] **C) Hybride** — Frontend React/TypeScript + Backend Python (API)
- [ ] **D) Autre** : _______________________
- [ ] **E) Laisser l'IA décider et justifier son choix**

## Question 2 : Si TypeScript/React, quelle architecture backend ?

- [x] **A) Node.js (Express/Fastify)** — Backend JS complet
- [ ] **B) Next.js (API Routes)** — Full-stack React
- [ ] **C) Python (FastAPI) + React frontend** — Hybride séparé
- [ ] **D) Autre** : _______________________
- [ ] **E) Non applicable (Python seul)**
- [ ] **F) Laisser l'IA décider et justifier son choix**

---

## Réponses utilisateur

<!-- INSTRUCTIONS : Cochez vos réponses en remplaçant [ ] par [x] -->
<!-- Si vous choisissez "Autre", complétez la ligne -->
<!-- Sauvegardez le fichier puis relancez le prompt -->

---

## Décision finale

**Choix retenu** : 

- **Q1** : A) TypeScript React
- **Q2** : A) Node.js (Express/Fastify)

**Résumé** : Le projet RAG sera développé en **TypeScript** avec :
- **Frontend** : React (ou framework basé React)
- **Backend** : Node.js avec Express ou Fastify

**Justification** :
L'utilisateur a explicitement choisi TypeScript/React dans la clarification initiale (`001-langage.md`). Cette décision prévaut sur l'ADR-001 (Python) précédemment généré, conformément à la règle **C7 - Précédence**.

**Conséquences** :
- Le document `04-decisions-architectures.md` doit être régénéré pour refléter la stack TypeScript/Node.js
- L'écosystème NLP/LLM en JavaScript est moins mature que Python, mais des alternatives existent :
  - `langchain.js` pour l'orchestration RAG
  - `@xenova/transformers` pour les embeddings côté client/serveur
  - APIs OpenAI/Anthropic via SDK TypeScript
- La base vectorielle peut utiliser ChromaDB (client JS) ou Pinecone/Qdrant via API REST

**Documents impactés** :
- `04-decisions-architectures.md` → statut `outdated`, à régénérer
- `05-specifications-techniques.md` → à générer avec la nouvelle stack

<!-- Section remplie automatiquement par l'IA après clôture -->
<!-- Ne pas modifier manuellement -->
