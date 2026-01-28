---
agent: agent
description: Créer le fichier .env.example avec toutes les variables d'environnement du projet RAG
---

# id004 — Créer le fichier `.env.example` avec les variables d'environnement

## Objectif

Créer un fichier `.env.example` documenté à la racine du dossier `project/` contenant toutes les variables d'environnement nécessaires au fonctionnement du projet RAG (backend, ChromaDB, OpenAI, etc.).

## Contexte

Le projet RAG nécessite plusieurs configurations :
- **API OpenAI** : clé pour embeddings et génération LLM
- **ChromaDB** : connexion à la base vectorielle
- **Serveur Express** : port et niveau de log
- **Modes de fonctionnement** : mock vs production

- Réf : [docs/09-integration-deploiement.md](docs/09-integration-deploiement.md) — Section "Configuration par environnement"
- Réf : [docs/05-specifications-techniques.md](docs/05-specifications-techniques.md) — Stack technique
- Dépendances : `id001` ✅

## Pré-requis

- [x] Tâche `id001` complétée (structure de dossiers créée)
- [x] Dossier `project/` existant

## Fichiers impactés

| Fichier | Action | Description |
| ------- | ------ | ----------- |
| `project/.env.example` | Créer | Template des variables d'environnement |

## Critères d'acceptation

- [ ] Le fichier `project/.env.example` existe
- [ ] Toutes les variables sont documentées avec des commentaires explicatifs
- [ ] Les valeurs par défaut sont adaptées au développement local
- [ ] Le fichier est versionné (pas dans `.gitignore`)
- [ ] Un développeur peut copier ce fichier en `.env` et démarrer immédiatement

## Variables d'environnement requises

D'après la documentation, les variables suivantes sont nécessaires :

| Variable | Description | Valeur dev |
| -------- | ----------- | ---------- |
| `PORT` | Port du serveur Express | `3000` |
| `LOG_LEVEL` | Niveau de log (debug, info, warn, error) | `debug` |
| `OPENAI_API_KEY` | Clé API OpenAI | `sk-xxx` (placeholder) |
| `CHROMA_HOST` | Hôte ChromaDB | `localhost` |
| `CHROMA_PORT` | Port ChromaDB | `8000` |
| `LLM_PROVIDER` | Provider LLM (mock, openai) | `mock` |
| `EMBEDDING_PROVIDER` | Provider embedding (local, openai) | `local` |

## Instructions

### Étape 1 : Créer le fichier `.env.example`

**Fichier** : `project/.env.example`

```bash
# ============================================
# RAG-TP - Configuration Environnement
# ============================================
# Copier ce fichier en .env et ajuster les valeurs
# cp .env.example .env

# --------------------------------------------
# Serveur Express
# --------------------------------------------
# Port d'écoute du backend API
PORT=3000

# Niveau de log : debug | info | warn | error
LOG_LEVEL=debug

# --------------------------------------------
# OpenAI API
# --------------------------------------------
# Clé API OpenAI (requise pour embeddings et génération)
# Obtenir une clé : https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your-api-key-here

# --------------------------------------------
# ChromaDB (Base vectorielle)
# --------------------------------------------
# Hôte du serveur ChromaDB
CHROMA_HOST=localhost

# Port du serveur ChromaDB
CHROMA_PORT=8000

# --------------------------------------------
# Providers (Mode de fonctionnement)
# --------------------------------------------
# Provider LLM : mock | openai
# - mock : réponses simulées (dev sans clé API)
# - openai : appels réels à GPT-4o-mini
LLM_PROVIDER=mock

# Provider Embedding : local | openai
# - local : Transformers.js (offline, plus lent)
# - openai : API OpenAI text-embedding-ada-002
EMBEDDING_PROVIDER=local

# --------------------------------------------
# Ingestion
# --------------------------------------------
# Taille des chunks en caractères
CHUNK_SIZE=500

# Chevauchement entre chunks en caractères
CHUNK_OVERLAP=50

# --------------------------------------------
# Recherche
# --------------------------------------------
# Nombre de résultats retournés par recherche
TOP_K=5
```

**Validation** : `Test-Path project/.env.example` (PowerShell) ou vérifier que le fichier existe

### Étape 2 : Vérifier la cohérence avec le backend

Vérifier que le fichier `project/backend/src/index.ts` utilise bien `dotenv` pour charger les variables :

```typescript
import 'dotenv/config';
```

Cette ligne est déjà présente dans le fichier actuel.

### Étape 3 : Mettre à jour le TODO.md

Cocher la tâche `id004` dans le fichier `/TODO.md`.

## Contraintes

- **Format** : Fichier bash/shell avec commentaires `#`
- **Valeurs sensibles** : Utiliser des placeholders (`sk-your-api-key-here`) jamais de vraies clés
- **Documentation** : Chaque section et variable doit être commentée
- **Compatibilité** : Le fichier doit fonctionner avec `dotenv` (Node.js) et Bun

## Definition of Done

- [ ] Fichier `project/.env.example` créé avec toutes les variables documentées
- [ ] Valeurs par défaut permettent un démarrage en mode développement (mock)
- [ ] Aucune clé API réelle dans le fichier
- [ ] Tâche `id004` cochée dans `/TODO.md`

## Références

- [docs/09-integration-deploiement.md](docs/09-integration-deploiement.md) — Variables par environnement
- [docs/05-specifications-techniques.md](docs/05-specifications-techniques.md) — Stack technique (ChromaDB, OpenAI)
- [docs/03-specifications-fonctionnelles.md](docs/03-specifications-fonctionnelles.md) — Paramètres chunking (F-002)
