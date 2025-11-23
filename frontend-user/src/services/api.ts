import axios, { AxiosError } from "axios";
import type { LoginCredentials, RegisterData, AuthResponse, UpdateProfileData, SettingsUpdateResponse, Reservation, ReservationStep1, ReservationStep2, ReservationStep3 } from "../types";


const API_BASE_URL =
  import.meta.env.VITE_API_URL || " https://bookfair-management-platform-production.up.railway.app/api/v1";

export  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiZW1haWwiOiJjaGFtaW5kdW5pcHVuOTlAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NjM5Mzg2MzIsImV4cCI6MTc2Mzk0MjIzMn0.uDXI4Bq1QEcntGdk8h6MLdVFYExuERRCBjA0jopJm9A";

interface BackendRegisterData {
  contactPerson: string;
  email: string;
  phoneNumber: string;
  businessName?: string;
  businessAddress?: string;
  password: string;
}


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

api.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    return api.post<AuthResponse>("/auth/login", credentials);
  },

  register: async (userData: RegisterData) => {
    const backendData: BackendRegisterData = {
      contactPerson: userData.fullName,
      email: userData.email,
      phoneNumber: userData.contactNumber,
      businessName: userData.businessName,
      businessAddress: userData.businessAddress,
      password: userData.password,
    };

    return api.post<AuthResponse>("/auth/register", backendData);
  },

  requestPasswordReset: async (email: string) => {
    return api.post("/auth/forgot", { email });
  },

  verifyOtp: async (email: string, otp: string) => {
    return api.post("/auth/verify-otp", { email, otp });
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    return api.post("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
  },
};

export const userAPI = {
  getCurrentUser: async () => {
    const response = await api.get("/users/me");
    return response;
  },

  // updateOwnProfile: async (userData: UpdateProfileData) => {
  //   return api.put<SettingsUpdateResponse>("/users/profile/me", userData);
  // },

  updateOwnProfile: async (userData: UpdateProfileData) => {
    const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");

    if (!userStr) {
      throw new Error("User not found. Please login again.");
    }

    const user = JSON.parse(userStr);
    const userId = user.id;

    if (!userId) {
      throw new Error("User ID not found. Please login again.");
    }
    return api.put<SettingsUpdateResponse>(`/users/${userId}`, userData);
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");

    if (!userStr) {
      throw new Error("User not found. Please login again.");
    }

    const user = JSON.parse(userStr);
    const userId = user.id;

    if (!userId) {
      throw new Error("User ID not found. Please login again.");
    }

    return api.put<SettingsUpdateResponse>(`/users/${userId}`, {
      password: newPassword,
    });
  },

  updateProfile: async (userData: Partial<RegisterData>) => {
    const response = await api.put("/users/profile", userData);
    return response;
  },

};


export const steperApi = {

getReservationById: async (id: string[]): Promise<Reservation> => {
  try {
    console.log('id', id[0]);
    const numericIdNumber = Number(id[0].split('-')[1]);

    const response = await api.get<Reservation>(`/reservation/${numericIdNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
},


  addReservation: async (userId: string, hallId: string): Promise<any> => {
    try {
      console.log('userId', userId, 'hallId', hallId)
      const response = await api.post<any>(
        '/reservation',
        {hallId:hallId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;

    } catch (error) {
      console.error(error);
      throw error
    }
  },
};

export const updateReservation = {
  updateStep1: async (step1Data: ReservationStep1, reserNo: string): Promise<any> => {
    try {
      const response = await api.put(`/reservation/${reserNo}`, {
        userId:step1Data.userId,
        hallId:step1Data.hallId
      },{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      return response.data;

    } catch (error) {
      console.error("Error updating step 1:", error);
      throw error;
    }
  },

  updateStep2: async <T>(step2Data: ReservationStep2, reserNo:string): Promise<T> => {
    try {
      const response = await api.put<T>(`/reservation/${reserNo}`, {
        stallIds:step2Data
      },{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      return response.data;

    } catch (error) {
      console.error("Error updating step 2:", error);
      throw error;
    }
  },

  updateStep3: async <T>(step3Data: ReservationStep3, reserNo:string): Promise<T> => {
    try {
      const response = await api.put<T>(`/reservation/${reserNo}`, step3Data);
      return response.data;

    } catch (error) {
      console.error("Error updating step 3:", error);
      throw error;
    }
  },

};





export default api;
