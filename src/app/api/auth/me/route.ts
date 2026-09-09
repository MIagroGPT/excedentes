import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUsers } from '@/lib/dataStore';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('raees_auth_session');

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = JSON.parse(
      Buffer.from(sessionCookie.value, 'base64').toString('utf-8')
    );

    // Verify user still exists and is active in DB
    const users = getUsers();
    const currentUser = users.find(u => u.id === payload.id);

    if (!currentUser || currentUser.estado === 'Inactivo') {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: currentUser.id,
        nombre: currentUser.nombre,
        email: currentUser.email,
        rol: currentUser.rol,
        estado: currentUser.estado,
        ultimoAcceso: currentUser.ultimoAcceso
      }
    });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
