import React, { useEffect, useState } from "react";
import { useGoogleSheets } from "../../contexts/formsGoogleSheetsContext";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const CreateTurno = () => {
  const { createTurno, dataUsers, dataUserLog, fetchUserProfile, fetchDataUsers } = useGoogleSheets();
  const [newTurno, setNewTurno] = useState({
    ESTADO: "PENDIENTE",
    BASE: "",
    FECHA: "",
    HORARIO: "",
    TECNICO_RESPONSABLE: "",
    TRABAJO: "",
    CREADOR_TURNO: "",
    DESCRIPCION_TECNICO: "",
    DOMINIO_SR: "",
    DESCRIPCION_CREADOR: "",
    DOMINIO_TRACTOR: ""
  });

  const [show, setShow] = useState(false);
  const [userLog, setUserLog] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const userLogeado = () => {
    if (!dataUsers.length || !dataUserLog?.email) return;
  
    const foundUser = dataUsers.find((user) => user.EMAIL === dataUserLog.email);
  
    if (foundUser && (!userLog || userLog.EMAIL !== foundUser.EMAIL)) {
      setUserLog(foundUser);
    }
  };

 useEffect(() => {
    const fetchData = async () => {
      await fetchDataUsers(); 
      await fetchUserProfile();
    };
  
    fetchData();
  }, [])

    
  useEffect(() => {
    userLogeado();
  }, [dataUsers, dataUserLog]);

  useEffect(() => {
      if (userLog) {
        setNewTurno((prev) => ({
          ...prev,
          CREADOR_TURNO: userLog?.EMAIL || "",
        }));
      }
    }, [userLog]);
  

  const handleInputChange = (e) => {
    setNewTurno({
      ...newTurno,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const turnoArray = Object.values(newTurno);
    await createTurno(turnoArray);
    handleClose();
  };

  return (
    <>
      <a variant="success" className='nav-link' onClick={handleShow}> Crear Turno </a>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Turno</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <p>Base:</p>
            <input type="text" name="BASE" value={newTurno.BASE} onChange={handleInputChange} />
            <hr />
            <p>Fecha:</p>
            <input type="date" name="FECHA" value={newTurno.FECHA} onChange={handleInputChange} />
            <hr />
            <p>Horario:</p>
            <input type="time" name="HORARIO" value={newTurno.HORARIO} onChange={handleInputChange} />
            <hr />
            <p>Técnico Responsable::</p>
            <select name="TECNICO_RESPONSABLE" value={newTurno.TECNICO_RESPONSABLE} onChange={handleInputChange} required>
              <option value="">Seleccionar</option>
              {dataUsers?.map((user, index)=>{
                  if(user.ACCESO === "TECNICO"){
                    return <option key={index} value={user.EMAIL} >{user.NOMBRE} {user.APELLIDO}</option>
                  } 
              })}
            </select>
            {/* <p>Técnico Responsable:</p>
            <input type="text" name="TECNICO_RESPONSABLE" value={newTurno.TECNICO_RESPONSABLE} onChange={handleInputChange} /> */}
            <hr />
            <p>Trabajo:</p>
            <input type="text" name="TRABAJO" value={newTurno.TRABAJO} onChange={handleInputChange} />
            <hr />
            <p>Creador del Turno:</p>
            <input type="text" name="CREADOR_TURNO" value={userLog?.EMAIL || ""} onChange={handleInputChange} />
            <hr />
            <p>Dominio SR:</p>
            <input type="text" name="DOMINIO_SR" value={newTurno.DOMINIO_SR} onChange={handleInputChange} />
            <hr />
            <p>Dominio Tractor:</p>
            <input type="text" name="DOMINIO_TRACTOR" value={newTurno.DOMINIO_TRACTOR} onChange={handleInputChange} />
            <hr />
            <p>Descripción:</p>
            <input type="text" name="DESCRIPCION_CREADOR" value={newTurno.DESCRIPCION_CREADOR} onChange={handleInputChange} />
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

export default CreateTurno