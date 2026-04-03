import React from 'react';
import { Heart, Users, BookOpen, Globe } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="w-full">
      {/* Compact Hero Section */}
      <section className="relative h-[250px] md:h-[350px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/HERO.jpeg" 
            alt="About Us" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/60"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-2 md:space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">About Us</h1>
            <p className="text-sm md:text-base lg:text-lg text-slate-200">
              A community of faith, hope, and love in Ghana
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 md:py-8 lg:py-12 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          {/* Introduction */}
          <div className="max-w-4xl mx-auto mb-8 md:mb-12">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6 lg:p-8">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 md:mb-4">Welcome to Trinity Lutheran Church Ghana</h2>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-3 md:mb-4">
                Trinity Lutheran Church has been a pillar of the community in Ghana for decades. We are a family of believers committed to living out the Gospel of Jesus Christ through worship, fellowship, and service.
              </p>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                Our church is a place where people from all walks of life come together to grow in faith, support one another, and make a positive impact in our community and beyond.
              </p>
            </div>
          </div>

          {/* Vision, Mission, Heritage Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6 mb-8 md:mb-12">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <Heart className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="font-bold text-base md:text-lg lg:text-xl mb-2 md:mb-3">Our Vision</h3>
              <p className="text-xs md:text-sm text-blue-100 leading-relaxed">
                To be a vibrant sanctuary of grace where Christ is known and lives are transformed through the power of the Gospel.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <Users className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="font-bold text-base md:text-lg lg:text-xl mb-2 md:mb-3">Our Mission</h3>
              <p className="text-xs md:text-sm text-green-100 leading-relaxed">
                Proclaiming the Gospel of Jesus Christ through Word, Worship, and Witness in Ghana and beyond.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h3 className="font-bold text-base md:text-lg lg:text-xl mb-2 md:mb-3">Our Heritage</h3>
              <p className="text-xs md:text-sm text-purple-100 leading-relaxed">
                Proudly following the Lutheran confessions within the unique cultural context of West Africa.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="max-w-4xl mx-auto mb-8 md:mb-12">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6 lg:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 md:mb-6">Our Core Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="flex gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 md:w-5 md:h-5 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-slate-900 mb-1">Grace</h3>
                    <p className="text-xs md:text-sm text-slate-600">We believe in God's unconditional love and forgiveness through Jesus Christ.</p>
                  </div>
                </div>

                <div className="flex gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-slate-900 mb-1">Community</h3>
                    <p className="text-xs md:text-sm text-slate-600">We are a family that supports and cares for one another in love.</p>
                  </div>
                </div>

                <div className="flex gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-slate-900 mb-1">Scripture</h3>
                    <p className="text-xs md:text-sm text-slate-600">The Bible is our foundation and guide for faith and life.</p>
                  </div>
                </div>

                <div className="flex gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 md:w-5 md:h-5 text-orange-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-slate-900 mb-1">Service</h3>
                    <p className="text-xs md:text-sm text-slate-600">We are called to serve our community and share God's love with others.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What We Believe */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-900 text-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6 lg:p-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">What We Believe</h2>
              <div className="space-y-3 md:space-y-4">
                <div>
                  <h3 className="font-bold text-sm md:text-base text-blue-400 mb-1 md:mb-2">The Triune God</h3>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    We believe in one God who exists eternally in three persons: Father, Son, and Holy Spirit.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-sm md:text-base text-blue-400 mb-1 md:mb-2">Salvation by Grace</h3>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    We are saved by God's grace alone through faith in Jesus Christ, not by our own works.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-sm md:text-base text-blue-400 mb-1 md:mb-2">The Authority of Scripture</h3>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    The Bible is the inspired Word of God and the ultimate authority for our faith and practice.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-sm md:text-base text-blue-400 mb-1 md:mb-2">The Sacraments</h3>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                    We celebrate Holy Baptism and Holy Communion as means of grace through which God strengthens our faith.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
