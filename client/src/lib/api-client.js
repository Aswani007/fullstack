import axios from "axios";
import { HOST } from "@/utils/constant";

export const apiClient = axios.create({
  baseURL: "http://localhost:4000", //HOST,
});
