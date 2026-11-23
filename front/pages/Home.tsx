
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
import { ministriesService } from '../src/services/api/endpoints/ministries.service';
import { galleryService } from '../src/services/api/endpoints/gallery.service';
import { setMetaTags, resetMetaTags } from '../src/utils/metaTags';
import type { ChurchInfo, Pastor, ServiceTime, CoreValue, Event, Ministry, GalleryPhoto } from '../src/types/models';

// Skeleton loader components
const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="h-48 bg-slate-200 rounded-2xl"></div>
  </div>
);

const SkeletonServiceTime = () => (
  <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-slate-50 rounded-xl md:rounded-2xl animate-pulse">
    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-200 rounded-lg md:rounded-xl"></div>
    <div className="flex-1 space-y-2">
      <div className="h-3 md:h-4 bg-slate-200 rounded w-3/4"></div>
      <div className="h-2.5 md:h-3 bg-slate-200 rounded w-1/2"></div>
      <div className="h-2.5 md:h-3 bg-slate-200 rounded w-full"></div>
    </div>
  </div>
);

const SkeletonEvent = () => (
  <div className="bg-white/5 border border-white/10 p-4 md:p-8 rounded-2xl md:rounded-3xl animate-pulse">
    <div className="flex justify-between items-start mb-4 md:mb-6">
      <div className="h-5 md:h-6 w-16 md:w-20 bg-white/10 rounded-lg"></div>
      <div className="w-5 h-5 md:w-6 md:h-6 bg-white/10 rounded"></div>
    </div>
    <div className="h-5 md:h-6 bg-white/10 rounded mb-3 md:mb-4 w-3/4"></div>
    <div className="space-y-1.5 md:space-y-2">
      <div className="h-3 md:h-4 bg-white/10 rounded w-1/2"></div>
      <div className="h-3 md:h-4 bg-white/10 rounded w-2/3"></div>
    </div>
  </div>
);

const SkeletonMinistry = () => (
  <div className="group relative overflow-hidden rounded-xl md:rounded-2xl aspect-[3/4] shadow-lg animate-pulse">
    <div className="w-full h-full bg-slate-200"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent flex flex-col justify-end p-3 md:p-6">
      <div className="h-5 md:h-6 bg-slate-700 rounded w-3/4 mb-1 md:mb-2"></div>
      <div className="h-3 md:h-4 bg-slate-700 rounded w-full mb-0.5 md:mb-1"></div>
      <div className="h-3 md:h-4 bg-slate-700 rounded w-2/3"></div>
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

  // Fetch ministries
  const { 
    data: ministriesResponse, 
    loading: ministriesLoading, 
    error: ministriesError,
    refetch: refetchMinistries 
  } = useAPI(() => ministriesService.getMinistries());

  const ministries = ministriesResponse?.results || [];

  // Fetch featured gallery photos for the Our Essence section
  const { 
    data: featuredPhotosResponse, 
    loading: photosLoading 
  } = useAPI(() => galleryService.getPhotos({ is_featured: true }));

  const featuredPhotos = featuredPhotosResponse?.results || [];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/HERO.jpeg" 
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
      <section className="bg-white py-8 md:py-12 border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-8">
          {serviceTimesError ? (
            <ErrorDisplay 
              message={serviceTimesError.message || 'Failed to load service times'}
              onRetry={refetchServiceTimes}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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
                    <div key={service.id} className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-slate-50 rounded-xl md:rounded-2xl hover:bg-blue-50 transition-colors group">
                      <div className="p-2 md:p-3 bg-white rounded-lg md:rounded-xl shadow-sm group-hover:bg-blue-700 group-hover:text-white transition-all">
                        <Clock size={20} className="md:w-6 md:h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm md:text-base">{service.day}</h3>
                        <p className="text-blue-700 font-semibold text-xs md:text-sm">
                          {typeof service.time === 'string' ? service.time : new Date(`2000-01-01T${service.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </p>
                        <p className="text-slate-500 text-xs md:text-sm mt-1">{service.description}</p>
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
      <section className="py-16 md:py-24 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          {coreValuesError ? (
            <ErrorDisplay 
              message={coreValuesError.message || 'Failed to load core values'}
              onRetry={refetchCoreValues}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                <div className="relative grid grid-cols-2 gap-3 md:gap-4">
                  {photosLoading ? (
                    <>
                      <div className="rounded-xl md:rounded-2xl shadow-lg mt-8 h-[300px] md:h-[500px] bg-slate-200 animate-pulse"></div>
                      <div className="rounded-xl md:rounded-2xl shadow-lg h-[300px] md:h-[500px] bg-slate-200 animate-pulse"></div>
                    </>
                  ) : featuredPhotos.length >= 2 ? (
                    <>
                      <img 
                        src={featuredPhotos[0].image || 'https://picsum.photos/seed/congregation1/400/500'} 
                        alt={featuredPhotos[0].title || 'Church life'} 
                        className="rounded-xl md:rounded-2xl shadow-lg mt-8 w-full h-[300px] md:h-[500px] object-cover" 
                      />
                      <img 
                        src={featuredPhotos[1].image || 'https://picsum.photos/seed/congregation2/400/500'} 
                        alt={featuredPhotos[1].title || 'Church worship'} 
                        className="rounded-xl md:rounded-2xl shadow-lg w-full h-[300px] md:h-[500px] object-cover" 
                      />
                    </>
                  ) : (
                    <>
                      <img src="https://picsum.photos/seed/congregation1/400/500" alt="Church life" className="rounded-xl md:rounded-2xl shadow-lg mt-8 w-full h-[300px] md:h-[500px] object-cover" />
                      <img src="https://picsum.photos/seed/congregation2/400/500" alt="Church worship" className="rounded-xl md:rounded-2xl shadow-lg w-full h-[300px] md:h-[500px] object-cover" />
                    </>
                  )}
                </div>
                <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl max-w-[160px] md:max-w-[200px]">
                  <p className="text-blue-700 font-bold text-2xl md:text-3xl">1000+</p>
                  <p className="text-slate-500 text-xs md:text-sm">Lives touched annually through our community missions.</p>
                </div>
              </div>
              
              <div className="space-y-6 md:space-y-8">
                <div className="space-y-3 md:space-y-4">
                  <h3 className="text-blue-600 font-bold uppercase tracking-widest text-xs md:text-sm">Our Essence</h3>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
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
                    <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                      {churchInfo.description || `For decades, ${churchInfo.name} has been a beacon of hope in our capital city. We believe in the transformative power of the Gospel and the strength of a community that prays together.`}
                    </p>
                  ) : (
                    <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                      For decades, Trinity Lutheran Church Ghana has been a beacon of hope in our capital city. We believe in the transformative power of the Gospel and the strength of a community that prays together.
                    </p>
                  )}
                </div>
                
                {coreValuesLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {coreValues.map((value) => (
                      <div key={value.id} className="flex gap-2 md:gap-3">
                        <div className="shrink-0 mt-0.5 md:mt-1">
                          {value.icon === 'BookOpen' ? <BookOpen className="text-blue-600" /> :
                           value.icon === 'Heart' ? <Heart className="text-blue-600" /> :
                           value.icon === 'Users' ? <Users className="text-blue-600" /> :
                           value.icon === 'Zap' ? <Zap className="text-blue-600" /> :
                           <BookOpen className="text-blue-600" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm md:text-base">{value.title}</h4>
                          <p className="text-xs md:text-sm text-slate-500">{value.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16 space-y-3 md:space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Ministries You Can Join</h2>
            <p className="text-slate-500 text-sm md:text-base">Find your place in our church family. There is a ministry for everyone at Trinity.</p>
          </div>
          
          {ministriesError ? (
            <ErrorDisplay 
              message={ministriesError.message || 'Failed to load ministries'} 
              onRetry={refetchMinistries} 
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {ministriesLoading ? (
                <>
                  <SkeletonMinistry />
                  <SkeletonMinistry />
                  <SkeletonMinistry />
                  <SkeletonMinistry />
                </>
              ) : ministries.length > 0 ? (
                ministries.slice(0, 4).map((ministry) => (
                  <div key={ministry.id} className="group relative overflow-hidden rounded-xl md:rounded-2xl aspect-[3/4] shadow-lg">
                    <img 
                      src={ministry.image_display_url || ministry.image || 'https://picsum.photos/seed/ministry/600/800'} 
                      alt={ministry.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent flex flex-col justify-end p-3 md:p-6">
                      <h3 className="text-white font-bold text-sm md:text-xl mb-1 md:mb-2">{ministry.name}</h3>
                      <p className="text-slate-300 text-xs md:text-sm line-clamp-2 mb-2 md:mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        {ministry.description}
                      </p>
                      <Link to="/ministries" className="text-blue-400 text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-1 md:gap-2">
                        EXPLORE <ArrowRight size={12} className="md:w-3.5 md:h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-500 text-sm md:text-base">No ministries available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Events & Calendar */}
      <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 md:gap-8 mb-12 md:mb-16">
            <div className="space-y-2 md:space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">What's Happening</h2>
              <p className="text-slate-400 text-sm md:text-base max-w-md">Mark your calendars for our upcoming gatherings and special services.</p>
            </div>
            <Link to="/events" className="px-4 md:px-6 py-2 md:py-3 border border-white/20 hover:bg-white/10 rounded-full font-bold text-sm md:text-base transition-all">
              VIEW FULL CALENDAR
            </Link>
          </div>

          {eventsError ? (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl md:rounded-2xl p-4 md:p-6 flex items-start gap-3 md:gap-4">
              <AlertCircle className="text-red-400 shrink-0 mt-0.5 md:mt-1 w-5 h-5 md:w-6 md:h-6" />
              <div className="flex-1">
                <h3 className="font-bold text-red-200 mb-2 text-sm md:text-base">Unable to load events</h3>
                <p className="text-red-300 text-xs md:text-sm mb-3 md:mb-4">{eventsError.message || 'Failed to load featured events'}</p>
                <button
                  onClick={refetchEvents}
                  className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-xs md:text-sm">
                  <RefreshCw size={14} className="md:w-4 md:h-4" />
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {eventsLoading ? (
                <>
                  <SkeletonEvent />
                  <SkeletonEvent />
                  <SkeletonEvent />
                </>
              ) : featuredEvents.length > 0 ? (
                featuredEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="bg-white/5 border border-white/10 p-4 md:p-8 rounded-2xl md:rounded-3xl hover:bg-white/10 transition-all group">
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                      <div className="px-2 md:px-3 py-1 bg-blue-600 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                        {event.event_type}
                      </div>
                      <Calendar className="text-slate-500 group-hover:text-blue-400 transition-colors" size={18} />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{event.title}</h3>
                    <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm text-slate-400">
                      <p className="flex items-center gap-1.5 md:gap-2">
                        <Clock size={12} className="md:w-3.5 md:h-3.5" /> 
                        {new Date(event.start_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                      <p className="flex items-center gap-1.5 md:gap-2"><MapPin size={12} className="md:w-3.5 md:h-3.5" /> {event.location}</p>
                    </div>
                    <Link 
                      to={`/events/${event.id}`}
                      className="mt-4 md:mt-8 text-white font-bold flex items-center gap-2 text-xs md:text-sm hover:gap-4 transition-all"
                    >
                      LEARN MORE <ArrowRight size={14} className="text-blue-500 md:w-4 md:h-4" />
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center text-slate-400 py-12 text-sm md:text-base">
                  No featured events at this time. Check back soon!
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Donation/Give CTA */}
      <section className="py-12 md:py-20 bg-blue-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[100px] opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
            <Heart size={36} className="mx-auto md:w-12 md:h-12 text-white animate-pulse" />
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight">Support Our Mission in Ghana</h2>
            <p className="text-blue-100 text-sm md:text-base lg:text-lg">
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
