import axios from "axios";

let instance;

/**
 * @returns {AxiosInstance}
 */
export const getInstance = () => {
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
