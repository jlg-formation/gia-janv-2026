# Vision Produit

## Résumé exécutif

Ce TP a pour objectif de construire un prototype RAG (Retrieval-Augmented Generation) complet permettant de répondre à des questions à partir d’un corpus de documents textuels. Le système combine une étape de recherche sémantique (base vectorielle) et une étape de génération par LLM afin de produire des réponses contextualisées, idéalement « ancrées » dans les contenus ingérés.

## Problème adressé

### Contexte

Les modèles de langage sont performants pour générer du texte mais ne disposent pas, par défaut, d’un accès fiable à une base de connaissances locale et peuvent halluciner ou répondre avec des informations obsolètes. Dans un contexte pédagogique (TP), l’enjeu est de comprendre comment connecter un LLM à des documents externes pour améliorer la pertinence et la traçabilité des réponses.

### Pain points actuels

- Difficile de répondre précisément à partir d’un corpus local sans recherche préalable.
- Réponses parfois plausibles mais non justifiées (hallucinations).
- Manque de transparence : on ne sait pas quels passages ont été utilisés.
- Mise en œuvre de bout en bout (ingestion → recherche → génération) rarement maîtrisée.

### Coût de l'inaction

- Prototype « LLM only » peu fiable sur des questions factuelles liées à un corpus.
- Difficulté à évaluer la qualité de la solution sans pipeline reproductible.
- Perte de temps à itérer sans instrumentation (retrieval, top-k, chunking).

## Solution proposée

### Proposition de valeur unique

Un pipeline RAG minimal mais complet, reproductible et observable, permettant :

1. d’ingérer un corpus de documents textuels,
2. d’indexer ce corpus dans une base de vecteurs,
3. de retrouver des passages pertinents pour une question,
4. de générer une réponse via un LLM à partir du contexte retrouvé.

### Bénéfices clés

- Réponses plus pertinentes sur le corpus ingéré.
- Réduction des hallucinations grâce au contexte fourni au LLM.
- Possibilité de tracer les sources (passages retrouvés) pour expliquer la réponse.
- Compréhension pratique des choix RAG (chunking, embeddings, top-k, prompt).

## Objectifs business

| Objectif | Métrique | Cible | Échéance |
| -------- | -------- | ----- | -------- |
| Démontrer un pipeline RAG end-to-end | Démo reproductible (script/CLI) | 1 scénario complet | Fin du TP |
| Qualité perçue des réponses | Évaluation manuelle (grille simple) | ≥ 4/5 sur questions du corpus | Fin du TP |
| Traçabilité des réponses | Réponse inclut passages/citations | ≥ 80% des réponses | Fin du TP |
| Temps de réponse acceptable | Latence p95 | < 5s en local (corpus petit) | Fin du TP |

## Périmètre

### In scope (MVP)

- **Ingestion** : chargement d’un dossier de documents textuels (ex: `.txt`, `.md`).
- **Pré-traitement** : découpage en chunks (taille + overlap) et nettoyage léger.
- **Vectorisation** : embeddings des chunks.
- **Indexation** : stockage dans une base vectorielle (local ou service).
- **Recherche** : top-k passages pertinents pour une requête.
- **Génération** : appel LLM avec un prompt incluant la requête + contexte.
- **Sortie** : réponse + affichage des passages retrouvés (sources).

### Out of scope

- Authentification/gestion multi-utilisateurs.
- Interface web complète (dashboard, gestion de corpus via UI).
- Scalabilité (sharding, haute dispo, index massif).
- Fine-tuning d’un modèle.
- Support natif multimodal (images, audio) ou OCR avancé.

### Évolutions futures

- Ajout d’un **mode évaluation** (jeu de questions/réponses, métriques automatiques).
- Expérimentation de stratégies de retrieval (MMR, hybrid search, reranking).
- Mise en place d’un format de **citations** (id chunk, score, extrait).
- Ingestion de PDF (via extraction texte) et/ou HTML.
- UI légère (ex: Streamlit) pour faciliter la démo.

## Critères de succès

- Le pipeline tourne localement de bout en bout sur un corpus exemple.
- Une requête utilisateur déclenche une recherche vectorielle, puis une génération.
- Les passages utilisés sont visibles (top-k + scores ou extraits).
- Le comportement est **reproductible** (configuration de chunking, top-k).

## Risques et hypothèses

| Type | Description | Mitigation |
| ---- | ----------- | ---------- |
| Hypothèse | Un corpus de documents textuels est disponible et exploitable | Fournir un corpus d’exemple ou un guide de collecte |
| Technique | Choix embeddings / base vectorielle non fixé dans le brief | Décider via une clarification lors des docs d’architecture |
| Technique | Accès à un LLM (clé API / modèle local) | Prévoir un mode « mock » ou un modèle local si possible |
| Qualité | Chunking inadéquat → retrieval faible | Paramétrer taille/overlap, tester plusieurs configs |
| Qualité | Réponses non ancrées (hallucinations) malgré retrieval | Contraindre le prompt, afficher les sources, ajuster top-k |
| Performance | Latence trop élevée sur machine étudiante | Limiter corpus, optimiser index, limiter top-k |

## Glossaire rapide

- **RAG** : Approche qui combine retrieval (recherche) et génération.
- **Chunk** : Fragment de document indexé pour la recherche.
- **Embedding** : Représentation vectorielle d’un texte.
- **Top-k** : Nombre de passages retournés par la recherche.
- **Hallucination** : Réponse plausible mais non fondée sur des sources.
