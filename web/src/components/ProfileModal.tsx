import React, { useState } from 'react';
import { useSahaay } from '../context/SahaayContext';
import { getStrings } from '../localization/strings';
import { UserProfile } from '../types';
import { X, User, Phone, MapPin, AlertCircle, Save } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, updateUserProfile, showFeedback, currentLanguage } = useSahaay();
  const strings = getStrings(currentLanguage);

  const [fullName, setFullName] = useState<string>(userProfile.fullName);
  const [age, setAge] = useState<string>(userProfile.age);
  const [contactNumber, setContactNumber] = useState<string>(userProfile.contactNumber);
  const [address, setAddress] = useState<string>(userProfile.address);
  const [emergencyContactName, setEmergencyContactName] = useState<string>(
    userProfile.emergencyContactName
  );
  const [emergencyContactPhone, setEmergencyContactPhone] = useState<string>(
    userProfile.emergencyContactPhone
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      fullName: fullName.trim(),
      age: age.trim(),
      contactNumber: contactNumber.trim(),
      address: address.trim(),
      emergencyContactName: emergencyContactName.trim(),
      emergencyContactPhone: emergencyContactPhone.trim(),
    };
    updateUserProfile(updated);
    showFeedback('Profile & Emergency contacts saved successfully!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#F5F5F7] w-full max-w-xl rounded-3xl shadow-apple-lg border border-apple-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-apple-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-apple-blue-light text-apple-blue flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-apple-text-primary">
                My Profile & Emergency Info
              </h2>
              <p className="text-xs text-apple-text-muted">Personal setup for Sahaay & SOS safety</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-apple-canvas hover:bg-gray-200 flex items-center justify-center text-apple-text-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Personal Details Card */}
          <div className="bg-white rounded-3xl p-5 border border-apple-border space-y-3.5">
            <div className="text-xs font-bold text-apple-blue uppercase tracking-wider">
              Personal Details
            </div>

            <div>
              <label className="block text-xs font-bold text-apple-text-primary mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ashutosh Pandey"
                className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-apple-border focus:ring-2 focus:ring-apple-blue outline-none text-sm font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-apple-text-primary mb-1">
                  Age / DOB
                </label>
                <input
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 68 years"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-apple-border focus:ring-2 focus:ring-apple-blue outline-none text-sm font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-apple-text-primary mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="e.g. +91 98765 12345"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-apple-border focus:ring-2 focus:ring-apple-blue outline-none text-sm font-semibold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-apple-text-primary mb-1">
                Address / City
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Bandra West, Mumbai"
                className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-apple-border focus:ring-2 focus:ring-apple-blue outline-none text-sm font-semibold"
                required
              />
            </div>
          </div>

          {/* Emergency Contact Info Card */}
          <div className="bg-white rounded-3xl p-5 border border-red-200 space-y-3.5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-sos-red uppercase tracking-wider">
              <span>🚨</span>
              <span>Emergency Contact (Used for SOS Guardrail)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-apple-text-primary mb-1">
                Emergency Contact Name & Relation
              </label>
              <input
                type="text"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                placeholder="e.g. Rahul (Son)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-apple-border focus:ring-2 focus:ring-sos-red outline-none text-sm font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-apple-text-primary mb-1">
                Emergency Phone Number
              </label>
              <input
                type="text"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-apple-canvas border border-apple-border focus:ring-2 focus:ring-sos-red outline-none text-sm font-semibold font-mono"
                required
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-4 bg-apple-blue hover:bg-apple-blue-dark text-white font-bold rounded-2xl shadow-apple-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-5 h-5" />
            <span>Save Profile Details</span>
          </button>
        </form>
      </div>
    </div>
  );
};
