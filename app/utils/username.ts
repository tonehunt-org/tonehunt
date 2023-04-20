const blockList = ["trending", "all", "popular", "tonehunt", "favorites", "delete" /* TODO: add more words here */];

export const isNotAllowed = (username: string) => {
  return blockList.includes(username);
};
