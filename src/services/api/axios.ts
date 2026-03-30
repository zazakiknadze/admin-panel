// src/api/axios.ts
import axios, { AxiosInstance } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const { get, post, put, delete: del } = axiosInstance;

export default axiosInstance;
