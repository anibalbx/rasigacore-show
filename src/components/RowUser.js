import { React, memo, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  Button, Col, Card } from 'react-bootstrap'
import CreateUser from "./CreateUser";
const RowUser = memo(function RowUser({user, updateUser, deleteUser}) {

  const [show, setShow] = useState(false);

  function showModal(){
    setShow(true);
  }

  return (
    <>
      <CreateUser recieveShow={setShow} gshow={show} guser={user} actionUpdateUser={updateUser} actionDeleteUser={deleteUser}/>
      <Col xs={6} lg={4} className='mb-2 mt-2'>
        <Card>
          <Card.Body>
            <Card.Title >
              {user.username}
            </Card.Title>
            <Card.Text>
              Permisos: <br></br>
              
                {user.getNamePermissions().map((perm) => (
                  <span key={perm.iconName+user.id}>
                    <FontAwesomeIcon  size='lg' icon={perm}></FontAwesomeIcon>
                  </span>
                ))}
              
            </Card.Text>
            <Card.Link><Button onClick={showModal} variant='secondary'>Ver</Button></Card.Link>
          </Card.Body>
        </Card>
      </Col>
    </>
  )
});
export default RowUser