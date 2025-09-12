export const getSessionAuth = () => {
  return sessionStorage.getItem("isAuthenticated") === "true";
};

export const setSessionAuth = () => {
  sessionStorage.setItem("isAuthenticated", "true");
};

export const clearSessionAuth = () => {
  sessionStorage.removeItem("isAuthenticated");
};
