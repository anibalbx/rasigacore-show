import React, { useContext,  useEffect,  useState } from 'react'
import CheckSession from '../components/CheckSession';
import RasigaNavBar from '../components/RasigaNavBar';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDot, faGear, faOilCan, faPowerOff, faUserClock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import DatabaseService from '../class/databaseservice';
import { RasigaAppContext } from '../components/RasigaAppContext';

function MainMenuView() {
  const dbb = new DatabaseService();
  const [canrender, setCanRender] = useState(false);
  const navigate = useNavigate();
  const {tyreperm, oilperm, userperm, permloaded, setIsLogged} = useContext(RasigaAppContext);

  useEffect( 
    ()=>{
      setIsLogged(true);
    }, [setIsLogged]
  );

  return (
    <>
    <CheckSession setCanRender={setCanRender}/>
    {
      canrender&&permloaded  ? (
        <>
        <RasigaNavBar />
        <Container>
          <Row className='mb-2'>
            {
              tyreperm ? (
              <Col xs={6} className='mt-2 '>
                <Button  className='menu-button rs-btn rs-color-green' onClick={()=>{navigate("/TyresView");}}><FontAwesomeIcon icon={faCircleDot}></FontAwesomeIcon> Neumáticos </Button>
              </Col>

              ):(null)
            }
            {
              oilperm ? (
              <Col xs={6}  className='mt-2'>
                <Button  className='menu-button rs-btn rs-color-purple' onClick={()=>{navigate("/OilView");}}><FontAwesomeIcon icon={faOilCan}></FontAwesomeIcon> Aceites </Button>
              </Col>
              ):(null)
            }
            {
              userperm ? (
                <Col xs={6}  className='mt-2'>
                  <Button  className='menu-button rs-btn' variant='primary' onClick={()=>{navigate("/OptionsView");}}><FontAwesomeIcon icon={faGear}></FontAwesomeIcon> Opciones </Button>
                </Col>
              ):(null)
            }
            <Col xs={6}  className='mt-2'>
              <Button className='menu-button rs-btn rs-color-orange' onClick={()=>{navigate("/LogView");}}><FontAwesomeIcon icon={faUserClock}></FontAwesomeIcon> Historial </Button>
            </Col>
            <Col xs={6}  className='mt-2'>
              <Button className='menu-button rs-btn rs-color-red' onClick={()=>{
                dbb.logout(navigate);
                setIsLogged(false);
                }}><FontAwesomeIcon icon={faPowerOff}></FontAwesomeIcon> Cerrar Sesion </Button>
            </Col>
          </Row>
        </Container>
        </>
      ):(null)
    }
    </>
  )
}

export default MainMenuView