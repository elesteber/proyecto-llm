import { IdentidadSimulada, RolUsuario, UsuarioActivo } from '@shared/types';

export interface DetalleIdentidad extends UsuarioActivo {
  nombre: IdentidadSimulada;
  rol: RolUsuario;
  descripcion: string;
}

export const CATALOGO_IDENTIDADES: Record<IdentidadSimulada, DetalleIdentidad> = {
  'Diseñador 1': {
    nombre: 'Diseñador 1',
    rol: 'Diseñador',
    descripcion: 'Usuario autorizado para proponer y editar borradores de umbrales.',
  },
  'Diseñador 2': {
    nombre: 'Diseñador 2',
    rol: 'Diseñador',
    descripcion: 'Usuario autorizado para proponer y editar borradores de umbrales.',
  },
  'Administrador 1': {
    nombre: 'Administrador 1',
    rol: 'Administrador',
    descripcion: 'Usuario con rol administrativo para aprobar o desestimar propuestas de umbrales.',
  },
  'Administrador 2': {
    nombre: 'Administrador 2',
    rol: 'Administrador',
    descripcion: 'Usuario con rol administrativo para aprobar o desestimar propuestas de umbrales.',
  },
  'Operador 1': {
    nombre: 'Operador 1',
    rol: 'Operador',
    descripcion: 'Usuario operador autorizado para ejecutar evaluaciones de casos.',
  },
};

export const USUARIO_POR_DEFECTO: IdentidadSimulada = 'Diseñador 1';

export class SessionService {
  getCatalogo(): Array<{ nombre: IdentidadSimulada; rol: RolUsuario }> {
    return Object.values(CATALOGO_IDENTIDADES).map((id) => ({
      nombre: id.nombre,
      rol: id.rol,
    }));
  }

  esIdentidadValida(nombre: string): nombre is IdentidadSimulada {
    return Object.prototype.hasOwnProperty.call(CATALOGO_IDENTIDADES, nombre);
  }

  getUsuario(nombre: string): DetalleIdentidad | null {
    if (this.esIdentidadValida(nombre)) {
      return CATALOGO_IDENTIDADES[nombre];
    }
    return null;
  }

  getUsuarioPorDefecto(): DetalleIdentidad {
    return CATALOGO_IDENTIDADES[USUARIO_POR_DEFECTO];
  }
}

export const sessionService = new SessionService();
