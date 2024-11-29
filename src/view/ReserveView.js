import React, { useState, useEffect, useCallback } from 'react'
import CheckSession from '../components/CheckSession';
import { Container, Button, Row, Col, Form, InputGroup, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faArrowLeft, faCheck, faEraser, faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Reserve from '../class/reserve';
import DatabaseService from '../class/databaseservice';
import { useLocation } from 'react-router-dom';
import Utils from '../class/utils';
import Tyre from '../class/tyre';
import RowTyre from '../components/RowTyre';

const db = new DatabaseService();
function ReserveView() {
  const [canrender, setCanRender] = useState(false);
  const navigate = useNavigate();
  const {state} = useLocation();
  const [tyre, setTyre] = useState();
  const [reservation, setReservation] = useState();
  const [reservations, setReservations] = useState([]);
  const [editmode, setEditmode] = useState(false);

    const loadReservations = useCallback(async () => {
    setReservations(await db.getReservations(state.tyre.id));


  } ,[state.tyre.id]);

  
  
  useEffect(
    ()=>{
      
      const reloadTyre = async () =>{
        setTyre(await db.getTyre(state.tyre.id));
      }

      if(!state){
        navigate("/TyresView");
      }
      setTyre(new Tyre(state.tyre.id, state.tyre.brand, state.tyre.model, state.tyre.size,
         state.tyre.stock, state.tyre.iccv, state.tyre.type, state.tyre.visual));
      setReservation(new Reserve(0, state.tyre.id, "", "", "", "", ""));
      loadReservations();
      window.addEventListener('load', reloadTyre);
      return () => {
        window.removeEventListener('load', reloadTyre);
      };
  

    }, [loadReservations, navigate,  state]
  );

  async function endReserve(reser){
    if(reser.number<=parseInt(tyre.stock)){
      const res = tyre.stock - reser.number;
      await db.updateStockTyre(tyre.id,res);
      await db.deleteReserve(reser.id);
      eraseReservationArray(reser.id);
      setTyre(new Tyre(tyre.id, tyre.brand, tyre.model, tyre.size,
        res, tyre.iccv, tyre.type, tyre.visual));
      Utils.addToast("Reserva liquidada", "success");

    }else{
      Utils.addToast("No se puede liquidar, no hay suficiente Stock", "warning");
    }
  }

  function calculateReservatedUnits(){
    let result = 0;
    for (let i = 0; i < reservations.length; i++) {
      result = result + parseInt(reservations[i].number);
    }
    return result;
  }
  function checkCanReservate(units){
    const compare = parseInt(tyre.stock);
    if((parseInt(units) + calculateReservatedUnits())>compare){
      return true;
    }else{
      return false;
    }
  }

  function eraseReservationArray(id){
    const nreservations = reservations.slice();
    const index = reservations.findIndex((element) => element.id === id);
    nreservations.splice(index, 1);
    setReservations(nreservations);

  }


  function editReserve(reser){
    setReservation(reser);
    setEditmode(true);

  }


   async function addReserve(){
    const res = reservation.checkEmptyToAdd();
    if(!res){

      if(checkCanReservate(reservation.number)){
        alert("El numero de reserva es superior al de Stock, se deben de pedir más.");
      }

      const add = await db.addReservation(reservation.idtyre, reservation.number, reservation.destination,
        reservation.date, reservation.pvp);
      if(add){
        Utils.addToast("Reserva añadida", "success");
        reservation.pvp = parseFloat(reservation.pvp).toFixed(2);
        loadReservations();
        setReservation(new Reserve(0, state.tyre.id, "", "", "", "", ""));


      }else{
        Utils.addToast("Reserva no añadida", "danger");

      }
    }else{
      Utils.addToast("Reserva vacía por favor rellene los campos", "danger");
    }

    
  }

  async function deleteReserve(id){
    const dia = window.confirm("¿Desea eliminar este registro?");
    if(dia){
      const res = await db.deleteReserve(id);
      if(res){
       eraseReservationArray(id);
        Utils.addToast("Reserva eliminada", "success");
      }
    }
  }

  async function completeEditReserve(){

    const res = await db.editeservation(reservation.id, reservation.number,
      reservation.destination, reservation.date, reservation.pvp
    );

    if(res){
      setReservation(new Reserve(0, state.tyre.id, "", "", "", "", ""));
      setEditmode(false);
      loadReservations();
    }

  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setReservation(prevReserve => new Reserve(
      reservation.id,
      reservation.idtyre,
      name === 'number' ? value : prevReserve.number,
      reservation.username,
      name === 'date' ? value : prevReserve.date,
      name === 'destination' ? value : prevReserve.destination,
      name === 'pvp' ? value : prevReserve.pvp,
    ));
  }

  return (
    <>
      <CheckSession setCanRender={setCanRender} />
      {
        canrender ? (
          <Container>
            <Row className="mb-2 mt-4 d-flex justify-content-start">
              <Col xs={2}>
                <Button variant="outline-primary" onClick={() => { navigate("/TyresView"); }}><FontAwesomeIcon icon={faArrowLeft} />Volver</Button>
              </Col>
            </Row>
            <Row>
              <Col><h3>Reservas para:</h3></Col>
            </Row>
            <RowTyre  key={0} tyre={tyre} enableactions={false}></RowTyre>
            <Row className='mt-2'>
              <Form>
                <Form.Group>
                  <Row className="mb-2">
                    <Col xs={12}>
                    <Form.Label
                        className='form-label-resp'>Unidades a reservar</Form.Label>
                      <Form.Control
                        className='form-control-resp'
                        type="number"
                        placeholder="Unidades"
                        name="number"
                        value={reservation.number}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={12}>
                    <Form.Label
                        className='form-label-resp'>Reservado a:</Form.Label>
                      <Form.Control
                        className='form-control-resp'
                        type="text"
                        name="destination"
                        value={reservation.destination}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={12}>
                    <Form.Label
                        className='form-label-resp'>Fecha de montaje:</Form.Label>
                      <Form.Control
                        className='form-control-resp'
                        type="date"
                        name="date"
                        value={reservation.date}
                        onChange={handleInputChange}
                      />
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col xs={12}>
                    <Form.Label
                        className='form-label-resp'>Precio presupuesto por neumático:</Form.Label>
                      <InputGroup>
                        <Form.Control
                          className='form-control-resp'
                          type="number"
                          name="pvp"
                          value={reservation.pvp}
                          onChange={handleInputChange}
                          />
                          <InputGroup.Text>€</InputGroup.Text>
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col className="text-end" xs={12}>
                      {
                        !editmode ? (
                          <Button size='lg' variant='success' onClick={addReserve}> Añadir <FontAwesomeIcon icon={faAdd}></FontAwesomeIcon></Button>
                        ):(
                          <>
                            <Button size='lg' variant='primary' onClick={completeEditReserve}> Editar <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon></Button>
                            <Button size='lg' variant='danger' onClick={()=>{
                              setReservation(new Reserve(0, state.tyre.id, "", "", "", "", ""));
                              setEditmode(false);
                            }}> Cancelar <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon></Button>
                          </>

                        )
                      }
                    </Col>
                  </Row>
                
                </Form.Group>
              </Form>
            </Row>
            <Row>
              <Col><h4>Reservas:</h4></Col>
            </Row>
            <Row>
              {
                reservations.length > 0 ? (
                  reservations.map((reser) =>(
                    <Col xs={6} key={reser.id} className='mb-2'>
                      <Card>
                        <Card.Title className='mt-2'>
                          {reser.destination}
                        </Card.Title>
                        <Card.Text>
                          <b>Unidades reservadas: </b> {reser.number} <br/>
                          <b>Fecha de montaje: </b> {reser.date} <br/>
                          <b>Presupuesto por neumático: </b> {parseFloat(reser.pvp).toFixed(2)} €<br/>
                          <b>Pedido por: </b> {reser.username}<br/>
                        </Card.Text>
                        <Card.Link className='mb-2'>
                          <Button size='lg' onClick={()=>{editReserve(reser)}} className='me-1 mb-2'>Modificar <FontAwesomeIcon icon={faPencil}></FontAwesomeIcon> </Button>
                          <Button size='lg' onClick={()=>{endReserve(reser)}} className='me-1 mb-2' variant='success'>Liquidar <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon> </Button>
                          <Button size='lg' onClick={() => {deleteReserve(reser.id)}} className='me-1 mb-2' variant='danger'>Eliminar <FontAwesomeIcon icon={faEraser}></FontAwesomeIcon> </Button>
                        </Card.Link>
                      </Card>
  
                    </Col>
                  ))

                ):(
                  <p>No hay reservas</p>
                )

              }
            </Row>
          </Container>
        ) : (null)
      }
    </>
  )
}

export default ReserveView