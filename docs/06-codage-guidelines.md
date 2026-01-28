# Guidelines de Développement

## Stack technique

Ce projet utilise **Bun** comme runtime JavaScript/TypeScript (clarification 004). Toutes les commandes `npm` sont remplacées par leurs équivalents `bun`.

---

## Structure du projet

```
project/
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── bun.lockb              # Lockfile Bun (binaire)
│   └── src/
│       ├── index.ts           # Point d'entrée
│       ├── api/
│       │   └── routes/
│       ├── config/
│       ├── services/
│       │   ├── ingestion/
│       │   ├── embedding/
│       │   ├── search/
│       │   └── generation/
│       ├── repositories/
│       ├── types/
│       └── utils/
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
├── shared/
│   └── types/
├── data/
│   └── documents/
└── docker-compose.yml
```

---

## Conventions de nommage

| Élément | Convention | Exemple |
|---------|------------|---------|
| Fichiers TS/TSX | kebab-case | `query-input.tsx`, `vector-store.ts` |
| Dossiers | kebab-case | `embedding/`, `api/` |
| Classes | PascalCase | `VectorStore`, `EmbeddingService` |
| Interfaces | PascalCase (préfixe I optionnel) | `QueryResult`, `IEmbedder` |
| Types | PascalCase | `ChunkMetadata`, `SearchResponse` |
| Fonctions | camelCase | `embedDocument`, `searchVectors` |
| Constantes | SCREAMING_SNAKE_CASE | `MAX_CHUNK_SIZE`, `DEFAULT_TOP_K` |
| Variables | camelCase | `embeddingVector`, `searchResults` |
| Env vars | SCREAMING_SNAKE_CASE | `OPENAI_API_KEY`, `CHROMA_HOST` |
| Composants React | PascalCase | `QueryInput`, `ResponseDisplay` |
| Hooks React | camelCase, préfixe `use` | `useQuery`, `useDebounce` |

---

## Standards de code

### Principes

- **SOLID** : Appliquer systématiquement, en particulier :
  - **S**ingle Responsibility : Un service = une responsabilité
  - **D**ependency Inversion : Injecter les dépendances via interfaces
- **DRY** : Factoriser le code dupliqué dans `/utils` ou `/shared`
- **KISS** : Préférer la simplicité — pas d'abstraction prématurée

### TypeScript strict

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Configuration ESLint recommandée

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "no-console": "warn",
    "prefer-const": "error"
  }
}
```

---

## Documentation du code

### Fonctions et méthodes

```typescript
/**
 * Génère un embedding pour un texte donné.
 * 
 * @param text - Le texte à vectoriser
 * @param options - Options de configuration
 * @returns Le vecteur d'embedding (1536 dimensions pour OpenAI)
 * @throws {EmbeddingError} Si l'API échoue ou le texte est vide
 * 
 * @example
 * const vector = await embedText("Hello world");
 * console.log(vector.length); // 1536
 */
export async function embedText(
  text: string,
  options?: EmbedOptions
): Promise<number[]> {
  // ...
}
```

### Interfaces et types

```typescript
/**
 * Résultat d'une recherche vectorielle.
 */
export interface SearchResult {
  /** Identifiant unique du chunk */
  chunkId: string;
  /** Texte du chunk trouvé */
  text: string;
  /** Score de similarité (0-1) */
  score: number;
  /** Métadonnées du document source */
  metadata: ChunkMetadata;
}
```

---

## Patterns recommandés

| Pattern | Cas d'usage | Exemple |
| ------- | ----------- | ------- |
| **Factory** | Créer des instances de services selon config | `createEmbedder(config)` → OpenAI ou Local |
| **Repository** | Abstraction accès données | `VectorStoreRepository`, `MetadataRepository` |
| **Strategy** | Algorithmes interchangeables | `ChunkingStrategy` (fixed, semantic) |
| **Builder** | Construction de prompts complexes | `PromptBuilder.withContext().withSources()` |
| **Singleton** | Config globale, connexions DB | `config`, `db` (via modules ES) |

### Exemple : Pattern Factory pour Embedder

```typescript
// services/embedding/index.ts
import { config } from '../../config';
import { OpenAIEmbedder } from './openai';
import { LocalEmbedder } from './local';

export interface Embedder {
  embed(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
}

export function createEmbedder(): Embedder {
  switch (config.embeddingProvider) {
    case 'openai':
      return new OpenAIEmbedder(config.openaiApiKey);
    case 'local':
      return new LocalEmbedder();
    default:
      throw new Error(`Unknown embedding provider: ${config.embeddingProvider}`);
  }
}
```

---

## Anti-patterns à éviter

| Anti-pattern | Problème | Alternative |
| ------------ | -------- | ----------- |
| **God Object** | Service qui fait tout | Découper en services spécialisés |
| **Hardcoded config** | Valeurs en dur | Utiliser `Bun.env` + `config.ts` |
| **any everywhere** | Perte du typage | Types explicites, génériques |
| **Callback hell** | Code illisible | async/await, Promises |
| **Console.log partout** | Logs non structurés | Logger dédié (pino, winston) |
| **Imports circulaires** | Erreurs runtime | Réorganiser les modules, barrel files |
| **Mutable state** | Bugs difficiles | `const`, immutabilité, `readonly` |

---

## Gestion des erreurs

### Hiérarchie des erreurs

```typescript
// types/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class EmbeddingError extends AppError {
  constructor(message: string) {
    super(message, 'EMBEDDING_ERROR', 502);
  }
}

export class VectorStoreError extends AppError {
  constructor(message: string) {
    super(message, 'VECTOR_STORE_ERROR', 503);
  }
}

export class LLMError extends AppError {
  constructor(message: string) {
    super(message, 'LLM_ERROR', 502);
  }
}
```

### Middleware Express pour les erreurs

```typescript
// api/middleware/error-handler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../types/errors';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
  });
}
```

---

## Commandes Bun

### Équivalences npm → Bun

| Action | npm | Bun |
|--------|-----|-----|
| Installer dépendances | `npm install` | `bun install` |
| Ajouter une dépendance | `npm install <pkg>` | `bun add <pkg>` |
| Ajouter une devDep | `npm install -D <pkg>` | `bun add -d <pkg>` |
| Supprimer une dépendance | `npm uninstall <pkg>` | `bun remove <pkg>` |
| Exécuter un script | `npm run <script>` | `bun run <script>` |
| Exécuter un fichier | `node file.js` | `bun file.ts` |
| Lancer les tests | `npm test` | `bun test` |
| Exécuter npx | `npx <cmd>` | `bunx <cmd>` |

### Scripts package.json (backend)

```json
{
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "start": "bun run src/index.ts",
    "test": "bun test",
    "test:watch": "bun test --watch",
    "typecheck": "tsc --noEmit",
    "lint": "bunx eslint src/",
    "format": "bunx prettier --write src/"
  }
}
```

### Scripts package.json (frontend)

```json
{
  "scripts": {
    "dev": "bunx --bun vite",
    "build": "bunx --bun vite build",
    "preview": "bunx --bun vite preview",
    "typecheck": "tsc --noEmit"
  }
}
```

---

## Git workflow

### Branches

| Type | Format | Exemple |
| ---- | ------ | ------- |
| Feature | `feature/[ticket]-description` | `feature/US-001-query-endpoint` |
| Bugfix | `fix/[ticket]-description` | `fix/BUG-042-embedding-timeout` |
| Refactor | `refactor/description` | `refactor/extract-embedder` |
| Docs | `docs/description` | `docs/api-endpoints` |

### Commits (Conventional Commits)

```
type(scope): description courte

[corps optionnel]

[footer optionnel]
```

**Types** :
- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `refactor` : Refactoring sans changement fonctionnel
- `docs` : Documentation
- `test` : Ajout/modification de tests
- `chore` : Tâches de maintenance (deps, config)

**Exemples** :
```
feat(api): add /api/query endpoint

Implements the main RAG query flow with vector search
and LLM generation.

Closes #12
```

```
fix(embedding): handle empty text input

Return empty vector instead of throwing for empty strings.
```

### Pull Requests

**Template PR** :

```markdown
## Description
<!-- Décrivez les changements -->

## Type de changement
- [ ] Nouvelle fonctionnalité
- [ ] Correction de bug
- [ ] Refactoring
- [ ] Documentation

## Checklist
- [ ] Tests ajoutés/modifiés
- [ ] TypeScript compile sans erreur
- [ ] Lint passe
- [ ] Documentation mise à jour

## Tests effectués
<!-- Décrivez comment vous avez testé -->
```

**Règles** :
- Minimum 1 reviewer
- CI verte requise (`bun test`, `tsc --noEmit`)
- Squash merge recommandé

---

## Bonnes pratiques Bun

### Utiliser les APIs natives Bun

```typescript
// ❌ Éviter (dépendance npm)
import dotenv from 'dotenv';
dotenv.config();
const apiKey = process.env.OPENAI_API_KEY;

// ✅ Préférer (natif Bun)
const apiKey = Bun.env.OPENAI_API_KEY;
```

```typescript
// ❌ Éviter (dépendance npm pour SQLite)
import Database from 'better-sqlite3';

// ✅ Préférer (natif Bun)
import { Database } from 'bun:sqlite';
```

```typescript
// ❌ Éviter (fs Node.js)
import { readFile } from 'fs/promises';
const content = await readFile('file.txt', 'utf-8');

// ✅ Préférer (natif Bun)
const file = Bun.file('file.txt');
const content = await file.text();
```

### Tests avec Bun

```typescript
// __tests__/embedding.test.ts
import { describe, it, expect, mock } from 'bun:test';
import { embedText } from '../src/services/embedding';

describe('embedText', () => {
  it('should return a vector of correct dimension', async () => {
    const result = await embedText('test');
    expect(result).toBeArray();
    expect(result.length).toBe(1536);
  });

  it('should throw for empty input', async () => {
    expect(embedText('')).rejects.toThrow();
  });
});
```

---

## Checklist avant commit

- [ ] `bun run typecheck` passe sans erreur
- [ ] `bun test` passe
- [ ] `bunx eslint src/` ne retourne pas d'erreur
- [ ] Pas de `console.log` de debug oublié
- [ ] Pas de `any` non justifié
- [ ] Documentation à jour si API modifiée
- [ ] Variables d'environnement documentées si ajoutées
