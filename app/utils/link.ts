const youtubeUrlParser = (url: string) => {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : false;
};

export const formatYoutubeLink = (url?: string) => {
  if (url) {
    const id = youtubeUrlParser(url);
    return `https://www.youtube.com/embed/${id}`;
  }
};

export const isValidUrl = (url: string) => {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
};
