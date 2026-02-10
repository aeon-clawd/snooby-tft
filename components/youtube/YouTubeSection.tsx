'use client';

import { useState, useEffect } from 'react';
import { YouTubeVideo } from '@/lib/youtube';
import { Loader2, Youtube, ExternalLink, Calendar } from 'lucide-react';

interface YouTubeSectionProps {
  maxVideos?: number;
  showDescription?: boolean;
}

/**
 * YouTubeSection Component
 * 
 * Displays latest videos from Snoodyboo's YouTube channels
 * 
 * Features:
 * - Responsive grid layout (1 col mobile, 2 tablet, 3 desktop)
 * - Thumbnail hover effects
 * - External link to YouTube
 * - Loading states
 * - Error handling with fallback
 */
export default function YouTubeSection({ 
  maxVideos = 6,
  showDescription = false 
}: YouTubeSectionProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true);
        const response = await fetch(`/api/youtube?limit=${maxVideos}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar videos');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setVideos(data.data);
        } else {
          throw new Error(data.error || 'Error desconocido');
        }
      } catch (err: any) {
        console.error('Error fetching YouTube videos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [maxVideos]);

  // Format date to relative time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
    return `Hace ${Math.floor(diffDays / 365)} años`;
  };

  // Loading state
  if (loading) {
    return (
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Youtube className="w-8 h-8 text-red-500" />
          <h2 className="text-3xl font-bold text-zinc-100">Últimos Vídeos</h2>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Youtube className="w-8 h-8 text-red-500" />
          <h2 className="text-3xl font-bold text-zinc-100">Últimos Vídeos</h2>
        </div>
        
        <div className="bg-red-900/20 border border-red-900 rounded-lg p-6 text-center">
          <p className="text-zinc-400">
            No se pudieron cargar los vídeos en este momento
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors text-sm"
          >
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  // Empty state
  if (videos.length === 0) {
    return (
      <section className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Youtube className="w-8 h-8 text-red-500" />
          <h2 className="text-3xl font-bold text-zinc-100">Últimos Vídeos</h2>
        </div>
        
        <p className="text-zinc-400 text-center py-8">
          No hay vídeos disponibles
        </p>
      </section>
    );
  }

  return (
    <section className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Youtube className="w-8 h-8 text-red-500" />
          <h2 className="text-3xl font-bold text-zinc-100">Últimos Vídeos</h2>
        </div>
        
        <a
          href="https://www.youtube.com/@TFTconSnoody"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Ver canal
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <a
            key={video.id}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-zinc-800/50 border border-zinc-700 rounded-lg overflow-hidden hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden bg-zinc-900">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-red-600 rounded-full p-4">
                  <Youtube className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-zinc-100 group-hover:text-red-400 transition-colors line-clamp-2 mb-2">
                {video.title}
              </h3>
              
              {showDescription && (
                <p className="text-sm text-zinc-400 line-clamp-2 mb-3">
                  {video.description}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(video.publishedAt)}</span>
                <span className="text-zinc-600">•</span>
                <span>{video.channelTitle}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
