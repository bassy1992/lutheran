import React, { useState, useEffect } from 'react';
import { Book, Music, Calendar, User, AlertCircle, Loader2 } from 'lucide-react';
import { sermonsService } from '../src/services/api/endpoints/sermons.service';

interface BibleReading {
  id: number;
  reading_type: string;
  reading_type_display: string;
  reader_name: string;
  photo_url: string | null;
  scripture_reference: string;
  order: number;
}

interface ServiceHymn {
  id: number;
  hymn_type: string;
  hymn_type_display: string;
  custom_hymn_type?: string;
  hymn_number: string;
  hymn_title: string;
  order: number;
}

interface WeeklyBulletin {
  id: number;
  title: string;
  service_date: string;
  pastor?: {
    id: number;
    name: string;
    role: string;
    photo_display_url?: string;
  };
  psalm_of_the_day?: string;
  is_active: boolean;
  has_communion: boolean;
  notes: string;
  readings: BibleReading[];
  hymns: ServiceHymn[];
  created_at: string;
  updated_at: string;
}

const WeeklyBulletin: React.FC = () => {
  const [bulletin, setBulletin] = useState<WeeklyBulletin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBulletin = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await sermonsService.getCurrentBulletin();
        if (response.results && response.results.length > 0) {
          setBulletin(response.results[0]);
        } else {
          setError('No bulletin available for this week');
        }
      } catch (err: any) {
        console.error('Error fetching bulletin:', err);
        setError('Failed to load weekly bulletin');
      } finally {
        setLoading(false);
      }
    };

    fetchBulletin();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 md:py-20">
        <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-blue-700 animate-spin" />
      </div>
    );
  }

  if (error || !bulletin) {
    return (
      <div className="text-center py-12 md:py-20">
        <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-slate-300 mx-auto mb-3 md:mb-4" />
        <h3 className="text-lg md:text-2xl font-bold text-slate-900 mb-2">No Bulletin Available</h3>
        <p className="text-sm md:text-base text-slate-600">{error || 'Check back later for this week\'s service bulletin'}</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Compact Header Card */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden mb-4 md:mb-6">
        <div className="p-4 md:p-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xs md:text-sm text-blue-200 font-medium">This Week's Service</span>
              </div>
              <h2 className="text-xl md:text-3xl font-bold mb-1">{bulletin.title}</h2>
              <p className="text-sm md:text-base text-blue-100">{formatDate(bulletin.service_date)}</p>
            </div>
            {bulletin.has_communion && (
              <div className="bg-yellow-400/20 border border-yellow-300/30 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg backdrop-blur-sm">
                <p className="text-[10px] md:text-xs font-bold text-yellow-100 whitespace-nowrap">🍷 Holy Communion</p>
              </div>
            )}
          </div>
          
          {/* Pastor Info - Inline */}
          {bulletin.pastor && (
            <div className="flex items-center gap-2.5 md:gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-2.5 md:p-3 border border-white/20">
              {bulletin.pastor.photo_display_url && (
                <img
                  src={bulletin.pastor.photo_display_url}
                  alt={bulletin.pastor.name}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white/50"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] md:text-xs text-blue-200 font-medium">Preaching Today</p>
                <p className="text-sm md:text-base font-bold truncate">{bulletin.pastor.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Two Column Layout for Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Left Column */}
        <div className="space-y-4 md:space-y-6">
          {/* Psalm of the Day - Featured */}
          {bulletin.psalm_of_the_day && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <Book className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs font-bold text-amber-700 uppercase tracking-wider">Psalm of the Day</p>
                  <p className="text-lg md:text-2xl font-bold text-amber-900">{bulletin.psalm_of_the_day}</p>
                </div>
              </div>
            </div>
          )}

          {/* Bible Readings */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Book className="w-4 h-4 md:w-5 md:h-5 text-blue-700" />
              <h3 className="text-base md:text-lg font-bold text-slate-900">Scripture Readings</h3>
            </div>
            
            <div className="space-y-2.5 md:space-y-3">
              {bulletin.readings.map((reading) => (
                <div key={reading.id} className="flex items-start gap-3 p-2.5 md:p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200">
                  {reading.photo_url && (
                    <img
                      src={reading.photo_url}
                      alt={reading.reader_name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-blue-200 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-[10px] md:text-xs font-bold text-blue-700 uppercase tracking-wide">{reading.reading_type_display}</span>
                      <span className="text-[10px] md:text-xs text-slate-500 font-medium">{reading.scripture_reference}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-slate-400" />
                      <p className="text-xs md:text-sm font-semibold text-slate-700">{reading.reader_name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 md:space-y-6">
          {/* Hymns */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Music className="w-4 h-4 md:w-5 md:h-5 text-blue-700" />
              <h3 className="text-base md:text-lg font-bold text-slate-900">Service Hymns</h3>
            </div>
            
            <div className="space-y-2">
              {bulletin.hymns.map((hymn) => (
                <div key={hymn.id} className="flex items-center gap-2.5 md:gap-3 p-2.5 md:p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-sm transition-all">
                  <div className="flex-shrink-0 w-9 h-9 md:w-11 md:h-11 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-lg flex items-center justify-center font-bold text-sm md:text-base shadow-sm">
                    {hymn.hymn_number || <Music className="w-4 h-4 md:w-5 md:h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] md:text-[10px] text-blue-600 font-bold uppercase tracking-wider">{hymn.hymn_type_display}</p>
                    <p className="font-bold text-xs md:text-sm text-slate-900 truncate leading-tight">{hymn.hymn_title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {bulletin.notes && (
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <div className="w-6 h-6 md:w-7 md:h-7 bg-slate-600 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                </div>
                <h3 className="font-bold text-sm md:text-base text-slate-900">Announcements</h3>
              </div>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-line">{bulletin.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyBulletin;
