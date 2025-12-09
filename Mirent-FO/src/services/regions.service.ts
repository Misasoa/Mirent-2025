import axios from "axios";
import { Region } from "../types/region";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/regions`;

export const RegionsService = {
  findAllWithDetails: async (): Promise<Region[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  createFull: async (region: Omit<Region, "id">): Promise<Region> => {
    try {
      const response = await axios.post(API_URL, region);
      return response.data;
    } catch (error) {
      console.error("Error creating region:", error);
      throw error;
    }
  },

  updateFull: async (id: number, region: Partial<Region>): Promise<Region> => {
    const data = {
      nom_region: region.nom_region,
      nom_district: region.nom_district,
      prix: region.prix,
    };
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  removeRegion: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
