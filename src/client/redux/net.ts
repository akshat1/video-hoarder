import axios from "axios";
import { AxiosInstance } from "axios";

let instance: AxiosInstance;

export const getInstance = (): AxiosInstance => {
  if (!instance) {
    instance = axios.create({
      timeout: 5000,
      headers: {
        "Cache-Control": "no-cache",
      },
    });
  }

  return instance;
};
