import React from 'react';
import { Heart, AlertCircle, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCases } from '../hooks/useCases';
import CaseCard from '../components/CaseCard';

const Home = () => {
  const { cases, loading, error } = useCases();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Help Save Animals in Need
            </h1>
            <p className="text-xl mb-8 text-purple-100">
              Join our community in rescuing and protecting injured animals. Every report and donation makes a difference.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/report"
                className="bg-white text-purple-600 px-8 py-3 rounded-xl font-medium hover:bg-purple-50 transition"
              >
                Report a Case
              </Link>
              <a
                href="#donate"
                className="bg-purple-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-purple-400 transition"
              >
                Donate Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <AlertCircle className="h-12 w-12 text-purple-600 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Report Cases</h2>
            <p className="text-gray-600 mb-4">
              Spot an injured animal? Report it immediately with location and photos.
            </p>
            <Link
              to="/report"
              className="inline-flex items-center text-purple-600 hover:text-purple-700"
            >
              Report now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <Heart className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Emergency Response</h2>
            <p className="text-gray-600 mb-4">
              Our team quickly responds to rescue and provide medical care.
            </p>
            <a
              href="tel:1-800-PAWHELP"
              className="inline-flex items-center text-purple-600 hover:text-purple-700"
            >
              Call now <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <DollarSign className="h-12 w-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Support & Donate</h2>
            <p className="text-gray-600 mb-4">
              Help fund medical treatments and rehabilitation for injured animals.
            </p>
            <a
              href="#donate"
              className="inline-flex items-center text-purple-600 hover:text-purple-700"
            >
              Donate now <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Recent Cases Section */}
      <div id="donate" className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Animals Needing Your Support</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            These animals need your help. Every donation helps provide medical care and rehabilitation.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cases...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 text-purple-600 hover:text-purple-700"
            >
              Try again
            </button>
          </div>
        ) : cases.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No cases found. Be the first to report a case!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {cases.map((case_) => (
              <CaseCard key={case_.id} case_={case_} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;