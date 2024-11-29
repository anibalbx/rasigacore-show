import { useEffect,useContext } from 'react';
import DatabaseService from '../class/databaseservice';
import { useNavigate } from 'react-router-dom';
import { RasigaAppContext } from './RasigaAppContext';
function PermissionComponent({permissionmode, permissiontype}) {
  const navigate = useNavigate();
  const {setIsLogged} = useContext(RasigaAppContext);
  
  useEffect( ()=>{
    const db = new DatabaseService();
    async function checkPermission(db){
      const res = await db.checkPermission(permissiontype, permissionmode);
      if(!res){
        setIsLogged(false);
        db.logout(navigate);
      }
    }
    checkPermission(db);
 }, [navigate, permissionmode, permissiontype, setIsLogged]);

  return null;
}

export default PermissionComponent