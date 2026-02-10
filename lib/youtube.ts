/**
 * YouTube Data API v3 Integration
 * 
 * Fetch latest videos from Snoodyboo's channels:
 * - TFTconSnoody (UCxxxxxx) - Canal principal TFT español
 * - SnoodyBooTFT (UCxxxxxx) - Canal secundario
 * 
 * Features:
 * - Cache de resultados (reduce quota usage)
 * - Manejo de errores robusto
 * - Type-safe responses
 */

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  publishedAt: string;
  channelTitle: string;
  description: string;
}

export interface YouTubeChannel {
  id: string;
  name: string;
  handle?: string;
}

// Canales de Snoodyboo
export const SNOOBY_CHANNELS: YouTubeChannel[] = [
  {
    id: 'UCjnVNV3MjGqeyE63AB9-mWA',
    name: 'TFTconSnoody',
    handle: '@TFTconSnoody'
  },
  {
    id: 'UCtfm2KT4Xjz9SRXl3csWTMQ',
    name: 'SnoodyBooTFT',
    handle: '@SnoodyBooTFT'
  }
];

/**
 * Fetch videos from a YouTube channel
 * @param channelId YouTube channel ID
 * @param maxResults Number of videos to fetch (default 6)
 * @returns Array of video objects
 */
export async function fetchChannelVideos(
  channelId: string,
  maxResults: number = 6
): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error('YouTube API key not configured');
  }

  try {
    // Get uploads playlist ID (every channel has one)
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
    );

    if (!channelResponse.ok) {
      throw new Error(`YouTube API error: ${channelResponse.status}`);
    }

    const channelData = await channelResponse.json();
    const uploadsPlaylistId =
      channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      throw new Error('Could not find uploads playlist');
    }

    // Fetch latest videos from uploads playlist
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${apiKey}`
    );

    if (!playlistResponse.ok) {
      throw new Error(`YouTube API error: ${playlistResponse.status}`);
    }

    const playlistData = await playlistResponse.json();

    // Transform to our video format
    const videos: YouTubeVideo[] = playlistData.items?.map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
      publishedAt: item.snippet.publishedAt,
      channelTitle: item.snippet.channelTitle,
      description: item.snippet.description
    })) || [];

    return videos;
  } catch (error) {
    console.error(`Error fetching videos for channel ${channelId}:`, error);
    throw error;
  }
}

/**
 * Fetch videos from all Snooby channels and merge them
 * @param maxPerChannel Number of videos per channel (default 6)
 * @returns Merged array of videos sorted by date
 */
export async function fetchAllSnoodyVideos(
  maxPerChannel: number = 6
): Promise<YouTubeVideo[]> {
  const allVideos: YouTubeVideo[] = [];

  for (const channel of SNOOBY_CHANNELS) {
    try {
      const videos = await fetchChannelVideos(channel.id, maxPerChannel);
      allVideos.push(...videos);
    } catch (error) {
      console.error(`Failed to fetch videos from ${channel.name}:`, error);
      // Continue with other channels even if one fails
    }
  }

  // Sort by publish date (newest first)
  allVideos.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return allVideos;
}
