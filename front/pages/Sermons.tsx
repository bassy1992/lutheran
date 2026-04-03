import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlayCircle, 
  Download, 
  Calendar, 
  BookOpen, 
  Search,
  Filter,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Video,
  Music,
  Clock,
  X
} from 'lucide-react';
import { useAPI } from '../src/hooks/useAPI';
import { sermonsService } from '../src/services/api/endpoints/sermons.service';
import { churchService } from '../src/services/api/endpoints/church.service';
import SermonSeriesDisplay from '../components/SermonSeriesDisplay';
import ShareButtons from '../components/ShareButtons';
import WeeklyBulletin from '../components/WeeklyBulletin';
import { setMetaTags, resetMetaTags } from '../src/utils/metaTags';
import type { Sermon, SermonSeries, Pastor, PaginatedResponse } from '../src/types/models';

// Skeleton loader for sermon cards
const SkeletonSermonCard = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-48 bg-slate-200"></div>
    <div className="p-6 space-y-4">
      <div className="h-4 bg-slate-200 rounded w-24"></div>
      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
      </div>
      <div className="flex gap-4">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

// Error display component
interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
    <AlertCircle className="text-red-600 shrink-0 mt-1" size={24} />
    <div className="flex-1">
      <h3 className="font-bold text-red-900 mb-2">Unable to load sermons</h3>
      <p className="text-red-700 text-sm mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    </div>
  </div>
);

// Audio Player Component
interface AudioPlayerProps {
  sermon: Sermon;
  onPlay: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ sermon, onPlay }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  const handlePlay = () => {
    if (!hasPlayed) {
      onPlay();
      setHasPlayed(true);
    }
  };

  return (
    <div className="mt-4">
      <audio
        ref={audioRef}
        controls
        className="w-full"
        onPlay={handlePlay}
        src={sermon.audio_file || ''}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

// Video Player Component
interface VideoPlayerProps {
  sermon: Sermon;
  onPlay: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ sermon, onPlay }) => {
  const [hasPlayed, setHasPlayed] = useState(false);

  const handlePlay = () => {
    if (!hasPlayed) {
      onPlay();
      setHasPlayed(true);
    }
  };

  // Extract YouTube video ID if it's a YouTube URL
  const getYouTubeEmbedUrl = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
  };

  const embedUrl = sermon.video_url ? getYouTubeEmbedUrl(sermon.video_url) : null;

  if (embedUrl) {
    return (
      <div className="mt-4 aspect-video">
        <iframe
          src={embedUrl}
          title={sermon.title}
          className="w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={handlePlay}
        ></iframe>
      </div>
    );
  }

  // Fallback for non-YouTube videos
  return (
    <div className="mt-4">
      <video
        controls
        className="w-full rounded-lg"
        onPlay={handlePlay}
        src={sermon.video_url}
      >
        Your browser does not support the video element.
      </video>
    </div>
  );
};

const Sermons: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sermons' | 'bulletin' | 'pastors'>('sermons');
  const [page, setPage] = useState(1);
  const [pastorFilter, setPastorFilter] = useState<number | ''>('');
  const [seriesFilter, setSeriesFilter] = useState<number | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [expandedSermon, setExpandedSermon] = useState<number | null>(null);

  // Set meta tags for sermons page
  useEffect(() => {
    setMetaTags({
      title: 'Sermons - Trinity Lutheran Church Ghana',
      description: 'Listen to inspiring sermons from Trinity Lutheran Church Ghana. Explore messages by pastor, series, and date.',
      type: 'website'
    });

    return () => {
      resetMetaTags();
    };
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch pastors for filter dropdown
  const { 
    data: pastors, 
    loading: pastorsLoading 
  } = useAPI<Pastor[]>(() => churchService.getPastors());

  // Fetch sermon series for filter dropdown
  const { 
    data: seriesList, 
    loading: seriesLoading 
  } = useAPI<SermonSeries[]>(() => sermonsService.getSeries());

  // Fetch sermons with filters
  const { 
    data: sermonsResponse, 
    loading, 
    error,
    refetch 
  } = useAPI<PaginatedResponse<Sermon>>(
    () => sermonsService.getSermons({
      page,
      pastor: pastorFilter || undefined,
      series: seriesFilter || undefined,
      search: debouncedSearch || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined
    }),
    [page, pastorFilter, seriesFilter, debouncedSearch, dateFrom, dateTo]
  );

  const sermons = sermonsResponse?.results || [];
  const totalPages = sermonsResponse ? Math.ceil(sermonsResponse.count / 10) : 1;

  // Handle filter changes
  const handlePastorChange = (pastor: string) => {
    setPastorFilter(pastor === '' ? '' : parseInt(pastor));
    setPage(1);
  };

  const handleSeriesChange = (series: string) => {
    setSeriesFilter(series === '' ? '' : parseInt(series));
    setPage(1);
  };

  const handleDateFromChange = (date: string) => {
    setDateFrom(date);
    setPage(1);
  };

  const handleDateToChange = (date: string) => {
    setDateTo(date);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setPastorFilter('');
    setSeriesFilter('');
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
  };

  const hasActiveFilters = pastorFilter || seriesFilter || dateFrom || dateTo || debouncedSearch;

  // Handle sermon play/download
  const handleSermonPlay = async (sermonId: number) => {
    try {
      await sermonsService.incrementViewCount(sermonId);
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  };

  const handleSermonDownload = async (sermonId: number, audioUrl: string) => {
    try {
      await sermonsService.incrementDownloadCount(sermonId);
      // Trigger download
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `sermon-${sermonId}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to increment download count:', error);
    }
  };

  const toggleSermonExpansion = (sermonId: number) => {
    setExpandedSermon(expandedSermon === sermonId ? null : sermonId);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/HERO.jpeg" 
            alt="Sermons" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/60"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold">Sermons</h1>
            <p className="text-base md:text-xl text-slate-200">
              Listen to messages that inspire, challenge, and transform
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex gap-1 md:gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('sermons')}
              className={`px-4 md:px-6 py-3 md:py-4 font-semibold transition-all border-b-2 text-sm md:text-base whitespace-nowrap ${
                activeTab === 'sermons'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Sermons
            </button>
            <button
              onClick={() => setActiveTab('bulletin')}
              className={`px-4 md:px-6 py-3 md:py-4 font-semibold transition-all border-b-2 text-sm md:text-base whitespace-nowrap ${
                activeTab === 'bulletin'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly Bulletin
            </button>
            <button
              onClick={() => setActiveTab('pastors')}
              className={`px-4 md:px-6 py-3 md:py-4 font-semibold transition-all border-b-2 text-sm md:text-base whitespace-nowrap ${
                activeTab === 'pastors'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Our Pastors
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'bulletin' ? (
        <div className="container mx-auto px-4 md:px-8 py-6 md:py-8">
          <WeeklyBulletin />
        </div>
      ) : activeTab === 'pastors' ? (
        <div className="container mx-auto px-4 md:px-8 py-6 md:py-8">
          {/* Pastors Grid */}
          {pastorsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg md:rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="h-32 md:h-36 bg-slate-200"></div>
                  <div className="p-3 md:p-4 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : pastors && pastors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {pastors.filter(p => p.is_active).map((pastor) => (
                <div key={pastor.id} className="group bg-white rounded-lg md:rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100">
                  {/* Pastor Photo with Overlay */}
                  <div className="relative h-32 md:h-36 overflow-hidden bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-50">
                    {pastor.photo_display_url ? (
                      <>
                        <img 
                          src={pastor.photo_display_url}
                          alt={pastor.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-lg">
                          {pastor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                    )}
                    
                    {/* Role Badge */}
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 md:px-2.5 md:py-1 bg-blue-600/90 backdrop-blur-sm text-white rounded-md text-[9px] md:text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {pastor.role.replace('_', ' ')}
                      </span>
                    </div>
                    
                    {/* Sermon Count Badge */}
                    {pastor.sermon_count !== undefined && pastor.sermon_count > 0 && (
                      <div className="absolute bottom-2 left-2">
                        <div className="flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-1 bg-white/90 backdrop-blur-sm rounded-md shadow-sm">
                          <BookOpen size={10} className="md:w-3 md:h-3 text-blue-700" />
                          <span className="text-[9px] md:text-[10px] font-bold text-slate-700">{pastor.sermon_count} sermon{pastor.sermon_count !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pastor Details */}
                  <div className="p-3 md:p-4">
                    {/* Name and Bio */}
                    <div className="mb-2.5 md:mb-3">
                      <h3 className="text-sm md:text-base font-bold text-slate-900 leading-tight mb-0.5">{pastor.name}</h3>
                      <p className="text-slate-600 text-[10px] md:text-xs line-clamp-2 leading-snug">{pastor.bio}</p>
                    </div>

                    {/* Contact Info - Compact Grid */}
                    <div className="space-y-1 mb-2.5 md:mb-3">
                      {pastor.email && (
                        <a 
                          href={`mailto:${pastor.email}`}
                          className="flex items-center gap-1.5 text-[10px] md:text-xs text-slate-600 hover:text-blue-700 transition-colors group/link"
                        >
                          <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-50 rounded-md flex items-center justify-center flex-shrink-0 group-hover/link:bg-blue-100 transition-colors">
                            <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="truncate font-medium">{pastor.email}</span>
                        </a>
                      )}
                      {pastor.phone && (
                        <a 
                          href={`tel:${pastor.phone}`}
                          className="flex items-center gap-1.5 text-[10px] md:text-xs text-slate-600 hover:text-blue-700 transition-colors group/link"
                        >
                          <div className="w-5 h-5 md:w-6 md:h-6 bg-green-50 rounded-md flex items-center justify-center flex-shrink-0 group-hover/link:bg-green-100 transition-colors">
                            <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </div>
                          <span className="font-medium">{pastor.phone}</span>
                        </a>
                      )}
                    </div>

                    {/* View Sermons Button */}
                    {pastor.sermon_count && pastor.sermon_count > 0 && (
                      <button
                        onClick={() => {
                          setActiveTab('sermons');
                          setPastorFilter(pastor.id);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full px-3 py-2 text-[10px] md:text-xs bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md active:scale-95"
                      >
                        <PlayCircle size={12} className="md:w-3.5 md:h-3.5" />
                        View All Sermons
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 md:py-16">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <BookOpen size={32} className="md:w-10 md:h-10 text-slate-300" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-slate-900 mb-2">No pastors found</h3>
              <p className="text-sm md:text-base text-slate-600">Check back soon!</p>
            </div>
          )}
        </div>
      ) : (
        <>
      {/* Sermons Grid */}
      <section className="py-8 md:py-12 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          {/* Results Count */}
          {!loading && sermonsResponse && (
            <div className="mb-4 md:mb-6 text-slate-600 text-sm md:text-base">
              Showing {sermons.length > 0 ? ((page - 1) * 10 + 1) : 0} - {Math.min(page * 10, sermonsResponse.count)} of {sermonsResponse.count} sermons
            </div>
          )}

          {/* Error State */}
          {error && (
            <ErrorDisplay 
              message={error.message || 'Failed to load sermons'}
              onRetry={refetch}
            />
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonSermonCard key={i} />
              ))}
            </div>
          )}

          {/* Sermons Grid */}
          {!loading && !error && sermons.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {sermons.map((sermon) => (
                <div key={sermon.id} className="bg-white rounded-xl md:rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Sermon Thumbnail */}
                  <div className="relative h-40 md:h-48 overflow-hidden">
                    <img 
                      src={sermon.thumbnail || `https://picsum.photos/seed/sermon-${sermon.id}/600/400`}
                      alt={sermon.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    {sermon.is_featured && (
                      <div className="absolute top-2 md:top-4 left-2 md:left-4">
                        <span className="px-2 md:px-3 py-0.5 md:py-1 bg-yellow-500 text-white rounded-md md:rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider">
                          Featured
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 flex items-center justify-between text-white text-xs md:text-sm">
                      {sermon.duration && (
                        <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 md:py-1 rounded">
                          <Clock size={12} className="md:w-3.5 md:h-3.5" />
                          {sermon.duration}
                        </span>
                      )}
                      <div className="flex gap-1.5 md:gap-2">
                        {sermon.audio_file && (
                          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                            <Music size={12} className="md:w-3.5 md:h-3.5" />
                          </span>
                        )}
                        {sermon.video_url && (
                          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                            <Video size={12} className="md:w-3.5 md:h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sermon Details */}
                  <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                    <div className="space-y-1 md:space-y-1.5">
                      <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-slate-500">
                        <Calendar size={10} className="md:w-3 md:h-3" />
                        <span>
                          {new Date(sermon.date_preached).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-slate-900 line-clamp-2 leading-snug">
                        {sermon.title}
                      </h3>
                    </div>

                    {sermon.pastor && (
                      <p className="text-xs md:text-sm text-blue-700 font-medium">
                        {sermon.pastor.name}
                      </p>
                    )}

                    {sermon.scripture_reference && (
                      <p className="text-[10px] md:text-xs text-slate-600 flex items-center gap-1">
                        <BookOpen size={10} className="md:w-3 md:h-3" />
                        {sermon.scripture_reference}
                      </p>
                    )}

                    <div className="flex items-center gap-2 md:gap-3 text-[9px] md:text-[10px] text-slate-500">
                      <span className="flex items-center gap-0.5 md:gap-1">
                        <PlayCircle size={10} className="md:w-3 md:h-3" />
                        {sermon.view_count}
                      </span>
                      {sermon.audio_file && (
                        <span className="flex items-center gap-0.5 md:gap-1">
                          <Download size={10} className="md:w-3 md:h-3" />
                          {sermon.download_count}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1.5 md:gap-2 pt-1 md:pt-2">
                      {(sermon.audio_file || sermon.video_url) && (
                        <button
                          onClick={() => toggleSermonExpansion(sermon.id)}
                          className="flex-1 px-2 md:px-3 py-2 md:py-2.5 text-xs md:text-sm bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-1 md:gap-1.5"
                        >
                          <PlayCircle size={14} className="md:w-4 md:h-4" />
                          {expandedSermon === sermon.id ? 'Hide' : 'Play'}
                        </button>
                      )}
                      {sermon.audio_file && (
                        <button
                          onClick={() => handleSermonDownload(sermon.id, sermon.audio_file!)}
                          className="px-2 md:px-3 py-2 md:py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                          title="Download"
                        >
                          <Download size={14} className="md:w-4 md:h-4" />
                        </button>
                      )}
                    </div>

                    {/* Expanded Media Player */}
                    {expandedSermon === sermon.id && (
                      <div className="border-t border-slate-200 pt-2 md:pt-3">
                        {sermon.video_url ? (
                          <VideoPlayer 
                            sermon={sermon} 
                            onPlay={() => handleSermonPlay(sermon.id)} 
                          />
                        ) : sermon.audio_file ? (
                          <AudioPlayer 
                            sermon={sermon} 
                            onPlay={() => handleSermonPlay(sermon.id)} 
                          />
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && sermons.length === 0 && (
            <div className="text-center py-16">
              <BookOpen size={64} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No sermons found</h3>
              <p className="text-slate-600 mb-6">
                {hasActiveFilters 
                  ? 'Try adjusting your filters to see more sermons.'
                  : 'Check back soon for new sermons!'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && sermons.length > 0 && totalPages > 1 && (
            <div className="mt-8 md:mt-12 flex justify-center items-center gap-1.5 md:gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-1.5 md:p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} className="md:w-5 md:h-5" />
              </button>

              <div className="flex gap-1 md:gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-lg font-medium transition-colors ${
                        page === pageNum
                          ? 'bg-blue-700 text-white'
                          : 'border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-1.5 md:p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} className="md:w-5 md:h-5" />
              </button>
            </div>
          )}
        </div>
      </section>
      </>
      )}
    </div>
  );
};

export default Sermons;
