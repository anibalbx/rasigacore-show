import React, { useState, useEffect } from 'react';
import { Container, Pagination } from 'react-bootstrap';
const PaginationComponent = ({ itemsPerPage, items, paginatorviewpages }) => {
  const [currentpage, setCurrentPage] = useState(1);
  const [currentitems, setCurrentItems] = useState([]);
  const totalpages = Math.ceil(items.length / itemsPerPage);
  const [maxvisual, setMaxVisual] = useState(0);
  const [paginatoritems, setPaginatorItems] = useState([]);

  useEffect(() => {

    if (totalpages > paginatorviewpages) {
      setMaxVisual(paginatorviewpages);
    } else {
      setMaxVisual(totalpages);
    }

  }, [totalpages, paginatorviewpages]);

  useEffect(() => {
    let auxarray = [];
    for (let i = 0; i < maxvisual; i++) {
      if (currentpage + i <= totalpages) {
        auxarray.push(<Pagination.Item
          key={currentpage + i}
          onClick={() => handlePageChange(currentpage + i)}
          disabled={currentpage === currentpage + i}
        >
          {currentpage + i}
        </Pagination.Item>);

      }
    }
    setPaginatorItems(auxarray);


  }, [maxvisual, currentpage, totalpages]);

  useEffect(() => {
    const startIndex = (currentpage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentItems(items.slice(startIndex, endIndex));
  }, [currentpage, items, itemsPerPage]);

  const handlePageChange = (pagenumber) => {
    setCurrentPage(pagenumber);
  };

  return (
    <Container>
      <div className="items">
        {currentitems.map((log) => (
          log
        ))}
      </div>
      {
        totalpages > 0 ? (
          <Pagination>
            <Pagination.First onClick={() => handlePageChange(1)} />
            <Pagination.Prev onClick={() => {
              if(currentpage-1>0){
                handlePageChange(currentpage - 1)
              }
            }} />
            {
              paginatoritems.map((item) => (
                item
              ))
            }
            <Pagination.Next onClick={
              () => {
                if (currentpage + 1 <= totalpages) {
                  handlePageChange(currentpage + 1)
                }
              }
            } />
            <Pagination.Last onClick={() => handlePageChange(totalpages)} />
          </Pagination>

        ) : null
      }

    </Container>
  );
};

export default PaginationComponent;