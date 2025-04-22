import axios, { AxiosRequestHeaders, Method } from "axios";
import { toast } from "react-toastify";

// You can later move this to an env file
export const baseURL: string = "http://localhost:3000";

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
  data: any = null,
): Promise<T | any> => {
const token =
  "eyJhbGciOiJIUzI1NiIsImtpZCI6ImdaaWdldnBSYWF3MC9TRDciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3FucGRpZW9teHJhZXJ6Z29jb2ZrLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJlOTgzYWVlNC0wMzg3LTQ0MGEtOTlmMy1jMTIzNTVhYTc0NTgiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ1MjYwNTI2LCJpYXQiOjE3NDUyNTY5MjYsImVtYWlsIjoidHVzZXJAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YXRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJhdmF0YXJfdXJsIjoiL2ltYWdlcy9hdmF0YXIucG5nIiwiZW1haWwiOiJ0dXNlckBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6InRlc3QiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInJvbGUiOiJEaXJlY3RvciIsInN1YiI6ImU5ODNhZWU0LTAzODctNDQwYS05OWYzLWMxMjM1NWFhNzQ1OCJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzQ1MjU2OTI2fV0sInNlc3Npb25faWQiOiJmNWZmYjZmMC1hYzA5LTQyYzQtOTM0ZC05ODEwZTU3ZDVhNDkiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.xMCkUj32Y9SFL7SGCUDVdPCSyVZFgd7_YCODXaxj630";


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

export const deleteData = <T,>(url: string, data?: any): Promise<T> =>
  handleRequest<T>("delete", url, data);

export const requestData = <T,>(
  method: Method,
  url: string,
  data?: any
): Promise<T> => handleRequest<T>(method, url, data);
