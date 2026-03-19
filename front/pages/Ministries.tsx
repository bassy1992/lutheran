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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-64 bg-slate-200"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        <div className="space-y-2 pt-4">
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
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
    <div className="pt-32 pb-20 container mx-auto px-4">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Our Ministries</h1>
        <p className="text-slate-600 text-lg">
          Find your place in our church family. There is a ministry for everyone at Trinity Lutheran Church.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            placeholder="Search ministries by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 pl-14 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {debouncedSearch && (
          <p className="mt-3 text-sm text-slate-600">
            Searching for: <span className="font-semibold">"{debouncedSearch}"</span>
          </p>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="max-w-4xl mx-auto mb-8 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto mb-8 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Ministries Grid */}
          {ministries.length === 0 ? (
            <div className="text-center py-12">
              <Users size={64} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No ministries found</h3>
              <p className="text-slate-600 text-lg mb-6">
                {debouncedSearch 
                  ? `No ministries match "${debouncedSearch}". Try a different search term.`
                  : 'No active ministries available at the moment.'}
              </p>
              {debouncedSearch && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-full font-medium transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ministries.map((ministry) => (
                <div
                  key={ministry.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Ministry Image */}
                  <Link to={`/ministries/${ministry.id}`}>
                    {ministry.image ? (
                      <img
                        src={ministry.image}
                        alt={ministry.name}
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center hover:from-blue-600 hover:to-blue-800 transition-colors">
                        <Users className="w-20 h-20 text-white opacity-50" />
                      </div>
                    )}
                  </Link>

                  {/* Ministry Details */}
                  <div className="p-6 space-y-4">
                    <Link to={`/ministries/${ministry.id}`}>
                      <h3 className="text-2xl font-bold text-slate-900 hover:text-blue-700 transition-colors">{ministry.name}</h3>
                    </Link>
                    <p className="text-slate-600 line-clamp-3">{ministry.description}</p>

                    {/* Leader Information */}
                    {ministry.leader && (
                      <div className="pt-4 border-t border-slate-200 space-y-2">
                        <p className="text-sm font-semibold text-slate-700">Ministry Leader</p>
                        <p className="text-slate-900 font-medium">{ministry.leader.full_name}</p>
                        
                        {ministry.leader.email && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-4 h-4" />
                            <a
                              href={`mailto:${ministry.leader.email}`}
                              className="hover:text-blue-700 transition-colors"
                            >
                              {ministry.leader.email}
                            </a>
                          </div>
                        )}
                        
                        {ministry.leader.phone && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-4 h-4" />
                            <a
                              href={`tel:${ministry.leader.phone}`}
                              className="hover:text-blue-700 transition-colors"
                            >
                              {ministry.leader.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Member Count */}
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users className="w-5 h-5" />
                      <span className="text-sm">
                        {ministry.member_count} {ministry.member_count === 1 ? 'member' : 'members'}
                      </span>
                    </div>

                    {/* View Details & Express Interest Buttons */}
                    <div className="flex gap-3">
                      <Link
                        to={`/ministries/${ministry.id}`}
                        className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-full font-bold hover:bg-slate-200 transition-all text-center"
                      >
                        View Details
                      </Link>
                      {isAuthenticated() && (
                        <button
                          onClick={() => handleExpressInterestClick(ministry)}
                          className="flex-1 bg-blue-700 text-white py-3 rounded-full font-bold hover:bg-blue-800 transition-all"
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
          <div className="bg-white rounded-2xl max-w-md w-full p-8 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Confirm Interest</h3>
            <p className="text-slate-600">
              Are you sure you want to express interest in joining <strong>{selectedMinistry.name}</strong>?
            </p>
            <p className="text-sm text-slate-500">
              The ministry leader will be notified and will contact you soon.
            </p>

            <div className="flex gap-4">
              <button
                onClick={handleDialogClose}
                disabled={expressInterestLoading}
                className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-full font-bold hover:bg-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleExpressInterestConfirm}
                disabled={expressInterestLoading}
                className="flex-1 bg-blue-700 text-white py-3 rounded-full font-bold hover:bg-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {expressInterestLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
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
