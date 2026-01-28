# Guidelines de Développement

## Structure du projet

```
rag-tp/
├── frontend/                    # Application React
│   ├── src/
│   │   ├── components/          # Composants React
│   │   │   ├── common/          # Composants réutilisables
│   │   │   └── features/        # Composants par feature
│   │   ├── hooks/               # Custom hooks
│   │   ├── services/            # Appels API
│   │   ├── types/               # Types TypeScript
│   │   ├── utils/               # Utilitaires
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
├── backend/                     # API Node.js/Express
│   ├── src/
│   │   ├── api/                 # Routes et controllers
│   │   │   └── routes/
│   │   ├── services/            # Logique métier
│   │   │   ├── ingestion/
│   │   │   ├── embedding/
│   │   │   ├── search/
│   │   │   └── generation/
│   │   ├── repositories/        # Accès données
│   │   ├── config/              # Configuration
│   │   ├── types/               # Types partagés
│   │   ├── utils/               # Utilitaires
│   │   └── index.ts             # Point d'entrée
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
├── shared/                      # Types partagés front/back
│   └── types/
├── data/                        # Documents à indexer
├── docs/                        # Documentation
├── .env.example
├── docker-compose.yml
└── README.md
```

## Conventions de nommage

| Élément | Convention | Exemple |
|---------|------------|---------|
| Fichiers TS/TSX | kebab-case | `query-input.tsx`, `embedding-service.ts` |
| Composants React | PascalCase | `QueryInput`, `ResultDisplay` |
| Hooks | camelCase avec `use` | `useQuery`, `useDebounce` |
| Services/Classes | PascalCase | `EmbeddingService`, `VectorStore` |
| Fonctions | camelCase | `embedText`, `searchSimilar` |
| Constantes | SCREAMING_SNAKE_CASE | `MAX_CHUNK_SIZE`, `DEFAULT_TOP_K` |
| Variables | camelCase | `currentQuery`, `searchResults` |
| Types/Interfaces | PascalCase avec I (optionnel) | `SearchResult`, `IEmbedder` |
| Enums | PascalCase | `ErrorCode`, `Status` |
| Fichiers de test | `*.test.ts` ou `*.spec.ts` | `embedder.test.ts` |

## Standards de code

### Principes fondamentaux

- **SOLID** : Appliquer systématiquement, notamment Single Responsibility
- **DRY** : Éviter la duplication, extraire les logiques communes
- **KISS** : Préférer la simplicité, éviter la sur-ingénierie
- **Composition over Inheritance** : Privilégier la composition

### TypeScript strict

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Configuration ESLint

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error'
  }
};
```

### Documentation du code

```typescript
/**
 * Génère les embeddings pour une liste de textes.
 * 
 * @param texts - Liste de textes à vectoriser
 * @param options - Options de génération (batch size, modèle)
 * @returns Promise<number[][]> - Matrice de vecteurs
 * @throws EmbeddingError si le service est indisponible
 * 
 * @example
 * const embeddings = await embedBatch(['Hello', 'World'], { batchSize: 10 });
 */
async function embedBatch(
  texts: string[],
  options?: EmbedOptions
): Promise<number[][]> {
  // implementation
}
```

## Patterns recommandés

| Pattern | Cas d'usage | Exemple |
| ------- | ----------- | ------- |
| **Repository** | Abstraction accès données | `VectorStoreRepository`, `MetadataRepository` |
| **Service** | Logique métier encapsulée | `EmbeddingService`, `SearchService` |
| **Factory** | Création d'objets complexes | `createEmbedder(config)` |
| **Dependency Injection** | Découplage des dépendances | Injection via constructeur |
| **Strategy** | Algorithmes interchangeables | `Embedder` interface avec implémentations |
| **Builder** | Construction d'objets step-by-step | `PromptBuilder` |

### Exemple : Pattern Repository

```typescript
// repositories/vector-store.ts
export interface VectorStoreRepository {
  add(id: string, vector: number[], metadata: Metadata): Promise<void>;
  search(vector: number[], topK: number): Promise<SearchResult[]>;
  delete(id: string): Promise<void>;
}

export class ChromaVectorStore implements VectorStoreRepository {
  constructor(private client: ChromaClient) {}
  
  async add(id: string, vector: number[], metadata: Metadata): Promise<void> {
    await this.client.add({ ids: [id], embeddings: [vector], metadatas: [metadata] });
  }
  
  async search(vector: number[], topK: number): Promise<SearchResult[]> {
    const results = await this.client.query({ queryEmbeddings: [vector], nResults: topK });
    return this.mapToSearchResults(results);
  }
}
```

### Exemple : Pattern Service

```typescript
// services/search/searcher.ts
export class SearchService {
  constructor(
    private embedder: Embedder,
    private vectorStore: VectorStoreRepository,
    private metadataStore: MetadataRepository
  ) {}

  async search(query: string, options: SearchOptions): Promise<SearchResult[]> {
    const embedding = await this.embedder.embed(query);
    const vectorResults = await this.vectorStore.search(embedding, options.topK);
    return this.enrichWithMetadata(vectorResults);
  }
}
```

## Anti-patterns à éviter

| Anti-pattern | Problème | Alternative |
| ------------ | -------- | ----------- |
| **God Class** | Classe avec trop de responsabilités | Découper en services spécialisés |
| **any** | Perte du typage | Types explicites ou `unknown` |
| **Callback Hell** | Code illisible | async/await |
| **Magic Numbers** | Valeurs non explicites | Constantes nommées |
| **Tight Coupling** | Difficile à tester/modifier | Injection de dépendances |
| **Premature Optimization** | Complexité inutile | Optimiser sur mesure |
| **Copy-Paste** | Duplication | Extraction en fonction/module |

## Gestion des erreurs

### Hiérarchie des erreurs

```typescript
// types/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, ErrorCode.VALIDATION_ERROR, 400);
  }
}

export class EmbeddingError extends AppError {
  constructor(message: string) {
    super(message, ErrorCode.EMBEDDING_ERROR, 503);
  }
}

export class LLMError extends AppError {
  constructor(message: string) {
    super(message, ErrorCode.LLM_ERROR, 503);
  }
}

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  EMBEDDING_ERROR = 'EMBEDDING_ERROR',
  LLM_ERROR = 'LLM_ERROR',
  VECTOR_STORE_ERROR = 'VECTOR_STORE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}
```

### Format des messages d'erreur

```typescript
// Réponse API erreur
{
  "success": false,
  "error": {
    "code": "EMBEDDING_ERROR",
    "message": "Failed to generate embeddings",
    "details": "OpenAI API rate limit exceeded",
    "timestamp": "2026-01-28T12:00:00Z"
  }
}
```

### Error handler Express

```typescript
// api/middleware/error-handler.ts
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error({ err, path: req.path, method: req.method });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        timestamp: new Date().toISOString()
      }
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    }
  });
};
```

## Git workflow

### Branches

| Type | Format | Exemple |
| ------- | ------------------------------ | --------------------------- |
| Feature | `feature/[US-ID]-description` | `feature/US-001-ingestion-api` |
| Bugfix | `fix/[BUG-ID]-description` | `fix/BUG-042-null-embedding` |
| Hotfix | `hotfix/[ID]-description` | `hotfix/001-api-crash` |
| Release | `release/vX.Y.Z` | `release/v1.0.0` |

### Commits (Conventional Commits)

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `docs` | Documentation |
| `style` | Formatage (pas de changement de code) |
| `refactor` | Refactoring |
| `test` | Ajout/modification de tests |
| `chore` | Maintenance, dépendances |

**Exemples :**
```
feat(ingestion): add chunking with configurable overlap
fix(embedding): handle empty text input
docs(api): add query endpoint documentation
refactor(search): extract vector search to repository
test(generation): add prompt builder unit tests
```

### Pull Requests

**Template PR :**
```markdown
## Description
<!-- Décrivez les changements -->

## Type de changement
- [ ] Feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] Documentation

## Checklist
- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Lint/format OK
- [ ] Review demandée

## Screenshots (si UI)

## Related Issues
Closes #XXX
```

**Règles :**
- Minimum 1 reviewer requis
- CI doit passer (tests + lint)
- Squash merge recommandé
- Description claire et concise

## Logging

### Configuration Pino

```typescript
// config/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' 
    ? { target: 'pino-pretty' } 
    : undefined,
  base: { service: 'rag-api' },
  timestamp: pino.stdTimeFunctions.isoTime
});
```

### Bonnes pratiques de logging

```typescript
// Contexte structuré
logger.info({ documentId, chunkCount }, 'Document ingested successfully');

// Erreurs avec stack
logger.error({ err, query }, 'Search failed');

// Durées et métriques
logger.info({ duration: endTime - startTime, topK }, 'Search completed');
```
