import { Request, Response } from 'express';
import { sessionService } from '../services/session-service';

export class SessionController {
  getCurrent(req: Request, res: Response): void {
    const usuarioActivo = req.user || sessionService.getUsuarioPorDefecto();
    const catalogoIdentidades = sessionService.getCatalogo();

    res.status(200).json({
      usuarioActivo,
      catalogoIdentidades,
    });
  }

  switchUser(req: Request, res: Response): void {
    const { nuevoUsuario } = req.body || {};

    if (!nuevoUsuario || !sessionService.esIdentidadValida(nuevoUsuario)) {
      res.status(400).json({
        error: 'Identidad no autorizada. Debe seleccionar una de las 5 identidades oficiales: Diseñador 1, Diseñador 2, Administrador 1, Administrador 2, Operador 1.',
      });
      return;
    }

    const usuario = sessionService.getUsuario(nuevoUsuario)!;

    // Express res.cookie encodes automatically
    res.cookie('mira_session', nuevoUsuario, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });

    res.status(200).json({
      mensaje: `Sesión conmutada exitosamente a '${nuevoUsuario}'.`,
      usuarioActivo: {
        nombre: usuario.nombre,
        rol: usuario.rol,
      },
    });
  }
}

export const sessionController = new SessionController();
