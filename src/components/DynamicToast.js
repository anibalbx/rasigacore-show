import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import Utils from '../class/utils';

function DynamicToast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToastsChange = (updatedToasts) => setToasts([...updatedToasts]);
    
    Utils.subscribe(handleToastsChange);
    
    // Initialite state with initial toast
    setToasts([...Utils.toasts]);

    return () => {
      Utils.unsubscribe(handleToastsChange);
    };
  }, []);

  const handleDeleteToast = (toast) => {
      Utils.deleteToast(toast);
  };

  return (
    <ToastContainer
      className="p-3"
      position="bottom-end"
      style={{ zIndex: 9999, position: 'fixed', bottom: 0, right: 0 }}
    >
      {toasts.map((toast) => (
        <Toast  bg={toast.type} key={toast.id} show={toast.show} onClose={()=>handleDeleteToast(toast)} delay={2000} autohide>
          <Toast.Body className='text-white'>{toast.message}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
}

export default DynamicToast;