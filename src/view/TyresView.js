import React, { useCallback, useState, useEffect } from 'react';
import { Col, Container, Form, Row, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DatabaseService from '../class/databaseservice';
import RasigaNavBar from '../components/RasigaNavBar';
import RowTyre from '../components/RowTyre';
import SearchBar from '../components/SearchBar';
import Utils from '../class/utils';
import ScrollButton from '../components/ScrollButton';
import CheckSession from '../components/CheckSession';
import { getItem } from '../class/db';
import Permission from '../class/permission';
import AddSubDialogComponent from '../components/AddSubDialogComponent';
import { faCircleDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const dbtyre = new DatabaseService();

function TyresView() {
  const [data, setData] = useState([]);
  const [searchby, setSearchBy] = useState('MEDIDA');
  const [searchvalue, setSearchValue] = useState('');
  const [orderby, setOrderBy] = useState('MARCA');
  const [shownostock, setShowNoStock] = useState(true);
  const [isloading, setIsLoading] = useState(false);
  const [firstSearch, setFirstSearch] = useState(false);
  const [canrender, setCanRender] = useState(false);
  const [searchformtype, setSearchFormType] = useState("number");
  const [enableaction, setEnableAction] = useState(true);
  const [cachedate, setCacheDate] = useState("");

  const [show, setShow] = useState(false);

  const [tyreop, setTyreOp] = useState(0);
  const [op, setOperation] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let reloadCache = null;

    async function getDate() {
      const cd = await getItem('Date');
      setCacheDate(cd);

    }
    //load cache for offline mode in a certain time
    if (Utils.offline_mode) {
      getDate();
      setCanRender(true);
      setEnableAction(false);
    } else {
      dbtyre.loadCache();
      reloadCache = setInterval(() => {
        dbtyre.loadCache();

      }, 900000);
    }
    
    return () => {
      if (reloadCache) {
        clearInterval(reloadCache);
      }
    }
  }, []);


  useEffect(() => {
    switch (searchby) {
      case "MEDIDA":
        setSearchFormType("number");
        setSearchValue("");
        break;
      default:
        setSearchFormType("text");
        setSearchValue("");

        break;
    }
  }, [searchby]);

  const handleClose = () => {
    setShow(false);

  };

  const resetOperationValues = () => {
    setOperation(0);
    setTyreOp(0);
  }

  const cleanAction = () => {
    setData([]);
    setSearchValue("");
  }



  const editTyre = useCallback((id) => {
    navigate("/CMTyreView", { state: { id: id } });
  }, [navigate]);


  const reserveTyre = useCallback((tyre) => {
    navigate("/ReserveView", { state: { tyre: tyre } });

  }, [navigate]);



  const delTyre = useCallback(async (id) => {
    let res = false;
    if (id) {
      res = await dbtyre.deleteTyre(id);
      if (res) {
        const updata = data.filter(tyre => tyre.id !== id);
        setData(updata);
        Utils.addToast("Neumático eliminado", "success");
      } else {
        Utils.addToast("Neumático no eliminado", "danger");

      }
    }
  }, [data]);

  const changeStock = useCallback(async (tyre, operation) => {
    setShow(true);
    setOperation(operation);
    setTyreOp(tyre);

  }, []);

  const changeStockOperation = async (unitsop) => {

    if (unitsop > 0 && op !== 0 && tyreop !== 0) {

      const units = parseInt(tyreop.stock) + op * parseInt(unitsop);
      if (units >= 0) {
        let res = await dbtyre.updateStockTyre(tyreop.id, units);
        if (res) {
          tyreop.stock = units;
          let tyresarray = [];
          tyresarray.push(tyreop);
          setData(tyresarray);
          Utils.addToast("Stock cambiado", "success");
          handleClose();
        } else {
          Utils.addToast("Error cambiando stock de neumático", "danger");
        }
      } else {

        Utils.addToast("ERROR: Retirados mas unidades que en stock", "danger");
      }
    }
  }



  const searchBy = async () => {

    if (searchvalue.length > 0) {
      try {
        setIsLoading(true);
        setFirstSearch(true);
        const tyresdata = await dbtyre.getSearchTyres(searchby, searchvalue, orderby, shownostock);
        setData(tyresdata);
        setIsLoading(false);
      } catch (error) {
        console.error('Error searching tyres:', error);
      }
    } else {
      Utils.addToast("Introduzca valor de busqueda", "warning");

    }
  };




  const handleSubmit = (event) => {
    event.preventDefault();
    searchBy();
  };

  return (
    <div>
      {
        Utils.offline_mode ? (
          null
        ) : (
          <>
            <CheckSession setCanRender={setCanRender} permissionmode={Permission.TYRES} permissiontype={Permission.ALLTYPE} />
          </>
        )
      }

      {
        canrender ? (
          <>
            <RasigaNavBar />
            {
              Utils.offline_mode ? (
                <Alert key="info" variant="info">
                  Cache: {String(cachedate)}
                  <br></br>
                  Esta en el modo offline

                </Alert>
              ) : (<></>)
            }
            <ScrollButton />
            <Container>
              <h3 className='mb-2 mt-2'>Stock de Neumáticos <FontAwesomeIcon icon={faCircleDot}></FontAwesomeIcon></h3>
              <Row>
                <Form onSubmit={handleSubmit}>
                  <Form.Group >
                    <Row className="mb-2">
                      <Col xs={6}>
                        <Form.Label className='form-label-resp'>Buscar por:</Form.Label>
                        <Form.Select className='form-control-resp' aria-label="select search by"
                          value={searchby}
                          onChange={(event) => { setSearchBy(event.target.value); }}>
                          <option value="MEDIDA">Medida</option>
                          <option value="MARCA">Marca</option>
                          <option value="MODELO">Modelo</option>
                        </Form.Select>
                      </Col>
                      <Col xs={6}>
                        <Form.Label className='form-label-resp'>Ordenar por:</Form.Label>
                        <Form.Select className='form-control-resp' aria-label="select search by"
                          value={orderby}
                          onChange={(event) => { setOrderBy(event.target.value); }}>
                          <option value="MARCA">Alfabetico</option>
                          <option value="STOCK DESC">Stock</option>
                        </Form.Select>
                      </Col>
                    </Row>
                    <SearchBar setSearchValue={setSearchValue} searchAction={searchBy}
                      cleanAction={cleanAction} searchformtype={searchformtype} searchvalue={searchvalue}
                      shownostock={shownostock} setShowNoStock={setShowNoStock} linkto={"/CMTyreView"} />
                  </Form.Group>
                </Form>
              </Row>
              {
                !firstSearch ? (
                  <Row xs={6} className='form-label-resp justify-content-center resp-subtitle '>
                    <Col xs={8}>Por favor, introduzca valor de búsqueda</Col>
                  </Row>
                ) : (
                  isloading ? (
                    <div>Cargando...</div>
                  ) : (
                    <>
                      {
                        data.length > 0 ? (
                          data.map((tyre) => (
                            <RowTyre key={tyre.id} tyre={tyre} changeStockAdd={changeStock}
                              changeStockMin={changeStock} editTyre={editTyre}
                              delTyre={delTyre} reserveTyre={reserveTyre} enableactions={enableaction}
                            />
                          )
                          )
                        ) : (<div>No hay resultados</div>)
                      }
                    </>
                  )
                )

              }
              <AddSubDialogComponent resetOperationValues={resetOperationValues} show={show} setShow={setShow} op={op} changeStockOperation={changeStockOperation}/>
              
            </Container>
          </>
        ) : (null)
      }
    </div>



  );
}

export default TyresView;