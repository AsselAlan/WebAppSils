import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useGoogleSheets } from "../../contexts/formsGoogleSheetsContext";
import { Accordion } from "react-bootstrap";

const FormDataTable = () => {
  const [userLog, setUserLog] = useState();
  const [filters, setFilters] = useState({ dominioTC: "", fecha: "", eett: "", dominioSR: "" });

  const { dataForm, fetchDataForm, dataUsers, dataUserLog, fetchUserProfile, fetchDataUsers } = useGoogleSheets();

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataForm();
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

  const columnsMONITOREO = [
    { name: "ID", selector: (row) => row.ID, sortable: true },
    { name: "Dominio TC", selector: (row) => row.DOMINIO_TC },
    { name: "Dominio SR", selector: (row) => row.DOMINIO_SR },
    { name: "Técnico", selector: (row) => row.TECNICO },
    { name: "EETT", selector: (row) => row.EETT },
    { name: "Responsable", selector: (row) => row.RESPONSABLE, sortable: true },
    { name: "Equipamiento", selector: (row) => row.EQUIPAMIENTO },
    { name: "Lleva informe", selector: (row) => row.LLEVA_INFORME },
    {
      name: "Estado de informe",
      selector: (row) => row.ESTADO_INFORME,
      cell: (row) => (
        <div
          style={{
            backgroundColor:
              row.ESTADO_INFORME?.trim().toUpperCase() === "COMPLETO"
                ? "rgba(0, 128, 0, 0.5)"
                : row.ESTADO_INFORME?.trim().toUpperCase() === "PENDIENTE"
                ? "rgba(255, 165, 0, 0.5)"
                : "transparent",
            padding: "5px",
            borderRadius: "5px",
            textAlign: "center",
            width: "100%",
          }}
        >
          {row.ESTADO_INFORME}
        </div>
      ),
    },
    { name: "Descripción", selector: (row) => row.DESCRIPCION },
    {
      name: "Control Calidad",
      selector: (row) => row.CONTROL_CALIDAD,
      cell: (row) => (
        <div
          style={{
            backgroundColor:
              row.CONTROL_CALIDAD?.trim().toUpperCase() === "CORRECTO"
                ? "rgba(0, 128, 0, 0.5)"
                : row.CONTROL_CALIDAD?.trim().toUpperCase() === "INCORRECTO"
                ? "rgba(255, 0, 0, 0.5)"
                : "transparent",
            padding: "5px",
            borderRadius: "5px",
            textAlign: "center",
            width: "100%",
          }}
        >
          {row.CONTROL_CALIDAD}
        </div>
      ),
    },
    { name: "Marca TC", selector: (row) => row.MARCA_TC },
    { name: "Modelo TC", selector: (row) => row.MODELO_TC },
    { name: "Modelo SR", selector: (row) => row.MODELO_SR },
    { name: "Año", selector: (row) => row.AÑO },
    { name: "Marca Temporal", selector: (row) => row.MARCA_TEMPORAL, sortable: true },
    { name: "Base", selector: (row) => row.BASE },
    { name: "Correo", selector: (row) => row.CORREO },
  ];

  const columnsTECNICO = [
    { name: "ID", selector: (row) => row.ID, sortable: true },
    { name: "Técnico", selector: (row) => row.TECNICO },
    { name: "Dominio TC", selector: (row) => row.DOMINIO_TC },
    { name: "Marca Temporal", selector: (row) => row.MARCA_TEMPORAL, sortable: true },
    { name: "EETT", selector: (row) => row.EETT },
    { name: "Dominio SR", selector: (row) => row.DOMINIO_SR },
  ];

  const filteredData = dataForm
    .filter((item) =>
      item &&
      item.DOMINIO_TC?.toLowerCase().includes(filters.dominioTC.toLowerCase()) &&
      item.MARCA_TEMPORAL?.toLowerCase().includes(filters.fecha.toLowerCase()) &&
      item.EETT?.toLowerCase().includes(filters.eett.toLowerCase()) &&
      item.DOMINIO_SR?.toLowerCase().includes(filters.dominioSR.toLowerCase())
    )
    .filter((item) => {
      if (!userLog) return false; // Si no hay usuario logueado, no muestra nada

      if (userLog.ACCESO === "TECNICO") {
        return item.TECNICO === userLog.EMAIL; // Técnicos solo ven sus propios registros
      }

      if (userLog.ACCESO === "MONITOREO") {
        return item.BASE === userLog.BASE; // Monitoreo solo ve los de su base
      }

      return false;
    });

  return (
    <>
      <div className="m-4">
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Filtros:</Accordion.Header>
            <Accordion.Body>
              <input
                type="text"
                placeholder="Filtrar por Dominio TC"
                className="border p-2 mx-2"
                value={filters.dominioTC}
                onChange={(e) => setFilters({ ...filters, dominioTC: e.target.value })}
              />
              <input
                type="text"
                placeholder="Filtrar por Fecha"
                className="border p-2 mx-2"
                value={filters.fecha}
                onChange={(e) => setFilters({ ...filters, fecha: e.target.value })}
              />
              <input
                type="text"
                placeholder="Filtrar por EETT"
                className="border p-2 mx-2"
                value={filters.eett}
                onChange={(e) => setFilters({ ...filters, eett: e.target.value })}
              />
              <input
                type="text"
                placeholder="Filtrar por Dominio SR"
                className="border p-2 mx-2"
                value={filters.dominioSR}
                onChange={(e) => setFilters({ ...filters, dominioSR: e.target.value })}
              />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      <div className="m-4">
        <DataTable
          columns={userLog?.ACCESO === "MONITOREO" ? columnsMONITOREO : columnsTECNICO}
          data={filteredData}
          pagination
          highlightOnHover
          striped
        />
      </div>
    </>
  );
};

export default FormDataTable;
