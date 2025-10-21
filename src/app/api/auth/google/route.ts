import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { googleId, email, name, picture } = await request.json();

    if (!googleId || !email || !name) {
      return NextResponse.json(
        { error: 'Dados do Google incompletos' },
        { status: 400 }
      );
    }

    // TODO: Em produção, buscar ou criar usuário no banco de dados
    // Exemplo:
    // let user = await prisma.user.findUnique({ where: { googleId } })
    // if (!user) {
    //   user = await prisma.user.create({ data: { googleId, email, name, picture } })
    // }
    
    // Para desenvolvimento, criar/retornar usuário mock
    const user = {
      id: googleId,
      name: name,
      email: email,
      picture: picture || null,
      googleId: googleId,
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      user: user,
      message: 'Autenticação com Google realizada com sucesso'
    });

  } catch (error: any) {
    console.error('Google Auth Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao autenticar com Google',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
