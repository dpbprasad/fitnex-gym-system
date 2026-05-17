'use client';

import { Member } from '@/types/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface MemberListProps {
  members: Member[];
  loading: boolean;
  onRefresh: () => void;
}

export default function MemberList({ members, loading, onRefresh }: MemberListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    member.status
                  )}`}
                >
                  {member.status}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>{member.membershipType}</span>
                <span>Expires: {new Date(member.expiryDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
