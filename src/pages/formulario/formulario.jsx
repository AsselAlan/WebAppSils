import React, { useEffect, useState } from "react";
import { useGoogleSheets } from "../../contexts/formsGoogleSheetsContext"; 
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const AddRowForm = ({turno}) => {
  
  const { addNewRow, updateTurnoEstado, dataUsers, dataUserLog, fetchUserProfile, fetchDataUsers } = useGoogleSheets();
  const [ userLog, setUserLog ] = useState() 


  useEffect(() => {
      const fetchData = async () => {
        await fetchDataUsers(); 
        await fetchUserProfile();
      };
    
      fetchData();
    }, []); // 👈 Se ejecuta solo al montar el componente
    
    useEffect(() => {
      userLogeado();
    }, [dataUsers, dataUserLog]); // 👈 Solo se ejecuta cuando cambian los datos
    
    const userLogeado = () => {
      if (!dataUsers.length || !dataUserLog?.email) return;
    
      const foundUser = dataUsers.find((user) => user.EMAIL === dataUserLog.email);
    
      if (foundUser && (!userLog || userLog.EMAIL !== foundUser.EMAIL)) {
        setUserLog(foundUser);
      }
    };
  

  const [newRowData, setNewRowData] = useState({
    RESPONSABLE: "",
    CONTROL_STOCK: "",
    LLEVA_INFORME: "",
    ESTADO_INFORME: "",
    CONTROL_CALIDAD: "",
    MARCA_TEMPORAL: "",
    CORREO: "",
    DOMINIO_TC: "",
    MARCA_TC: "",
    MODELO_TC: "",
    AÑO: "",
    DOMINIO_SR: "",
    MODELO_SR: "",
    EQUIPAMIENTO: "",
    EETT: "",
    DESCRIPCION: "",
    TECNICO: "",
  });

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleInputChange = (e) => {
    setNewRowData({
      ...newRowData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rowArray = Object.values(newRowData);
    await addNewRow(rowArray);
    updateTurnoEstado(turno.ID,"COMPLETO",newRowData.DESCRIPCION)
    handleClose(); 
  };


  return (
    <>
    <Button variant="primary" onClick={handleShow}> Terminar </Button>

    
       <Modal show={show} onHide={handleClose}>
         <Modal.Header closeButton>
           <Modal.Title>FOMULARIO</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <form onSubmit={handleSubmit}>
              <p>Responsable:</p>
              <input className="mb-1" type="text" name="RESPONSABLE" value={turno.CREADOR_TURNO} onChange={handleInputChange} />
              <hr />
              <p>Control de Stock:</p>
              <input className="mb-1" type="text" name="CONTROL_STOCK" value={newRowData.CONTROL_STOCK} onChange={handleInputChange} />
              <hr />
              <p>Checklist:</p>
              <input className="mb-1" type="text" name="CHECKLIST" value={newRowData.CHECKLIST} onChange={handleInputChange} />
              <hr />
              <p>Registro en Drive:</p>
              <input className="mb-1" type="text" name="REGISTRO_DRIVE" value={newRowData.REGISTRO_DRIVE} onChange={handleInputChange} />
              <hr />
              <p>Control de Calidad:</p>
              <input className="mb-1" type="text" name="CONTROL_CALIDAD" value={newRowData.CONTROL_CALIDAD} onChange={handleInputChange} />
              <hr />
              <p>Marcatemporal:</p>
              <input className="mb-1" type="text" name="MARCA_TEMPORAL" value={newRowData.MARCA_TEMPORAL} onChange={handleInputChange} />
              <hr />
              <p>Correo:</p>
              <input className="mb-1" type="EMAIL" name="CORREO" value={newRowData.EMAIL} onChange={handleInputChange} />
              <hr />
              <p>Dominio de Tractor:</p>
              <input className="mb-1" type="text" name="DOMINIO_TC" value={newRowData.DOMINIO_TC} placeholder={turno.DOMINIO_TRACTOR}  onChange={handleInputChange} />
              <hr />
              <p>Marca de Tractor:</p>
              <input className="mb-1" type="text" name="MARCA_TC" value={newRowData.MARCA_TC} onChange={handleInputChange} />
              <hr />
              <p>Modelo de Tractor:</p>
              <input className="mb-1" type="text" name="MODELO_TC" value={newRowData.MODELO_TC} onChange={handleInputChange} />
              <hr />
              <p>Año:</p>
              <input className="mb-1" type="number" name="AÑO" value={newRowData.AÑO} onChange={handleInputChange} />
              <hr />
              <p>Dominio de Cisterna:</p>
              <input className="mb-1" type="text" name="DOMINIO_SR" value={newRowData.DOMINIO_SR} placeholder={turno.DOMINIO_SR} onChange={handleInputChange} />
              <hr />
              <p>Modelo de Cisterna:</p>
              <input className="mb-1" type="text" name="MODELO_SR" value={newRowData.MODELO_SR} onChange={handleInputChange} />
              <hr />
              <p>Equipamiento:</p>
              <input className="mb-1" type="text" name="EQUIPAMIENTO" value={newRowData.EQUIPAMIENTO} onChange={handleInputChange} />
              <hr />
              <p>Descripcion:</p>
              <input className="mb-1" type="text" name="DESCRIPCION" value={newRowData.DESCRIPCION} onChange={handleInputChange} />
              <hr />
              <p>Empresa de Transporte:</p>
              <input className="mb-1" type="text" name="EETT" value={newRowData.EETT} onChange={handleInputChange} />
              <hr />
              <p>Tecnico:</p>
              <input className="mb-1" type="text" name="TECNICO" value={userLog?.EMAIL || ""} onChange={handleInputChange} />
              <hr />
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  CANCELAR
                </Button>
                <Button variant="primary" type="submit">
                  TERMINAR
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Body>
       </Modal>


    </>
  );
};

export default AddRowForm;
