'use client';

import { useState } from 'react';
import { Member } from '@/types/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface MemberListProps {
  members: Member[];
  loading: boolean;
  onRefresh: () => void;
  onUpdateStatus?: (memberId: string, status: string, reason?: string, reasonDetails?: string) => Promise<void>;
}

export default function MemberList({ members, loading, onRefresh, onUpdateStatus }: MemberListProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('Active');
  const [reason, setReason] = useState('');
  const [reasonDetails, setReasonDetails] = useState('');
  const [updating, setUpdating] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (member: Member) => {
    setSelectedMember(member);
    setNewStatus(member.status);
    setReason('');
    setReasonDetails('');
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedMember || !onUpdateStatus) return;

    setUpdating(true);
    try {
      await onUpdateStatus(String(selectedMember.id), newStatus, reason, reasonDetails);
      setShowStatusModal(false);
      onRefresh();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-gray-600">Loading members...</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Members</h2>
          <Button onClick={onRefresh} variant="secondary" size="sm">
            Refresh
          </Button>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No members found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-800">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        member.status
                      )}`}
                    >
                      {member.status}
                    </span>
                    {onUpdateStatus && (
                      <button
                        onClick={() => handleStatusChange(member)}
                        className="text-primary text-sm hover:underline"
                      >
                        Change
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{member.membershipType}</span>
                  {member.expiryDate && (
                    <span>Expires: {new Date(member.expiryDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Status Change Modal */}
      {showStatusModal && selectedMember && (
        <Modal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)}>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Membership Status</h2>
            <p className="text-sm text-gray-600 mb-4">
              Member: <strong>{selectedMember.name}</strong><br />
              Current Status: <strong>{selectedMember.status}</strong>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {newStatus === 'On Hold' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 bg-white"
                      required
                    >
                      <option value="">Select a reason...</option>
                      <option value="payment_delay">Payment Delay</option>
                      <option value="rule_violation">Rule Violation</option>
                      <option value="medical_leave">Medical Leave</option>
                      <option value="member_request">Member Request</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason Details</label>
                    <textarea
                      value={reasonDetails}
                      onChange={(e) => setReasonDetails(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-gray-900 bg-white"
                      rows={3}
                      placeholder="Additional details..."
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowStatusModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={updating || (newStatus === 'On Hold' && !reason)}
                  className="flex-1"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
