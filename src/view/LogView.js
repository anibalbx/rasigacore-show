import React, { useState, useContext } from 'react'
import RasigaNavBar from '../components/RasigaNavBar'
import { Container, Row, Form, Col, Button, ListGroup, Spinner, ToggleButton, ToggleButtonGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBroom, faCar, faMagnifyingGlass, faOilCan } from '@fortawesome/free-solid-svg-icons';
import DatabaseService from '../class/databaseservice';
import Utils from '../class/utils';
import ScrollButton from '../components/ScrollButton';
import PaginationComponent from '../components/PaginationComponent';
import CheckSession from '../components/CheckSession';
import { useEffect } from 'react';
import { RasigaAppContext } from '../components/RasigaAppContext';

const db = new DatabaseService();

function LogView() {
  const [searchvalue, setSearchValue] = useState("");
  const [searchvaluesecond, setSearchValueSecond] = useState("");
  const [data, setData] = useState([]);
  const [inputtype, setInputType] = useState("");
  const [searching, setSearching] = useState(false);
  const [canrender, setCanRender] = useState(false);
  //0 for tyres, 1 for oil
  const [logtype, setLogType] = useState(-1);
  const {tyreperm, oilperm} = useContext(RasigaAppContext);
  
    useEffect(()=>{
      if(oilperm){
        setLogType(1);
        setInputType("NAME_OIL");
      }
      if(tyreperm){
        setLogType(0);
        setInputType("SIZE");

      }
    },[oilperm, tyreperm]);
  
  const fetchLogSearch = async () => {
    if (searchvalue === "") {
      Utils.addToast("Rellena los campos vacíos", "warning");
      return;
    }
    if ((searchvalue === "" || searchvaluesecond === "") && inputtype === "DATE") {
      Utils.addToast("Rellena los campos vacíos", "warning");
      return;
    }
    try {
      setSearching(true);
      let logdata;
      let arrayview = [];

      switch (logtype) {
        //tyres
        case 0:
          logdata = await db.getTyreLogSearch(inputtype, searchvalue, searchvaluesecond);
          logdata.map((log) => {
            return arrayview.push(
              <ListGroup.Item
                key={log.ID}
                as="li"
                className=''
                style={{ backgroundColor: Utils.getDecorationLog(log.OPERATION) }}
              >
                <div style={{ whiteSpace: 'pre-line' }}><b>Medida:</b> {log.SIZE}
                  <br /><b>Operacion:</b> {log.OPERATION}
                  <br /><b>Mensaje:</b> {log.MESSAGE}
                  <br /><b>Fecha:</b> {log.DATE}
                  <br /><b>Usuario:</b> {log.USERNAME}</div>
              </ListGroup.Item>
            );
          });
          setData(arrayview);
          break;
          //Oil
          case 1:
            logdata = await db.getOilLogSearch(inputtype, searchvalue, searchvaluesecond);
            logdata.map((log) => {
              return arrayview.push(
                <ListGroup.Item
                  key={log.ID}
                  as="li"
                  className=""
                  style={{ backgroundColor: Utils.getDecorationLog(log.OPERATION) }}
                >
                  <div style={{ whiteSpace: 'pre-line' }}><b>Nombre:</b> {log.NAME_OIL} 
                    <br /><b>Operacion:</b> {log.OPERATION}
                    <br /><b>Mensaje:</b> {log.MESSAGE}
                    <br /><b>Fecha:</b> {log.DATE}
                    <br /><b>Usuario:</b> {log.USERNAME}</div>
                </ListGroup.Item>
              );
            });
            setData(arrayview);
            break;
      
        default:
          break;
      }
      
      setSearching(false);
    } catch (error) {
      console.error('Error fetching tyres:', error);
    }
  };

  const cleanLog = () => {
    setData([]);
    setSearchValue("");
    setSearchValueSecond("");

  }

  const handleSubmit = (event) => {
    event.preventDefault(); 
    fetchLogSearch();


  };

  return (
    <>
      
      <CheckSession setCanRender={setCanRender} />
      {
        canrender ? (
          <>
            <ScrollButton />
            <RasigaNavBar />
            <Container>
              <Form onSubmit={handleSubmit} style={{ marginTop: "15px" }}>
                <Form.Group>
                  <Row className='mb-2 d-flex justify-content-end'>
                    <Col className='mb-2' xs={12} lg={4}>
                      <Form.Label>Buscar por:</Form.Label>
                      <Form.Select value={inputtype}
                        onChange={(event) => {
                          setInputType(event.target.value)
                          setSearchValue("");
                          setSearchValueSecond("");
                        }}
                        aria-label='select search type'>
                        {
                          logtype === 0 ? (
                            <option value="SIZE">Medida</option>
                          ):(null)
                        }
                        {
                          logtype === 1 ? (
                            <option value="NAME_OIL">Tipo</option>
                          ):(null)
                        }
                        <option value="USERNAME">Usuario</option>
                        <option value="DATE">Fecha</option>
                      </Form.Select>
                    </Col>

                    {inputtype === 'SIZE' && (
                      <Col className='mb-2' xs={12} lg={6}>
                        <Form.Label>Medida: </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Búsqueda por medida"
                          name="search"
                          value={searchvalue}
                          onChange={(event) => { setSearchValue(event.target.value); }} />
                      </Col>
                    )}
                    
                    {inputtype === 'NAME_OIL' && (
                      <Col className='mb-2' xs={12} lg={6}>
                        <Form.Label>Tipo: </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Búsqueda por tipo"
                          name="search"
                          value={searchvalue}
                          onChange={(event) => { setSearchValue(event.target.value); }} />
                      </Col>
                    )}
                    {inputtype === 'USERNAME' && (
                      <Col className='mb-2' xs={12} lg={6}>
                        <Form.Label>Usuario:</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Búsqueda por usuario"
                          name="search"
                          value={searchvalue}
                          onChange={(event) => { setSearchValue(event.target.value); }} />
                      </Col>
                    )}
                    {inputtype === 'DATE' && (
                      <>
                        <Col className='mb-2' xs={12} lg={3}>
                          <Form.Label>Fecha de inicio</Form.Label>
                          <Form.Control
                            type="date"
                            max={searchvaluesecond}
                            value={searchvalue}
                            onChange={(event) => { setSearchValue(event.target.value); }} />
                        </Col>
                        <Col className='mb-2' xs={12} lg={3}>
                          <Form.Label>Fecha de fin</Form.Label>
                          <Form.Control
                            disabled={searchvalue==="" ? true : false}
                            type="date"
                            min={searchvalue}
                            value={searchvaluesecond}
                            onChange={(event) => { setSearchValueSecond(event.target.value); }} />
                        </Col>

                      </>
                    )}

                      <Col xs={2} lg={2} className='mb-2 mt-2 d-flex align-items-center justify-content-end'>
                        <Col className='d-flex justify-content-end me-1'>
                            <Button onClick={fetchLogSearch} size='lg'><FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon></Button>
                        </Col>
                        <Col className='d-flex justify-content-end me-1'>
                            <Button variant="danger" onClick={cleanLog} size='lg'><FontAwesomeIcon icon={faBroom}></FontAwesomeIcon></Button>
                        </Col>
                      </Col>

                  </Row>
                  <Row className='mb-2 mb-2 d-flex justify-content-start'>
                    <Col xs={4} className='d-flex justify-content-start'>
                      <ToggleButtonGroup type="radio" name="options"  value={logtype}
                      onChange={(val)=>{setLogType(val)}}>
                        {tyreperm ? (
                        <ToggleButton onClick={()=>{
                          if(tyreperm){
                            setInputType("SIZE");
                            cleanLog();
                          }
                          }} variant='secondary' id="tbg-radio-1" value={0}>
                          Neumáticos <FontAwesomeIcon icon={faCar}></FontAwesomeIcon>
                        </ToggleButton>
                        ):(null)
                        }
                        {
                          oilperm ? (
                        <ToggleButton onClick={()=>{
                          if(oilperm){
                            setInputType("NAME_OIL");
                            cleanLog();
                          }

                        }} variant='secondary' id="tbg-radio-2" value={1}>
                          Aceites <FontAwesomeIcon icon={faOilCan}></FontAwesomeIcon>
                        </ToggleButton>
                          ):(null)
                        }
                      </ToggleButtonGroup>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
              <ListGroup as="ol">
                {
                  searching ? (
                    <div>Buscando...<Spinner animation="border" variant="primary" /></div>
                  ) : (
                    <PaginationComponent itemsPerPage={50} items={data} paginatorviewpages={4} />
                  )


                }
              </ListGroup>

            </Container>
          </>
        ) : (null)
      }


    </>
  )
}

export default LogView