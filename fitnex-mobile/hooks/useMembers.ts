import { useState, useEffect } from 'react';
import { Member } from '@/types/api';
import { apiClient } from '@/lib/api';
import { useAuth } from './useAuth';

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchMembers = async () => {
    if (!user || !user.tenantId) return;

    setLoading(true);
    setError(null);

    const response = await apiClient.getMembers(user.tenantId.toString());
    
    if (response.success && response.data) {
      setMembers(response.data);
    } else {
      setError(response.error || 'Failed to fetch members');
    }

    setLoading(false);
  };

  const createMember = async (data: Partial<Member>) => {
    setLoading(true);
    setError(null);

    const response = await apiClient.createMember(data);
    
    if (response.success && response.data) {
      setMembers([...members, response.data]);
    } else {
      setError(response.error || 'Failed to create member');
    }

    setLoading(false);
    return response;
  };

  useEffect(() => {
    fetchMembers();
  }, [user]);

  return {
    members,
    loading,
    error,
    fetchMembers,
    createMember,
  };
}
