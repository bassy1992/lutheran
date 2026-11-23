import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Mail, Phone, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { ministriesService } from '../src/services/api/endpoints/ministries.service';
import type { Ministry, PaginatedResponse } from '../src/types/models';

const Ministries: React.FC = () => {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [expressInterestLoading, setExpressInterestLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
  };

  // Fetch ministries from backend
  const fetchMinistries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ministriesService.getMinistries({ search: debouncedSearch || undefined });
      setMinistries(data.results);
    } catch (err: any) {
      console.error('Error fetching ministries:', err);
      setError(err.response?.data?.detail || 'Failed to load ministries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinistries();
  }, [debouncedSearch]);

  // Handle express interest button click
  const handleExpressInterestClick = (ministry: Ministry) => {
    if (!isAuthenticated()) {
      setErrorMessage('Please log in to express interest in a ministry.');
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }
    setSelectedMinistry(ministry);
    setShowConfirmDialog(true);
  };

  // Handle express interest confirmation
  const handleExpressInterestConfirm = async () => {
    if (!selectedMinistry) return;

    try {
      setExpressInterestLoading(true);
      setErrorMessage(null);
      const response = await ministriesService.expressInterest(selectedMinistry.id);
      setSuccessMessage(response.message);
      setShowConfirmDialog(false);
      setSelectedMinistry(null);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Error expressing interest:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || 'Failed to express interest. Please try again.';
      setErrorMessage(errorMsg);
      
      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setExpressInterestLoading(false);
    }
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setShowConfirmDialog(false);
    setSelectedMinistry(null);
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg md:rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-40 md:h-48 bg-slate-200"></div>
      <div className="p-3 md:p-4 space-y-2 md:space-y-3">
        <div className="h-4 md:h-5 bg-slate-200 rounded w-3/4"></div>
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
        <div className="pt-2 md:pt-3 border-t border-slate-200 space-y-2">
          <div className="h-3 bg-slate-200 rounded w-2/3"></div>
          <div className="h-3 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  // Error state with retry
  if (error && !loading) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Unable to Load Ministries</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={fetchMinistries}
            className="bg-blue-700 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 pb-12 md:pb-16 container mx-auto px-4 md:px-8">
      {/* Compact Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12 space-y-2 md:space-y-3">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Our Ministries</h1>
        <p className="text-slate-600 text-sm md:text-base lg:text-lg">
          Find your place in our church family. There is a ministry for everyone.
        </p>
      </div>

      {/* Compact Search Bar */}
      <div className="max-w-2xl mx-auto mb-6 md:mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search ministries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 md:py-3 pl-10 md:pl-12 text-sm md:text-base border border-slate-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {debouncedSearch && (
          <p className="mt-2 text-xs md:text-sm text-slate-600">
            Searching for: <span className="font-semibold">"{debouncedSearch}"</span>
          </p>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="max-w-4xl mx-auto mb-4 md:mb-6 bg-green-50 border border-green-200 rounded-lg md:rounded-xl p-3 md:p-4 flex items-start gap-2 md:gap-3">
          <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto mb-4 md:mb-6 bg-red-50 border border-red-200 rounded-lg md:rounded-xl p-3 md:p-4 flex items-start gap-2 md:gap-3">
          <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Ministries Grid */}
          {ministries.length === 0 ? (
            <div className="text-center py-12 md:py-16">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <Users size={32} className="md:w-12 md:h-12 text-slate-300" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-slate-900 mb-2">No ministries found</h3>
              <p className="text-sm md:text-base text-slate-600 mb-4 md:mb-6">
                {debouncedSearch 
                  ? `No ministries match "${debouncedSearch}".`
                  : 'No active ministries available at the moment.'}
              </p>
              {debouncedSearch && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 md:px-6 md:py-3 text-sm md:text-base bg-blue-700 hover:bg-blue-800 text-white rounded-lg md:rounded-full font-medium transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
              {ministries.map((ministry) => (
                <div
                  key={ministry.id}
                  className="group bg-white rounded-lg md:rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-100"
                >
                  {/* Ministry Image */}
                  <Link to={`/ministries/${ministry.id}`} className="block relative overflow-hidden">
                    {(ministry.image_display_url || ministry.image) ? (
                      <img
                        src={ministry.image_display_url || ministry.image || ''}
                        alt={ministry.name}
                        className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-40 md:h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-800 transition-colors">
                        <Users className="w-12 h-12 md:w-16 md:h-16 text-white opacity-50" />
                      </div>
                    )}
                    {/* Member Count Badge */}
                    <div className="absolute bottom-2 right-2">
                      <div className="flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md shadow-sm">
                        <Users className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-700" />
                        <span className="text-[10px] md:text-xs font-bold text-slate-700">{ministry.member_count}</span>
                      </div>
                    </div>
                  </Link>

                  {/* Ministry Details */}
                  <div className="p-3 md:p-4 space-y-2 md:space-y-3">
                    <Link to={`/ministries/${ministry.id}`}>
                      <h3 className="text-base md:text-lg font-bold text-slate-900 hover:text-blue-700 transition-colors line-clamp-1">{ministry.name}</h3>
                    </Link>
                    <p className="text-slate-600 text-xs md:text-sm line-clamp-2 leading-snug">{ministry.description}</p>

                    {/* Leader Information - Compact */}
                    {ministry.leader && (
                      <div className="pt-2 md:pt-3 border-t border-slate-200 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 md:w-7 md:h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Users className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-700" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] md:text-[10px] text-slate-500 font-medium uppercase tracking-wide">Leader</p>
                            <p className="text-xs md:text-sm text-slate-900 font-semibold truncate">{ministry.leader.full_name}</p>
                          </div>
                        </div>
                        
                        {ministry.leader.email && (
                          <a
                            href={`mailto:${ministry.leader.email}`}
                            className="flex items-center gap-1.5 text-[10px] md:text-xs text-slate-600 hover:text-blue-700 transition-colors group/link"
                          >
                            <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-50 rounded-md flex items-center justify-center flex-shrink-0 group-hover/link:bg-blue-100 transition-colors">
                              <Mail className="w-2.5 h-2.5 md:w-3 md:h-3 text-blue-600" />
                            </div>
                            <span className="truncate font-medium">{ministry.leader.email}</span>
                          </a>
                        )}
                        
                        {ministry.leader.phone && (
                          <a
                            href={`tel:${ministry.leader.phone}`}
                            className="flex items-center gap-1.5 text-[10px] md:text-xs text-slate-600 hover:text-blue-700 transition-colors group/link"
                          >
                            <div className="w-5 h-5 md:w-6 md:h-6 bg-green-50 rounded-md flex items-center justify-center flex-shrink-0 group-hover/link:bg-green-100 transition-colors">
                              <Phone className="w-2.5 h-2.5 md:w-3 md:h-3 text-green-600" />
                            </div>
                            <span className="font-medium">{ministry.leader.phone}</span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-1">
                      <Link
                        to={`/ministries/${ministry.id}`}
                        className="flex-1 bg-slate-100 text-slate-700 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold hover:bg-slate-200 transition-all text-center"
                      >
                        Details
                      </Link>
                      {isAuthenticated() && (
                        <button
                          onClick={() => handleExpressInterestClick(ministry)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all active:scale-95"
                        >
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && selectedMinistry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl md:rounded-2xl max-w-md w-full p-5 md:p-8 space-y-4 md:space-y-6">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900">Confirm Interest</h3>
            <p className="text-sm md:text-base text-slate-600">
              Are you sure you want to express interest in joining <strong>{selectedMinistry.name}</strong>?
            </p>
            <p className="text-xs md:text-sm text-slate-500">
              The ministry leader will be notified and will contact you soon.
            </p>

            <div className="flex gap-3 md:gap-4">
              <button
                onClick={handleDialogClose}
                disabled={expressInterestLoading}
                className="flex-1 bg-slate-200 text-slate-700 py-2.5 md:py-3 rounded-lg md:rounded-full text-sm md:text-base font-bold hover:bg-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleExpressInterestConfirm}
                disabled={expressInterestLoading}
                className="flex-1 bg-blue-700 text-white py-2.5 md:py-3 rounded-lg md:rounded-full text-sm md:text-base font-bold hover:bg-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {expressInterestLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                    <span className="text-sm md:text-base">Submitting...</span>
                  </>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ministries;
