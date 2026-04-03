import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  Calendar, 
  Image as ImageIcon, 
  Search,
  Filter,
  X,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAPI } from '../src/hooks/useAPI';
import { galleryService } from '../src/services/api/endpoints/gallery.service';
import { setMetaTags, resetMetaTags } from '../src/utils/metaTags';
import type { GalleryAlbum, PaginatedResponse } from '../src/types/models';

// Skeleton loader
const SkeletonAlbumCard = () => (
  <div className="bg-white rounded-lg md:rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="h-40 md:h-48 bg-slate-200"></div>
    <div className="p-3 md:p-4 space-y-2 md:space-y-3">
      <div className="h-4 md:h-5 bg-slate-200 rounded w-3/4"></div>
      <div className="h-3 bg-slate-200 rounded w-full"></div>
      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
    </div>
  </div>
);

// Error display
interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg md:rounded-xl p-4 md:p-6 flex items-start gap-3 md:gap-4">
    <AlertCircle className="text-red-600 shrink-0 mt-0.5 md:mt-1" size={20} />
    <div className="flex-1">
      <h3 className="font-bold text-sm md:text-base text-red-900 mb-1 md:mb-2">Unable to load gallery</h3>
      <p className="text-red-700 text-xs md:text-sm mb-3 md:mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
      >
        <RefreshCw size={14} className="md:w-4 md:h-4" />
        Try Again
      </button>
    </div>
  </div>
);

const Gallery: React.FC = () => {
  const [page, setPage] = useState(1);
  const [yearFilter, setYearFilter] = useState<number | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Set meta tags
  useEffect(() => {
    setMetaTags({
      title: 'Photo Gallery - Trinity Lutheran Church Ghana',
      description: 'Browse photos from our church events, services, and community activities.',
      type: 'website'
    });

    return () => {
      resetMetaTags();
    };
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch available years
  const { data: yearsData } = useAPI(() => galleryService.getYears());
  const years = yearsData?.years || [];

  // Fetch albums
  const { 
    data: albumsResponse, 
    loading, 
    error,
    refetch 
  } = useAPI<PaginatedResponse<GalleryAlbum>>(
    () => galleryService.getAlbums({
      page,
      year: yearFilter || undefined,
      search: debouncedSearch || undefined
    }),
    [page, yearFilter, debouncedSearch]
  );

  const albums = albumsResponse?.results || [];
  const totalPages = albumsResponse ? Math.ceil(albumsResponse.count / 10) : 1;

  const handleYearChange = (year: string) => {
    setYearFilter(year === '' ? '' : parseInt(year));
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearFilters = () => {
    setYearFilter('');
    setSearchQuery('');
  };

  const hasActiveFilters = yearFilter || debouncedSearch;

  return (
    <div className="w-full">
      {/* Compact Hero Section */}
      <section className="relative h-[250px] md:h-[350px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/HERO.jpeg" 
            alt="Photo Gallery" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/60"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-2 md:space-y-3">
            <Camera size={40} className="md:w-16 md:h-16 mx-auto" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Photo Gallery</h1>
            <p className="text-sm md:text-base lg:text-lg text-slate-200">
              Capturing moments of faith, fellowship, and service
            </p>
          </div>
        </div>
      </section>

      {/* Compact Filters Section */}
      <section className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 md:px-8 py-3 md:py-4">
          <div className="flex flex-col md:flex-row gap-2 md:gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-3 py-2 md:py-2.5 text-sm md:text-base border border-slate-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Year Filter */}
            <div className="relative min-w-[140px] md:min-w-[180px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              <select
                value={yearFilter}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-3 py-2 md:py-2.5 text-sm md:text-base border border-slate-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-2 md:mt-3 flex flex-wrap gap-1.5 md:gap-2 items-center">
              <span className="text-xs md:text-sm text-slate-600">Filters:</span>
              {yearFilter && (
                <span className="inline-flex items-center gap-1 md:gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] md:text-xs font-medium">
                  {yearFilter}
                  <button onClick={() => handleYearChange('')} className="hover:text-blue-900">
                    <X size={12} className="md:w-3.5 md:h-3.5" />
                  </button>
                </span>
              )}
              {debouncedSearch && (
                <span className="inline-flex items-center gap-1 md:gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] md:text-xs font-medium">
                  "{debouncedSearch}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-blue-900">
                    <X size={12} className="md:w-3.5 md:h-3.5" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-[10px] md:text-xs text-blue-700 hover:text-blue-900 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Albums Grid */}
      <section className="py-6 md:py-8 lg:py-12 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          {/* Results Count */}
          {!loading && albumsResponse && (
            <div className="mb-4 md:mb-6 text-xs md:text-sm text-slate-600">
              Showing {albums.length > 0 ? ((page - 1) * 10 + 1) : 0} - {Math.min(page * 10, albumsResponse.count)} of {albumsResponse.count} albums
            </div>
          )}

          {/* Error State */}
          {error && (
            <ErrorDisplay 
              message={error.message || 'Failed to load gallery albums'}
              onRetry={refetch}
            />
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <SkeletonAlbumCard key={i} />
              ))}
            </div>
          )}

          {/* Albums Grid */}
          {!loading && !error && albums.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {albums.map((album) => (
                <Link
                  key={album.id}
                  to={`/gallery/${album.id}`}
                  className="group bg-white rounded-lg md:rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-slate-100"
                >
                  {/* Album Cover */}
                  <div className="relative h-40 md:h-48 overflow-hidden">
                    <img 
                      src={album.cover_image || `https://picsum.photos/seed/album-${album.id}/600/400`}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    {album.is_featured && (
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 md:px-2.5 md:py-1 bg-yellow-500 text-white rounded-md text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                          Featured
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md shadow-sm">
                        <ImageIcon size={12} className="md:w-3.5 md:h-3.5 text-blue-700" />
                        <span className="text-[10px] md:text-xs font-bold text-slate-700">{album.photo_count}</span>
                      </div>
                    </div>
                  </div>

                  {/* Album Details */}
                  <div className="p-2.5 md:p-3 space-y-1.5 md:space-y-2">
                    <h3 className="text-xs md:text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
                      {album.title}
                    </h3>
                    
                    <p className="text-slate-600 text-[10px] md:text-xs line-clamp-2 leading-snug">
                      {album.description}
                    </p>

                    <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-slate-500">
                      <Calendar size={10} className="md:w-3 md:h-3" />
                      <span>
                        {new Date(album.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && albums.length === 0 && (
            <div className="text-center py-12 md:py-16">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <Camera size={32} className="md:w-12 md:h-12 text-slate-300" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-slate-900 mb-2">No albums found</h3>
              <p className="text-sm md:text-base text-slate-600 mb-4 md:mb-6">
                {hasActiveFilters 
                  ? 'Try adjusting your filters to see more albums.'
                  : 'Check back soon for new photo albums!'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 md:px-6 md:py-3 text-sm md:text-base bg-blue-700 hover:bg-blue-800 text-white rounded-lg md:rounded-xl font-medium transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && albums.length > 0 && totalPages > 1 && (
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
                      className={`px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-lg font-medium transition-colors ${
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
    </div>
  );
};

export default Gallery;
