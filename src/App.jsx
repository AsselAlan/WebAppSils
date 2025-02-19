//Clave API: AIzaSyAVKwTt-qud1wW_48crbg_PgRaX_dYhAyI
//ID Cliente: 975263545881-n5mgv58bs3q2uojbgi79co5p598pra63.apps.googleusercontent.com
import { Route, Routes } from 'react-router-dom';
import './App.css'

import { useGoogleSheets } from "./contexts/formsGoogleSheetsContext.jsx";

import Login from './pages/login/login.jsx';
import NavBar from './pages/nav/navBar.jsx';
import Turnos from './pages/turnos/turnos.jsx';
import FormDataTable from './pages/table/dataTableForms.jsx';
import Home from './pages/home-noticias/home.jsx';


function App() {


  const { isAuthorized, dataForm, dataUserLog, dataUsers, handleAuthClick, handleSignoutClick, fetchDataForm, addNewRow, } = useGoogleSheets();

  const TurnosPendientes = () => <div className="w-100 d-flex justify-content-center align-items-center flex-wrap"><Turnos ESTADO={"PENDIENTE"} /></div>
  const TurnosSuspendidos = () => <div className="w-100 d-flex justify-content-center align-items-center flex-wrap"><Turnos ESTADO={"SUSPENDIDO"} /></div>
  const TurnosCompletos = () =>  <div className="w-100 d-flex justify-content-center align-items-center flex-wrap"><Turnos ESTADO={"COMPLETO"} /></div>
  return (
    <>
      {!isAuthorized ? <Login /> : 
      
      <>
        <NavBar />

        <Routes>
          <Route path='/home' element={<Home/>} />
          <Route path='/turnos/pendientes' element={<TurnosPendientes/>} />
          <Route path='/turnos/suspendidos' element={<TurnosSuspendidos/>} />
          <Route path='/turnos/completos' element={<TurnosCompletos/>} />
          <Route path='/tabla/forms' element={<FormDataTable />} />
        </Routes>
      </>
      
      
      }
      
    </>
  )
}

export default App

