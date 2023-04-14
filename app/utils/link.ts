export const formatYoutubeLink = (url?: string) => {
  return url?.includes("watch?v=") ? `https://youtube.com/embed/${url.split("watch?v=")[1]}` : url;
};
