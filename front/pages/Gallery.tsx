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
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-64 bg-slate-200"></div>
    <div className="p-6 space-y-4">
      <div className="h-6 bg-slate-200 rounded w-3/4"></div>
      <div className="h-4 bg-slate-200 rounded w-full"></div>
      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
      <div className="flex gap-4">
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        <div className="h-4 bg-slate-200 rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

// Error display
interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
    <AlertCircle className="text-red-600 shrink-0 mt-1" size={24} />
    <div className="flex-1">
      <h3 className="font-bold text-red-900 mb-2">Unable to load gallery</h3>
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
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/HERO.jpeg" 
            alt="Photo Gallery" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/60"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <Camera size={64} className="mx-auto" />
            <h1 className="text-4xl md:text-6xl font-bold">Photo Gallery</h1>
            <p className="text-xl text-slate-200">
              Capturing moments of faith, fellowship, and service
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Year Filter */}
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
              <select
                value={yearFilter}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
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
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-slate-600">Active filters:</span>
              {yearFilter && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Year: {yearFilter}
                  <button onClick={() => handleYearChange('')} className="hover:text-blue-900">
                    <X size={14} />
                  </button>
                </span>
              )}
              {debouncedSearch && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Search: "{debouncedSearch}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-blue-900">
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
      </section>

      {/* Albums Grid */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          {/* Results Count */}
          {!loading && albumsResponse && (
            <div className="mb-6 text-slate-600">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonAlbumCard key={i} />
              ))}
            </div>
          )}

          {/* Albums Grid */}
          {!loading && !error && albums.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album) => (
                <Link
                  key={album.id}
                  to={`/gallery/${album.id}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
                >
                  {/* Album Cover */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={album.cover_image || `https://picsum.photos/seed/album-${album.id}/600/400`}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    {album.is_featured && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider">
                          Featured
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-sm">
                      <span className="flex items-center gap-2">
                        <ImageIcon size={16} />
                        {album.photo_count} photos
                      </span>
                    </div>
                  </div>

                  {/* Album Details */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-slate-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {album.title}
                    </h3>
                    
                    <p className="text-slate-600 text-sm line-clamp-2">
                      {album.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar size={16} />
                      <span>
                        {new Date(album.date).toLocaleDateString('en-US', { 
                          month: 'long', 
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
            <div className="text-center py-16">
              <Camera size={64} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No albums found</h3>
              <p className="text-slate-600 mb-6">
                {hasActiveFilters 
                  ? 'Try adjusting your filters to see more albums.'
                  : 'Check back soon for new photo albums!'}
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
          {!loading && !error && albums.length > 0 && totalPages > 1 && (
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
    </div>
  );
};

export default Gallery;
