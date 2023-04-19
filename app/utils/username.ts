const blockList = ["trending", "all", "popular", "tonehunt", "delete" /* TODO: add more words here */];

export const isNotAllowed = (username: string) => {
  return blockList.includes(username);
};
