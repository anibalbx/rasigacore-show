import React, { useContext} from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useLocation} from 'react-router-dom';
import DatabaseService from '../class/databaseservice';
import { useNavigate } from 'react-router-dom';
import Utils from '../class/utils';
import { RasigaAppContext } from './RasigaAppContext';

function RasigaNavBar() {

  const dbb = new DatabaseService();
  const navigate = useNavigate();
  const {userperm, tyreperm, oilperm, permloaded, setIsLogged} = useContext(RasigaAppContext);
  const loc = useLocation();


  function logout() {
    setIsLogged(false);
    dbb.logout(navigate);
  }

  return (
    <>


      <Navbar variant="dark" bg="secondary" expand="xxl">
        <Container>
          <Navbar.Brand as={Link} to="/MainMenuView">RasigaCore</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link className={loc.pathname === ("/MainMenuView") ? ('active'):('')}  as={Link} to="/MainMenuView">Menú Principal</Nav.Link>
              {
                !Utils.offline_mode && permloaded ? (
                  <>
                    {
                      tyreperm ? (
                        <Nav.Link className={loc.pathname === ("/TyresView") ? ('active'):('')} as={Link} to="/TyresView">Neumáticos</Nav.Link>
                      ) : (null)
                    }
                    {
                      userperm ? (
                        <Nav.Link className={loc.pathname === ("/OptionsView") ? ('active'):('')} as={Link} to="/OptionsView">Opciones</Nav.Link>
                      ) : (null)
                    }
                    <Nav.Link className={loc.pathname === ("/LogView") ? ('active'):('')} as={Link} to="/LogView">Log</Nav.Link>
                    {
                      oilperm ? (
                        <Nav.Link className={loc.pathname === ("/OilView") ? ('active'):('')} as={Link} to="/OilView">Aceites</Nav.Link>
                      ) : (null)
                    }
                  </>
                ) : (
                  null
                )
              }
              <Nav.Link onClick={logout}>Cerrar Sesión</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>



    </>
  )

}

export default RasigaNavBar