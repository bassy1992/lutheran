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
      {/* Header */}
      <section className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 md:px-8">
          <button
            onClick={() => navigate('/gallery')}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Gallery
          </button>

          <div className="max-w-4xl">
            {album.is_featured && (
              <span className="inline-block px-3 py-1 bg-yellow-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider mb-4">
                Featured Album
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{album.title}</h1>
            <p className="text-xl text-slate-300 mb-6">{album.description}</p>
            
            <div className="flex flex-wrap gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>
                  {new Date(album.date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Camera size={16} />
                <span>{photos.length} photos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="bg-white border-b border-slate-200 py-4">
        <div className="container mx-auto px-4 md:px-8">
          <ShareButtons
            title={album.title}
            description={album.description}
          />
        </div>
      </section>

      {/* Photos Grid */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          {photos.length === 0 ? (
            <div className="text-center py-16">
              <Camera size={64} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No photos yet</h3>
              <p className="text-slate-600">Photos will be added soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => openLightbox(index)}
                  className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
                >
                  <img
                    src={photo.thumbnail || photo.image}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                  {photo.is_featured && (
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 bg-yellow-500 text-white rounded text-xs font-bold">
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

      {/* Lightbox */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
          >
            <X size={32} />
          </button>

          {/* Previous Button */}
          {selectedPhotoIndex > 0 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <ChevronLeft size={48} />
            </button>
          )}

          {/* Next Button */}
          {selectedPhotoIndex < photos.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <ChevronRight size={48} />
            </button>
          )}

          {/* Image */}
          <div className="max-w-7xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center p-4">
            <img
              src={photos[selectedPhotoIndex].image}
              alt={`Photo ${selectedPhotoIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Photo Info */}
            <div className="mt-4 text-center text-white max-w-2xl">
              {photos[selectedPhotoIndex].description && (
                <p className="text-slate-300 text-sm mb-2">{photos[selectedPhotoIndex].description}</p>
              )}
              <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
                {photos[selectedPhotoIndex].photographer && (
                  <span>📷 {photos[selectedPhotoIndex].photographer}</span>
                )}
                <span>{selectedPhotoIndex + 1} / {photos.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryAlbumPage;
