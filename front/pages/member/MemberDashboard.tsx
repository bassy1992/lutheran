import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../src/contexts/AuthContext';
import { membersService } from '../../src/services/api/endpoints';
import { AlertCircle, Loader, Heart, Calendar, Gift, Users } from 'lucide-react';
import type { Member, Donation, EventRegistration } from '../../src/types/models';

const MemberDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [events, setEvents] = useState<EventRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch member profile
        const memberData = await membersService.getProfile();
        setMember(memberData);

        // Fetch recent donations
        const donationsData = await membersService.getDonations({ page: 1, page_size: 5 });
        setDonations(donationsData.results || []);

        // Fetch recent events
        const eventsData = await membersService.getEvents({ page: 1, page_size: 5 });
        setEvents(eventsData.results || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, navigate]);

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
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome, {user?.first_name || 'Member'}!</h1>
        <p className="text-slate-600">Manage your Trinity Lutheran Church account and activity</p>
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

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Donations</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {donations.length > 0 ? `GHS ${donations.reduce((sum, d) => sum + parseFloat(d.amount), 0).toFixed(2)}` : 'GHS 0.00'}
              </p>
            </div>
            <Gift className="text-blue-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Event Registrations</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{events.length}</p>
            </div>
            <Calendar className="text-green-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Member Status</p>
              <p className="text-xl font-bold text-slate-900 mt-2 capitalize">{member?.membership_status || 'Active'}</p>
            </div>
            <Users className="text-purple-600" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Member Since</p>
              <p className="text-sm font-bold text-slate-900 mt-2">
                {member?.joined_date ? new Date(member.joined_date).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <Heart className="text-red-600" size={32} />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Section */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Profile</h2>
            {member && (
              <div className="space-y-4">
                <div>
                  <p className="text-slate-600 text-sm">Full Name</p>
                  <p className="text-slate-900 font-semibold">{member.full_name}</p>
                </div>
                <div>
                  <p className="text-slate-600 text-sm">Email</p>
                  <p className="text-slate-900 font-semibold">{member.email}</p>
                </div>
                <div>
                  <p className="text-slate-600 text-sm">Phone</p>
                  <p className="text-slate-900 font-semibold">{member.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-slate-600 text-sm">City</p>
                  <p className="text-slate-900 font-semibold">{member.city || 'Not provided'}</p>
                </div>
              </div>
            )}
            <button
              onClick={() => navigate('/member/profile')}
              className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="md:col-span-2 space-y-8">
          {/* Recent Donations */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Recent Donations</h2>
              <button
                onClick={() => navigate('/member/donations')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All
              </button>
            </div>
            {donations.length > 0 ? (
              <div className="space-y-4">
                {donations.map((donation) => (
                  <div key={donation.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">{donation.category?.name || 'General'}</p>
                      <p className="text-sm text-slate-600">
                        {new Date(donation.donated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-bold text-slate-900">GHS {parseFloat(donation.amount).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-center py-8">No donations yet</p>
            )}
          </div>

          {/* Recent Events */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Upcoming Events</h2>
              <button
                onClick={() => navigate('/member/events')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All
              </button>
            </div>
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-slate-900">{event.name}</p>
                      <p className="text-sm text-slate-600">
                        Status: <span className="capitalize font-medium">{event.status}</span>
                      </p>
                    </div>
                    <p className="text-sm text-slate-600">
                      {event.number_of_attendees} attendee{event.number_of_attendees !== 1 ? 's' : ''}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-center py-8">No event registrations yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/member/profile')}
          className="py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
        >
          Update Profile
        </button>
        <button
          onClick={() => navigate('/donate')}
          className="py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all"
        >
          Make a Donation
        </button>
        <button
          onClick={() => navigate('/events')}
          className="py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all"
        >
          Browse Events
        </button>
      </div>
    </div>
  );
};

export default MemberDashboard;
