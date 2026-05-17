export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    tenantId: number;
  };
}

export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  status: 'active' | 'inactive' | 'expired';
  expiryDate: string;
  tenantId: number;
}

export interface Payment {
  id: number;
  membershipId: number;
  amount: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface AttendanceLog {
  id: number;
  userId: number;
  checkInTime: string;
  checkOutTime?: string;
  tenantId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
