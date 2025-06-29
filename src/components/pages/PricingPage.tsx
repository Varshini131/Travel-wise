import React, { useState } from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';

const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Explorer',
      icon: Star,
      price: isAnnual ? 0 : 0,
      period: 'Forever Free',
      description: 'Perfect for occasional travelers',
      features: [
        'Basic AI trip planning',
        'Up to 3 destinations per month',
        'Standard recommendations',
        'Community support',
        'Mobile app access'
      ],
      color: 'gray',
      popular: false
    },
    {
      name: 'Adventurer',
      icon: Zap,
      price: isAnnual ? 79 : 9,
      period: isAnnual ? 'per year' : 'per month',
      description: 'For frequent travelers who want more',
      features: [
        'Advanced AI trip planning',
        'Unlimited destinations',
        'Premium recommendations',
        'Weather-based outfit suggestions',
        'Priority support',
        'Offline access',
        'Custom itinerary export'
      ],
      color: 'purple',
      popular: true
    },
    {
      name: 'Globetrotter',
      icon: Crown,
      price: isAnnual ? 199 : 19,
      period: isAnnual ? 'per year' : 'per month',
      description: 'For travel enthusiasts and professionals',
      features: [
        'Everything in Adventurer',
        'Concierge trip planning',
        'Exclusive local experiences',
        'Group trip coordination',
        'Travel expense tracking',
        'VIP customer support',
        'Early access to new features',
        'Personal travel consultant'
      ],
      color: 'gold',
      popular: false
    }
  ];

  const getColorClasses = (color: string, popular: boolean) => {
    if (popular) {
      return {
        border: 'border-purple-500 border-2',
        header: 'bg-gradient-to-r from-purple-500 to-pink-500',
        button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg',
        icon: 'bg-purple-100 text-purple-600'
      };
    }
    
    switch (color) {
      case 'gray':
        return {
          border: 'border-gray-200',
          header: 'bg-gray-50',
          button: 'bg-gray-900 hover:bg-gray-800',
          icon: 'bg-gray-100 text-gray-600'
        };
      case 'gold':
        return {
          border: 'border-yellow-200',
          header: 'bg-gradient-to-r from-yellow-400 to-orange-400',
          button: 'bg-gradient-to-r from-yellow-400 to-orange-400 hover:shadow-lg',
          icon: 'bg-yellow-100 text-yellow-600'
        };
      default:
        return {
          border: 'border-gray-200',
          header: 'bg-gray-50',
          button: 'bg-gray-900 hover:bg-gray-800',
          icon: 'bg-gray-100 text-gray-600'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Choose Your Travel Plan</h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Unlock the full potential of AI-powered travel planning with our flexible pricing options
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`font-medium ${!isAnnual ? 'text-white' : 'text-white/70'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isAnnual ? 'bg-white' : 'bg-white/30'
              }`}
            >
              <div className={`absolute w-5 h-5 bg-purple-600 rounded-full top-1 transition-transform ${
                isAnnual ? 'translate-x-8' : 'translate-x-1'
              }`}></div>
            </button>
            <span className={`font-medium ${isAnnual ? 'text-white' : 'text-white/70'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                Save 20%
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const colors = getColorClasses(plan.color, plan.popular);
            
            return (
              <div key={plan.name} className={`bg-white rounded-2xl shadow-lg overflow-hidden relative ${colors.border}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className={`${colors.header} ${plan.popular ? 'text-white' : 'text-gray-900'} p-6 text-center`}>
                  <div className={`w-16 h-16 ${colors.icon} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className={`${plan.popular ? 'text-white/90' : 'text-gray-600'} mb-4`}>
                    {plan.description}
                  </p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className={`${plan.popular ? 'text-white/70' : 'text-gray-500'} ml-2`}>
                      {plan.period}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`w-full ${colors.button} text-white py-3 rounded-xl font-semibold transition-all`}>
                    {plan.price === 0 ? 'Get Started Free' : 'Start Free Trial'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-3">Can I change plans anytime?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-3">Is there a free trial?</h3>
              <p className="text-gray-600">
                All paid plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-semibold text-gray-900 mb-3">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;