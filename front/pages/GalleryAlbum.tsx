import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Camera, 
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2
} from 'lucide-react';
import { useAPI } from '../src/hooks/useAPI';
import { galleryService } from '../src/services/api/endpoints/gallery.service';
import ShareButtons from '../components/ShareButtons';
import { setMetaTags, resetMetaTags } from '../src/utils/metaTags';
import type { GalleryAlbum } from '../src/types/models';

const GalleryAlbumPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Fetch album with photos
  const { data: album, loading, error } = useAPI<GalleryAlbum>(
    () => galleryService.getAlbum(parseInt(id!)),
    [id]
  );

  // Set meta tags
  useEffect(() => {
    if (album) {
      setMetaTags({
        title: `${album.title} - Gallery - Trinity Lutheran Church Ghana`,
        description: album.description,
        type: 'website',
        image: album.cover_image || undefined
      });
    }

    return () => {
      resetMetaTags();
    };
  }, [album]);

  const photos = album?.photos || [];

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
    document.body.style.overflow = 'auto';
  };

  const goToPrevious = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Album not found</h2>
          <button
            onClick={() => navigate('/gallery')}
            className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium transition-colors"
          >
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Compact Header */}
      <section className="bg-slate-900 text-white py-6 md:py-8 lg:py-12">
        <div className="container mx-auto px-4 md:px-8">
          <button
            onClick={() => navigate('/gallery')}
            className="inline-flex items-center gap-1.5 md:gap-2 text-sm md:text-base text-slate-300 hover:text-white mb-4 md:mb-6 transition-colors"
          >
            <ArrowLeft size={16} className="md:w-5 md:h-5" />
            Back to Gallery
          </button>

          <div className="max-w-4xl">
            {album.is_featured && (
              <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 bg-yellow-500 text-white rounded-md md:rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wider mb-2 md:mb-3">
                Featured
              </span>
            )}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3">{album.title}</h1>
            <p className="text-sm md:text-base lg:text-lg text-slate-300 mb-4 md:mb-6">{album.description}</p>
            
            <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm text-slate-400">
              <div className="flex items-center gap-1.5 md:gap-2">
                <Calendar size={14} className="md:w-4 md:h-4" />
                <span>
                  {new Date(album.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <Camera size={14} className="md:w-4 md:h-4" />
                <span>{photos.length} photos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Share Section */}
      <section className="bg-white border-b border-slate-200 py-2 md:py-3">
        <div className="container mx-auto px-4 md:px-8">
          <ShareButtons
            title={album.title}
            description={album.description}
          />
        </div>
      </section>

      {/* Photos Grid - Optimized for Mobile */}
      <section className="py-4 md:py-6 lg:py-8 bg-slate-50">
        <div className="container mx-auto px-2 md:px-4 lg:px-8">
          {photos.length === 0 ? (
            <div className="text-center py-12 md:py-16">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <Camera size={32} className="md:w-12 md:h-12 text-slate-300" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-slate-900 mb-2">No photos yet</h3>
              <p className="text-sm md:text-base text-slate-600">Photos will be added soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => openLightbox(index)}
                  className="relative aspect-square overflow-hidden rounded-lg md:rounded-xl cursor-pointer group bg-slate-200"
                >
                  <img
                    src={photo.thumbnail || photo.image}
                    alt={photo.title || `Photo ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                  {photo.is_featured && (
                    <div className="absolute top-1 md:top-2 right-1 md:right-2">
                      <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-yellow-500 text-white rounded text-[10px] md:text-xs font-bold">
                        ★
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox - Mobile Optimized */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-2 md:top-4 right-2 md:right-4 p-1.5 md:p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <X size={24} className="md:w-8 md:h-8" />
          </button>

          {/* Previous Button */}
          {selectedPhotoIndex > 0 && (
            <button
              onClick={goToPrevious}
              className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 p-1 md:p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <ChevronLeft size={32} className="md:w-12 md:h-12" />
            </button>
          )}

          {/* Next Button */}
          {selectedPhotoIndex < photos.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 p-1 md:p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <ChevronRight size={32} className="md:w-12 md:h-12" />
            </button>
          )}

          {/* Image */}
          <div className="max-w-7xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center p-2 md:p-4">
            <img
              src={photos[selectedPhotoIndex].image}
              alt={photos[selectedPhotoIndex].title || `Photo ${selectedPhotoIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Photo Info */}
            <div className="mt-2 md:mt-4 text-center text-white max-w-2xl px-2">
              {photos[selectedPhotoIndex].title && (
                <p className="text-white text-sm md:text-base font-semibold mb-1 md:mb-2">{photos[selectedPhotoIndex].title}</p>
              )}
              {photos[selectedPhotoIndex].description && (
                <p className="text-slate-300 text-xs md:text-sm mb-1 md:mb-2">{photos[selectedPhotoIndex].description}</p>
              )}
              <div className="flex items-center justify-center gap-2 md:gap-4 text-[10px] md:text-xs text-slate-400">
                {photos[selectedPhotoIndex].photographer && (
                  <span>📷 {photos[selectedPhotoIndex].photographer}</span>
                )}
                <span className="font-medium">{selectedPhotoIndex + 1} / {photos.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryAlbumPage;
