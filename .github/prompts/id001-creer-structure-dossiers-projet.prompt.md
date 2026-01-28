---
agent: agent
description: Créer la structure de dossiers du projet RAG (frontend, backend, shared, data)
---

# id001 — Créer la structure de dossiers du projet

## Objectif

Créer l'arborescence complète des dossiers du projet RAG-TP conformément à l'architecture définie, incluant les répertoires `project/frontend/`, `project/backend/`, `project/shared/`, et `project/data/`.

## Contexte

Projet RAG-TP : un pipeline Retrieval-Augmented Generation permettant d'ingérer des documents, de poser une question et d'obtenir une réponse contextualisée avec affichage des sources.

- Réf : [docs/05-specifications-techniques.md](docs/05-specifications-techniques.md) — Structure du projet
- Réf : [docs/06-codage-guidelines.md](docs/06-codage-guidelines.md) — Structure du projet et conventions
- Dépendances : Aucune (tâche racine)

## Pré-requis

- [ ] Aucun pré-requis technique
- [ ] Workspace `rag-tp` accessible en écriture

## Fichiers impactés

| Dossier/Fichier | Action | Description |
| --------------- | ------ | ----------- |
| `project/` | Créer | Dossier racine du code source |
| `project/frontend/` | Créer | Application React |
| `project/frontend/src/` | Créer | Code source frontend |
| `project/frontend/src/components/` | Créer | Composants React |
| `project/frontend/src/hooks/` | Créer | Custom hooks React |
| `project/frontend/src/services/` | Créer | Appels API |
| `project/frontend/src/types/` | Créer | Types TypeScript frontend |
| `project/frontend/src/utils/` | Créer | Utilitaires frontend |
| `project/backend/` | Créer | API Node.js/Express |
| `project/backend/src/` | Créer | Code source backend |
| `project/backend/src/api/` | Créer | Routes et controllers |
| `project/backend/src/api/routes/` | Créer | Définitions des routes |
| `project/backend/src/services/` | Créer | Logique métier |
| `project/backend/src/services/ingestion/` | Créer | Services d'ingestion |
| `project/backend/src/services/embedding/` | Créer | Services d'embedding |
| `project/backend/src/services/search/` | Créer | Services de recherche |
| `project/backend/src/services/generation/` | Créer | Services de génération |
| `project/backend/src/repositories/` | Créer | Accès aux données |
| `project/backend/src/config/` | Créer | Configuration |
| `project/backend/src/types/` | Créer | Types TypeScript backend |
| `project/backend/src/utils/` | Créer | Utilitaires backend |
| `project/shared/` | Créer | Types partagés front/back |
| `project/shared/types/` | Créer | Types communs |
| `project/data/` | Créer | Documents à indexer |
| `project/data/documents/` | Créer | Fichiers sources pour le RAG |
| `project/.gitkeep` files | Créer | Fichiers de suivi Git pour dossiers vides |

## Critères d'acceptation

- [ ] Le dossier `project/` existe à la racine du workspace
- [ ] Le dossier `project/frontend/src/` contient les sous-dossiers : `components/`, `hooks/`, `services/`, `types/`, `utils/`
- [ ] Le dossier `project/backend/src/` contient les sous-dossiers : `api/routes/`, `services/ingestion/`, `services/embedding/`, `services/search/`, `services/generation/`, `repositories/`, `config/`, `types/`, `utils/`
- [ ] Le dossier `project/shared/types/` existe
- [ ] Le dossier `project/data/documents/` existe
- [ ] Chaque dossier vide contient un fichier `.gitkeep` pour le suivi Git

## Instructions

### Étape 1 : Créer la structure frontend

**Dossiers à créer** :

```
project/frontend/src/components/
project/frontend/src/hooks/
project/frontend/src/services/
project/frontend/src/types/
project/frontend/src/utils/
```

**Action** : Créer ces dossiers et ajouter un fichier `.gitkeep` dans chacun.

**Validation** : Vérifier que les dossiers existent avec `ls project/frontend/src/`

### Étape 2 : Créer la structure backend

**Dossiers à créer** :

```
project/backend/src/api/routes/
project/backend/src/services/ingestion/
project/backend/src/services/embedding/
project/backend/src/services/search/
project/backend/src/services/generation/
project/backend/src/repositories/
project/backend/src/config/
project/backend/src/types/
project/backend/src/utils/
```

**Action** : Créer ces dossiers et ajouter un fichier `.gitkeep` dans chaque dossier feuille.

**Validation** : Vérifier que les dossiers existent avec `ls project/backend/src/`

### Étape 3 : Créer la structure shared

**Dossiers à créer** :

```
project/shared/types/
```

**Action** : Créer ce dossier et ajouter un fichier `.gitkeep`.

**Validation** : Vérifier que le dossier existe avec `ls project/shared/`

### Étape 4 : Créer la structure data

**Dossiers à créer** :

```
project/data/documents/
```

**Action** : Créer ce dossier et ajouter un fichier `.gitkeep`.

**Validation** : Vérifier que le dossier existe avec `ls project/data/`

### Étape 5 : Vérification finale

**Commande de validation** :

```bash
# Windows PowerShell
Get-ChildItem -Path project -Recurse -Directory | Select-Object FullName
```

**Résultat attendu** : Liste complète de tous les dossiers créés.

## Contraintes

- Respecter exactement la structure définie dans `/docs/05-specifications-techniques.md`
- Utiliser des fichiers `.gitkeep` pour les dossiers vides (convention Git)
- Ne pas créer de fichiers de code à cette étape (uniquement les dossiers)
- Le dossier racine doit être `project/` (et non à la racine du workspace)

## Definition of Done

- [ ] Tous les dossiers listés sont créés
- [ ] Chaque dossier feuille contient un fichier `.gitkeep`
- [ ] La commande de vérification finale liste tous les dossiers attendus
- [ ] Tâche `id001` cochée dans `/TODO.md`

## Références

- [docs/05-specifications-techniques.md](docs/05-specifications-techniques.md) — Structure du projet
- [docs/06-codage-guidelines.md](docs/06-codage-guidelines.md) — Structure du projet et conventions
