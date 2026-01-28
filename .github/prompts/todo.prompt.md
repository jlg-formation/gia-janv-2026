---
agent: agent
description: Transforme une tâche du TODO.md en prompt exécutable par un agent IA
---

# Générateur de Prompts de Tâche

Transforme un identifiant de tâche (`idNNN`) du fichier `/TODO.md` en un prompt complet et autonome qu'un agent IA peut exécuter sans assistance.

---

## Rôle

Tu agis en tant que **Tech Lead Senior** avec une expertise en :

- Conception de prompts précis pour agents IA
- Architecture logicielle (cf. `/docs/05-specifications-techniques.md`, `/docs/06-codage-guidelines.md`)
- Méthodologie Agile et critères de validation

---

## Entrée

Un identifiant de tâche au format `idNNN` (ex : `id001`, `id012`).

---

## Sortie

Un fichier prompt créé à l'emplacement :

```
/.github/prompts/<idNNN>-<slug>.prompt.md
```

**Règles pour le slug :**

1. Extraire le titre de la tâche
2. Convertir en kebab-case (minuscules, tirets)
3. Supprimer accents et caractères spéciaux
4. Limiter à 40 caractères

> Exemple : `Initialiser le projet Node.js + TypeScript` → `init-projet-nodejs-typescript`

---

## Validation de l'entrée

| Problème                    | Réponse                                           |
| --------------------------- | ------------------------------------------------- |
| ID inexistant               | Lister les IDs disponibles, demander confirmation |
| Tâche déjà complétée        | Informer et proposer une autre tâche              |
| Format ID invalide          | Rappeler le format `idNNN`                        |
| Dépendances non satisfaites | Proposer de traiter d'abord les tâches bloquantes |

---

## Contrôles préalables

Avant génération, vérifier :

- **Dépendances** (`🔗 Dépend de`) : toutes cochées ?
- **Clarté** : consulter `/clarifications/*.md` si ambiguïté

---

## Template du prompt généré

````markdown
---
agent: agent
description: <Résumé en une ligne>
---

# <idNNN> — <Titre de la tâche>

## Objectif

<Ce qui doit être accompli, en termes clairs et mesurables>

## Contexte

<Informations essentielles extraites de la documentation>

- Réf : [fichier](chemin) — section concernée
- Dépendances : `<idXXX>`, `<idYYY>` (si applicable)

## Pré-requis

- [ ] Tâches dépendantes complétées : `<liste>`
- [ ] Environnement configuré : <détails>

## Fichiers impactés

| Fichier             | Action           | Description     |
| ------------------- | ---------------- | --------------- |
| `chemin/fichier.ts` | Créer / Modifier | Rôle du fichier |

## Critères d'acceptation

- [ ] Critère fonctionnel
- [ ] Critère technique
- [ ] Critère de test

## Tests requis

**Unitaires** : `tests/unit/<module>.test.ts` — cas à couvrir

**Intégration** (si applicable) : scénarios à valider

## Instructions

### Étape 1 : <Action>

**Fichier** : `chemin/fichier.ts`

```typescript
// Code attendu
```

**Validation** : `<commande>`

### Étape 2 : <Action>

<Même structure>

## Contraintes

- Règles issues de `/docs/06-codage-guidelines.md`
- Patterns obligatoires
- Erreurs à éviter

## Definition of Done

- [ ] Code conforme aux guidelines
- [ ] Tests passent (`npm test`)
- [ ] Aucune erreur lint/TS (`npm run lint`)
- [ ] Tâche cochée dans `/TODO.md`

## Références

- [doc](chemin) — description
````

---

## Processus de génération

1. **Extraire** les données de la tâche depuis `/TODO.md`
2. **Collecter** le contexte dans les docs référencées (`📖 Réf`)
3. **Vérifier** les dépendances (`🔗 Dépend de`)
4. **Rédiger** le prompt selon le template
5. **Valider** l'autonomie du prompt
6. **Sauvegarder** dans `/.github/prompts/<idNNN>-<slug>.prompt.md`

---

## Critères de qualité

| Critère     | Exigence                                                |
| ----------- | ------------------------------------------------------- |
| Autonomie   | Exécutable sans question supplémentaire                 |
| Précision   | Chemins exacts, noms de fonctions explicites            |
| Testabilité | Critères d'acceptation vérifiables automatiquement      |
| Complétude  | Toutes les informations nécessaires incluses            |
| Cohérence   | Aligné avec l'architecture et les conventions du projet |

---

## Documentation de référence

| Fichier                                 | Contenu                         |
| --------------------------------------- | ------------------------------- |
| `/TODO.md`                              | Liste des tâches et dépendances |
| `/docs/00-vision.md`                    | Vision et périmètre             |
| `/docs/05-specifications-techniques.md` | Architecture technique          |
| `/docs/06-codage-guidelines.md`         | Conventions de code             |
| `/docs/08-tests-verification.md`        | Stratégie de tests              |
| `/clarifications/*.md`                  | Décisions et clarifications     |

---

## Erreurs à éviter

- Prompts vagues sans chemins de fichiers précis
- Critères d'acceptation non vérifiables
- Oubli des dépendances entre tâches
- Absence de références à la documentation
- Instructions génériques ("implémenter la feature")
- Section tests manquante

---

## Actions post-génération

1. Afficher le chemin du fichier créé
2. Proposer l’exécution immédiate de la tâche générée

---

## Exemple

**Entrée** : `id001`

**Tâche** : Initialiser le projet Node.js + TypeScript

**Prompt généré** :

````markdown
---
agent: agent
description: Initialiser le projet Node.js 22 LTS avec TypeScript 5.x
---

# id001 — Initialiser le projet Node.js + TypeScript

## Objectif

Créer la structure de base du projet avec Node.js 22 LTS et TypeScript 5.x.

## Contexte

CLI `jlgcli` pour orchestrer des agents IA.

- Réf : [docs/05-specifications-techniques.md](docs/05-specifications-techniques.md) — Stack technique
- Réf : [docs/06-codage-guidelines.md](docs/06-codage-guidelines.md) — Structure projet

## Pré-requis

- [ ] Node.js 22 LTS (`node --version`)
- [ ] npm 10+ (`npm --version`)

## Fichiers impactés

| Fichier                 | Action | Description       |
| ----------------------- | ------ | ----------------- |
| `project/package.json`  | Créer  | Manifest npm      |
| `project/tsconfig.json` | Créer  | Config TypeScript |

## Critères d'acceptation

- [ ] `npm install` réussit
- [ ] `npx tsc --noEmit` réussit
- [ ] ESM activé (`type: "module"`)
- [ ] Target ES2022+

## Instructions

### Étape 1 : Créer package.json

**Fichier** : `project/package.json`

```json
{
  "name": "@jlguenego/ai-cli",
  "version": "0.1.0",
  "type": "module",
  "bin": { "jlgcli": "./bin/jlgcli.js" },
  "scripts": { "build": "tsc", "test": "vitest" },
  "engines": { "node": ">=22.0.0" }
}
```

**Validation** : `npm install`

### Étape 2 : Créer tsconfig.json

**Fichier** : `project/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

**Validation** : `npx tsc --noEmit`

## Definition of Done

- [ ] `npm install` réussit
- [ ] `npx tsc --noEmit` réussit
- [ ] Tâche cochée dans `/TODO.md`

## Références

- [docs/05-specifications-techniques.md](docs/05-specifications-techniques.md)
- [docs/06-codage-guidelines.md](docs/06-codage-guidelines.md)
````
