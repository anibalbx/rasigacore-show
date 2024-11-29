import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import { Button, Col, Container, Row } from 'react-bootstrap';
import DatabaseService from '../class/databaseservice';

function CSVReader() {
  const [csv, setCsv] = useState();
  const [count, setCount] = useState();
  const [completed, setCompleted] = useState(0);
  const [isloading, setIsloading] = useState(false);
  const loadid = useRef(0);
  const isreading = useRef(false);
  let formatarray =[];

  function checkIsInFormat(g_format){
    if(!formatarray.includes(g_format)){
      formatarray.push(g_format);
    }

  }


    const addingTyre  = async () => {

      if(csv){
        if(csv.length>loadid.current){
          const tyredb = new DatabaseService();
          let brand, model, size, iccv, stock, type, visual;
          if (csv[loadid.current]['Marca']) brand = csv[loadid.current]['Marca'];
          if (csv[loadid.current]['Modelo']) model =csv[loadid.current]['Modelo'];
          if (csv[loadid.current]['Medida']) size = csv[loadid.current]['Medida'];
          if (csv[loadid.current]['Iccv']) iccv =csv[loadid.current]['Iccv'];
          if (csv[loadid.current]['Stock']) stock = csv[loadid.current]['Stock'];
          if (csv[loadid.current]['Tipo']) type = csv[loadid.current]['Tipo'];
          if (csv[loadid.current]['Formato']) visual = csv[loadid.current]['Formato'];
          
          //Mutex with flags
          if(isreading.current){
            return;
          }else{
            isreading.current = true;
          }
          loadid.current++;
          isreading.current = false;
          try {
            await tyredb.addTyre(brand, model, size, stock, iccv, type, visual);
            setCompleted(prev => prev + 1);
            addingTyre();
            checkIsInFormat(visual);
          } catch (error) {
            console.error("Error during add tyre "+error);
          }
        }else{
          setIsloading(false);
        }
      }

    }

   const importTyres  = async () => {
    
    if(csv){
      //number of threads
      setCompleted(0);
      loadid.current = 0;
      const proceses = 20;
      setIsloading(true);
      for (let i = 0; i < proceses; i++) {
        addingTyre();
        
      }
    }

}

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    
    Papa.parse(file, {
      header: true,
      complete: (result) => {
        setCsv(result.data);
        setCount(result.data.length);
      },
      error: (error) => {
        console.error('Error al analizar el archivo CSV:', error);
      },
    });
  };



  return (
    <Container>
      <Row className='mb-2'>
        <Col>
          <h2>Subir archivo CSV</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <input type="file" accept=".csv" onChange={handleFileUpload} />
        </Col>
      </Row>
      <Row className='mb-2'>
        <Col>
          {
            count ? (
              <div>Completados {completed} de {count}</div>
            ):(
              <></>
            )
          }
        </Col>
      </Row>
      <Row className='mb-2'>
        <Col>
        {isloading ? (
          <Button size='lg' onClick={importTyres} disabled>Cargando...</Button>
        ):(
          <Button size='lg' onClick={importTyres} >Importar Neumáticos</Button> 
        )}
      </Col>
      </Row>
    </Container>
  );
}

export default CSVReader;