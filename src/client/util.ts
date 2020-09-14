export const getURL = (url: string): string => `%%%SERVER_PATH%%%/${url}`.replace(/\/+/g, "/");
