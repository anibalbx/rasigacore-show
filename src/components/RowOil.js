import {React, memo, useState } from "react";
import { Row, Col, Dropdown, Badge } from "react-bootstrap";
import ModalComponent from "./ModalComponent";
import Utils from "../class/utils";
const RowOil = memo(function RowOil({ oil, changeStockAdd, changeStockMin, editOil,delOil, enableactions}) {

  const [show, setShow] = useState(false);
  const titlemodal = (
    <>
      <p>{oil.brand} {oil.model} {oil.type} {oil.capacity}L</p>
    </>
  );

  const pdesc = 100 - oil.desc;
  const finalprice = oil.pvp  * ( pdesc / 100);

  const bodymodal = (
    <>
      <Row>
        <Col><b>PVP:</b> {Utils.formatNumberWithComma(parseFloat(oil.pvp))}€</Col>
      </Row>
      <Row>
        <Col><b>Descuento:</b> {oil.desc}%</Col>
      </Row>
      <Row>
        <Col><b>Total:</b> {
          Utils.formatNumberWithComma(finalprice)
        }€</Col>
      </Row>
    </>
  );


  return (
    <>
      <ModalComponent gshow={show} title={titlemodal} body={bodymodal} reciveClose={() => setShow(false)} />
      <Row className={ oil.stock > 10 ? 
        'mb-1 tyre-list-h decoration-tyre' : oil.stock > 0 ?
        'mb-1 tyre-list-m decoration-tyre' : 'mb-1 tyre-list-l decoration-tyre'}>
        <Col xs={3} style={{ backgroundColor: oil.getColorFromLocation() }} className="tyre-row-decoration d-flex justify-content-center align-items-center"> 
          <Row className="justify-content-center align-items-center">{oil.location.toUpperCase()}</Row> 
        </Col> 
        <Col className="description-tyre">
          <Row className="mb-2">
            <Col xs={12} md={4} className="title-tyre">{oil.brand.toUpperCase()}</Col>
            <Col xs={12} md={4} className="sub-title-tyre">{oil.model}</Col>
            <Col ><Badge bg="secondary" className="badge-description">{oil.stock} Unidades</Badge></Col>
          </Row>
          <Row  className="mb-2">
            <Col><Badge bg="secondary" className="badge-description">{oil.type}</Badge></Col>
            <Col><Badge bg="primary" className="badge-description">{oil.capacity.toString().toUpperCase()}L</Badge></Col>
            <Col><span className="sub-title-tyre">Referencia: </span><Badge bg="primary" className="badge-description">{oil.ref}</Badge></Col>

            <Col >
              <Dropdown >
                <Dropdown.Toggle 
                size="lg"
                variant={ oil.stock > 10 ? 'success' : oil.stock > 0 ? 'warning' : 'danger'} id="dropdown-basic">
                </Dropdown.Toggle>
                  {
                    enableactions ? (
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => changeStockAdd(oil, 1)} href="#">Añadir</Dropdown.Item>
                        <Dropdown.Item onClick={() => changeStockMin(oil, -1)} href="#">Retirar</Dropdown.Item>
                        <Dropdown.Item onClick={() => editOil(oil.id)} href="#">Editar</Dropdown.Item>
                        <Dropdown.Item  onClick={() => {
                          let res = window.confirm("¿Desea eliminar el aceite?");
                          if(res){
                            delOil(oil.id)
                          }
                        }} href="#">Eliminar</Dropdown.Item>
                        <Dropdown.Item onClick={() => setShow(true)} href="#">Ver más</Dropdown.Item>  
                      </Dropdown.Menu>
                    ) : (<></>)
                  }
              </Dropdown>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
});
export default RowOil