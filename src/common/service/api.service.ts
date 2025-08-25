import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class ApiService {
  private api: AxiosInstance;

  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    this.api = axios.create({
      baseURL:
        this.configService.get<string>('API_URL') || 'http://localhost:3000',
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use((config) => {
      const token = this.authService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add tenant context
      const userInfo = this.authService.getUserInfo();
      if (userInfo?.tenantId) {
        config.headers['X-Tenant-ID'] = userInfo.tenantId;
      }

      return config;
    });

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // For now, we'll skip the logout call as we don't have userId
          // This should be handled by the auth guard/interceptor
          console.warn('Unauthorized request detected');
        }
        return Promise.reject(error);
      },
    );
  }

  // Generic CRUD methods
  async get<T>(url: string): Promise<T> {
    const response = await this.api.get<T>(url);
    return response.data;
  }

  async post<T>(url: string, data: any): Promise<T> {
    const response = await this.api.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data: any): Promise<T> {
    const response = await this.api.put<T>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.api.delete<T>(url);
    return response.data;
  }
}
