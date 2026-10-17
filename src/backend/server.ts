import { app } from './app.js';
import { config } from './config/env.js';
import { getDatabase } from './db/database.js';

// Inicializar base de datos relacional
getDatabase();

export { app };

if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => {
    console.log(`[SERVER] Backend MIRA escuchando en http://localhost:${config.port}`);
  });
}

export default app;
