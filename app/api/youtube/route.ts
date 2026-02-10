import { NextRequest, NextResponse } from 'next/server';
import { fetchAllSnoodyVideos, type YouTubeVideo } from '@/lib/youtube';

/**
 * YouTube Videos API Route
 * 
 * GET /api/youtube
 * Returns latest videos from Snoodyboo's YouTube channels
 * 
 * Cache Strategy:
 * - Server-side cache for 1 hour (reduce API quota usage)
 * - Client can request fresh data with ?fresh=true
 * 
 * Response Format:
 * {
 *   success: true,
 *   data: YouTubeVideo[],
 *   cached: boolean,
 *   cachedAt: string
 * }
 */

// Cache structure
interface VideoCache {
  videos: YouTubeVideo[];
  timestamp: number;
}

// In-memory cache (persists during server runtime)
let cache: VideoCache | null = null;

// Cache TTL: 1 hour (3600 seconds)
const CACHE_TTL = 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const forceFresh = searchParams.get('fresh') === 'true';
    const limit = parseInt(searchParams.get('limit') || '12');

    // Check cache validity
    const now = Date.now();
    const isCacheValid = cache && (now - cache.timestamp < CACHE_TTL);

    // Return cached data if valid and not forcing fresh
    if (isCacheValid && !forceFresh) {
      return NextResponse.json({
        success: true,
        data: cache!.videos.slice(0, limit),
        cached: true,
        cachedAt: new Date(cache!.timestamp).toISOString()
      });
    }

    // Fetch fresh data from YouTube API
    console.log('Fetching fresh YouTube data...');
    const videos = await fetchAllSnoodyVideos(6);

    // Update cache
    cache = {
      videos,
      timestamp: now
    };

    return NextResponse.json({
      success: true,
      data: videos.slice(0, limit),
      cached: false,
      cachedAt: new Date(now).toISOString()
    });

  } catch (error: any) {
    console.error('YouTube API error:', error);
    
    // Return cached data as fallback if available
    if (cache) {
      return NextResponse.json({
        success: true,
        data: cache.videos,
        cached: true,
        cachedAt: new Date(cache.timestamp).toISOString(),
        warning: 'Using cached data due to API error'
      });
    }

    // No cache available, return error
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch YouTube videos',
        message: error.message
      },
      { status: 500 }
    );
  }
}

// Optional: Add cache clearing endpoint
export async function DELETE() {
  cache = null;
  
  return NextResponse.json({
    success: true,
    message: 'Cache cleared'
  });
}
