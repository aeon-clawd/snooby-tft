import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Comp from '@/models/Comp';
import mongoose from 'mongoose';

/**
 * GET /api/comps/[id]
 * Obtiene una composición específica
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid comp ID' },
        { status: 400 }
      );
    }
    
    const comp = await Comp.findById(id).lean();
    
    if (!comp) {
      return NextResponse.json(
        { success: false, error: 'Comp not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: comp
    });
    
  } catch (error: any) {
    console.error('GET /api/comps/[id] error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/comps/[id]
 * Actualiza una composición
 * Requiere autenticación
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    
    const { id } = await params;
    
    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid comp ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Actualizar comp
    const comp = await Comp.findByIdAndUpdate(
      id,
      { $set: body },
      { 
        new: true, // Retornar el documento actualizado
        runValidators: true // Ejecutar validadores del schema
      }
    );
    
    if (!comp) {
      return NextResponse.json(
        { success: false, error: 'Comp not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: comp
    });
    
  } catch (error: any) {
    console.error('PUT /api/comps/[id] error:', error);
    
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

/**
 * DELETE /api/comps/[id]
 * Elimina una composición
 * Requiere autenticación
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    
    const { id } = await params;
    
    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid comp ID' },
        { status: 400 }
      );
    }
    
    const comp = await Comp.findByIdAndDelete(id);
    
    if (!comp) {
      return NextResponse.json(
        { success: false, error: 'Comp not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Comp deleted successfully',
      data: comp
    });
    
  } catch (error: any) {
    console.error('DELETE /api/comps/[id] error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
