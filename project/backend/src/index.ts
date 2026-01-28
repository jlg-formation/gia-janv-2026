import express, { Request, Response, NextFunction } from 'express';
import { pino } from 'pino';
import 'dotenv/config';

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
