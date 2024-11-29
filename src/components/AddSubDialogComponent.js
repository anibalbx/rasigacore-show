import React, { useState, useRef } from 'react'
import { Offcanvas, Row, Col, Button, Form } from 'react-bootstrap';
import Utils from '../class/utils';

function AddSubDialogComponent({resetOperationValues, show, setShow, op, changeStockOperation}) {
  
  const [unitsop, setUnitsOp] = useState("");
  let inputRef = useRef(null);

  const handleClose = ()=>{
    setShow(false);

  }

  const focusOnShow = () =>{
    inputRef.current.focus();
  }


  return (
    <Offcanvas onExited={()=>{
      resetOperationValues();
      setUnitsOp("");
      }} onShow={focusOnShow} show={show} onHide={handleClose} placement='top'>
    <Offcanvas.Header closeButton>
      <Offcanvas.Title>Añadir/Retirar Stock</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
      <Form onSubmit={(event)=>{
        event.preventDefault();
        if(unitsop){
          changeStockOperation(unitsop);
        }else{
          Utils.addToast("Introduzca un Stock válido", "warning");
        }

        }}>
        <Row className='justify-content-end'>
          <Col xs={5} className='d-flex justify-content-end'>
          <Form.Control
            
            size="lg"
            className='form-control-resp'
            type="Number"
            placeholder="Unidades"
            name="units"
            value={unitsop}
            ref={inputRef} 
            onChange={(event) => {setUnitsOp(event.target.value);}}
          />
          </Col>
          <Col xs={5} >
            <Button variant={op > 0 ? ('success'): op < 0 ? ('danger') : (null)} 
            onClick={ () => {
              if(unitsop){
                changeStockOperation(unitsop);
              }else{
                Utils.addToast("Introduzca un Stock válido", "warning");
              }
            }} 
            size='lg'>{ op > 0 ? ('Añadir'): op < 0 ? ('Retirar') : (null)}</Button>
          </Col>
        </Row>  
      </Form>
    </Offcanvas.Body>
  </Offcanvas>
  )
}

export default AddSubDialogComponent