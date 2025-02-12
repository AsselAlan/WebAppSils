import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useGoogleSheets } from "../../contexts/formsGoogleSheetsContext";
import { Dropdown } from "bootstrap";
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';
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
      { name: "Responsable", selector: (row) => row.RESPONSABLE, sortable: true },
      { name: "Control Stock", selector: (row) => row.CONTROL_STOCK },
      { name: "Checklist", selector: (row) => row.CHECKLIST },
      { name: "Registro Drive", selector: (row) => row.REGISTRO_DRIVE },
      { name: "Control Calidad", selector: (row) => row.CONTROL_CALIDAD },
      { name: "Marca Temporal", selector: (row) => row.MARCA_TEMPORAL, sortable: true },
      { name: "Correo", selector: (row) => row.CORREO },
      { name: "Dominio TC", selector: (row) => row.DOMINIO_TC },
      { name: "Marca TC", selector: (row) => row.MARCA_TC },
      { name: "Modelo TC", selector: (row) => row.MODELO_TC },
      { name: "Año", selector: (row) => row.AÑO },
      { name: "Dominio SR", selector: (row) => row.DOMINIO_SR },
      { name: "Modelo SR", selector: (row) => row.MODELO_SR },
      { name: "Equipamiento", selector: (row) => row.EQUIPAMIENTO },
      { name: "EETT", selector: (row) => row.EETT },
      { name: "Descripción", selector: (row) => row.DESCRIPCION },
      { name: "Técnico", selector: (row) => row.TECNICO },
  ];
  
  const columnsTECNICO = [
    { name: "ID", selector: (row) => row.ID, sortable: true },
    { name: "Dominio TC", selector: (row) => row.DOMINIO_TC },
    { name: "Marca Temporal", selector: (row) => row.MARCA_TEMPORAL, sortable: true },
    { name: "EETT", selector: (row) => row.EETT },
    { name: "Dominio SR", selector: (row) => row.DOMINIO_SR },
  ];

  const filteredData = dataForm.filter((item) =>
    item &&
    item.DOMINIO_TC?.toLowerCase().includes(filters.dominioTC.toLowerCase()) &&
    item.MARCA_TEMPORAL?.toLowerCase().includes(filters.fecha.toLowerCase()) &&
    item.EETT?.toLowerCase().includes(filters.eett.toLowerCase()) &&
    item.DOMINIO_SR?.toLowerCase().includes(filters.dominioSR.toLowerCase())
  );

  return (

    <>
      <div className="m-4"> 
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Filtros:</Accordion.Header>
            <Accordion.Body>
                  <input type="text" placeholder="Filtrar por Dominio TC" className="border p-2 mx-2" value={filters.dominioTC} onChange={(e) => setFilters({ ...filters, dominioTC: e.target.value })} />
                  <input type="text" placeholder="Filtrar por Fecha" className="border p-2 mx-2" value={filters.fecha} onChange={(e) => setFilters({ ...filters, fecha: e.target.value })} />
                  <input type="text" placeholder="Filtrar por EETT" className="border p-2 mx-2" value={filters.eett} onChange={(e) => setFilters({ ...filters, eett: e.target.value })} />
                  <input type="text" placeholder="Filtrar por Dominio SR" className="border p-2 mx-2" value={filters.dominioSR} onChange={(e) => setFilters({ ...filters, dominioSR: e.target.value })} />
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
