---
agent: agent
description: Initialiser le frontend React avec Vite et TypeScript
---

# id003 — Initialiser le frontend React avec Vite et TypeScript

## Objectif

Configurer le projet frontend avec React 18.x, Vite 5.x et TypeScript strict pour créer une application web permettant de saisir des questions et afficher les réponses du système RAG.

## Contexte

Le frontend fait partie du prototype RAG-TP (Retrieval-Augmented Generation). Il doit permettre :
- La saisie de questions par l'utilisateur
- L'affichage des réponses générées par le LLM
- L'affichage des sources utilisées pour la réponse

- Réf : [docs/04-decisions-architectures.md](docs/04-decisions-architectures.md) — ADR-002 (React + Vite)
- Réf : [docs/05-specifications-techniques.md](docs/05-specifications-techniques.md) — Stack technique, Structure du projet
- Réf : [docs/06-codage-guidelines.md](docs/06-codage-guidelines.md) — Conventions de nommage, Standards TypeScript
- Dépendances : `id001` (structure de dossiers)

## Pré-requis

- [x] Tâches dépendantes complétées : `id001`
- [ ] Node.js 20.x LTS (`node --version`)
- [ ] npm 10+ (`npm --version`)

## Fichiers impactés

| Fichier | Action | Description |
| ------- | ------ | ----------- |
| `project/frontend/package.json` | Créer | Manifest npm avec dépendances React/Vite/TypeScript |
| `project/frontend/tsconfig.json` | Créer | Configuration TypeScript stricte |
| `project/frontend/tsconfig.node.json` | Créer | Configuration TS pour Vite |
| `project/frontend/vite.config.ts` | Créer | Configuration Vite avec React plugin |
| `project/frontend/index.html` | Créer | Point d'entrée HTML |
| `project/frontend/src/main.tsx` | Créer | Point d'entrée React |
| `project/frontend/src/App.tsx` | Créer | Composant racine de l'application |
| `project/frontend/src/App.css` | Créer | Styles de base |
| `project/frontend/src/index.css` | Créer | Styles globaux |
| `project/frontend/src/vite-env.d.ts` | Créer | Déclarations de types Vite |

## Critères d'acceptation

- [ ] `npm install` réussit sans erreur dans `project/frontend`
- [ ] `npm run dev` démarre le serveur de développement Vite
- [ ] `npm run build` compile le projet sans erreur TypeScript
- [ ] `npx tsc --noEmit` valide le typage strict
- [ ] ESM activé (`type: "module"` dans package.json)
- [ ] React 18.x et Vite 5.x sont installés
- [ ] TypeScript est configuré en mode strict

## Tests requis

**Validation manuelle** :
- Le serveur de développement démarre sur le port par défaut (5173)
- La page affiche "RAG-TP" sans erreur console
- Hot Module Replacement fonctionne (modification = rechargement à chaud)

## Instructions

### Étape 1 : Créer package.json

**Fichier** : `project/frontend/package.json`

```json
{
  "name": "@rag-tp/frontend",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "~5.6.2",
    "vite": "^6.0.5"
  }
}
```

**Validation** : Fichier créé

---

### Étape 2 : Créer tsconfig.json

**Fichier** : `project/frontend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Validation** : `npx tsc --noEmit`

---

### Étape 3 : Créer tsconfig.node.json

**Fichier** : `project/frontend/tsconfig.node.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

**Validation** : Fichier créé

---

### Étape 4 : Créer vite.config.ts

**Fichier** : `project/frontend/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

**Validation** : `npm run dev`

---

### Étape 5 : Créer index.html

**Fichier** : `project/frontend/index.html`

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RAG-TP</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Validation** : Fichier créé

---

### Étape 6 : Créer src/vite-env.d.ts

**Fichier** : `project/frontend/src/vite-env.d.ts`

```typescript
/// <reference types="vite/client" />
```

**Validation** : Fichier créé

---

### Étape 7 : Créer src/index.css

**Fichier** : `project/frontend/src/index.css`

```css
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  min-width: 320px;
  min-height: 100vh;
}

#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
}
```

**Validation** : Fichier créé

---

### Étape 8 : Créer src/App.css

**Fichier** : `project/frontend/src/App.css`

```css
.app {
  text-align: center;
}

.app-header {
  margin-bottom: 2rem;
}

.app-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.app-header p {
  color: rgba(255, 255, 255, 0.6);
}
```

**Validation** : Fichier créé

---

### Étape 9 : Créer src/main.tsx

**Fichier** : `project/frontend/src/main.tsx`

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

**Validation** : Fichier créé

---

### Étape 10 : Créer src/App.tsx

**Fichier** : `project/frontend/src/App.tsx`

```tsx
import './App.css';

function App(): JSX.Element {
  return (
    <div className="app">
      <header className="app-header">
        <h1>RAG-TP</h1>
        <p>Retrieval-Augmented Generation — Prototype</p>
      </header>
      <main>
        <p>Frontend initialisé avec succès.</p>
      </main>
    </div>
  );
}

export default App;
```

**Validation** : `npm run dev` puis ouvrir http://localhost:5173

---

### Étape 11 : Installer les dépendances et valider

**Commandes** :

```bash
cd project/frontend
npm install
npm run dev
```

**Validation** :
- `npm install` réussit
- Le serveur démarre sans erreur
- La page affiche "RAG-TP"

---

### Étape 12 : Valider le build de production

**Commande** :

```bash
npm run build
```

**Validation** :
- `npm run build` réussit
- Le dossier `dist/` est créé avec les fichiers compilés

## Contraintes

- **TypeScript strict** : Toutes les options strictes activées (cf. `docs/06-codage-guidelines.md`)
- **ESM uniquement** : `type: "module"` obligatoire
- **React 18.x** : Utiliser createRoot (nouveau API React 18)
- **Vite 5.x ou 6.x** : Build moderne avec HMR
- **Proxy API** : Configurer le proxy vers le backend (port 3000)
- **Pas de any** : Typage explicite partout

## Definition of Done

- [ ] `npm install` réussit dans `project/frontend`
- [ ] `npm run dev` démarre le serveur Vite
- [ ] `npm run build` compile sans erreur
- [ ] `npx tsc --noEmit` valide le typage
- [ ] La page affiche "RAG-TP" dans le navigateur
- [ ] Tâche cochée dans `/TODO.md`

## Références

- [docs/04-decisions-architectures.md](docs/04-decisions-architectures.md) — ADR-002 (React)
- [docs/05-specifications-techniques.md](docs/05-specifications-techniques.md) — Stack technique
- [docs/06-codage-guidelines.md](docs/06-codage-guidelines.md) — Conventions TypeScript
