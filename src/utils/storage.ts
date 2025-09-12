export const getSessionAuth = () => {
    return sessionStorage.getItem( "isAuthenticated" ) === "true";
};

export const getSessionUid = () => {
    return sessionStorage.getItem( "uid" ) || "";
}

export const setSessionAuth = ( uid: string ) => {
    sessionStorage.setItem( "isAuthenticated", "true" );
    sessionStorage.setItem( "uid", uid );
};

export const clearSessionAuth = () => {
    sessionStorage.removeItem( "isAuthenticated" );
};
