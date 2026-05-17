'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { membershipId: number; amount: number; paymentMethod: string }) => Promise<void>;
  membershipId?: number;
}

export default function PaymentForm({ isOpen, onClose, onSubmit, membershipId }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    membershipId: membershipId || 0,
    amount: '',
    paymentMethod: 'cash',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        membershipId: formData.membershipId,
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
      });
      setFormData({ membershipId: membershipId || 0, amount: '', paymentMethod: 'cash' });
      onClose();
    } catch (error) {
      console.error('Failed to process payment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Process Payment</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Membership ID"
            type="number"
            value={formData.membershipId.toString()}
            onChange={(e) => setFormData({ ...formData, membershipId: parseInt(e.target.value) })}
            required
          />

          <Input
            label="Amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              required
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Processing...' : 'Process Payment'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
