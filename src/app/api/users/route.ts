import { NextResponse } from 'next/server';
import { getUsers, saveUsers } from '@/lib/dataStore';
import { UserAdmin } from '@/lib/types';

export async function GET() {
  const users = getUsers();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { nombre, email, password, rol, estado } = data;

    if (!nombre || !email || !password || !rol) {
      return NextResponse.json(
        { error: 'Todos los campos (nombre, correo, contraseña y rol) son requeridos' },
        { status: 400 }
      );
    }

    if (rol !== 'SUPER ADMIN' && rol !== 'SUPERVISOR') {
      return NextResponse.json(
        { error: 'El rol debe ser exactamente SUPER ADMIN o SUPERVISOR' },
        { status: 400 }
      );
    }

    const users = getUsers();
    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      return NextResponse.json(
        { error: 'Ya existe un usuario registrado con este correo electrónico' },
        { status: 400 }
      );
    }

    const newUser: UserAdmin = {
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      rol,
      estado: estado || 'Activo',
      fechaCreacion: new Date().toLocaleString('es-CO'),
      ultimoAcceso: 'Pendiente primer inicio'
    };

    users.push(newUser);
    saveUsers(users);

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear el usuario' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, nombre, email, password, rol, estado } = data;

    if (!id) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    const users = getUsers();
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    if (rol && rol !== 'SUPER ADMIN' && rol !== 'SUPERVISOR') {
      return NextResponse.json(
        { error: 'El rol debe ser exactamente SUPER ADMIN o SUPERVISOR' },
        { status: 400 }
      );
    }

    if (email) {
      const emailDuplicate = users.some(
        u => u.id !== id && u.email.toLowerCase() === email.toLowerCase()
      );
      if (emailDuplicate) {
        return NextResponse.json(
          { error: 'Ya existe otro usuario con este correo electrónico' },
          { status: 400 }
        );
      }
      users[index].email = email.trim().toLowerCase();
    }

    if (nombre) users[index].nombre = nombre.trim();
    if (password) users[index].password = password.trim();
    if (rol) users[index].rol = rol;
    if (estado) users[index].estado = estado;

    saveUsers(users);
    return NextResponse.json({ success: true, user: users[index] });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }

    const users = getUsers();
    const targetUser = users.find(u => u.id === id);

    if (!targetUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Safety: ensure at least one SUPER ADMIN remains
    if (targetUser.rol === 'SUPER ADMIN') {
      const superAdminCount = users.filter(u => u.rol === 'SUPER ADMIN').length;
      if (superAdminCount <= 1) {
        return NextResponse.json(
          { error: 'No se puede eliminar el único Administrador General (SUPER ADMIN) del sistema' },
          { status: 400 }
        );
      }
    }

    const updated = users.filter(u => u.id !== id);
    saveUsers(updated);

    return NextResponse.json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });
  }
}
