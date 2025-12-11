import { useState, useCallback } from "react";
import axios from "axios";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiResult<T> {
  state: UseApiState<T>;
  request: (
    url: string,
    method?: "GET" | "POST" | "PUT" | "DELETE",
    body?: any
  ) => Promise<void>;
}

import { API_BASE_URL } from "../config";


function useApi<T>(): UseApiResult<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const request = useCallback(
    async (
      url: string,
      method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
      body?: any
    ) => {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      try {
        const response = await axios({
          method,
          url: `${API_BASE_URL}${url}`,
          data: body,
        });
        setState({ data: response.data, loading: false, error: null });
      } catch (error: any) {
        setState({ data: null, loading: false, error: error.message });
      }
    },
    []
  );

  return { state, request };
}

export default useApi;
