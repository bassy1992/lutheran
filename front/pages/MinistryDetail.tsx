import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Users, 
  Mail, 
  Phone, 
  Calendar, 
  ArrowLeft, 
  AlertCircle, 
  Loader2,
  CheckCircle,
  UserPlus
} from 'lucide-react';
import { ministriesService } from '../src/services/api/endpoints/ministries.service';
import type { Ministry } from '../src/types/models';

const MinistryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [expressInterestLoading, setExpressInterestLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
  };

  useEffect(() => {
    const fetchMinistry = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await ministriesService.getMinistry(parseInt(id));
        setMinistry(data);
      } catch (err: any) {
        console.error('Error fetching ministry:', err);
        setError(err.response?.data?.detail || 'Failed to load ministry details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMinistry();
  }, [id]);

  const handleExpressInterest = async () => {
    if (!ministry) return;

    if (!isAuthenticated()) {
      setErrorMessage('Please log in to express interest in this ministry.');
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    try {
      setExpressInterestLoading(true);
      setErrorMessage(null);
      const response = await ministriesService.expressInterest(ministry.id);
      setSuccessMessage(response.message);
      setShowConfirmDialog(false);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      console.error('Error expressing interest:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || 'Failed to express interest.';
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setExpressInterestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-blue-700 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !ministry) {
    return (
      <div className="pt-32 pb-20 container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Unable to Load Ministry</h2>
          <p className="text-slate-600 mb-6">{error || 'Ministry not found'}</p>
          <button
            onClick={() => navigate('/ministries')}
            className="bg-blue-700 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition-all"
          >
            Back to Ministries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      {/* Back Button */}
      <div className="container mx-auto px-4 mb-8">
        <button
          onClick={() => navigate('/ministries')}
          className="flex items-center gap-2 text-blue-700 hover:text-blue-800 font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Ministries
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="container mx-auto px-4 mb-8">
          <div className="max-w-4xl mx-auto bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="container mx-auto px-4 mb-8">
          <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-96 mb-12">
        {ministry.image ? (
          <img
            src={ministry.image}
            alt={ministry.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <Users className="w-32 h-32 text-white opacity-30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{ministry.name}</h1>
          <div className="flex items-center gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{ministry.member_count} {ministry.member_count === 1 ? 'member' : 'members'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-4">About This Ministry</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{ministry.description}</p>
              </div>

              {/* Express Interest Button */}
              {isAuthenticated() && (
                <button
                  onClick={() => setShowConfirmDialog(true)}
                  className="w-full bg-blue-700 text-white py-4 rounded-full font-bold hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Express Interest in Joining
                </button>
              )}

              {!isAuthenticated() && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                  <p className="text-slate-700 mb-4">Want to join this ministry?</p>
                  <Link
                    to="/login"
                    className="inline-block bg-blue-700 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition-all"
                  >
                    Log In to Express Interest
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Leader Card */}
              {ministry.leader && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-bold mb-4">Ministry Leader</h3>
                  <div className="space-y-4">
                    <p className="text-xl font-semibold text-slate-900">{ministry.leader.full_name}</p>
                    
                    {ministry.leader.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                        <a
                          href={`mailto:${ministry.leader.email}`}
                          className="text-slate-600 hover:text-blue-700 transition-colors break-all"
                        >
                          {ministry.leader.email}
                        </a>
                      </div>
                    )}
                    
                    {ministry.leader.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                        <a
                          href={`tel:${ministry.leader.phone}`}
                          className="text-slate-600 hover:text-blue-700 transition-colors"
                        >
                          {ministry.leader.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-slate-200">
                    <span className="text-slate-600">Members</span>
                    <span className="font-bold text-slate-900">{ministry.member_count}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-slate-600">Status</span>
                    <span className="font-bold text-green-600">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Confirm Interest</h3>
            <p className="text-slate-600">
              Are you sure you want to express interest in joining <strong>{ministry.name}</strong>?
            </p>
            <p className="text-sm text-slate-500">
              The ministry leader will be notified and will contact you soon.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                disabled={expressInterestLoading}
                className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-full font-bold hover:bg-slate-300 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExpressInterest}
                disabled={expressInterestLoading}
                className="flex-1 bg-blue-700 text-white py-3 rounded-full font-bold hover:bg-blue-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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

export default MinistryDetail;
