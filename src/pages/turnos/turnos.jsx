import React, { useEffect, useState } from "react";
//CSS
import './turnos.css'
// COMPONENTS
import Card from "react-bootstrap/Card";
import { Button } from "react-bootstrap";
// CONTEXT
import { useGoogleSheets } from "../../contexts/formsGoogleSheetsContext";
import AddRowForm from "../formulario/formulario";
import Suspender from "./suspender";
import Eliminar from "./eliminar";

function Turnos({ ESTADO }) {
  const { fetchDataTurnos, dataTurnos, dataUsers, dataUserLog, fetchUserProfile, fetchDataUsers, updateTurnoEstado, deleteTurno } = useGoogleSheets();

  const [ userLog, setUserLog ] = useState() 

  useEffect(() => {
    fetchDataTurnos();
  }, [fetchDataTurnos, dataTurnos]); 

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataUsers(); 
      await fetchUserProfile();
    };
  
    fetchData();
  }, []); 

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

  const renderTurnos = () => {
    if (!dataTurnos || dataTurnos.length === 0) {
      return <p>No hay turnos disponibles</p>;
    }
        

    return dataTurnos
      .filter((turno) => turno.ESTADO === ESTADO) // 🔹 Filtra antes de mapear
      .map((turno, index) => (
        <div key={index} className="d-flex justify-content-center align-items-center flex-wrap gap-3">
          <Card style={{ width: "18rem", marginBottom: "10px" }} className="m-5">
            <Card.Body>
              <Card.Title className="d-flex justify-content-center align-items-center">
                {turno.TRABAJO} - {turno.DOMINIO_TRACTOR}
              </Card.Title>

              {turno.DESCRIPCION_CREADOR ? 
                  <>
                   <hr />
                   <Card.Title className="d-flex justify-content-center align-items-center">
                     {turno.DESCRIPCION_CREADOR}
                   </Card.Title>
                  </>

              : null}
              
             
              <hr />
              <Card.Subtitle className="mb-2 d-flex justify-content-center align-items-center">
                <p>{turno.ESTADO}</p>
              </Card.Subtitle>
              <Card.Subtitle className="mb-2 text-muted">
                <span>SR:</span> {turno.DOMINIO_SR}
              </Card.Subtitle>
              <Card.Subtitle className="mb-2 text-muted">
                <span>Base:</span> {turno.BASE}
              </Card.Subtitle>
              <Card.Subtitle className="mb-2 text-muted">
                <span>Técnico:</span> {turno.TECNICO_RESPONSABLE}
              </Card.Subtitle>
              <Card.Text>
                <span>Creador: {turno.CREADOR_TURNO}</span>
                <br />
                <span>{turno.HORARIO}</span>
                <span className="mx-2">{turno.FECHA}</span>
              </Card.Text>
              {turno.DESCRIPCION_TECNICO ? 
                <>
                  <hr />
                  {turno.DESCRIPCION_TECNICO}
                </> 
              : null}
              {turno.ESTADO === "PENDIENTE" && userLog && userLog.ACCESO !== "MONITOREO" && (
                <Card.Link className="w-100 d-flex justify-content-center">
                  <AddRowForm turno={turno} />
                  <Suspender id={turno.ID}  />
                </Card.Link>
              )}
              {turno.ESTADO === "PENDIENTE" && userLog && userLog.ACCESO === "MONITOREO" && (
                <Card.Link className="w-100 d-flex justify-content-center">
                  <Eliminar  id={turno.ID}/>
                </Card.Link>
              )}
            </Card.Body>
          </Card>
        </div>
      ))
  };

  return <>{renderTurnos()}</>
}

export default Turnos;
