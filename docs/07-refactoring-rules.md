# Règles de Refactoring

## Principes directeurs

### Quand refactorer

- [ ] Code dupliqué (> 2 occurrences)
- [ ] Fonction > 25 lignes
- [ ] Fichier > 200 lignes
- [ ] Complexité cyclomatique > 10
- [ ] Couplage excessif entre modules
- [ ] Tests difficiles à écrire
- [ ] Noms ambigus ou trompeurs
- [ ] Commentaires expliquant du code complexe (le code devrait être clair)
- [ ] Type `any` utilisé

### Quand NE PAS refactorer

- Code legacy stable sans tests (écrire les tests d'abord)
- Veille de release / deadline critique
- Sans compréhension complète du contexte
- Refactoring "cosmétique" sans valeur ajoutée
- Sans review planifiée

### Règle d'or

> **« Leave the code better than you found it »** (Boy Scout Rule)

Chaque PR peut inclure un petit refactoring opportuniste si :
- Il est limité en scope
- Il ne change pas le comportement
- Il améliore la lisibilité/maintenabilité

## Catalogue des refactorings

### Niveau 1 : Cosmétique (faible risque)

| Refactoring | Déclencheur | Action |
|-------------|-------------|--------|
| **Rename** | Nom ambigu ou trompeur | Renommer variable/fonction/classe avec un nom explicite |
| **Extract variable** | Expression complexe ou répétée | Créer une constante nommée |
| **Inline variable** | Variable utilisée une seule fois sans valeur sémantique | Supprimer l'indirection |
| **Format/Prettier** | Inconsistance de style | Appliquer le formatter automatique |
| **Remove dead code** | Code jamais exécuté | Supprimer (vérifier avec tests) |

**Exemple - Extract Variable :**
```typescript
// Avant
if (user.role === 'admin' && user.permissions.includes('write') && !user.suspended) {
  // ...
}

// Après
const canWrite = user.role === 'admin' 
  && user.permissions.includes('write') 
  && !user.suspended;

if (canWrite) {
  // ...
}
```

### Niveau 2 : Structurel (risque modéré)

| Refactoring | Déclencheur | Action |
|-------------|-------------|--------|
| **Extract function** | Fonction trop longue, bloc de code réutilisable | Créer une fonction dédiée |
| **Extract module** | Fichier trop long, responsabilités multiples | Séparer en fichiers cohérents |
| **Extract interface** | Dépendance concrète, besoin de mock | Créer une interface/type |
| **Replace conditional with polymorphism** | Switch/if répétés | Utiliser le polymorphisme |
| **Introduce parameter object** | Fonction avec > 3 paramètres | Créer un objet de configuration |

**Exemple - Extract Function :**
```typescript
// Avant
async function processDocument(doc: Document): Promise<void> {
  // Validation (10 lignes)
  if (!doc.content) throw new Error('Empty content');
  if (doc.content.length > MAX_SIZE) throw new Error('Too large');
  // ... plus de validation

  // Chunking (15 lignes)
  const chunks: Chunk[] = [];
  let position = 0;
  // ... logique de chunking

  // Embedding (10 lignes)
  const embeddings = await embedder.embedBatch(chunks.map(c => c.text));
  // ... logique d'embedding
}

// Après
async function processDocument(doc: Document): Promise<void> {
  validateDocument(doc);
  const chunks = chunkDocument(doc);
  await embedAndStore(chunks);
}

function validateDocument(doc: Document): void { /* ... */ }
function chunkDocument(doc: Document): Chunk[] { /* ... */ }
async function embedAndStore(chunks: Chunk[]): Promise<void> { /* ... */ }
```

### Niveau 3 : Architectural (risque élevé)

| Refactoring | Déclencheur | Action |
|-------------|-------------|--------|
| **Replace inheritance with composition** | Hiérarchie rigide, diamond problem | Utiliser la composition + interfaces |
| **Introduce Repository** | Accès données dispersé | Centraliser dans un repository |
| **Introduce Service Layer** | Logique métier dans controllers | Extraire en services |
| **Split monolith** | Module trop gros | Séparer en modules indépendants |
| **Introduce Dependency Injection** | Couplage fort, tests difficiles | Injecter les dépendances |

**Exemple - Introduce Repository :**
```typescript
// Avant (accès dispersé)
// Dans service A
const chunks = db.query('SELECT * FROM chunks WHERE doc_id = ?', [docId]);

// Dans service B  
const chunk = db.query('SELECT * FROM chunks WHERE id = ?', [chunkId]);

// Après (repository centralisé)
interface ChunkRepository {
  findByDocumentId(docId: string): Promise<Chunk[]>;
  findById(id: string): Promise<Chunk | null>;
  save(chunk: Chunk): Promise<void>;
}

class SQLiteChunkRepository implements ChunkRepository {
  async findByDocumentId(docId: string): Promise<Chunk[]> {
    return this.db.query('SELECT * FROM chunks WHERE doc_id = ?', [docId]);
  }
  // ...
}
```

## Gestion de la dette technique

### Classification

| Niveau | Impact | Exemple | Action | Délai max |
|--------|--------|---------|--------|-----------|
| **Critique** | Bloquant / Sécurité | Faille sécurité, crash prod | Immédiat | 24h |
| **Majeur** | Performance / Stabilité | N+1 queries, memory leak | Sprint courant | 1 semaine |
| **Moyen** | Maintenabilité | Code dupliqué, types manquants | Sprint suivant | 1 mois |
| **Mineur** | Confort | Nom confus, formatage | Backlog | Opportuniste |

### Suivi de la dette

| ID | Description | Type | Fichier(s) | Priorité | Estimation | Status |
|----|-------------|------|------------|----------|------------|--------|
| DEBT-001 | Type `any` dans embedding service | Moyen | `embedding-service.ts` | P2 | 2h | À faire |
| DEBT-002 | Duplication logique de chunking | Moyen | `chunker.ts`, `loader.ts` | P2 | 4h | À faire |
| DEBT-003 | Pas de retry sur API OpenAI | Majeur | `openai-embedder.ts` | P1 | 3h | En cours |

### Budget dette technique

> **Règle : 20% du temps de développement** est alloué à la réduction de la dette.

- Sprint de 2 semaines → 2 jours pour la dette
- Inclure dans chaque sprint au moins 1 item de dette P1/P2

## Métriques qualité

| Métrique | Outil | Seuil acceptable | Seuil cible | Bloquant CI |
|----------|-------|------------------|-------------|-------------|
| Couverture tests | Vitest coverage | > 70% | > 85% | Oui (> 60%) |
| Complexité cyclomatique | ESLint complexity | < 15 | < 10 | Oui (> 20) |
| Duplication | SonarQube / jscpd | < 5% | < 3% | Non |
| TypeScript strict | tsc | 0 errors | 0 errors | Oui |
| Linting | ESLint | 0 errors | 0 warnings | Oui (errors) |
| Bundle size (frontend) | Vite build | < 500KB | < 300KB | Non |
| Dépendances obsolètes | npm audit | 0 critical | 0 high | Oui (critical) |

### Script de vérification

```json
// package.json
{
  "scripts": {
    "quality:check": "npm run lint && npm run type-check && npm run test:coverage",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "test:coverage": "vitest run --coverage --coverage.thresholds.lines=70"
  }
}
```

## Checklist pré-refactoring

### Avant de commencer

- [ ] Tests existants passent (green state)
- [ ] Branche dédiée créée depuis `develop`
- [ ] Scope défini et limité (1 refactoring = 1 PR)
- [ ] Impact identifié (fichiers, dépendances)
- [ ] Review planifiée avec un pair

### Pendant le refactoring

- [ ] Commits atomiques et fréquents
- [ ] Tests maintenus à jour
- [ ] Pas de changement de comportement
- [ ] Documentation mise à jour si nécessaire

### Après le refactoring

- [ ] Tous les tests passent
- [ ] Linting OK
- [ ] Couverture maintenue ou améliorée
- [ ] PR créée avec description claire
- [ ] Review effectuée

## Outils recommandés

| Outil | Usage | Installation |
|-------|-------|--------------|
| **ESLint** | Linting, complexité | `npm install -D eslint` |
| **Prettier** | Formatage | `npm install -D prettier` |
| **Vitest** | Tests + coverage | `npm install -D vitest @vitest/coverage-v8` |
| **TypeScript** | Type checking | Inclus |
| **jscpd** | Détection duplication | `npx jscpd src` |
| **madge** | Dépendances circulaires | `npx madge --circular src` |

### Détection de code smell

```bash
# Trouver les fichiers trop longs
find src -name "*.ts" -exec wc -l {} + | sort -n | tail -20

# Trouver les fonctions complexes (ESLint)
npx eslint src --rule 'complexity: ["error", 10]'

# Détecter la duplication
npx jscpd src --min-lines 5 --reporters console

# Vérifier les dépendances circulaires
npx madge --circular --extensions ts src
```

## Exemples de refactoring courants pour ce projet

### 1. Extraction du prompt template

```typescript
// Avant
async function generate(question: string, passages: Passage[]): Promise<string> {
  const prompt = `Tu es un assistant qui répond aux questions basé sur le contexte fourni.

Contexte:
${passages.map(p => p.text).join('\n\n')}

Question: ${question}

Réponds de manière concise en te basant uniquement sur le contexte.`;
  
  return await llm.complete(prompt);
}

// Après
// prompts/rag-prompt.ts
export const RAG_PROMPT_TEMPLATE = `Tu es un assistant qui répond aux questions basé sur le contexte fourni.

Contexte:
{{context}}

Question: {{question}}

Réponds de manière concise en te basant uniquement sur le contexte.`;

// services/generation/prompt-builder.ts
export function buildRagPrompt(question: string, passages: Passage[]): string {
  const context = passages.map(p => p.text).join('\n\n');
  return RAG_PROMPT_TEMPLATE
    .replace('{{context}}', context)
    .replace('{{question}}', question);
}
```

### 2. Introduction d'une interface Embedder

```typescript
// Avant (couplage fort)
import { OpenAIEmbedder } from './openai-embedder';
const embedder = new OpenAIEmbedder(apiKey);

// Après (découplé)
// types/embedder.ts
export interface Embedder {
  embed(text: string): Promise<number[]>;
  embedBatch(texts: string[]): Promise<number[][]>;
}

// services/embedding/openai-embedder.ts
export class OpenAIEmbedder implements Embedder { /* ... */ }

// services/embedding/local-embedder.ts
export class LocalEmbedder implements Embedder { /* ... */ }

// Factory
export function createEmbedder(config: Config): Embedder {
  if (config.embeddingProvider === 'openai') {
    return new OpenAIEmbedder(config.openaiApiKey);
  }
  return new LocalEmbedder();
}
```
