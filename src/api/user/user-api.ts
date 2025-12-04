import axios from "axios";
import { env } from "@config";

export const userApi = axios.create({
  baseURL: env.BASE_URL,
});
