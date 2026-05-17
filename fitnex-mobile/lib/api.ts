import { ApiResponse, LoginRequest, LoginResponse, Member, Payment, AttendanceLog } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Network error',
      };
    }
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getMembers(tenantId: string): Promise<ApiResponse<Member[]>> {
    return this.request<Member[]>(`/api/v1/members?tenantId=${tenantId}`);
  }

  async createMember(data: Partial<Member>): Promise<ApiResponse<Member>> {
    return this.request<Member>('/api/v1/members', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPayments(tenantId: string): Promise<ApiResponse<Payment[]>> {
    return this.request<Payment[]>(`/api/v1/billing/payments?tenantId=${tenantId}`);
  }

  async processPayment(data: {
    membershipId: number;
    amount: number;
    paymentMethod: string;
  }): Promise<ApiResponse<Payment>> {
    return this.request<Payment>('/api/v1/billing/pay', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAttendanceLogs(tenantId: string, date?: string): Promise<ApiResponse<AttendanceLog[]>> {
    const url = date 
      ? `/api/v1/reports/traffic?tenantId=${tenantId}&date=${date}`
      : `/api/v1/reports/traffic?tenantId=${tenantId}`;
    return this.request<AttendanceLog[]>(url);
  }

  async validateQRToken(token: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
    return this.request<{ success: boolean; message: string }>('/api/v1/attendance/validate', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }
}

export const apiClient = new ApiClient();
