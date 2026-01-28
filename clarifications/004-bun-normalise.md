---
id: "004"
slug: "bun-normalise"
status: "cloture"
created_at: "2026-01-28T14:00:00Z"
updated_at: "2026-01-28T14:30:00Z"
related_docs:
  - "04-decisions-architectures"
  - "05-specifications-techniques"
  - "06-codage-guidelines"
  - "09-integration-deploiement"
original_source: "003-bun.md"
---

# Clarification : Runtime JavaScript - Bun au lieu de Node.js/npm

## Contexte

Une clarification utilisateur (format libre) a été détectée dans `003-bun.md` indiquant :

> « Je veux pas node et npm, mais bun. »

Cette clarification est **postérieure** à la clarification `002-langage-normalise.md` qui avait validé Node.js (Express/Fastify) comme backend.

Selon la règle **C7 - Précédence**, cette clarification (004 > 002) **prévaut** sur la décision antérieure.

### Qu'est-ce que Bun ?

**Bun** est un runtime JavaScript/TypeScript moderne qui remplace à la fois :
- **Node.js** (runtime)
- **npm/yarn/pnpm** (gestionnaire de paquets)
- **webpack/esbuild** (bundler intégré)

Avantages de Bun :
- Performances supérieures (jusqu'à 4x plus rapide que Node.js)
- Support TypeScript natif (sans transpilation)
- Gestionnaire de paquets ultra-rapide
- API compatible avec la plupart des modules Node.js
- Bundler intégré

## Impact

Si Bun est confirmé, les documents suivants devront être mis à jour :
- `04-decisions-architectures.md` : ADR runtime à modifier
- `05-specifications-techniques.md` : stack technique (Bun au lieu de Node.js)
- `06-codage-guidelines.md` : commandes npm → bun
- `09-integration-deploiement.md` : pipeline CI/CD avec Bun

## Question 1 : Confirmez-vous l'utilisation de Bun comme runtime ?

- [x] **A) Oui, Bun uniquement** — Remplacer Node.js et npm par Bun partout
- [ ] **B) Non, conserver Node.js/npm** — Ignorer cette clarification
- [ ] **C) Bun pour le dev, Node.js en prod** — Bun localement, Node.js pour le déploiement (compatibilité)
- [ ] **D) Autre** : _______________________
- [ ] **E) Laisser l'IA décider et justifier son choix**

## Question 2 : Framework backend avec Bun ?

- [ ] **A) Hono** — Framework léger et rapide, natif Bun
- [ ] **B) Elysia** — Framework TypeScript-first pour Bun, très performant
- [x] **C) Express (via compatibilité)** — Garder Express, Bun le supporte
- [ ] **D) Fastify (via compatibilité)** — Garder Fastify, Bun le supporte
- [ ] **E) Autre** : _______________________
- [ ] **F) Laisser l'IA décider et justifier son choix**

---

## Réponses utilisateur

<!-- INSTRUCTIONS : Cochez vos réponses en remplaçant [ ] par [x] -->
<!-- Si vous choisissez "Autre", complétez la ligne -->
<!-- Sauvegardez le fichier puis relancez le prompt -->

---

## Décision finale

**Choix retenu** :

- **Q1** : A) Oui, Bun uniquement
- **Q2** : C) Express (via compatibilité)

**Résumé** : Le projet RAG sera développé avec **Bun** comme runtime JavaScript/TypeScript, remplaçant Node.js et npm. Le framework backend sera **Express**, exécuté via la couche de compatibilité Bun.

**Stack confirmée** :
- **Runtime** : Bun (dernière version stable)
- **Gestionnaire de paquets** : Bun (remplace npm/yarn/pnpm)
- **Backend** : Express.js (via compatibilité Bun)
- **Frontend** : React + TypeScript (bundlé avec Bun)

**Justification** :
L'utilisateur a explicitement demandé Bun pour remplacer Node.js/npm. Le choix d'Express (via compatibilité) permet de bénéficier :
- De la maturité et de l'écosystème riche d'Express
- Des performances accrues de Bun (~4x plus rapide que Node.js)
- D'une migration simplifiée (Express fonctionne nativement avec Bun)

**Conséquences** :
- Les commandes `npm` deviennent `bun` (ex: `bun install`, `bun run dev`)
- Les fichiers `package-lock.json` sont remplacés par `bun.lockb`
- Le Dockerfile utilisera l'image `oven/bun` au lieu de `node`
- La CI/CD doit installer Bun (`curl -fsSL https://bun.sh/install | bash`)

**Documents impactés** (à régénérer) :
- `04-decisions-architectures.md` → ADR runtime modifié
- `05-specifications-techniques.md` → stack Bun + Express
- `06-codage-guidelines.md` → commandes Bun
- `09-integration-deploiement.md` → pipeline CI/CD avec Bun
