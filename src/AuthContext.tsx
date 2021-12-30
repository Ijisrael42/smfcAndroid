import React from "react";
import { accountService } from './services/accountService'; 

// create the context
export type IAuthContext = {
  authInfo: { loggedIn: boolean; user: { email: string; id: string; }; };
  logOut: any;
  logIn: any;
};

const AuthContext = React.createContext<any>(undefined);

// create the context provider, we are using use state to ensure that
// we get reactive values from the context...
export const AuthProvider: React.FC = ({ children }) => {
  // the reactive values
  const [authInfo, setAuthInfo] = React.useState<any>();
  const [user, setUser] = React.useState<any>();

  const logOut = () => {
    return new Promise((resolve) => {
      setAuthInfo({ loggedIn: false, user: null });
      setTimeout(() => { return resolve(true); }, 1000);
    });
  };

  const authUser = () => { return accountService.userValue; }; // setUser(accountService.userValue); 

  const logIn = (user:any) => {
    return new Promise((resolve) => {
      setUser(user);
      setTimeout(() => { return resolve(true); }, 1000);
    });
  };
  
  let v = { authInfo, authUser, user, logOut: logOut, logIn: logIn, };
  return <AuthContext.Provider value={v}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);
