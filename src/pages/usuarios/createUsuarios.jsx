import React, { useEffect, useState } from "react";
import { useGoogleSheets } from "../../contexts/formsGoogleSheetsContext";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const CreateUsuario = () => {
  const { createUser, dataUsers, dataUserLog, fetchUserProfile, fetchDataUsers } = useGoogleSheets();
  const [newUsuario, setNewUsuario] = useState({
    APELLIDO: "",
    NOMBRE: "",
    BASE: "",
    RESPONSABLE: "", 
    EMAIL: "",
    ACCESO: ""
  });

  const [userLog, setUserLog] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (userLog) {
      setNewUsuario((prev) => ({
        ...prev,
        RESPONSABLE: `${userLog.NOMBRE} ${userLog.APELLIDO}`
      }));
    }
  }, [userLog]);
    
  useEffect(() => {
    userLogeado();
  }, [dataUsers, dataUserLog]);
    
  const userLogeado = () => {
    if (!dataUsers.length || !dataUserLog?.email) return;
  
    const foundUser = dataUsers.find((user) => user.EMAIL === dataUserLog.email);
  
    if (foundUser && (!userLog || userLog.EMAIL !== foundUser.EMAIL)) {
      setUserLog(foundUser);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const usuarioArray = Object.values(newUsuario);
    await createUser(usuarioArray);
    handleClose();
  };

  return (
    <>
      <a variant="success" className='nav-link' onClick={handleShow}> Crear Usuario </a>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <p>Nombre:</p>
            <input type="text" name="NOMBRE" value={newUsuario.NOMBRE} onChange={handleInputChange} required />
            <hr />
            <p>Apellido:</p>
            <input type="text" name="APELLIDO" value={newUsuario.APELLIDO} onChange={handleInputChange} required />
            <hr />
            <p>Email:</p>
            <input type="email" name="EMAIL" value={newUsuario.EMAIL} onChange={handleInputChange} required />
            <hr />
            <p>BASE:</p>
            <input type="text" name="BASE" value={newUsuario.BASE} onChange={handleInputChange} required />
            <hr />
            <p>ACCESO:</p>
            <select name="ACCESO" value={newUsuario.ACCESO || ""} onChange={handleInputChange} required>
              <option value="">Seleccionar</option>
              <option value="TECNICO">TECNICO</option>
              <option value="MONITOREO">MONITOREO</option>
            </select>
            <hr />
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
              <Button variant="primary" type="submit">Crear</Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateUsuario;