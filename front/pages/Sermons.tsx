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
      <section className="relative h-[400px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/sermons-hero/1920/600" 
            alt="Sermons" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/60"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">Sermons</h1>
            <p className="text-xl text-slate-200">
              Listen to messages that inspire, challenge, and transform
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('sermons')}
              className={`px-6 py-4 font-semibold transition-all border-b-2 ${
                activeTab === 'sermons'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Sermons
            </button>
            <button
              onClick={() => setActiveTab('bulletin')}
              className={`px-6 py-4 font-semibold transition-all border-b-2 ${
                activeTab === 'bulletin'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly Bulletin
            </button>
            <button
              onClick={() => setActiveTab('pastors')}
              className={`px-6 py-4 font-semibold transition-all border-b-2 ${
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
        <div className="container mx-auto px-4 md:px-8 py-12">
          <WeeklyBulletin />
        </div>
      ) : activeTab === 'pastors' ? (
        <div className="container mx-auto px-4 md:px-8 py-12">
          {/* Pastors Grid */}
          {pastorsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-64 bg-slate-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : pastors && pastors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastors.filter(p => p.is_active).map((pastor) => (
                <div key={pastor.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Pastor Photo */}
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
                    {pastor.photo_display_url ? (
                      <img 
                        src={pastor.photo_display_url}
                        alt={pastor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-4xl font-bold">
                          {pastor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>

                  {/* Pastor Details */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{pastor.name}</h3>
                      <p className="text-blue-700 font-medium">{pastor.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                    </div>

                    <p className="text-slate-600 text-sm line-clamp-4">{pastor.bio}</p>

                    <div className="space-y-2 text-sm text-slate-600">
                      {pastor.email && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <a href={`mailto:${pastor.email}`} className="hover:text-blue-700 transition-colors">
                            {pastor.email}
                          </a>
                        </div>
                      )}
                      {pastor.phone && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <a href={`tel:${pastor.phone}`} className="hover:text-blue-700 transition-colors">
                            {pastor.phone}
                          </a>
                        </div>
                      )}
                      {pastor.joined_date && (
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>Joined {new Date(pastor.joined_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        </div>
                      )}
                      {pastor.sermon_count !== undefined && pastor.sermon_count > 0 && (
                        <div className="flex items-center gap-2">
                          <BookOpen size={16} />
                          <span>{pastor.sermon_count} sermon{pastor.sermon_count !== 1 ? 's' : ''}</span>
                        </div>
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
                        className="w-full px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <PlayCircle size={18} />
                        View Sermons
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen size={64} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No pastors found</h3>
              <p className="text-slate-600">Check back soon!</p>
            </div>
          )}
        </div>
      ) : (
        <>
      {/* Sermon Series Display */}
      <SermonSeriesDisplay
        series={seriesList || []}
        selectedSeries={seriesFilter}
        onSeriesSelect={handleSeriesChange}
      />

      {/* Filters Section */}
      <section className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 md:px-8 py-6">
          <div className="space-y-4">
            {/* Filter Dropdowns and Date Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Pastor Filter */}
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" size={20} />
                <select
                  value={pastorFilter}
                  onChange={(e) => handlePastorChange(e.target.value)}
                  disabled={pastorsLoading}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer disabled:bg-slate-100"
                >
                  <option value="">All Pastors</option>
                  {pastors?.filter(p => p.is_active).map((pastor) => (
                    <option key={pastor.id} value={pastor.id}>
                      {pastor.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Series Filter */}
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" size={20} />
                <select
                  value={seriesFilter}
                  onChange={(e) => handleSeriesChange(e.target.value)}
                  disabled={seriesLoading}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer disabled:bg-slate-100"
                >
                  <option value="">All Series</option>
                  {seriesList?.filter(s => s.is_active).map((series) => (
                    <option key={series.id} value={series.id}>
                      {series.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" size={20} />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => handleDateFromChange(e.target.value)}
                  placeholder="From Date"
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Date To */}
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" size={20} />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => handleDateToChange(e.target.value)}
                  placeholder="To Date"
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-slate-600">Active filters:</span>
                {pastorFilter && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Pastor: {pastors?.find(p => p.id === pastorFilter)?.name}
                    <button
                      onClick={() => handlePastorChange('')}
                      className="hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {seriesFilter && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Series: {seriesList?.find(s => s.id === seriesFilter)?.title}
                    <button
                      onClick={() => handleSeriesChange('')}
                      className="hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {dateFrom && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    From: {new Date(dateFrom).toLocaleDateString()}
                    <button
                      onClick={() => handleDateFromChange('')}
                      className="hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {dateTo && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    To: {new Date(dateTo).toLocaleDateString()}
                    <button
                      onClick={() => handleDateToChange('')}
                      className="hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {debouncedSearch && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Search: "{debouncedSearch}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="hover:text-blue-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-700 hover:text-blue-900 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sermons Grid */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          {/* Results Count */}
          {!loading && sermonsResponse && (
            <div className="mb-6 text-slate-600">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sermons.map((sermon) => (
                <div key={sermon.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Sermon Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={sermon.thumbnail || `https://picsum.photos/seed/sermon-${sermon.id}/600/400`}
                      alt={sermon.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    {sermon.is_featured && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider">
                          Featured
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-sm">
                      {sermon.duration && (
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {sermon.duration}
                        </span>
                      )}
                      <div className="flex gap-2">
                        {sermon.audio_file && (
                          <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                            <Music size={14} />
                          </span>
                        )}
                        {sermon.video_url && (
                          <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                            <Video size={14} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sermon Details */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar size={14} />
                        <span>
                          {new Date(sermon.date_preached).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 line-clamp-2">
                        {sermon.title}
                      </h3>
                    </div>

                    {sermon.pastor && (
                      <p className="text-sm text-blue-700 font-medium">
                        By {sermon.pastor.name}
                      </p>
                    )}

                    {sermon.series && (
                      <p className="text-sm text-slate-600">
                        Series: {sermon.series.title}
                      </p>
                    )}

                    {sermon.scripture_reference && (
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <BookOpen size={14} />
                        {sermon.scripture_reference}
                      </p>
                    )}

                    <p className="text-slate-600 text-sm line-clamp-2">
                      {sermon.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <PlayCircle size={14} />
                        {sermon.view_count} views
                      </span>
                      {sermon.audio_file && (
                        <span className="flex items-center gap-1">
                          <Download size={14} />
                          {sermon.download_count} downloads
                        </span>
                      )}
                    </div>

                    {/* Share Buttons */}
                    <ShareButtons
                      title={sermon.title}
                      description={sermon.description}
                      className="py-4 border-t border-slate-200"
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {(sermon.audio_file || sermon.video_url) && (
                        <button
                          onClick={() => toggleSermonExpansion(sermon.id)}
                          className="flex-1 px-4 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <PlayCircle size={18} />
                          {expandedSermon === sermon.id ? 'Hide' : 'Play'}
                        </button>
                      )}
                      {sermon.audio_file && (
                        <button
                          onClick={() => handleSermonDownload(sermon.id, sermon.audio_file!)}
                          className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
                          title="Download Audio"
                        >
                          <Download size={18} />
                        </button>
                      )}
                    </div>

                    {/* Expanded Media Player */}
                    {expandedSermon === sermon.id && (
                      <div className="border-t border-slate-200 pt-4">
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
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-2">
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
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={20} />
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
