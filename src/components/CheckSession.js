import { useEffect, useContext } from 'react';
import { useNavigate} from 'react-router-dom';
import DatabaseService from '../class/databaseservice';
import { RasigaAppContext } from './RasigaAppContext';



function CheckSession({setCanRender, permissionmode, permissiontype}) {

  const navigate = useNavigate();
  const {setIsLogged} = useContext(RasigaAppContext);

  useEffect(() => {
    const db = new DatabaseService();
    async function checkSessionUse(){
      const res = await db.checkSession();

      if(!res){
        setIsLogged(false);
        db.logout(navigate);
        
      }else{
        if(permissionmode && permissiontype){
          const resu = await db.checkPermission(permissiontype, permissionmode);
          if(!resu){
            setIsLogged(false);
            db.logout(navigate);
          }else{
            setCanRender(true);
          }
        }else{
          setCanRender(true);
        }

      }
    }

    checkSessionUse();


  }, [setCanRender, navigate, setIsLogged, permissionmode, permissiontype]);




  return null;
}

export default CheckSession