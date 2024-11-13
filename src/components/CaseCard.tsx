import React, { useState } from 'react';
import { Case } from '../types/case';
import { useCases } from '../hooks/useCases';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface CaseCardProps {
  case_: Case;
}

const CaseCard: React.FC<CaseCardProps> = ({ case_ }) => {
  const [donationAmount, setDonationAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | null>(null);
  const { donate } = useCases();
  const { user } = useAuth();

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to donate');
      return;
    }

    const amount = Number(donationAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    try {
      await donate(case_.id, Number(donationAmount));
      toast.success('Thank you for your donation!');
      setDonationAmount('');
      setShowPaymentModal(false);
      setPaymentMethod(null);
    } catch (error) {
      toast.error('Failed to process donation');
    }
    setIsProcessing(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <img
        src={case_.imageUrl}
        alt={case_.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{case_.title}</h3>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
            {case_.type}
          </span>
        </div>
        <p className="text-gray-600 mb-4">{case_.description}</p>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span className="text-purple-600">₹{case_.raised} of ₹{case_.goal}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 rounded-full h-2"
              style={{ width: `${(case_.raised / case_.goal) * 100}%` }}
            />
          </div>
        </div>
        <form onSubmit={handleDonate} className="space-y-3">
          <div>
            <input
              type="number"
              placeholder="Enter donation amount (₹)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              min="1"
              step="1"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Donate Now'}
          </button>
        </form>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Select Payment Method</h3>
            <div className="space-y-4">
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`w-full p-4 border rounded-xl ${
                  paymentMethod === 'upi' ? 'border-purple-600' : 'border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span>UPI</span>
                </div>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-4 border rounded-xl ${
                  paymentMethod === 'card' ? 'border-purple-600' : 'border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span>Credit/Debit Card</span>
                </div>
              </button>

              {paymentMethod === 'upi' && (
                <div className="mt-4">
                  <img
                    src="https://i.ibb.co/wQBtGFy/upi-qr.png"
                    alt="UPI QR Code"
                    className="w-48 h-48 mx-auto"
                  />
                  <p className="text-center mt-2 text-sm text-gray-600">
                    Scan QR code to pay
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentMethod(null);
                  }}
                  className="flex-1 py-2 border border-gray-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  className="flex-1 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
                  disabled={!paymentMethod || isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Pay ₹' + donationAmount}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseCard;