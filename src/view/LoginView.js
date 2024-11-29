import React, { useState, useEffect } from 'react'
import { Button, Col, Container, Image, Row, Form } from 'react-bootstrap'
import User from '../class/user';
import FormUser from '../components/FormUser';
import DatabaseService from '../class/databaseservice';
import { useNavigate } from 'react-router-dom';
import Utils from '../class/utils';



function LoginView() {
  const [user, setUser] = useState(new User('', '', 0));
  const [remind, setRemind] = useState(false);
  const dbb = new DatabaseService();
  const navigate = useNavigate();



  useEffect(() => {
    const name = localStorage.getItem('authName');
    const pass = localStorage.getItem('authPassword');

    if (name && pass) {
      let newuser = new User('', '', 0);
      newuser.username = name;
      newuser.userpassword = pass;
      setUser(newuser);
      setRemind(true);
    }
  }, []);

  const reciveUser = (name, pass) => {
    let newuser = new User('', '', 0);
    newuser.username = name;
    newuser.userpassword = pass;
    setUser(newuser);
  }

  function offlineMode() {
    let pass = prompt("Contraseña super usuario: ");
    if (pass) {
      if (Utils.checkSuperUserPass(pass)) {
        if (!navigator.onLine) {
          Utils.offline_mode = true;
          navigate("TyresView");
        } else {
          Utils.addToast("Servicio sólo offline", "warning");
        }

      } else {
        Utils.addToast("Error de contraseña", "danger");
      }
    }

  }

  function handleCheckChange(event) {
    setRemind(event.target.checked);
  }

  function checkReminder() {
    if (remind) {
      localStorage.setItem("authName", user.username);
      localStorage.setItem("authPassword", user.userpassword);

    } else {
      localStorage.removeItem('authName');
      localStorage.removeItem('authPassword');
    }

  }


  async function login() {
    dbb.login(user, checkReminder, navigate);



  }

  return (
    <Container>
      <Form
        onSubmit={(event) => {
          event.preventDefault();
          login();
        }}>
      <Row className='mb-2 d-flex justify-content-center align-items-center'>
        <Image className='img-logo' src='rasigacore.png'></Image>
      </Row>
      <Row className='mb-2 d-flex justify-content-center align-items-center'>
        <Col xs={8} lg={6}>
            <FormUser onChange={reciveUser} username={user.username} userpass={user.userpassword} remind={remind}></FormUser>
            <div key="inline-checkbox" className="mb-3">
              <Form.Check
                inline
                label="Recordar usuario"
                name="group1"
                type="checkbox"
                id="inline-checkbox-1"
                checked={remind}
                onChange={handleCheckChange}

              />
            </div>
        
        </Col>
      </Row>
      <Row>
        <Button onClick={offlineMode} variant="link">Modo Sin Conexión</Button>
      </Row>
      <Row>
        <Col>
          <Button type="submit" onClick={login}>Entrar</Button>
        </Col>
      </Row>
      </Form>
    </Container>
  )
}

export default LoginView