import React from 'react';
import { MapPin, Star, Users, Award, ArrowRight, Play } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">
                Plan Your Perfect Trip with AI-Powered Intelligence
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Discover authentic experiences, genuine reviews, and local pricing with TravelWise's advanced location intelligence.
              </p>
              <div className="flex space-x-4">
                <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2">
                  <span>Start Planning</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Travel planning"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Mumbai, India</div>
                    <div className="text-sm text-gray-500">Perfect for exploration</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose TravelWise?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of travel planning with our AI-powered platform that delivers authentic, personalized recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Authentic Experiences</h3>
              <p className="text-gray-600">
                Discover genuine local experiences with real reviews and authentic pricing from verified travelers.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Personalized Planning</h3>
              <p className="text-gray-600">
                AI-powered recommendations tailored to your preferences, budget, and travel style for the perfect trip.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Recommendations</h3>
              <p className="text-gray-600">
                Advanced location intelligence provides insider tips and hidden gems that typical tourists miss.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-purple-100">Happy Travelers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-purple-100">Destinations</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-purple-100">Authentic Reviews</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-purple-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Plan Your Next Adventure?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of travelers who trust TravelWise for their perfect trips.
          </p>
          <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all">
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;