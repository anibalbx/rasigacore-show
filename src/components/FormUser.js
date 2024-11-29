import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";

function FormUser({ onChange, username, userpass, remind }) {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");

  useEffect(() => {
    if(username){
      setName(username);
    }
    if(userpass){
      setPass(userpass);
    }
  }, [remind, username, userpass]);

  function handleInputName(event) {
    setName(event.target.value);
    onChange(event.target.value, pass);
  }

  function handleInputPass(event) {
    setPass(event.target.value);
    onChange(name, event.target.value);
  }

  return (
    <>
      <Form.Group className="mb-4">
        <Form.Label>Nombre de usuario:</Form.Label>
        <Form.Control
          type="text"
          placeholder="Escriba nombre de usuario"
          name="username"
          value={name}
          onChange={handleInputName}
        />
        <Form.Label>Contraseña:</Form.Label>
        <Form.Control
          type="password"
          placeholder="Escriba contraseña"
          name="userpassword"
          value={pass}
          onChange={handleInputPass}
        />
      </Form.Group>
    </>
  );
}

export default FormUser;
