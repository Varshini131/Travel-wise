import React, { useState } from 'react';
import { Search, MessageCircle, Book, Video, Mail, Phone, ChevronDown, ChevronRight } from 'lucide-react';

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    {
      icon: Book,
      title: 'Getting Started',
      description: 'Learn the basics of using TravelWise',
      articles: 12
    },
    {
      icon: MessageCircle,
      title: 'Trip Planning',
      description: 'How to create and manage your trips',
      articles: 18
    },
    {
      icon: Video,
      title: 'AI Features',
      description: 'Understanding our AI recommendations',
      articles: 8
    }
  ];

  const faqs = [
    {
      question: 'How does TravelWise AI work?',
      answer: 'TravelWise uses advanced machine learning algorithms to analyze your preferences, travel history, and real-time data to provide personalized recommendations. Our AI considers factors like weather, local events, your budget, and travel style to suggest the best experiences for you.'
    },
    {
      question: 'Can I use TravelWise offline?',
      answer: 'Yes! With our Adventurer and Globetrotter plans, you can download your itineraries and access them offline. This includes maps, restaurant details, and attraction information, so you\'re never lost even without internet connection.'
    },
    {
      question: 'How accurate are the price estimates?',
      answer: 'Our price estimates are updated in real-time and sourced from multiple verified providers. We aim for 95% accuracy, though prices can fluctuate due to seasonal changes, availability, and local factors. We always recommend checking current prices before booking.'
    },
    {
      question: 'Can I share my itinerary with others?',
      answer: 'Absolutely! You can share your itineraries with travel companions, family, or friends. They can view your plans, add comments, and even contribute suggestions. Group planning features are available with our paid plans.'
    },
    {
      question: 'What if I need to change my travel dates?',
      answer: 'No problem! TravelWise makes it easy to adjust your travel dates. Our AI will automatically update recommendations based on your new dates, considering factors like weather changes and seasonal availability of attractions.'
    },
    {
      question: 'How do I contact customer support?',
      answer: 'You can reach our support team through multiple channels: live chat (available 24/7 for paid plans), email support, or phone support for Globetrotter members. We typically respond to emails within 2-4 hours during business days.'
    }
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">How can we help you?</h1>
          <p className="text-xl text-white/90 mb-8">
            Find answers to your questions and get the most out of TravelWise
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles, features, or questions..."
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:ring-2 focus:ring-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{category.articles} articles</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Chat Support</h3>
            <p className="text-gray-600 mb-6">
              Get instant help from our support team. Available 24/7 for premium members.
            </p>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors">
              Start Chat
            </button>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Email Support</h3>
            <p className="text-gray-600 mb-6">
              Send us a detailed message and we'll get back to you within 2-4 hours.
            </p>
            <button className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors">
              Send Email
            </button>
          </div>
        </div>

        {/* Still Need Help */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h3>
          <p className="text-gray-600 mb-6">
            Our support team is here to help you make the most of your TravelWise experience.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="w-5 h-5" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="w-5 h-5" />
              <span>support@travelwise.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;