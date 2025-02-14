import './navBar.css'

import logo  from '../../assets/logo.png'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import OAuth from '../login/oAuth.jsx';

import { useGoogleSheets } from "../../contexts/formsGoogleSheetsContext";
import { useEffect, useState } from 'react';
import { NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CreateTurno from '../turnos/crearTurno.jsx';
import CreateUser from '../usuarios/createUsuarios.jsx';


function NavBar() {

  const [ userLog, setUserLog ] = useState() 

  const { dataUsers, dataUserLog, fetchUserProfile, fetchDataUsers } = useGoogleSheets();

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

  const renderAcceso = () =>{
    if(!userLog){
      return <p>Solicite permisos</p>;
    }
    if(userLog.ACCESO === "TECNICO"){
      return(
        <Nav className="me-auto">
        <NavDropdown title="Turnos" id="basic-nav-dropdown">
          <NavDropdown.Item as={Link} to="turnos/pendientes" className="my-2">
            Pendientes
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="turnos/suspendidos" className="my-2">
            Suspendidos
          </NavDropdown.Item>
          <NavDropdown.Item as={Link} to="turnos/completos" className="my-2">
            Completos
          </NavDropdown.Item>
        </NavDropdown>
        <Link to="tabla/forms" className='nav-link'>Unidades</Link>
      </Nav>
      )
    }
    if(userLog.ACCESO === "MONITOREO"){
      return(
          <Nav className="me-auto">
            <NavDropdown title="Turnos" id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to="turnos/pendientes" className="my-2">
              Pendientes
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="turnos/suspendidos" className="my-2">
              Suspendidos
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="turnos/completos" className="my-2">
              Completos
            </NavDropdown.Item>
          </NavDropdown>
          <CreateTurno/>
          <CreateUser/>
          <Link to="tabla/forms" className='nav-link'>Forms</Link>
          <Nav.Link href="#link">Informes</Nav.Link>
        </Nav>
      )
    }
  }
  
  

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container className='containerNavBar'>
        <Navbar.Brand href="#home">
          <div className="divTittle">
              <img src={logo} alt="" />
              <h3>Silstech<span>.</span></h3>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            {userLog ? 
              <>
                {renderAcceso()}
                <span className="material-symbols-outlined m-1 text-white">person</span>
                <h6 className='m-2 text-white' >
                  {userLog.APELLIDO.charAt(0).toUpperCase() + userLog.APELLIDO.slice(1).toLowerCase()} 
                  { " " }
                  {userLog.NOMBRE.charAt(0).toUpperCase() + userLog.NOMBRE.slice(1).toLowerCase()}
                </h6>

                <h6 className='m-2 text-white' >
                  {userLog.ACCESO.charAt(0).toUpperCase() + userLog.ACCESO.slice(1).toLowerCase()}
                </h6>
              </>
                : null }
              <OAuth />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;