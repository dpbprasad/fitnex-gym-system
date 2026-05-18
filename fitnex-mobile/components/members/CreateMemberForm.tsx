'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import SignaturePad from '@/components/ui/SignaturePad';

interface CreateMemberFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export default function CreateMemberForm({ isOpen, onClose, onSubmit }: CreateMemberFormProps) {
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    email: '',
    idType: 'NIC',
    idNumber: '',
    dateOfBirth: '',
    gender: 'Male',
    weight: '',
    height: '',
    permanentAddress: '',
    temporaryAddress: '',
    contactNumber: '',
    photoUrl: '',
    // Guardian
    guardianName: '',
    guardianContact: '',
    guardianSignature: false,
    // Declaration
    declarationSigned: false,
    memberSignature: '',
    // Health Declaration
    healthDeclaration: {
      heartCondition: false,
      heartConditionDetails: '',
      bloodPressure: false,
      bloodPressureDetails: '',
      asthma: false,
      asthmaDetails: '',
      diabetes: false,
      diabetesDetails: '',
      jointInjuries: false,
      jointInjuriesDetails: '',
      recentSurgery: false,
      recentSurgeryDetails: '',
      allergies: false,
      allergiesDetails: '',
      pregnancy: 'No',
      pregnancyDetails: ''
    },
    // Emergency Contacts
    emergencyContacts: [
      { name: '', relationship: '', contactNumber: '' }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [showGuardian, setShowGuardian] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to create member:', error);
      alert('Failed to create member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addEmergencyContact = () => {
    setFormData({
      ...formData,
      emergencyContacts: [
        ...formData.emergencyContacts,
        { name: '', relationship: '', contactNumber: '' }
      ]
    });
  };

  const removeEmergencyContact = (index: number) => {
    const newContacts = formData.emergencyContacts.filter((_, i) => i !== index);
    setFormData({ ...formData, emergencyContacts: newContacts });
  };

  const updateEmergencyContact = (index: number, field: string, value: string) => {
    const newContacts = [...formData.emergencyContacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setFormData({ ...formData, emergencyContacts: newContacts });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Member</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Personal Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
                <select
                  value={formData.idType}
                  onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 bg-white"
                  required
                >
                  <option value="NIC">NIC</option>
                  <option value="Driving Licence">Driving Licence</option>
                  <option value="Passport">Passport</option>
                </select>
              </div>
              <Input
                label="ID Number"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => {
                  setFormData({ ...formData, dateOfBirth: e.target.value });
                  // Calculate age and check if under 18
                  const dob = new Date(e.target.value);
                  const today = new Date();
                  const age = today.getFullYear() - dob.getFullYear();
                  setShowGuardian(age < 18);
                }}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 bg-white"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <Input
                label="Contact Number"
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Weight (kg)"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
              <Input
                label="Height (cm)"
                type="number"
                step="0.1"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
              <textarea
                value={formData.permanentAddress}
                onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 bg-white"
                rows={2}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temporary Address (Optional)</label>
              <textarea
                value={formData.temporaryAddress}
                onChange={(e) => setFormData({ ...formData, temporaryAddress: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 bg-white"
                rows={2}
              />
            </div>
          </div>

          {/* Guardian Section (for under-18) */}
          {showGuardian && (
            <div className="space-y-4 bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Guardian Details (Under 18)</h3>
              <Input
                label="Guardian Name"
                value={formData.guardianName}
                onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                required={showGuardian}
              />
              <Input
                label="Guardian Contact"
                type="tel"
                value={formData.guardianContact}
                onChange={(e) => setFormData({ ...formData, guardianContact: e.target.value })}
                required={showGuardian}
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.guardianSignature}
                  onChange={(e) => setFormData({ ...formData, guardianSignature: e.target.checked })}
                  required={showGuardian}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">Guardian signature confirmed</span>
              </label>
            </div>
          )}

          {/* Health Declaration Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Health Declaration</h3>
            
            {[
              { key: 'heartCondition', label: 'Heart condition' },
              { key: 'bloodPressure', label: 'High or low blood pressure' },
              { key: 'asthma', label: 'Asthma or breathing difficulties' },
              { key: 'diabetes', label: 'Diabetes' },
              { key: 'jointInjuries', label: 'Joint, bone, or back injuries' },
              { key: 'recentSurgery', label: 'Recent surgery' },
              { key: 'allergies', label: 'Allergies' }
            ].map((item) => (
              <div key={item.key} className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.healthDeclaration[item.key as keyof typeof formData.healthDeclaration] as boolean}
                    onChange={(e) => setFormData({
                      ...formData,
                      healthDeclaration: {
                        ...formData.healthDeclaration,
                        [item.key]: e.target.checked,
                        [`${item.key}Details`]: e.target.checked ? formData.healthDeclaration[`${item.key}Details` as keyof typeof formData.healthDeclaration] : ''
                      }
                    })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </label>
                {formData.healthDeclaration[item.key as keyof typeof formData.healthDeclaration] && (
                  <Input
                    label={`${item.label} details`}
                    value={formData.healthDeclaration[`${item.key}Details` as keyof typeof formData.healthDeclaration] as string}
                    onChange={(e) => setFormData({
                      ...formData,
                      healthDeclaration: {
                        ...formData.healthDeclaration,
                        [`${item.key}Details`]: e.target.value
                      }
                    })}
                    required
                  />
                )}
              </div>
            ))}

            {formData.gender === 'Female' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pregnancy</label>
                <select
                  value={formData.healthDeclaration.pregnancy}
                  onChange={(e) => setFormData({
                    ...formData,
                    healthDeclaration: {
                      ...formData.healthDeclaration,
                      pregnancy: e.target.value
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 bg-white"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                {formData.healthDeclaration.pregnancy === 'Yes' && (
                  <Input
                    label="Pregnancy details"
                    value={formData.healthDeclaration.pregnancyDetails}
                    onChange={(e) => setFormData({
                      ...formData,
                      healthDeclaration: {
                        ...formData.healthDeclaration,
                        pregnancyDetails: e.target.value
                      }
                    })}
                  />
                )}
              </div>
            )}
          </div>

          {/* Emergency Contacts Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Emergency Contacts</h3>
            {formData.emergencyContacts.map((contact, index) => (
              <div key={index} className="space-y-2 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Contact {index + 1}</span>
                  {formData.emergencyContacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmergencyContact(index)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <Input
                  label="Name"
                  value={contact.name}
                  onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                  <select
                    value={contact.relationship}
                    onChange={(e) => updateEmergencyContact(index, 'relationship', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 bg-white"
                    required
                  >
                    <option value="">Select relationship...</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Brother/Sister">Brother/Sister</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <Input
                  label="Contact Number"
                  type="tel"
                  value={contact.contactNumber}
                  onChange={(e) => updateEmergencyContact(index, 'contactNumber', e.target.value)}
                  required
                />
              </div>
            ))}
            {formData.emergencyContacts.length < 2 && (
              <button
                type="button"
                onClick={addEmergencyContact}
                className="text-primary hover:underline text-sm font-medium"
              >
                + Add Emergency Contact
              </button>
            )}
          </div>

          {/* General Rules and Regulations Section */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2">General Rules and Regulations</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>All members must present valid ID upon entry</li>
              <li>Proper workout attire and closed-toe shoes are required</li>
              <li>Wipe down equipment after use</li>
              <li>Re-rack weights after use</li>
              <li>No food or drinks (except water) in workout areas</li>
              <li>Respect time limits on cardio machines during peak hours</li>
              <li>Use equipment responsibly and report any damage</li>
              <li>Follow staff instructions at all times</li>
              <li>Mobile phones should be used in designated areas only</li>
              <li>Towels are required for all workout activities</li>
            </ul>
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={formData.declarationSigned}
                onChange={(e) => setFormData({ ...formData, declarationSigned: e.target.checked })}
                required
                className="w-4 h-4 mt-1"
              />
              <span className="text-sm text-gray-700">I have read and agree to abide by the gym rules and regulations</span>
            </label>
          </div>

          {/* Declaration Section */}
          <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Declaration & Consent</h3>
            <p className="text-sm text-gray-600">
              I declare that the information I have provided, including my health and medical details, is true and complete to the best of my knowledge. I understand that physical exercise carries inherent risks, and that I take part voluntarily and at my own risk.
            </p>
            <SignaturePad
              value={formData.memberSignature}
              onChange={(signature) => setFormData({ ...formData, memberSignature: signature })}
            />
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={formData.declarationSigned}
                onChange={(e) => setFormData({ ...formData, declarationSigned: e.target.checked })}
                required
                className="w-4 h-4 mt-1"
              />
              <span className="text-sm text-gray-700">I agree to the declaration and consent</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creating...' : 'Create Member'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
