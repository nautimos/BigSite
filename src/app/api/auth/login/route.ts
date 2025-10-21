import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-mail e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'E-mail ou senha inválidos' },
        { status: 401 }
      );
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'E-mail ou senha inválidos' },
        { status: 401 }
      );
    }

    // Return user without password hash
    const { passwordHash, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Login realizado com sucesso'
    });

  } catch (error: any) {
    console.error('Login Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao processar login',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
