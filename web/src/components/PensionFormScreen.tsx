import React, { useState } from 'react';
import { useSahaay } from '../context/SahaayContext';
import { X, CheckCircle, FileText, User, ShieldCheck, Loader2 } from 'lucide-react';

interface PensionFormScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PensionFormScreen: React.FC<PensionFormScreenProps> = ({ isOpen, onClose }) => {
  const { userProfile, showFeedback, currentLanguage } = useSahaay();

  const [fullName, setFullName] = useState<string>(userProfile.fullName);
  const [phoneNumber, setPhoneNumber] = useState<string>(userProfile.contactNumber);
  const [address, setAddress] = useState<string>(userProfile.address);
  const [aadhaarNumber, setAadhaarNumber] = useState<string>('');

  const isHindi = currentLanguage.includes('Hindi') || currentLanguage.includes('हिंदी');

  const pensionSchemes = isHindi
    ? [
        'वृद्धावस्था पेंशन योजना',
        'विधवा पेंशन योजना',
        'दिव्यांग पेंशन योजना',
        'राष्ट्रीय सामाजिक सहायता कार्यक्रम',
      ]
    : [
        'Old Age Pension Scheme',
        'Widow Pension Scheme',
        'Disability Pension Scheme',
        'National Social Assistance Program',
      ];

  const [selectedScheme, setSelectedScheme] = useState<string>(pensionSchemes[0]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showFeedback(`Pension application submitted successfully for ${fullName}!`);
    }, 1200);
  };

  const handleFinish = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#F5F5F7] w-full max-w-2xl rounded-3xl shadow-apple-lg border border-apple-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-apple-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">
              📋
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-apple-text-primary">
                Pension Application
              </h2>
              <p className="text-xs sm:text-sm text-apple-text-muted">
                Government Welfare Scheme Portal
              </p>
            </div>
          </div>
          <button
            onClick={handleFinish}
            className="w-9 h-9 rounded-full bg-apple-canvas hover:bg-gray-200 flex items-center justify-center text-apple-text-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {isSubmitted ? (
            /* Success View */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-green-300 shadow-apple-md text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-green-700">Application Submitted!</h3>
                <p className="text-sm text-apple-text-secondary mt-1 max-w-md mx-auto">
                  Your pension application has been submitted to the Welfare Department.
                </p>
              </div>

              <div className="bg-apple-canvas rounded-2xl p-4 text-left space-y-2 text-sm max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-apple-text-muted">Applicant:</span>
                  <span className="font-bold text-apple-text-primary">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-apple-text-muted">Scheme:</span>
                  <span className="font-semibold text-apple-text-primary">{selectedScheme}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-apple-text-muted">Application Ref:</span>
                  <span className="font-mono font-bold text-apple-blue">
                    PEN-{Math.floor(100000 + Math.random() * 900000)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-apple-text-muted">Status:</span>
                  <span className="text-green-600 font-bold">Verification Pending</span>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full max-w-md mx-auto py-3.5 bg-apple-blue hover:bg-apple-blue-dark text-white font-bold rounded-2xl shadow-sm transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Pre-fill Notice Banner matching Kotlin */}
              <div className="p-3.5 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-green-800 font-medium">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                <span>Fields pre-filled from your profile. Edit if needed.</span>
              </div>

              {/* Personal Details */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-apple-border space-y-3.5">
                <div className="text-xs font-bold text-apple-blue uppercase tracking-wider">
                  Personal Details (Pre-filled)
                </div>

                <div>
                  <label className="block text-xs font-bold text-apple-text-primary mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-apple-border focus:ring-2 focus:ring-apple-blue outline-none text-sm font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-apple-text-primary mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-apple-border focus:ring-2 focus:ring-apple-blue outline-none text-sm font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-apple-text-primary mb-1">
                    Residential Address
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-apple-border focus:ring-2 focus:ring-apple-blue outline-none text-sm font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Pension Details */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-apple-border space-y-3.5">
                <div className="text-xs font-bold text-apple-blue uppercase tracking-wider">
                  Pension Details
                </div>

                <div>
                  <label className="block text-xs font-bold text-apple-text-primary mb-1">
                    Pensioner ID / Aadhaar Number (12 digits)
                  </label>
                  <input
                    type="text"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="Enter 12-digit Aadhaar or Pensioner ID"
                    maxLength={14}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-apple-border focus:ring-2 focus:ring-apple-blue outline-none text-sm font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-apple-text-primary mb-2">
                    Pension Scheme Type
                  </label>
                  <div className="space-y-2">
                    {pensionSchemes.map((scheme) => (
                      <label
                        key={scheme}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          selectedScheme === scheme
                            ? 'border-apple-blue bg-apple-blue-light/50 font-bold text-apple-blue'
                            : 'border-apple-border bg-apple-canvas text-apple-text-secondary hover:bg-gray-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="pension_scheme"
                          value={scheme}
                          checked={selectedScheme === scheme}
                          onChange={() => setSelectedScheme(scheme)}
                          className="accent-apple-blue w-4 h-4"
                        />
                        <span className="text-sm">{scheme}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !fullName || !aadhaarNumber}
                className="w-full py-4 bg-apple-blue hover:bg-apple-blue-dark disabled:opacity-50 text-white font-bold rounded-2xl shadow-apple-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <span>Submit Pension Application</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
