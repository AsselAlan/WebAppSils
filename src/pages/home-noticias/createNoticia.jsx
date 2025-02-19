import React, { useEffect, useState } from "react";
import { useGoogleSheets } from "../../contexts/formsGoogleSheetsContext";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const CreateNoticia = () => {
  const { createNoticia, createTurno, dataUsers, dataUserLog, fetchUserProfile, fetchDataUsers, fetchDataNoticias } = useGoogleSheets();
  const [nuevaNoticia, setNuevaNoticia] = useState({
    CREADOR: "",
    MENSAJE: "",
    TITULO: "",
    PARA_ROL: "",
    IMPORTANCIA: "",
    FECHA: "",
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
    if (userLog) {
      setNuevaNoticia((prev) => ({
        ...prev,
        CREADOR: userLog.EMAIL || "",
        FECHA: new Date().toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
      }));
    }
  }, [userLog]);

 useEffect(() => {
    const fetchData = async () => {
      await fetchDataUsers(); 
      await fetchUserProfile();
      await fetchDataNoticias()
    };
  
    fetchData();
  }, [])

    
  useEffect(() => {
    userLogeado();
  }, [dataUsers, dataUserLog]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaNoticia((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    await createNoticia(nuevaNoticia);
    setNuevaNoticia({
      CREADOR: "",
      MENSAJE: "",
      TITULO: "",
      PARA_ROL: "",
      FECHA: "",
      IMPORTANCIA: "",
      ID: "",
    });
    handleClose(); 
  };

  return (
    <>
      <Button variant="success" onClick={handleShow} className="button-crear"> Crear Noticia</Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Turno</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={handleSubmit}>
        
                <p>Creador:</p>
                <input
                type="text"
                name="CREADOR"
                value={userLog?.EMAIL || ""}
                onChange={handleInputChange}
                required
                />
                <hr />
        
                <p>Mensaje:</p>
                <textarea
                name="MENSAJE"
                value={nuevaNoticia.MENSAJE}
                onChange={handleInputChange}
                required
                />
                 <hr />
        
                <p>Título:</p>
                <input
                type="text"
                name="TITULO"
                value={nuevaNoticia.TITULO}
                onChange={handleInputChange}
                required
                />
                 <hr />
        
                <p>Para Rol:</p>
                <select
                name="PARA_ROL"
                value={nuevaNoticia.PARA_ROL}
                onChange={handleInputChange}
                required
                >
              <option value="">Seleccionar</option>
              <option value="TECNICO">TECNICO</option>
              <option value="MONITOREO">MONITOREO</option>
            </select>
                <hr />

                <p>Importancia:</p>
                <select
                type="text"
                name="IMPORTANCIA"
                value={nuevaNoticia.IMPORTANCIA}
                onChange={handleInputChange}
                required
                >
                <option value="">Seleccionar</option>
                <option value="NO" style={{ backgroundColor: "rgba(0, 128, 0, 0.4)" }}>No importante</option>
                <option value="SI" style={{ backgroundColor: "rgba(255, 165, 0, 0.4)" }}>Importante</option>
                <option value="MUY" style={{ backgroundColor: "rgba(255, 0, 0, 0.4)" }}>Muy importante</option>
            </select>

                <hr />        
                <input
                type="text"
                name="FECHA"
                value={new Date().toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                onChange={handleInputChange}
                required
                />
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

export default CreateNoticia