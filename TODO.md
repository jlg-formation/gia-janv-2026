# TODO — RAG-TP (Retrieval-Augmented Generation)

> Dernière mise à jour : 2026-01-28 16:30
> Progression : 3/38 tâches (8%)

## 🎯 Objectif actuel

**MVP Démontrable** : Avoir un pipeline RAG fonctionnel end-to-end permettant d'ingérer des documents, de poser une question et d'obtenir une réponse contextualisée avec affichage des sources.

---

## 🔥 Priorité haute (Quick Wins / Démontrable)

### Phase 0 — Setup & Infrastructure

- [x] `id001` — Créer la structure de dossiers du projet (frontend, backend, shared, data)
  - 📁 Fichiers : `project/frontend/`, `project/backend/`, `project/shared/`, `project/data/`
  - 🔗 Dépend de : —
  - 📄 Réf : [05-specifications-techniques.md](docs/05-specifications-techniques.md) (Structure du projet)

- [x] `id002` — Initialiser le backend Node.js avec TypeScript et Express
  - 📁 Fichiers : `project/backend/package.json`, `project/backend/tsconfig.json`, `project/backend/src/index.ts`
  - 🔗 Dépend de : `id001`
  - 📄 Réf : [04-decisions-architectures.md](docs/04-decisions-architectures.md) (ADR-003)

- [x] `id003` — Initialiser le frontend React avec Vite et TypeScript
  - 📁 Fichiers : `project/frontend/package.json`, `project/frontend/tsconfig.json`, `project/frontend/vite.config.ts`
  - 🔗 Dépend de : `id001`
  - 📄 Réf : [04-decisions-architectures.md](docs/04-decisions-architectures.md) (ADR-002)

- [ ] `id004` — Créer le fichier `.env.example` avec les variables d'environnement
  - 📁 Fichiers : `project/.env.example`
  - 🔗 Dépend de : `id001`
  - 📄 Réf : [09-integration-deploiement.md](docs/09-integration-deploiement.md)

- [ ] `id005` — Créer le fichier `docker-compose.yml` pour ChromaDB
  - 📁 Fichiers : `project/docker-compose.yml`
  - 🔗 Dépend de : `id001`
  - 📄 Réf : [04-decisions-architectures.md](docs/04-decisions-architectures.md) (ADR-004)

---

## 🚧 En cours

_(Aucune tâche en cours)_

---

## 📋 Backlog

### Phase 1 — Backend Core (Ingestion & Indexation)

- [ ] `id010` — Définir les types partagés TypeScript (Document, Chunk, Embedding, SearchResult)
  - 📁 Fichiers : `project/backend/src/types/index.ts`, `project/shared/types/index.ts`
  - 🔗 Dépend de : `id002`
  - 📄 Réf : [05-specifications-techniques.md](docs/05-specifications-techniques.md) (Modèle de données)

- [ ] `id011` — Créer le module de configuration (config/index.ts avec Zod)
  - 📁 Fichiers : `project/backend/src/config/index.ts`
  - 🔗 Dépend de : `id002`
  - 📄 Réf : [05-specifications-techniques.md](docs/05-specifications-techniques.md) (Stack technique)

- [ ] `id012` — Implémenter le service Loader (chargement de fichiers .txt et .md)
  - 📁 Fichiers : `project/backend/src/services/ingestion/loader.ts`
  - 🔗 Dépend de : `id010`, `id011`
  - 📄 Réf : [03-specifications-fonctionnelles.md](docs/03-specifications-fonctionnelles.md) (F-001)
  - 🧪 Stories : US-001

- [ ] `id013` — Implémenter le service Chunker (découpage en chunks avec overlap)
  - 📁 Fichiers : `project/backend/src/services/ingestion/chunker.ts`
  - 🔗 Dépend de : `id010`
  - 📄 Réf : [03-specifications-fonctionnelles.md](docs/03-specifications-fonctionnelles.md) (F-002)
  - 🧪 Stories : US-002

- [ ] `id014` — Définir l'interface Embedder et créer l'implémentation OpenAI
  - 📁 Fichiers : `project/backend/src/services/embedding/embedder.ts`, `project/backend/src/services/embedding/openai-embedder.ts`
  - 🔗 Dépend de : `id010`, `id011`
  - 📄 Réf : [03-specifications-fonctionnelles.md](docs/03-specifications-fonctionnelles.md) (F-003), [04-decisions-architectures.md](docs/04-decisions-architectures.md) (ADR-005)

- [ ] `id015` — Implémenter le repository VectorStore pour ChromaDB
  - 📁 Fichiers : `project/backend/src/repositories/vector-store.ts`
  - 🔗 Dépend de : `id010`, `id005`
  - 📄 Réf : [03-specifications-fonctionnelles.md](docs/03-specifications-fonctionnelles.md) (F-004), [04-decisions-architectures.md](docs/04-decisions-architectures.md) (ADR-004)

- [ ] `id016` — Implémenter le repository MetadataStore pour SQLite
  - 📁 Fichiers : `project/backend/src/repositories/metadata-store.ts`
  - 🔗 Dépend de : `id010`
  - 📄 Réf : [05-specifications-techniques.md](docs/05-specifications-techniques.md) (Stack technique)

- [ ] `id017` — Créer le service d'ingestion complet (orchestration Loader → Chunker → Embedder → Store)
  - 📁 Fichiers : `project/backend/src/services/ingestion/ingestion-service.ts`
  - 🔗 Dépend de : `id012`, `id013`, `id014`, `id015`, `id016`
  - 📄 Réf : [03-specifications-fonctionnelles.md](docs/03-specifications-fonctionnelles.md) (F-001 à F-004)
  - 🧪 Stories : US-001, US-002, US-003

- [ ] `id018` — Créer la route API POST /api/ingest
  - 📁 Fichiers : `project/backend/src/api/routes/ingest.ts`
  - 🔗 Dépend de : `id017`
  - 📄 Réf : [05-specifications-techniques.md](docs/05-specifications-techniques.md) (Spécifications API)
  - 🧪 Stories : US-001, US-004

### Phase 2 — Backend Core (Recherche & Génération)

- [ ] `id020` — Implémenter le service Searcher (recherche sémantique top-k)
  - 📁 Fichiers : `project/backend/src/services/search/searcher.ts`
  - 🔗 Dépend de : `id014`, `id015`
  - 📄 Réf : [03-specifications-fonctionnelles.md](docs/03-specifications-fonctionnelles.md) (F-005)
  - 🧪 Stories : US-005, US-006, US-007

- [ ] `id021` — Implémenter le PromptBuilder (construction du prompt avec contexte)
  - 📁 Fichiers : `project/backend/src/services/generation/prompt-builder.ts`
  - 🔗 Dépend de : `id010`
  - 📄 Réf : [03-specifications-fonctionnelles.md](docs/03-specifications-fonctionnelles.md) (F-006)

- [ ] `id022` — Implémenter le LLMCaller (appel OpenAI GPT-4o-mini)
  - 📁 Fichiers : `project/backend/src/services/generation/llm-caller.ts`
  - 🔗 Dépend de : `id010`, `id011`
  - 📄 Réf : [03-specifications-fonctionnelles.md](docs/03-specifications-fonctionnelles.md) (F-007), [04-decisions-architectures.md](docs/04-decisions-architectures.md) (ADR-006)

- [ ] `id023` — Créer le mode mock pour le LLM (tests sans API)
  - 📁 Fichiers : `project/backend/src/services/generation/mock-llm-caller.ts`
  - 🔗 Dépend de : `id022`
  - 📄 Réf : [04-decisions-architectures.md](docs/04-decisions-architectures.md) (ADR-006)

- [ ] `id024` — Créer le service Generation complet (orchestration Search → Prompt → LLM)
  - 📁 Fichiers : `project/backend/src/services/generation/generation-service.ts`
  - 🔗 Dépend de : `id020`, `id021`, `id022`
  - 📄 Réf : [03-specifications-fonctionnelles.md](docs/03-specifications-fonctionnelles.md) (F-006, F-007)

- [ ] `id025` — Créer la route API POST /api/query
  - 📁 Fichiers : `project/backend/src/api/routes/query.ts`
  - 🔗 Dépend de : `id024`
  - 📄 Réf : [05-specifications-techniques.md](docs/05-specifications-techniques.md) (Spécifications API)
  - 🧪 Stories : US-005, US-006, US-010

- [ ] `id026` — Créer les routes API GET /api/status et GET /api/health
  - 📁 Fichiers : `project/backend/src/api/routes/status.ts`
  - 🔗 Dépend de : `id015`, `id016`
  - 📄 Réf : [05-specifications-techniques.md](docs/05-specifications-techniques.md) (Spécifications API)
  - 🧪 Stories : US-009

- [ ] `id027` — Configurer le router Express et assembler les routes
  - 📁 Fichiers : `project/backend/src/api/index.ts`
  - 🔗 Dépend de : `id018`, `id025`, `id026`
  - 📄 Réf : [05-specifications-techniques.md](docs/05-specifications-techniques.md)

### Phase 3 — Frontend MVP

- [ ] `id030` — Créer le service API client (services/api.ts)
  - 📁 Fichiers : `project/frontend/src/services/api.ts`
  - 🔗 Dépend de : `id003`
  - 📄 Réf : [05-specifications-techniques.md](docs/05-specifications-techniques.md)

- [ ] `id031` — Définir les types frontend (types/index.ts)
  - 📁 Fichiers : `project/frontend/src/types/index.ts`
  - 🔗 Dépend de : `id003`
  - 📄 Réf : [05-specifications-techniques.md](docs/05-specifications-techniques.md)

- [ ] `id032` — Créer le composant QueryInput (saisie de question)
  - 📁 Fichiers : `project/frontend/src/components/QueryInput.tsx`
  - 🔗 Dépend de : `id031`
  - 📄 Réf : [01-personas-parcours.md](docs/01-personas-parcours.md) (Parcours Question → Réponse)
  - 🧪 Stories : US-005

- [ ] `id033` — Créer le composant ResultDisplay (affichage réponse)
  - 📁 Fichiers : `project/frontend/src/components/ResultDisplay.tsx`
  - 🔗 Dépend de : `id031`
  - 📄 Réf : [01-personas-parcours.md](docs/01-personas-parcours.md)
  - 🧪 Stories : US-006

- [ ] `id034` — Créer le composant SourceList (affichage des sources)
  - 📁 Fichiers : `project/frontend/src/components/SourceList.tsx`
  - 🔗 Dépend de : `id031`
  - 📄 Réf : [01-personas-parcours.md](docs/01-personas-parcours.md)
  - 🧪 Stories : US-006, US-010

- [ ] `id035` — Créer le hook useQuery (gestion état requête)
  - 📁 Fichiers : `project/frontend/src/hooks/useQuery.ts`
  - 🔗 Dépend de : `id030`, `id031`
  - 📄 Réf : [05-specifications-techniques.md](docs/05-specifications-techniques.md)

- [ ] `id036` — Assembler App.tsx avec les composants
  - 📁 Fichiers : `project/frontend/src/App.tsx`, `project/frontend/src/main.tsx`
  - 🔗 Dépend de : `id032`, `id033`, `id034`, `id035`
  - 📄 Réf : [05-specifications-techniques.md](docs/05-specifications-techniques.md)

### Phase 4 — Tests & Qualité

- [ ] `id040` — Configurer Vitest pour le backend
  - 📁 Fichiers : `project/backend/vitest.config.ts`, `project/backend/package.json`
  - 🔗 Dépend de : `id002`
  - 📄 Réf : [08-tests-verification.md](docs/08-tests-verification.md)

- [ ] `id041` — Écrire les tests unitaires pour le Chunker
  - 📁 Fichiers : `project/backend/src/services/ingestion/__tests__/chunker.test.ts`
  - 🔗 Dépend de : `id013`, `id040`
  - 📄 Réf : [08-tests-verification.md](docs/08-tests-verification.md)

- [ ] `id042` — Écrire les tests unitaires pour le Searcher
  - 📁 Fichiers : `project/backend/src/services/search/__tests__/searcher.test.ts`
  - 🔗 Dépend de : `id020`, `id040`
  - 📄 Réf : [08-tests-verification.md](docs/08-tests-verification.md)

- [ ] `id043` — Configurer ESLint et Prettier pour le projet
  - 📁 Fichiers : `project/.eslintrc.js`, `project/.prettierrc`
  - 🔗 Dépend de : `id002`, `id003`
  - 📄 Réf : [06-codage-guidelines.md](docs/06-codage-guidelines.md)

### Phase 5 — Documentation & Démo

- [ ] `id050` — Créer le README.md principal avec instructions d'installation
  - 📁 Fichiers : `project/README.md`
  - 🔗 Dépend de : `id001`
  - 📄 Réf : [00-vision.md](docs/00-vision.md)
  - 🧪 Stories : US-008

- [ ] `id051` — Ajouter un corpus de documents exemple dans data/documents/
  - 📁 Fichiers : `project/data/documents/*.md`
  - 🔗 Dépend de : `id001`
  - 📄 Réf : [00-vision.md](docs/00-vision.md) (Risques et hypothèses)

- [ ] `id052` — Créer un script de démo CLI (ou npm script)
  - 📁 Fichiers : `project/scripts/demo.ts` ou `project/package.json`
  - 🔗 Dépend de : `id027`, `id036`
  - 📄 Réf : [00-vision.md](docs/00-vision.md) (Critères de succès)
  - 🧪 Stories : US-008

---

## ✅ Terminé

- [x] `id001` — Créer la structure de dossiers du projet _(2026-01-28)_
  - 📁 Fichiers : `project/frontend/`, `project/backend/`, `project/shared/`, `project/data/`
- [x] `id002` — Initialiser le backend Node.js avec TypeScript et Express _(2026-01-28)_
  - 📁 Fichiers : `project/backend/package.json`, `project/backend/tsconfig.json`, `project/backend/src/index.ts`
- [x] `id003` — Initialiser le frontend React avec Vite et TypeScript _(2026-01-28)_
  - 📁 Fichiers : `project/frontend/package.json`, `project/frontend/tsconfig.json`, `project/frontend/vite.config.ts`

---

## 📊 Métriques

| Phase | Total | Terminées | En cours | À faire |
|-------|-------|-----------|----------|---------|
| Phase 0 — Setup | 5 | 3 | 0 | 2 |
| Phase 1 — Ingestion | 9 | 0 | 0 | 9 |
| Phase 2 — Recherche | 8 | 0 | 0 | 8 |
| Phase 3 — Frontend | 7 | 0 | 0 | 7 |
| Phase 4 — Tests | 4 | 0 | 0 | 4 |
| Phase 5 — Démo | 3 | 0 | 0 | 3 |
| **TOTAL** | **38** | **3** | **0** | **35** |

---

## 🔍 Notes

### Dépendances techniques
- **Bun 1.x** requis (remplace Node.js selon clarification 004)
- **Docker** requis pour ChromaDB
- **Clé API OpenAI** requise (ou mode mock)

### Prochaines actions recommandées
1. Compléter `id004` (.env.example) et `id005` (docker-compose.yml) pour finaliser Phase 0
2. Puis `id010` et `id011` (types et config) pour débloquer Phase 1
3. Focus sur le pipeline ingestion (`id012` → `id017` → `id018`)
