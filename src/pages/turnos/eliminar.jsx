import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useGoogleSheets } from '../../contexts/formsGoogleSheetsContext';

function Eliminar({ id }) {
  const [show, setShow] = useState(false);
  const [descripcion, setDescripcion] = useState(""); // Estado para la descripción

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { updateTurnoEstado } = useGoogleSheets();

  const handleSuspender = () => {
    updateTurnoEstado(id, "ELIMINADO", descripcion);
    handleClose();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} className='mx-2'>
         Eliminar
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Añade una descripción antes de Eliminar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input 
            type="text" 
            value={descripcion} 
            onChange={(e) => setDescripcion(e.target.value)} 
            placeholder="Motivo de Eliminacion"
            className="form-control" // Para mejorar el estilo en Bootstrap
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            CANCELAR
          </Button>
          <Button variant="danger" onClick={handleSuspender}>
            ELIMINAR
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Eliminar;
