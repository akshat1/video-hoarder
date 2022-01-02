import { useEffect } from "react";

export const useTitle = (titleText: string): void => {
  useEffect(() => {
    document.title = `Video Hoarder - ${titleText}`;
  }, []);
};
