import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import { useEffect } from "react";
import User from "../class/user";
import FormUser from "./FormUser";
import Utils from "../class/utils";
import DatabaseService from "../class/databaseservice";
import Permission from "../class/permission";


function CreateUser({ recieveShow, gshow, guser, actionUpdateUser, actionDeleteUser }) {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(new User(0, "", "", 0));
  const [cbxpermissions, setCBXPermissions] = useState([
    { id: 1,  isChecked: false }, //usuarios
    { id: 2, isChecked: false },  //tyres
    { id: 3, isChecked: false },  //oil
  ]);

  const db = new DatabaseService();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(()=>{
    if(guser){
      setUser(new User(guser.id,guser.username, "", guser.permission ));
      const user_p = guser.getPermissionType(Permission.USERS, Permission.ALLTYPE);
      const tyre_p = guser.getPermissionType(Permission.TYRES, Permission.ALLTYPE);
      const oil_p = guser.getPermissionType(Permission.OIL, Permission.ALLTYPE);
      setCBXPermissions(
        [
          { id: 1,  isChecked: user_p }, //usuarios
          { id: 2, isChecked: tyre_p },  //tyres
          { id: 3, isChecked: oil_p },  //oil
        ]

      );
    }
  }, [guser]);

  const reciveUser = (name, pass) => {
    let newuser = new User(0,"", "", 0);
    if(guser){
      newuser.id = guser.id;
    }
    newuser.username = name;
    newuser.userpassword = pass;
    setUser(newuser);
  };

  const handleCheckboxChange = (id) => {
    setCBXPermissions(prevPermissions => {
      return prevPermissions.map(permission => {
        if (permission.id === id) {
          return { ...permission, isChecked: !permission.isChecked };
        }
        return permission;
      });
    });
  };

  function closeModal() {
    handleClose();
    recieveShow(false);
  }

  async function deleteUser(){
    const quest = window.confirm("¿Desea eliminar al usuaio?");
    if(quest){
      const res = await db.deleteUser(user.id);
      if(res){
        closeModal();
        actionDeleteUser(user.id);
      }

    }

  }

  async function updateUser(){


    user.eraseAllPermission();

    for (let i = 0; i < cbxpermissions.length; i++) {
      if(cbxpermissions[i].isChecked){
        user.setAllPermission(i);
      }
    }
   const res = await db.updateUser(user.id, user.username, user.userpassword,
      user.permission);
    //setUser(new User(user.id,user.username, "", user.permission));
    if (res){
      actionUpdateUser(user);
      closeModal();
      Utils.addToast("Usuario editado", "success");
    }else{
      Utils.addToast("Usuario no editado", "danger");
    }

  }

  async function createUser() {

    //check spaces
    if(user.username.includes(" ")||
    user.userpassword.includes(" ")){
      Utils.addToast("El nombre o contraseña de usuario no puede contener espacios","warning");
      return;
    }

    //handle permisions
    for (let i = 0; i < cbxpermissions.length; i++) {
      if(cbxpermissions[i].isChecked){
        user.setAllPermission(i);
      }
      
    }
    const res = await db.createUser(user, closeModal);
    if(res){
      actionUpdateUser(user);
    }

  }

  useEffect(() => {
    if (gshow) {
      handleShow();
    }
  }, [gshow]);

  return (
    <>
      <Modal show={show} onHide={closeModal}>
        <Modal.Header closeButton>
          {
            guser ? (
              <Modal.Title>Actualización de usuarios</Modal.Title>

            ):(
              <Modal.Title>Creación de usuarios</Modal.Title>
            )
          }
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormUser onChange={reciveUser} username={user.username}  remind={false}></FormUser>
            <Form.Group className="mb-3" controlId="formCreateUser">
              <Form.Label>Permisos de usuario:</Form.Label>
              <div key="inline-checkbox" className="mb-3">
                <Form.Check
                  inline
                  label="Usuarios"
                  name="group1"
                  type="checkbox"
                  id="inline-checkbox-1"
                  checked={cbxpermissions[0].isChecked}
                  onChange={() => handleCheckboxChange(cbxpermissions[0].id)}
                />
                <Form.Check
                  inline
                  label="Neumáticos"
                  name="group1"
                  type="checkbox"
                  id="inline-checkbox-2"
                  checked={cbxpermissions[1].isChecked}
                  onChange={() => handleCheckboxChange(cbxpermissions[1].id)}


                />
                <Form.Check
                  inline
                  label="Aceite"
                  name="group1"
                  type="checkbox"
                  id="inline-checkbox-3"
                  checked={cbxpermissions[2].isChecked}
                  onChange={() => handleCheckboxChange(cbxpermissions[2].id)}


                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cerrar
          </Button>
          {
            guser ? (
              <>
                <Button variant="danger" onClick={deleteUser}>
                  Borrar usuario
                </Button>
                <Button variant="primary" onClick={()=>updateUser()}>
                  Actualizar usuario
                </Button>
              </>
            ):(
              <Button variant="primary" onClick={createUser}>
              Subir usuario
            </Button> 
            )
          }
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default CreateUser;
