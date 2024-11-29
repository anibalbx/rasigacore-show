import React from 'react'
import { Row, Form, Col, Button  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Utils from '../class/utils';
import { Link } from 'react-router-dom';
import { faMagnifyingGlass, faBroom, faPlus } from '@fortawesome/free-solid-svg-icons';

function SearchBar({
   setSearchValue, searchAction, cleanAction, 
  searchformtype, searchvalue, shownostock, setShowNoStock, linkto}) {
  return (
      <Form.Group >
        <Row className="mb-2 d-flex justify-content-end">
          <Col className="mb-2 " xs={12} md={9} lg={10}>
            
              <Form.Control
                size="lg"
                className='form-control-resp'
                type={searchformtype}
                placeholder="Búsqueda"
                name="search"
                value={searchvalue}
                onChange={(event) => {setSearchValue(event.target.value);}}
              />
            </Col>
            <Col  xs={4} md={3} lg={2} className="d-flex justify-content-end">
              <Col className='mb-1 me-1 '>
                <Button size="lg" className='form-control-resp' onClick={() =>searchAction()}><FontAwesomeIcon icon={faMagnifyingGlass} /></Button>
              </Col>
              <Col className='mb-1 me-1 '>
                <Button size="lg" className='form-control-resp' variant="danger" onClick={() => {
                  cleanAction();
                }
              } ><FontAwesomeIcon icon={faBroom} /></Button>
              </Col>
              {
                !Utils.offline_mode ? (
                  <>
                  <Col className='mb-1 me-1 '>
                    <Link to={linkto}>
                      <Button  size="lg" className='form-control-resp' variant="success">
                        <FontAwesomeIcon icon={faPlus} />
                      </Button>
                    </Link>
                  </Col>
                  </>
                
                ):(
                  <></>
                )
              }
          </Col>
        </Row>
        <Row className="mb-2">
          <Col xs={12}>
            <Form.Check 
             
              className='d-flex justify-content-start form-control-resp'
              type="switch"
              id="custom-switch"
              label=" Mostrar sin stock"
              checked={shownostock}
              onChange={() => {
                setShowNoStock(!shownostock);
              }}

            />
          </Col>
        </Row>
      </Form.Group>
  )
}

export default SearchBar