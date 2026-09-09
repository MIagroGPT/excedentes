import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUsers, saveUsers } from '@/lib/dataStore';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Por favor ingresa correo y contraseña' },
        { status: 400 }
      );
    }

    const users = getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const userIndex = users.findIndex(
      u => u.email.toLowerCase() === cleanEmail && u.password === cleanPass
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'Correo o contraseña incorrectos. Verifica tus datos.' },
        { status: 401 }
      );
    }

    const matchedUser = users[userIndex];

    if (matchedUser.estado === 'Inactivo') {
      return NextResponse.json(
        { error: 'Tu usuario se encuentra desactivado. Contacta al Administrador General.' },
        { status: 403 }
      );
    }

    // Update ultimoAcceso
    matchedUser.ultimoAcceso = new Date().toLocaleString('es-CO');
    users[userIndex] = matchedUser;
    saveUsers(users);

    // Create session payload
    const safeUser = {
      id: matchedUser.id,
      nombre: matchedUser.nombre,
      email: matchedUser.email,
      rol: matchedUser.rol,
      estado: matchedUser.estado,
      ultimoAcceso: matchedUser.ultimoAcceso
    };

    const sessionData = Buffer.from(JSON.stringify(safeUser)).toString('base64');

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('raees_auth_session', sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return NextResponse.json({
      success: true,
      user: safeUser
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error interno en el servidor de autenticación' },
      { status: 500 }
    );
  }
}
