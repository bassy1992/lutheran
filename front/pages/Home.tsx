
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  PlayCircle, 
  Heart, 
  MapPin, 
  Zap, 
  BookOpen, 
  Users,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useEffect } from 'react';
import { useAPI } from '../src/hooks/useAPI';
import { churchService } from '../src/services/api/endpoints/church.service';
import { eventsService } from '../src/services/api/endpoints/events.service';
import { setMetaTags, resetMetaTags } from '../src/utils/metaTags';
import type { ChurchInfo, Pastor, ServiceTime, CoreValue, Event } from '../src/types/models';
import { MINISTRIES } from '../constants';

// Skeleton loader components
const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="h-48 bg-slate-200 rounded-2xl"></div>
  </div>
);

const SkeletonServiceTime = () => (
  <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl animate-pulse">
    <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
      <div className="h-3 bg-slate-200 rounded w-full"></div>
    </div>
  </div>
);

const SkeletonEvent = () => (
  <div className="bg-white/5 border border-white/10 p-8 rounded-3xl animate-pulse">
    <div className="flex justify-between items-start mb-6">
      <div className="h-6 w-20 bg-white/10 rounded-lg"></div>
      <div className="w-6 h-6 bg-white/10 rounded"></div>
    </div>
    <div className="h-6 bg-white/10 rounded mb-4 w-3/4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-white/10 rounded w-1/2"></div>
      <div className="h-4 bg-white/10 rounded w-2/3"></div>
    </div>
  </div>
);

// Error display component with retry
interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4">
    <AlertCircle className="text-red-600 shrink-0 mt-1" size={24} />
    <div className="flex-1">
      <h3 className="font-bold text-red-900 mb-2">Unable to load data</h3>
      <p className="text-red-700 text-sm mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
      >
        <RefreshCw size={16} />
        Try Again
      </button>
    </div>
  </div>
);

const Home: React.FC = () => {
  // Set meta tags for home page
  useEffect(() => {
    setMetaTags({
      title: 'Trinity Lutheran Church Ghana - Welcome',
      description: 'Join Trinity Lutheran Church Ghana, a vibrant community of faith serving Accra since 1964. Experience inspiring worship, meaningful fellowship, and community impact.',
      type: 'website'
    });

    return () => {
      resetMetaTags();
    };
  }, []);

  // Fetch church info
  const { 
    data: churchInfo, 
    loading: churchInfoLoading, 
    error: churchInfoError,
    refetch: refetchChurchInfo 
  } = useAPI<ChurchInfo>(() => churchService.getChurchInfo());

  // Fetch service times
  const { 
    data: serviceTimes, 
    loading: serviceTimesLoading, 
    error: serviceTimesError,
    refetch: refetchServiceTimes 
  } = useAPI<ServiceTime[]>(() => churchService.getServiceTimes());

  // Fetch pastors
  const { 
    data: pastors, 
    loading: pastorsLoading, 
    error: pastorsError,
    refetch: refetchPastors 
  } = useAPI<Pastor[]>(() => churchService.getPastors());

  // Fetch core values
  const { 
    data: coreValues, 
    loading: coreValuesLoading, 
    error: coreValuesError,
    refetch: refetchCoreValues 
  } = useAPI<CoreValue[]>(() => churchService.getCoreValues());

  // Fetch featured events
  const { 
    data: featuredEventsResponse, 
    loading: eventsLoading, 
    error: eventsError,
    refetch: refetchEvents 
  } = useAPI(() => eventsService.getEvents({ is_featured: true }));

  const featuredEvents = featuredEventsResponse?.results || [];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/ghana-church/1920/1080" 
            alt="Trinity Lutheran Ghana" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/40"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center md:text-left">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/30 backdrop-blur-md rounded-full border border-blue-400/30 text-blue-100 text-xs font-bold uppercase tracking-widest animate-fadeIn">
              <Zap size={14} className="text-yellow-400" />
              Serving Ghana with Grace Since 1964
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-slideUp">
              Welcome to Your <br />
              <span className="text-blue-400">Spiritual Home</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 leading-relaxed max-w-2xl animate-slideUp delay-100">
              Join a community of believers dedicated to the truth of God's Word, the beauty of Lutheran liturgy, and the warmth of Ghanaian hospitality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slideUp delay-200 justify-center md:justify-start">
              <Link to="/about" className="px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white rounded-full font-bold transition-all transform hover:scale-105 shadow-xl shadow-blue-900/20">
                PLAN YOUR VISIT
              </Link>
              <Link to="/sermons" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-full font-bold transition-all flex items-center gap-2 justify-center">
                <PlayCircle size={20} />
                LATEST SERMON
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* Service Times Quick Info */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-8">
          {serviceTimesError ? (
            <ErrorDisplay 
              message={serviceTimesError.message || 'Failed to load service times'}
              onRetry={refetchServiceTimes}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {serviceTimesLoading ? (
                <>
                  <SkeletonServiceTime />
                  <SkeletonServiceTime />
                  <SkeletonServiceTime />
                </>
              ) : serviceTimes && serviceTimes.length > 0 ? (
                serviceTimes
                  .filter(service => service.is_active)
                  .map((service) => (
                    <div key={service.id} className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-colors group">
                      <div className="p-3 bg-white rounded-xl shadow-sm group-hover:bg-blue-700 group-hover:text-white transition-all">
                        <Clock size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{service.day}</h3>
                        <p className="text-blue-700 font-semibold text-sm">
                          {typeof service.time === 'string' ? service.time : new Date(`2000-01-01T${service.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </p>
                        <p className="text-slate-500 text-sm mt-1">{service.description}</p>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="col-span-3 text-center text-slate-500 py-8">
                  No service times available
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          {coreValuesError ? (
            <ErrorDisplay 
              message={coreValuesError.message || 'Failed to load core values'}
              onRetry={refetchCoreValues}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                <div className="relative grid grid-cols-2 gap-4">
                  <img src="https://picsum.photos/seed/congregation1/400/500" alt="Church life" className="rounded-2xl shadow-lg mt-8" />
                  <img src="https://picsum.photos/seed/congregation2/400/500" alt="Church worship" className="rounded-2xl shadow-lg" />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl max-w-[200px]">
                  <p className="text-blue-700 font-bold text-3xl">1000+</p>
                  <p className="text-slate-500 text-sm">Lives touched annually through our community missions.</p>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-blue-600 font-bold uppercase tracking-widest text-sm">Our Essence</h3>
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
                    {churchInfoLoading ? (
                      <div className="animate-pulse">
                        <div className="h-12 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="h-12 bg-slate-200 rounded w-2/3"></div>
                      </div>
                    ) : churchInfo ? (
                      <>Rooted in Faith, <br />Growing in Grace.</>
                    ) : (
                      <>Rooted in Faith, <br />Growing in Grace.</>
                    )}
                  </h2>
                  {churchInfoLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-slate-200 rounded"></div>
                      <div className="h-4 bg-slate-200 rounded"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                    </div>
                  ) : churchInfo ? (
                    <p className="text-lg text-slate-600 leading-relaxed">
                      {churchInfo.description || `For decades, ${churchInfo.name} has been a beacon of hope in our capital city. We believe in the transformative power of the Gospel and the strength of a community that prays together.`}
                    </p>
                  ) : (
                    <p className="text-lg text-slate-600 leading-relaxed">
                      For decades, Trinity Lutheran Church Ghana has been a beacon of hope in our capital city. We believe in the transformative power of the Gospel and the strength of a community that prays together.
                    </p>
                  )}
                </div>
                
                {coreValuesLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse flex gap-3">
                        <div className="w-6 h-6 bg-slate-200 rounded shrink-0 mt-1"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                          <div className="h-3 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : coreValues && coreValues.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {coreValues.map((value) => (
                      <div key={value.id} className="flex gap-3">
                        <div className="shrink-0 mt-1">
                          {value.icon === 'BookOpen' ? <BookOpen className="text-blue-600" /> :
                           value.icon === 'Heart' ? <Heart className="text-blue-600" /> :
                           value.icon === 'Users' ? <Users className="text-blue-600" /> :
                           value.icon === 'Zap' ? <Zap className="text-blue-600" /> :
                           <BookOpen className="text-blue-600" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{value.title}</h4>
                          <p className="text-sm text-slate-500">{value.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { icon: <BookOpen className="text-blue-600" />, title: 'Pure Word', text: 'Preaching the undiluted truth of the Bible.' },
                      { icon: <Heart className="text-blue-600" />, title: 'Genuine Fellowship', text: 'A family where everyone belongs.' },
                      { icon: <Users className="text-blue-600" />, title: 'Community Impact', text: 'Active missions serving the needy in Ghana.' },
                      { icon: <Zap className="text-blue-600" />, title: 'Spiritual Growth', text: 'Mentorship for all stages of life.' }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="shrink-0 mt-1">{item.icon}</div>
                        <div>
                          <h4 className="font-bold text-slate-900">{item.title}</h4>
                          <p className="text-sm text-slate-500">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Link to="/about" className="inline-flex items-center gap-2 text-blue-700 font-bold hover:gap-4 transition-all">
                  LEARN MORE ABOUT US <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Ministries */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Ministries You Can Join</h2>
            <p className="text-slate-500">Find your place in our church family. There is a ministry for everyone at Trinity.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MINISTRIES.map((m) => (
              <div key={m.id} className="group relative overflow-hidden rounded-2xl aspect-[3/4] shadow-lg">
                <img src={m.image} alt={m.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white font-bold text-xl mb-2">{m.title}</h3>
                  <p className="text-slate-300 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {m.description}
                  </p>
                  <Link to="/ministries" className="text-blue-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    EXPLORE <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events & Calendar */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">What's Happening</h2>
              <p className="text-slate-400 max-w-md">Mark your calendars for our upcoming gatherings and special services.</p>
            </div>
            <Link to="/events" className="px-6 py-3 border border-white/20 hover:bg-white/10 rounded-full font-bold transition-all">
              VIEW FULL CALENDAR
            </Link>
          </div>

          {eventsError ? (
            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6 flex items-start gap-4">
              <AlertCircle className="text-red-400 shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="font-bold text-red-200 mb-2">Unable to load events</h3>
                <p className="text-red-300 text-sm mb-4">{eventsError.message || 'Failed to load featured events'}</p>
                <button
                  onClick={refetchEvents}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {eventsLoading ? (
                <>
                  <SkeletonEvent />
                  <SkeletonEvent />
                  <SkeletonEvent />
                </>
              ) : featuredEvents.length > 0 ? (
                featuredEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="px-3 py-1 bg-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                        {event.event_type}
                      </div>
                      <Calendar className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{event.title}</h3>
                    <div className="space-y-2 text-sm text-slate-400">
                      <p className="flex items-center gap-2">
                        <Clock size={14} /> 
                        {new Date(event.start_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                      <p className="flex items-center gap-2"><MapPin size={14} /> {event.location}</p>
                    </div>
                    <Link 
                      to={`/events/${event.id}`}
                      className="mt-8 text-white font-bold flex items-center gap-2 text-sm hover:gap-4 transition-all"
                    >
                      LEARN MORE <ArrowRight size={16} className="text-blue-500" />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-slate-400 py-12">
                  No featured events at this time. Check back soon!
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Donation/Give CTA */}
      <section className="py-20 bg-blue-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[100px] opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <Heart size={48} className="mx-auto text-white animate-pulse" />
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">Support Our Mission in Ghana</h2>
            <p className="text-blue-100 text-lg">
              Your generosity helps us maintain our sanctuary, support the choir, and reach out to the marginalized in our communities. Every gift makes a difference.
            </p>
            <Link to="/give" className="inline-block px-12 py-4 bg-white text-blue-700 rounded-full font-bold text-lg hover:bg-slate-100 transition-all shadow-2xl">
              GIVE A GIFT TODAY
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
