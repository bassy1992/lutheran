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
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-blue-700 animate-spin" />
      </div>
    );
  }

  if (error || !bulletin) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-900 mb-2">No Bulletin Available</h3>
        <p className="text-slate-600">{error || 'Check back later for this week\'s service bulletin'}</p>
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
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-8 h-8" />
          <h2 className="text-3xl font-bold">{bulletin.title}</h2>
        </div>
        <p className="text-blue-100 text-lg">{formatDate(bulletin.service_date)}</p>
        {bulletin.has_communion && (
          <div className="mt-4 inline-block bg-blue-500/30 px-4 py-2 rounded-lg">
            <p className="text-sm font-semibold">Holy Communion will be celebrated</p>
          </div>
        )}
      </div>

      {/* Bible Readings */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Book className="w-6 h-6 text-blue-700" />
          <h3 className="text-2xl font-bold">Bible Readings</h3>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bulletin.readings.map((reading) => (
            <div key={reading.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <h4 className="font-bold text-lg text-blue-700 mb-3">{reading.reading_type_display}</h4>
              
              {reading.photo_url && (
                <img
                  src={reading.photo_url}
                  alt={reading.reader_name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-2 border-blue-200"
                />
              )}
              
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-slate-700">
                  <User className="w-4 h-4" />
                  <p className="font-semibold">{reading.reader_name}</p>
                </div>
                <p className="text-slate-600 text-sm font-medium">{reading.scripture_reference}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hymns */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Music className="w-6 h-6 text-blue-700" />
          <h3 className="text-2xl font-bold">Hymns</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {bulletin.hymns.map((hymn) => (
            <div key={hymn.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                {hymn.hymn_number || <Music className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-600 font-medium">{hymn.hymn_type_display}</p>
                <p className="font-bold text-slate-900">{hymn.hymn_title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      {bulletin.notes && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-3 text-blue-900">Additional Notes</h3>
          <p className="text-slate-700 whitespace-pre-line">{bulletin.notes}</p>
        </div>
      )}
    </div>
  );
};

export default WeeklyBulletin;
