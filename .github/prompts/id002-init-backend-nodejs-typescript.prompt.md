---
agent: agent
description: Initialiser le backend Node.js 20.x avec TypeScript et Express.js
---

# id002 — Initialiser le backend Node.js avec TypeScript et Express

## Objectif

Créer la configuration de base du backend Node.js avec TypeScript et Express.js, incluant le `package.json`, le `tsconfig.json` et le point d'entrée `index.ts` avec un serveur Express fonctionnel.

## Contexte

Ce projet est un prototype RAG (Retrieval-Augmented Generation) qui expose une API REST pour l'ingestion de documents et les requêtes sémantiques. Le backend utilise Express.js pour sa simplicité et son écosystème mature.

- Réf : [docs/04-decisions-architectures.md](docs/04-decisions-architectures.md) — ADR-003 : Framework Backend — Express.js
- Réf : [docs/05-specifications-techniques.md](docs/05-specifications-techniques.md) — Stack technique
- Réf : [docs/06-codage-guidelines.md](docs/06-codage-guidelines.md) — Conventions de code
- Dépendances : `id001` (structure de dossiers)

## Pré-requis

- [x] Tâche dépendante complétée : `id001`
- [ ] Node.js 20.x installé (`node --version`)
- [ ] npm 10+ installé (`npm --version`)

## Fichiers impactés

| Fichier | Action | Description |
| ------- | ------ | ----------- |
| `project/backend/package.json` | Créer | Manifest npm avec dépendances et scripts |
| `project/backend/tsconfig.json` | Créer | Configuration TypeScript stricte |
| `project/backend/src/index.ts` | Créer | Point d'entrée du serveur Express |

## Critères d'acceptation

- [ ] `npm install` s'exécute sans erreur dans `project/backend/`
- [ ] `npm run build` compile le TypeScript sans erreur
- [ ] `npm run dev` démarre le serveur Express sur le port 3000
- [ ] Le endpoint `GET /api/health` retourne `{ "status": "ok" }`
- [ ] ESM activé (`"type": "module"` dans package.json)
- [ ] TypeScript en mode strict avec target ES2022

## Tests requis

**Manuel** : Vérifier que le serveur démarre et répond sur `/api/health`

```bash
curl http://localhost:3000/api/health
# Réponse attendue : {"status":"ok"}
```

## Instructions

### Étape 1 : Créer package.json

**Fichier** : `project/backend/package.json`

```json
{
  "name": "@rag-tp/backend",
  "version": "0.1.0",
  "description": "Backend API pour le prototype RAG",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src --ext .ts",
    "type-check": "tsc --noEmit"
  },
  "engines": {
    "node": ">=20.0.0"
  },
  "dependencies": {
    "express": "^4.21.0",
    "zod": "^3.23.0",
    "pino": "^8.21.0",
    "pino-pretty": "^11.2.0",
    "dotenv": "^16.4.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.14.0",
    "tsx": "^4.16.0",
    "typescript": "^5.5.0"
  }
}
```

**Validation** :

```bash
cd project/backend
npm install
```

### Étape 2 : Créer tsconfig.json

**Fichier** : `project/backend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Validation** :

```bash
npm run type-check
```

### Étape 3 : Créer le point d'entrée Express

**Fichier** : `project/backend/src/index.ts`

```typescript
import express, { Request, Response, NextFunction } from 'express';
import pino from 'pino';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Configuration du logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

// Créer l'application Express
const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Middleware pour parser le JSON
app.use(express.json());

// Middleware de logging des requêtes
app.use((req: Request, _res: Response, next: NextFunction): void => {
  logger.info({ method: req.method, url: req.url }, 'Incoming request');
  next();
});

// Route de santé
app.get('/api/health', (_req: Request, res: Response): void => {
  res.json({ status: 'ok' });
});

// Route de statut (placeholder)
app.get('/api/status', (_req: Request, res: Response): void => {
  res.json({
    status: 'ok',
    version: '0.1.0',
    uptime: process.uptime(),
  });
});

// Middleware de gestion des erreurs
app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  logger.error({ err }, 'Unhandled error');
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: err.message || 'Internal server error',
    },
  });
});

// Démarrer le serveur
app.listen(PORT, (): void => {
  logger.info({ port: PORT }, 'Server started');
});

export default app;
```

**Validation** :

```bash
npm run dev
# Dans un autre terminal :
curl http://localhost:3000/api/health
```

## Contraintes

- **ESM obligatoire** : Utiliser `"type": "module"` et imports avec extensions `.js` dans les fichiers compilés
- **TypeScript strict** : Tous les flags stricts activés dans tsconfig.json
- **Logging structuré** : Utiliser Pino pour les logs JSON (cf. [05-specifications-techniques.md](docs/05-specifications-techniques.md))
- **Conventions de nommage** : kebab-case pour les fichiers, camelCase pour les variables (cf. [06-codage-guidelines.md](docs/06-codage-guidelines.md))

## Definition of Done

- [ ] `npm install` s'exécute sans erreur
- [ ] `npm run build` compile sans erreur TypeScript
- [ ] `npm run dev` démarre le serveur
- [ ] `curl http://localhost:3000/api/health` retourne `{"status":"ok"}`
- [ ] Aucune erreur TypeScript (`npm run type-check`)
- [ ] Tâche `id002` cochée dans `/TODO.md`

## Références

- [docs/04-decisions-architectures.md](docs/04-decisions-architectures.md) — ADR-003
- [docs/05-specifications-techniques.md](docs/05-specifications-techniques.md) — Stack technique
- [docs/06-codage-guidelines.md](docs/06-codage-guidelines.md) — Conventions et standards
