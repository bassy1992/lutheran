import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/contexts/AuthContext';
import { membersService } from '../../src/services/api/endpoints';
import { AlertCircle, Loader, Download } from 'lucide-react';
import type { Donation } from '../../src/types/models';

interface DonationResponse {
  count: number;
  page: number;
  page_size: number;
  results: Donation[];
}

const MemberDonations: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchDonations = async () => {
      try {
        setIsLoading(true);
        const data = await membersService.getDonations({ page, page_size: pageSize });
        setDonations(data.results || []);
        setTotalCount(data.count || 0);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load donations';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, [isAuthenticated, navigate, page]);

  const totalPages = Math.ceil(totalCount / pageSize);
  const totalAmount = donations.reduce((sum, d) => sum + parseFloat(d.amount), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 container mx-auto px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Donation History</h1>
        <p className="text-slate-600">View and manage your donations to Trinity Lutheran Church</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-red-900 text-sm">Error</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-slate-600 text-sm font-medium">Total Donations</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">GHS {totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-slate-600 text-sm font-medium">Number of Donations</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{totalCount}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <p className="text-slate-600 text-sm font-medium">Average Donation</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            GHS {totalCount > 0 ? (totalAmount / totalCount).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {donations.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Method</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {donations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {new Date(donation.donated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {donation.category?.name || 'General'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        GHS {parseFloat(donation.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 capitalize">
                        {donation.payment_method.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          donation.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : donation.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          title="Download receipt"
                        >
                          <Download size={16} />
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center">
            <p className="text-slate-600 mb-4">No donations yet</p>
            <button
              onClick={() => navigate('/donate')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
            >
              Make a Donation
            </button>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <button
          onClick={() => navigate('/member')}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default MemberDonations;
