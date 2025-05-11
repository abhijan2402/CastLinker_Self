import axios, { AxiosRequestHeaders, Method } from "axios";
import { toast } from "react-toastify";

// You can later move this to an env file
// export const baseURL: string = "https://filmcollab.in/";
export const baseURL: string = "https://91.108.104.109:3000/";

if (!baseURL) {
  console.warn(
    "> BaseURL error, please check your env file or visit api/ClientFunction.tsx for more details."
  );
}

// Axios instance
const api = axios.create({
  baseURL,
});

// Generic request handler
const handleRequest = async <T,>(
  method: Method,
  url: string,
  data: any = null
): Promise<T | any> => {
  const token = localStorage.getItem("token");

  try {
    const response = await api({
      method,
      url,
      data: method !== "get" ? data : undefined,
      params: method === "get" ? data : undefined,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response?.data as T;
  } catch (error: any) {
    const errorData = error?.response?.data ?? {};
    const message = errorData?.message;

    if (
      message === "Authorization token is required" ||
      message === "Invalid or expired token" ||
      message === "User not found" ||
      message === "Account Blocked, Can't Proceed." ||
      message === "Invalid or expired session"
    ) {
      window.location.href = baseURL;
    }

    if (!errorData?.success && message) {
      toast.error(message || "Something went wrong in API call.");
    }

    return errorData;
  }
};

// API functions

export const fetchData = <T,>(url: string): Promise<T> =>
  handleRequest<T>("get", url);

export const postData = <T,>(url: string, data: any): Promise<T> =>
  handleRequest<T>("post", url, data);

export const updateData = <T,>(url: string, data: any): Promise<T> =>
  handleRequest<T>("put", url, data);

export const patchData = <T,>(url: string, data: any): Promise<T> =>
  handleRequest<T>("patch", url, data);

export const deleteData = <T,>(url: string, data?: any): Promise<T> =>
  handleRequest<T>("delete", url, data);

export const requestData = <T,>(
  method: Method,
  url: string,
  data?: any
): Promise<T> => handleRequest<T>(method, url, data);
