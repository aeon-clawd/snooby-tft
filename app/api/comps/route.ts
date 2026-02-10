import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Comp from '@/models/Comp';

/**
 * GET /api/comps
 * Lista todas las composiciones
 * Query params:
 * - tier: Filtrar por tier (S, A, B, C, D)
 * - champion: Filtrar por nombre de campeón
 * - synergy: Filtrar por sinergia
 * - isActive: true/false
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const tier = searchParams.get('tier');
    const champion = searchParams.get('champion');
    const synergy = searchParams.get('synergy');
    const isActive = searchParams.get('isActive');
    
    let query: any = {};
    
    if (tier) {
      query.tier = tier.toUpperCase();
    }
    
    if (champion) {
      query['champions.name'] = new RegExp(champion, 'i');
    }
    
    if (synergy) {
      query['synergies.name'] = new RegExp(synergy, 'i');
    }
    
    if (isActive !== null) {
      query.isActive = isActive === 'true';
    }
    
    const comps = await Comp.find(query)
      .sort({ tier: 1, createdAt: -1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      count: comps.length,
      data: comps
    });
    
  } catch (error: any) {
    console.error('GET /api/comps error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/comps
 * Crea una nueva composición
 * Requiere autenticación
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const body = await request.json();
    
    // Validar campos requeridos
    if (!body.name || !body.champions || !body.synergies || !body.tier) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, champions, synergies, tier' },
        { status: 400 }
      );
    }
    
    // Crear nueva comp
    const comp = await Comp.create(body);
    
    return NextResponse.json(
      {
        success: true,
        data: comp
      },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('POST /api/comps error:', error);
    
    // Errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
