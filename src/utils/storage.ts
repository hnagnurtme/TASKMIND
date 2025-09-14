export const getSessionAuth = () => {
    return sessionStorage.getItem( "isAuthenticated" ) === "true";
};

export const getSessionUid = () => {
    return sessionStorage.getItem( "uid" ) || "";
}
export const getSessionEmail = () => {
    return sessionStorage.getItem( "email" ) || "";
}

export const setSessionAuth = ( uid: string, email: string) => {
    sessionStorage.setItem( "isAuthenticated", "true" );
    sessionStorage.setItem( "uid", uid );
    sessionStorage.setItem( "email", email );
};

export const clearSessionAuth = () => {
    sessionStorage.removeItem( "isAuthenticated" );
};
