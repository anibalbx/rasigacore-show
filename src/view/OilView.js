import React, { useState, useCallback } from 'react'
import CheckSession from '../components/CheckSession';
import RasigaNavBar from '../components/RasigaNavBar';
import ScrollButton from '../components/ScrollButton';
import { Container, Form, Row, Col } from 'react-bootstrap';
import SearchBar from '../components/SearchBar';
import DatabaseService from '../class/databaseservice';
import Utils from '../class/utils';
import RowOil from '../components/RowOil';
import Oil from '../class/oil';
import { useNavigate } from 'react-router-dom';
import Permission from '../class/permission';
import AddSubDialogComponent from '../components/AddSubDialogComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faOilCan } from '@fortawesome/free-solid-svg-icons';
const db = new DatabaseService();
function OilView() {

  const [canrender, setCanRender] = useState(false);
  const [searchvalue, setSearchValue] = useState("");
  const [shownostock, setShowNoStock] = useState(true);
  const [searchby, setSearchBy] = useState("TIPO");
  const [orderby, setOrderBy] = useState("MARCA");
  const [slocation, setSLocation] = useState("");
  const [data, setData] = useState([]);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  //for dialog
  const [show, setShow] = useState(false);
  const [op, setOperation] = useState(0);
  const [oilop, setOilOp] = useState();

  async function searchAction(){
    setSearching(true);
    setData([]);

    let res = await db.getSearchOil(searchby, searchvalue,
       orderby,slocation,shownostock);
    if(res.length>0){
      setData(res);
    }else{
      Utils.addToast("No se encontraron datos", "danger");
    }

    setSearching(false);

  }

  const resetOperationValues = ()=>{
    setOperation(0);
    setOilOp(0);
  }
  const cleanAction = () => {
    setData([]);
    setSearchValue("");
  }
  const delOil = useCallback(async (id) =>{
    
    let res = false;
    if(id){
      res = await db.deleteOil(id);
      if(res){
        const updata = data.filter(oil => oil.id !== id);
        setData(updata);
        Utils.addToast("Aceite eliminado","success");
      }else{
        Utils.addToast("Aceite no eliminado","danger");

      }
    }

    
  }, [data]);
  
  const changeStock =  useCallback( async (oil, operation) =>{
   setShow(true);
   setOperation(operation);
   setOilOp(oil);
  }, []);

  const changeStockOperation = async (unitsop)=>{

      const units = parseInt(oilop.stock) +  op * parseInt(unitsop);
      if(units>=0){
        let res = await db.updateOilUnits(oilop.id, units);
        if(res){
          let addingoil = new Oil(oilop.id, oilop.brand, oilop.model, oilop.type,oilop.capacity, oilop.stock,oilop.location);
          addingoil.stock=units;
          let oilarray = [];
          oilarray.push(addingoil);
          setData(oilarray);
          Utils.addToast("Stock cambiado","success");
          setShow(false);

        }else{
          Utils.addToast("Error cambiando stock de aceite", "danger");
        }
      }else{
      
        Utils.addToast("ERROR: Retirados mas unidades que en stock","danger");
      }
    
  }

  const handleSubmit = (event) => {
    event.preventDefault(); 
    searchAction();
  };

  const editOil = useCallback((id) =>{
    navigate("/CMOilView",  { state: { id: id} });
  }, [navigate]);



  return (
    <>
      <CheckSession setCanRender={setCanRender} permissionmode={Permission.OIL} permissiontype={Permission.ALLTYPE}/>

      {canrender ?
      ( 
      <>
        <RasigaNavBar />
        <ScrollButton />
        <Container>
          <h3 className='mb-2 mt-2'>Stock de Aceites <FontAwesomeIcon icon={faOilCan}></FontAwesomeIcon></h3>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-2">
              <Col xs={6} md={4}>
                <Form.Label className='form-label-resp'>Buscar por:</Form.Label>
                <Form.Select className='form-control-resp' aria-label="select search by" 
                value={searchby}
                onChange={(event) => {
                  setSearchBy(event.target.value);
                  setSearchValue("");}}>
                  <option value="TIPO">Tipo</option>
                  <option value="REFERENCIA">Referencia</option>
                  <option value="MARCA">Marca</option>
                  <option value="MODELO">Modelo</option>
                </Form.Select>
             </Col>
              <Col xs={6} md={4}>
                <Form.Label className='form-label-resp'>Ordenar por:</Form.Label>
                <Form.Select className='form-control-resp' aria-label="select search by"
               value={orderby}
                onChange={(event) => {setOrderBy(event.target.value);}}>
                  <option value="MARCA">Alfabetico</option>
                  <option value="STOCK DESC">Stock</option>
                </Form.Select>
              </Col>
              <Col xs={6} md={4}>
                <Form.Label className='form-label-resp'>Localización:</Form.Label>
                <Form.Select className='form-control-resp' aria-label="select search by"
               value={slocation}
                onChange={(event) => {setSLocation(event.target.value);}}>
                  <option value="">Todos</option>
                  <option value="rasiga">Rasiga</option>
                  <option value="sumagrib">Sumagrib</option>
                </Form.Select>
              </Col>
            </Row>
            <SearchBar setSearchValue={setSearchValue} searchAction={searchAction}
            cleanAction={cleanAction} searchformtype={"text"} searchvalue={searchvalue}
            shownostock={shownostock} setShowNoStock={setShowNoStock} linkto={"/CMOilView"}/>
          </Form>
          {
            searching ? (
              <div>Buscando...</div>
              
            ):(
              <>
                {
                  data.length>0 ? (
                    data.map((oil)=>(
                      <RowOil key={oil.id} oil={oil} changeStockAdd={changeStock}
                      changeStockMin={changeStock} enableactions={true} delOil={delOil} editOil={editOil}/>
                    )
                    )
                  ):(
                    null
                  )
                }
              </>
            )
          }

          <AddSubDialogComponent resetOperationValues={resetOperationValues}
          show={show} setShow={setShow} op={op} changeStockOperation={changeStockOperation} />
        </Container>
      </>
      ):(null)
      }
    </>
  )
}

export default OilView