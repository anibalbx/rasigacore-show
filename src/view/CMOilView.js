import React, { useState, useEffect } from 'react'
import { Container, Row, Button, Form, Col } from 'react-bootstrap'
import CheckSession from '../components/CheckSession'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { useNavigate } from 'react-router-dom';
import Oil from '../class/oil';
import Utils from '../class/utils';
import RowOil from '../components/RowOil';
import DatabaseService from '../class/databaseservice';
import { useLocation } from 'react-router-dom';

function CMOilView() {
  const [canrender, setCanRender] = useState(false);
  const navigate = useNavigate();
  const [newoil, setNewOil] = useState( 
    new Oil (0,"","","",0,0,"", "", 0,0));
  const [db] = useState(new DatabaseService());
  const [id, setId] = useState(0);
  const {state} = useLocation();

  useEffect(() => {
    
    const fetchOil = async (aid) => {
     
      try {
        const oildata = await db.getOil(aid);
        setNewOil(oildata);
        
      } catch (error) {
        console.error('Error fetching tyres:', error);
      }
    };

    if(state){
      setId(state.id);
      fetchOil(state.id);
    }
  },[state, db]);

  async function addOil(){
    if(!newoil.isEmpty()){
      if(id!==0){
        let res = db.updateOil(newoil);
        if(res){
          Utils.addToast("Aceite añadido", "success");
        }else{
            Utils.addToast("Aceite no añadido", "danger");
        }
        setId(0);
        setNewOil(new Oil (0,"","","",0,0,"", "", 0, 0));
      }else{
        let res = db.addOil(newoil.brand, newoil.model, newoil.type,
          newoil.capacity, newoil.stock, newoil.location, newoil.ref, newoil.pvp, newoil.desc);
          if(res){
            Utils.addToast("Aceite insertado", "success");
            setNewOil(new Oil  (0,"","","",0,0,"", "", 0, 0));
          }else{
            Utils.addToast("Aceite no insertado", "danger");
          }

      }

    }else{
      Utils.addToast("Rellene aceite para insertar", "warning");
    }
  }
  function handleInputChange(event){
    const oil =  new Oil 
    (newoil.id,newoil.brand,newoil.model, newoil.type,
      newoil.capacity, newoil.stock, newoil.location,
      newoil.ref, newoil.pvp, newoil.desc
    );
    
    switch (event.target.name) {
      case "brand":
          oil.brand=event.target.value;
        break;
        case "model":
          oil.model=event.target.value;
        break;
        case "type":
          oil.type=event.target.value;
        break;
        case "capacity":
          oil.capacity=event.target.value;
        break;
        case "stock":
          oil.stock=event.target.value;
        break;
        case "location":
          oil.location=event.target.value;
        break;
        case "referencia":
          oil.ref=event.target.value;
        break;
        case "pvp":
          oil.pvp=event.target.value;
        break;
        case "descuento":
          oil.desc=event.target.value;
        break;
      default:
        break;

    }
    setNewOil(oil);

  }

  return (
    <>
    <CheckSession setCanRender={setCanRender}/>
    {
      canrender ? (
      <Container>
        <Row className="mb-2 mt-4 d-flex justify-content-start">
          <Col xs={2}>
            <Button  variant="outline-primary" onClick={()=>{navigate("/OilView");}}><FontAwesomeIcon icon={faArrowLeft} />Volver</Button>
          </Col>
        </Row>
        <div>Crear/Modificar Aceites</div>
        <Row>
          <Form>
            <Form.Group>
            <Row className="mb-2" >
                <Col xs={12} className="text-start">           
                  <Form.Control
                    className='form-control-resp'
                    type="text"
                    placeholder="Referencia"
                    name="referencia"
                    value={newoil.ref}
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>
              <Row className="mb-2">
                <Col xs={12}>
                  <Form.Control
                    className='form-control-resp'
                    type="text"
                    placeholder="Marca"
                    name="brand"
                    value={newoil.brand}
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>
              <Row className="mb-2">
                <Col xs={12}>
                  <Form.Control
                    className='form-control-resp'
                    type="text"
                    placeholder="Modelo"
                    name="model"
                    value={newoil.model}
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>
              <Row className="mb-2">
                <Col xs={12}>
                  <Form.Control
                    className='form-control-resp'
                    type="text"
                    placeholder="Tipo"
                    name="type"
                    value={newoil.type}
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>
              <Row className="mb-2">
                <Col xs={12} className="text-start">
                  <Form.Label 
                  className='form-label-resp'>Capacidad en Litros</Form.Label>
                  <Form.Control
                    className='form-control-resp'
                    type="number"
                    placeholder="Capacidad"
                    name="capacity"
                    value={newoil.capacity}
                    onChange={handleInputChange}
                  /> 
                </Col>
              </Row>
              <Row className="mb-2" >
                <Col xs={12} className="text-start">
                <Form.Label 
                className='form-label-resp'>Stock</Form.Label>
           
                  <Form.Control
                    className='form-control-resp'
                    type="number"
                    placeholder="Stock"
                    name="stock"
                    value={newoil.stock}
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>
              <Row className="mb-2" >
                <Col xs={12} className="text-start">
                <Form.Label 
                className='form-label-resp'>PVP</Form.Label>
           
                  <Form.Control
                    className='form-control-resp'
                    type="number"
                    name="pvp"
                    value={newoil.pvp}
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>
              <Row className="mb-2" >
                <Col xs={12} className="text-start">
                <Form.Label 
                className='form-label-resp'>Descuento % </Form.Label>
           
                  <Form.Control
                    className='form-control-resp'
                    type="number"
                    name="descuento"
                    value={newoil.desc}
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>
              <Row className="mb-2">
                <Col xs={12}>
                  <Form.Select 
                  className='form-control-resp'
                  onChange={handleInputChange} value={newoil.location} name="location" aria-label="select location">
                      <option value ="">Localización</option>
                      <option value="sumagrib">Sumagrib</option>
                      <option value="rasiga">Rasiga</option>
                  </Form.Select>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col xs={12}>
                  <Button onClick={addOil} size='lg'>Añadir</Button>
                </Col>
              </Row>
              
            </Form.Group>
          </Form>
        </Row>
        <RowOil oil={newoil}  enableactions={false}/>
      </Container>
      ):(null)
    }
    </>
  )
}

export default CMOilView