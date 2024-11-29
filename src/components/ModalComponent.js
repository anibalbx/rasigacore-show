import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap';

function ModalComponent({ gshow, title, body, reciveClose }) {
  const [show, setShow] = useState(gshow);

  const closeModal  = () => {
    setShow(false);
    reciveClose();
  }

  const showModal  = () => {
    setShow(true);
  }


  useEffect(() => {
    if (gshow) {
      showModal();
    }
  }, [gshow]);

  return (
    <Modal show={show} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModalComponent