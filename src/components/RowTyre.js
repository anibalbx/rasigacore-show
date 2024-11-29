import { React, memo } from "react";
import { Row, Col, Dropdown, Badge } from "react-bootstrap";
const RowTyre = memo(function RowTyre({ tyre, changeStockAdd, changeStockMin, editTyre, delTyre, enableactions, reserveTyre }) {


  return (
    <>
      <Row className={tyre.stock > 10 ?
        'mb-1 tyre-list-h decoration-tyre' : tyre.stock > 0 ?
          'mb-1 tyre-list-m decoration-tyre' : 'mb-1 tyre-list-l decoration-tyre'} draggable={true}>
        <Col xs={3} style={{ backgroundColor: tyre.getColorFromType() }} className="tyre-row-decoration d-flex justify-content-center align-items-center">
          <Row className="justify-content-center align-items-center">{tyre.type.toUpperCase()}</Row>
        </Col>
        <Col className="description-tyre">
          <Row className="mb-2">
            <Col xs={12} md={4} className="title-tyre">{tyre.brand.toUpperCase()}</Col>
            <Col xs={12} md={4} className="sub-title-tyre">{tyre.model}</Col>
            <Col ><Badge bg="secondary" className="badge-description">{tyre.stock} Unidades</Badge></Col>
          </Row>
          <Row className="mb-2">
            <Col><Badge bg="secondary" className="badge-description">{tyre.getVisualFromSize()}</Badge></Col>
            <Col><Badge bg="primary" className="badge-description">{tyre.iccv.toUpperCase()}</Badge></Col>
          </Row>
          <Row className="d-flex align-items-center justify-content-end">
            {
              tyre.reserved ? (
                <Col><Badge bg={tyre.reserved >= tyre.stock ? 'danger' : 'success'} className="badge-description">Reservas: {tyre.reserved}</Badge></Col>
              ) : (null)
            }
            <Col xs={4}>
              <Dropdown >
                <Dropdown.Toggle
                  size="lg"
                  variant={tyre.stock > 10 ? 'success' : tyre.stock > 0 ? 'warning' : 'danger'} id="dropdown-basic">
                </Dropdown.Toggle>
                {
                  enableactions ? (
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => changeStockAdd(tyre, 1)} href="#">Añadir</Dropdown.Item>
                      <Dropdown.Item onClick={() => changeStockMin(tyre, -1)} href="#">Retirar</Dropdown.Item>
                      <Dropdown.Item onClick={() => editTyre(tyre.id)} href="#">Editar</Dropdown.Item>
                      <Dropdown.Item onClick={() => {
                        let res = window.confirm("¿Desea eliminar el neumatico?");
                        if (res) {
                          delTyre(tyre.id)
                        }
                      }} href="#">Eliminar</Dropdown.Item>
                      <Dropdown.Item onClick={() => reserveTyre(tyre)} href="#">Reservar</Dropdown.Item>
                    </Dropdown.Menu>
                  ) : (<></>)
                }
              </Dropdown>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
});

export default RowTyre;