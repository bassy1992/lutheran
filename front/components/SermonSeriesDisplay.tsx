import React from 'react';
import { BookOpen, Calendar, PlayCircle } from 'lucide-react';
import type { SermonSeries } from '../src/types/models';

interface SermonSeriesDisplayProps {
  series: SermonSeries[];
  selectedSeries: number | '';
  onSeriesSelect: (seriesId: number | '') => void;
}

const SermonSeriesDisplay: React.FC<SermonSeriesDisplayProps> = ({
  series,
  selectedSeries,
  onSeriesSelect,
}) => {
  if (!series || series.length === 0) {
    return null;
  }

  // Filter to show only active series
  const activeSeries = series.filter(s => s.is_active);

  if (activeSeries.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Sermon Series</h2>
          <p className="text-slate-600">
            Explore our current sermon series and dive deeper into God's word
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeSeries.map((seriesItem) => {
            const isSelected = selectedSeries === seriesItem.id;
            const startDate = new Date(seriesItem.start_date);
            const endDate = seriesItem.end_date ? new Date(seriesItem.end_date) : null;
            const isOngoing = !endDate || endDate > new Date();

            return (
              <div
                key={seriesItem.id}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                  isSelected ? 'ring-4 ring-blue-500' : ''
                }`}
                onClick={() => onSeriesSelect(isSelected ? '' : seriesItem.id)}
              >
                {/* Series Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={seriesItem.image || `https://picsum.photos/seed/series-${seriesItem.id}/600/400`}
                    alt={seriesItem.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {isOngoing ? (
                      <span className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider">
                        Completed
                      </span>
                    )}
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider">
                        Filtered
                      </span>
                    </div>
                  )}
                </div>

                {/* Series Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                      {seriesItem.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-3">
                      {seriesItem.description}
                    </p>
                  </div>

                  {/* Series Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-slate-600">
                        <PlayCircle size={16} />
                        <span className="font-medium">
                          {seriesItem.sermon_count || 0} {seriesItem.sermon_count === 1 ? 'Sermon' : 'Sermons'}
                        </span>
                      </span>
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar size={14} />
                      <span>
                        {startDate.toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                        {endDate && (
                          <>
                            {' - '}
                            {endDate.toLocaleDateString('en-US', { 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </>
                        )}
                        {!endDate && ' - Ongoing'}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {seriesItem.sermon_count && seriesItem.sermon_count > 0 && (
                      <div className="pt-2">
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isOngoing ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ 
                              width: isOngoing ? '75%' : '100%' 
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {isOngoing ? 'In Progress' : 'Complete'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    className={`w-full py-3 rounded-xl font-medium transition-colors ${
                      isSelected
                        ? 'bg-blue-700 text-white hover:bg-blue-800'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSeriesSelect(isSelected ? '' : seriesItem.id);
                    }}
                  >
                    {isSelected ? 'Clear Filter' : 'View Sermons'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Series Link */}
        {selectedSeries && (
          <div className="mt-8 text-center">
            <button
              onClick={() => onSeriesSelect('')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-700 text-blue-700 rounded-xl font-medium hover:bg-blue-50 transition-colors"
            >
              <BookOpen size={18} />
              View All Sermons
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SermonSeriesDisplay;
