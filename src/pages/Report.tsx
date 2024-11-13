import React, { useState } from 'react';
import { Camera, MapPin, Send, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCases } from '../hooks/useCases';
import toast from 'react-hot-toast';

const Report = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { reportCase } = useCases();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    location: '',
    severity: 'moderate' as 'mild' | 'moderate' | 'severe',
    goal: 0,
    image: null as File | null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to report a case');
      navigate('/login');
      return;
    }

    if (!formData.image) {
      toast.error('Please upload an image');
      return;
    }

    setLoading(true);
    try {
      await reportCase({
        type: formData.type,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        severity: formData.severity,
        goal: formData.goal,
        imageUrl: ''
      }, formData.image);
      
      toast.success('Case reported successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to report case. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center space-x-3 mb-8">
          <AlertCircle className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Report an Injured Animal</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of Animal
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="">Select animal type</option>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Enter a title for this case"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['mild', 'moderate', 'severe'].map((severity) => (
                    <button
                      key={severity}
                      type="button"
                      className={`px-4 py-2 rounded-lg capitalize ${
                        formData.severity === severity
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition`}
                      onClick={() => setFormData({ ...formData, severity: severity as 'mild' | 'moderate' | 'severe' })}
                    >
                      {severity}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="Enter precise location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Funding Goal (₹)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="Enter amount needed"
                  value={formData.goal || ''}
                  onChange={(e) => setFormData({ ...formData, goal: Number(e.target.value) })}
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description of Injury/Situation
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  rows={4}
                  placeholder="Describe the animal's condition and situation in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl h-[300px] relative ${preview ? 'bg-gray-50' : 'bg-white'}`}>
                {preview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={preview}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setFormData({ ...formData, image: null });
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 text-center flex flex-col items-center justify-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                        <span>Upload a photo</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white py-3 px-6 rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition"
            disabled={loading}
          >
            <Send className="h-5 w-5" />
            <span className="font-medium">{loading ? 'Submitting...' : 'Submit Report'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Report;