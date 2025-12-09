import axios from "axios";
import { Customer } from "../types/clientDetail";

import { API_BASE_URL } from "../config";

export const fetchClients = async (): Promise<Customer[]> => {
  const response = await axios.get(`${API_BASE_URL}/clients`);
  return response.data;
};
