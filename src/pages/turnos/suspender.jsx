import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useGoogleSheets } from '../../contexts/formsGoogleSheetsContext';

function Suspender({ id }) {
  const [show, setShow] = useState(false);
  const [descripcion, setDescripcion] = useState(""); // Estado para la descripción

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { updateTurnoEstado } = useGoogleSheets();

  const handleSuspender = () => {
    updateTurnoEstado(id, "SUSPENDIDO", descripcion);
    handleClose();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow} className='mx-2'>
        Suspender
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Añade una descripción antes de suspender</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input 
            type="text" 
            value={descripcion} 
            onChange={(e) => setDescripcion(e.target.value)} 
            placeholder="Motivo de suspensión"
            className="form-control" // Para mejorar el estilo en Bootstrap
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleSuspender}>
            Suspender
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Suspender;
