import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Comp from '@/models/Comp';

/**
 * Test endpoint to verify MongoDB connection and schema
 * GET /api/test-db
 */
export async function GET() {
  try {
    // Connect to database
    await dbConnect();
    
    // Count documents
    const count = await Comp.countDocuments();
    
    // Get one sample comp if exists
    const sampleComp = await Comp.findOne();
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      stats: {
        totalComps: count,
        sampleComp: sampleComp ? {
          id: sampleComp._id,
          name: sampleComp.name,
          tier: sampleComp.tier
        } : null
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Database connection failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
