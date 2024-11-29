import React, {createContext, useEffect, useState} from "react";
import DatabaseService from "../class/databaseservice";
import Permission from "../class/permission";
export const RasigaAppContext = createContext();

export const RasigaAppProvider = ({children}) => {
  const [tyreperm, setTyrePerm] = useState(false);
  const [oilperm, setOilPerm] = useState(false);
  const [userperm, setUserPerm] = useState(false);
  const [permloaded, setPermLoaded] = useState(false);
  const [islogged, setIsLogged] = useState(false);

  useEffect(
    ()=>{
      const dbb = new DatabaseService();
      const readPermission = async ()=>{
        setPermLoaded(false);
        setTyrePerm(await dbb.checkPermission(Permission.ALLTYPE, Permission.TYRES));
        setOilPerm(await dbb.checkPermission(Permission.ALLTYPE, Permission.OIL));
        setUserPerm(await dbb.checkPermission(Permission.ALLTYPE, Permission.USERS));
        setPermLoaded(true);
      }
      const reloadContext = () =>{
       setPermLoaded(false); 
       const res = dbb.checkSession();
       if(res){
        readPermission();
       }

      }

      if(islogged){
        readPermission();
      }
               
    window.addEventListener('load', reloadContext);
    return () => {
      window.removeEventListener('load', reloadContext);
    };

    },
    [islogged]
  );

  


  return(
    <RasigaAppContext.Provider value={{tyreperm, oilperm, userperm, permloaded, setIsLogged}}>
      {children}
    </RasigaAppContext.Provider>
  );
  

};