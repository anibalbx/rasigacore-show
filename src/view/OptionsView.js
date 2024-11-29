import React, { useEffect, useState } from 'react'
import RasigaNavBar from '../components/RasigaNavBar'
import CSVReader from '../components/CSVReader'
import { Container, Button, Row, Col} from 'react-bootstrap'
import CreateUser from '../components/CreateUser'
import CheckSession from '../components/CheckSession'
import DatabaseService from '../class/databaseservice'
import Permission from '../class/permission'
import RowUser from '../components/RowUser'

function OptionsView() {
  const [activemodal, setActiveModal] = useState(false);
  const [canrender, setCanRender] = useState(false);
  const [users, setUsers] = useState([]);
  

    
    useEffect(()=>{
    const dbb = new DatabaseService();
    async function loadUsers(dbb){
      setUsers(await dbb.getUsers());
    }
    loadUsers(dbb);
  },[]);


  function updateUser(user){
    const cusers = users.slice();
    const index = cusers.findIndex((element) => element.id === user.id);
    if(index>0){
      cusers[index] = user;
      setUsers(cusers);
    }else{
      cusers.push(user);
      setUsers(cusers);
    }
  }
  function deleteUser(id){
    const cusers = users.slice();
    const index = cusers.findIndex((element) => element.id === id);
    cusers.splice(index, 1);
    setUsers(cusers);

  }

  function showModal(){
    setActiveModal(true);
    console.log(users);

  }
  const recieveShow = (show) => {
    setActiveModal(show);
  }
  return (
    <>
    <CheckSession setCanRender={setCanRender} permissionmode={Permission.USERS} permissiontype={Permission.ALLTYPE}/> 

    {
      canrender? (
       <>
      <RasigaNavBar/>
      <Container>
        <CSVReader/>
        {activemodal ? <CreateUser recieveShow={recieveShow} gshow={activemodal} actionUpdateUser={updateUser}/> : null}
        <Row>
          <h2>Usuarios:</h2>
        </Row>
        <Row>
          <Col>
            <Button variant='success' onClick={showModal} size='lg'>Crear Usuario</Button>
          </Col>
        </Row>
        <Row>
        {
          users.length>0 ? (
            users.map(
              (user)=>(
                <RowUser key={user.id} user={user} updateUser={updateUser} deleteUser={deleteUser}/>
              )
            )
          ):(null)
        }
        </Row>
      </Container>
       </> 

      ):(null)
    }
    <div>
    </div>

    </>

  )
}

export default OptionsView