'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { useMembers } from '@/hooks/useMembers';
import MemberList from '@/components/members/MemberList';
import CreateMemberForm from '@/components/members/CreateMemberForm';
import Button from '@/components/ui/Button';

export default function MembersPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { members, loading, createMember, fetchMembers } = useMembers();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateMember = async (data: any) => {
    await createMember(data);
    fetchMembers();
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-4">
                <Button variant="secondary" size="sm" onClick={() => router.push('/dashboard')}>
                  ← Back
                </Button>
                <h1 className="text-xl font-bold text-gray-800">Members</h1>
              </div>
              <div className="flex items-center gap-4">
                <Button onClick={() => setShowCreateForm(true)} size="sm">
                  + New Member
                </Button>
                <Button onClick={logout} variant="secondary" size="sm">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MemberList
            members={members}
            loading={loading}
            onRefresh={fetchMembers}
          />
        </main>

        <CreateMemberForm
          isOpen={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSubmit={handleCreateMember}
        />
      </div>
    </AuthGuard>
  );
}
