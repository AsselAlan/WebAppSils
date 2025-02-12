import React from "react";
import { useGoogleSheets } from "../../contexts/formsGoogleSheetsContext";
import { Button } from "react-bootstrap";

const OAuth = () => {

  const { isAuthorized, dataForm, dataUserLog, dataUsers, handleAuthClick, handleSignoutClick, fetchDataForm, addNewRow, } = useGoogleSheets();

  return (
    <>
      {
        isAuthorized ? null : <Button className="buttonLogin" onClick={handleAuthClick}>
        {/* <a onClick={handleAuthClick}> */}
          Entrar
        {/* </a> */}
      </Button>
      }
     
      {
        isAuthorized ? <Button  className="m-2 buttonLogout" onClick={handleSignoutClick}> 
        {/* <a onClick={handleSignoutClick}> */}
          Salir
        {/* </a> */}
      </Button> : null
      }
     
    </>
  );
};

export default OAuth;