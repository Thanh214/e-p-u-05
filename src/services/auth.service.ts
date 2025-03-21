
import { apiService } from './api.service';
import { ENDPOINTS } from '@/config/api';

// Định nghĩa kiểu dữ liệu
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    role?: string;
  };
}

// Auth Service
class AuthService {
  // Đăng nhập
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.post<AuthResponse>(ENDPOINTS.LOGIN, {
        body: credentials,
      });
      
      // Lưu token vào localStorage
      if (response && response.token) {
        localStorage.setItem('auth_token', response.token);
        
        // Giả định thông tin người dùng từ token JWT
        const user = this.getUserFromToken(response.token);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  // Decode JWT token để lấy thông tin user
  private getUserFromToken(token: string): AuthResponse['user'] | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      return {
        id: payload.userId || payload.id || 0,
        username: payload.username || 'User',
        email: payload.email || '',
        role: payload.role,
      };
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }
  
  // Đăng ký
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('Sending register request with data:', userData);
      
      const response = await apiService.post<AuthResponse>(ENDPOINTS.REGISTER, {
        body: userData,
      });
      
      console.log('Register response:', response);
      
      // Nếu API trả về token trực tiếp sau khi đăng ký
      if (response && response.token) {
        localStorage.setItem('auth_token', response.token);
        
        const user = this.getUserFromToken(response.token);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        return response;
      }
      
      // Nếu API không trả về token, trả về response như nhận được
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }
  
  // Đăng xuất
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
  
  // Kiểm tra đã đăng nhập chưa
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
  
  // Lấy thông tin người dùng hiện tại
  getCurrentUser(): AuthResponse['user'] | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export const authService = new AuthService();
