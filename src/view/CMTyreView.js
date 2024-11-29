import React, { useEffect, useState } from 'react'
import { Container, Form, Col, Row, Button } from 'react-bootstrap'
import Tyre from '../class/tyre';
import { useLocation } from 'react-router-dom';
import DatabaseService from '../class/databaseservice';
import { useNavigate } from 'react-router-dom';
import RowTyre from '../components/RowTyre';
import Utils from '../class/utils';
import CheckSession from '../components/CheckSession';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function CMTyreView() {
  const [newtyre, setNewtyre] = useState(new Tyre(0,'','','',0,'','', '000/00R00'));
  const {state} = useLocation();
  const navigate = useNavigate();
  const [id, setId] = useState(0);
  const [canrender, setCanRender] = useState(false);
  const [dboperations] = useState(new DatabaseService());

  
  useEffect(() => {
    
    const fetchTyre = async (aid) => {
     
      try {
        const tyresData = await dboperations.getTyre(aid);
        setNewtyre(tyresData);
        
      } catch (error) {
        console.error('Error fetching tyres:', error);
      }
    };

    if(state){
      setId(state.id);
      fetchTyre(state.id);
    }
  },[state, dboperations]);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setNewtyre(prevTyre => new Tyre(
      prevTyre.id,
      name === 'brand' ? value : prevTyre.brand,
      name === 'model' ? value : prevTyre.model,
      name === 'size' ? value : prevTyre.size,
      name === 'stock' ? parseInt(value, 10) : prevTyre.stock,
      name === 'iccv' ? value : prevTyre.iccv,
      name === 'type' ? value : prevTyre.type,
      name === 'visual' ? value : prevTyre.visual
    ));
  }
 
  async function addTyre(){
    const res = newtyre.isEmpty();
 
    //insert bd
    if(!res&&id>0){
      const ins = await dboperations.editTyre(id, newtyre.brand, newtyre.model,
        newtyre.size, newtyre.stock, newtyre.iccv, newtyre.type, newtyre.visual);
        if(ins){
          setNewtyre(new Tyre(0,'','','',0,'','', '000/00R00')); 
          setId(0);
          Utils.addToast("Neumático editado","success");
       
        }else{
          Utils.addToast("Neumático no editado","danger");
        
        }
    }else{
      if(!res){
        const ins = await dboperations.addTyre(newtyre.brand, newtyre.model,
        newtyre.size, newtyre.stock, newtyre.iccv, newtyre.type, newtyre.visual);
        if(ins){
          Utils.addToast("Neumático insertado","success");

          setNewtyre(new Tyre(0,'','','',0,'','', '000/00R00')); 
        }else{
          Utils.addToast("Error insertando el neumático", "danger");
        }
      }else{
        Utils.addToast("Completa el neumático","warning");

      }
    }

  }

  return (
    <>
    
    <CheckSession setCanRender={setCanRender}/> 
    {canrender? (
      <Container>
      <Row className="mb-2 mt-4 d-flex justify-content-start">
        <Col xs={2}>
          <Button  variant="outline-primary" onClick={()=>{navigate("/TyresView");}}><FontAwesomeIcon icon={faArrowLeft} />Volver</Button>
        </Col>
      </Row>
      <Row>
      <Form>
        <Form.Group>
          <Row className="mb-2">
          <Col xs={12}>
            <Form.Control
                className='form-control-resp'
                type="text"
                placeholder="Marca"
                name="brand"
                value={newtyre.brand}
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
                value={newtyre.model}
                onChange={handleInputChange}
              />
          </Col>
          </Row>
          <Row className="mb-2">
          <Col xs={12}>
            <Form.Control
                className='form-control-resp'
                type="number"
                placeholder="Medida"
                name="size"
                value={newtyre.size}
                onChange={handleInputChange}
              />
          </Col>
          </Row>
          <Row className="mb-2">
          <Col className="text-start" xs={12}>
            <Form.Label 
            className='form-label-resp'>Stock</Form.Label>
            <Form.Control
                className='form-control-resp'
                type="number"
                placeholder="Stock"
                name="stock"
                value={newtyre.stock}
                onChange={handleInputChange}
              />
          </Col>
          </Row>
          <Row className="mb-2">
          <Col xs={12}>
            <Form.Control
                className='form-control-resp'
                type="text"
                placeholder="ICCV"
                name="iccv"
                value={newtyre.iccv}
                onChange={handleInputChange}
              />
          </Col>
          </Row>
          <Row className="mb-2">
          <Col xs={12}>
            <Form.Select 
            className='form-control-resp'
            onChange={handleInputChange} value={newtyre.type} name="type" aria-label="select type">
                <option value ="">Elegir tipo de rueda</option>
                <option value="turismo">Turismo</option>
                <option value="4x4">4x4</option>
                <option value="agricola">Agricola</option>
                <option value="furgoneta">Furgoneta</option>
                <option value="camion">Camion</option>
                <option value="moto">Moto</option>
                <option value="quad">Quad</option>
            </Form.Select>
          </Col>
          </Row>
          <Row className="mb-2">
          <Col xs={12} className="text-start">
          <Form.Label 
            className='form-label-resp'>Formato</Form.Label>
            <Form.Select 
            className='form-control-resp'
            onChange={handleInputChange} value={newtyre.visual} name="visual" aria-label="select visual">
                <option value="000/00R00">000/00R00</option>
                <option value="000/00-00">000/00-00</option>
                <option value="000/00-00.0">000/00-00.0</option>
                <option value="00/000-00">00/000-00</option>
                <option value="0.00-00">0.00-00</option>
                <option value="00/00-00">00/00-00</option>
                <option value="00.0-00">00.0-00</option>
                <option value="00-00">00-00</option>
                <option value="000/00R00.0">000/00R00.0</option>
                <option value="00.0/00-00">00.0/00-00</option>
                <option value="00-00.0">00-00.0</option>
                <option value="0.0-00">0.0-00</option>
                <option value="00.0/00-00.0">00.0/00-00.0</option>
                <option value="0.00R00">0.00R00</option>
                <option value="00.00-00">00.00-00</option>
                <option value="00x0.00-00">00X0.00-00</option>
                <option value="00x00.00R00">00x00.00R00</option>
                <option value="0.0R00.0">0.0R00.0</option>
                <option value="00x00.00-00">00X00.00-00</option>
                <option value="00x0-0">00X0-0</option>
                <option value="00x0.00-0">00X0.00-0</option>
                <option value="00x0.0-00">00X0.0-00</option>
                <option value="00x0-00">00X0-00</option>
                <option value="00L-00">00L-00</option>
                <option value="0.00/0.00-00">0.00/0.00-00</option>
                <option value="00.00-00.0">00.00-00.0</option>
                <option value="Sin formato">Sin formato</option>
  
            </Form.Select>
          </Col>
          </Row>
          <Row className="mb-2">
            <Col xs={12}>
              <Button onClick={addTyre} size='lg'>Añadir</Button>
            </Col>
          </Row>
        </Form.Group>
      </Form>
      </Row>
        <RowTyre 
        key={0} tyre={newtyre} enableactions={false}/>
    </Container>
    ):(null)}
    
  </>
  )
}
