import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  // State variables to track the authentication process
  isSigningUp: false,
  isCheckingAuth: true,
  isLoggingIn: false,
  isLoggingOut: false,

  // Signup function
  signup: async (userInfo) => {
    set({ isSigningUp: true });
    try {
      const response = await axios.post(
        "https://binge-box-pi.vercel.app/api/auth/signup",
        userInfo
      );
      set({ user: response.data.user, isSigningUp: false });
      toast.success("Account created successfully");
    } catch (error) {
      console.error("Signup error:", error); // Log error for debugging
      const message =
        error.response?.data?.message || "Failed to create an account";
      toast.error(message);
      set({ isSigningUp: false, user: null });
    }
  },

  // Login function
  login: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const response = await axios.post(
        "https://binge-box-pi.vercel.app/api/auth/signin",
        credentials
      );
      set({ user: response.data.user, isLoggingIn: false });
      toast.success("Login successful");
    } catch (error) {
      console.error("Login error:", error); // Log error for debugging
      const message =
        error.response?.data?.message || "Failed to log in";
      toast.error(message);
      set({ isLoggingIn: false, user: null });
    }
  },

  // Logout function
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axios.post("https://binge-box-pi.vercel.app/api/auth/logout");
      set({ user: null, isLoggingOut: false });
      toast.success("Logout successful");
    } catch (error) {
      console.error("Logout error:", error); // Log error for debugging
      const message =
        error.response?.data?.message || "Failed to log out";
      toast.error(message);
      set({ isLoggingOut: false });
    }
  },

  // Authentication check function
  authCheck: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axios.get(
        "https://binge-box-pi.vercel.app/api/auth/authCheck" // Corrected URL
      );
      set({ user: response.data.user, isCheckingAuth: false });
    } catch (error) {
      console.error("AuthCheck error:", error); // Log error for debugging
      set({ user: null, isCheckingAuth: false });
      const message =
        error.response?.data?.message || "Failed to verify authentication";
      toast.error(message);
    }
  },
}));
