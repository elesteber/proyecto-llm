import { Request, Response, NextFunction } from 'express';
import { sessionService, DetalleIdentidad } from '../services/session-service';
import { RolUsuario } from '@shared/types';

declare global {
  namespace Express {
    interface Request {
      user?: DetalleIdentidad;
    }
  }
}

export function sessionMiddleware(req: Request, res: Response, next: NextFunction): void {
  const cookieValue = req.cookies?.mira_session;
  let usuario: DetalleIdentidad | null = null;

  if (cookieValue) {
    usuario = sessionService.getUsuario(cookieValue);
    if (!usuario) {
      try {
        const decoded = decodeURIComponent(cookieValue);
        usuario = sessionService.getUsuario(decoded);
      } catch {
        usuario = null;
      }
    }
  }

  if (!usuario) {
    usuario = sessionService.getUsuarioPorDefecto();
  }

  req.user = usuario;
  next();
}

export function requireRole(...rolesPermitidos: RolUsuario[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
      res.status(403).json({
        error: `Acción no autorizada para el rol '${req.user?.rol || 'Desconocido'}'. Requiere uno de: ${rolesPermitidos.join(', ')}.`,
      });
      return;
    }
    next();
  };
}
