import React from 'react'
//CSS
import './login.css'
//CONTEXT
import { useGoogleSheets } from "../../contexts/formsGoogleSheetsContext";
//COMPONENTS
import OAuth from './oAuth';
import logo  from '../../assets/logo.png'
import { Container } from 'react-bootstrap';


function Login() {

  const { isAuthorized } = useGoogleSheets();


  return (
    <>
        {!isAuthorized ?
      

                    <Container className="containerLogin">
                        <div className="divTittle">
                            <img src={logo} alt="" />
                            <h3>Silstech<span>.</span></h3>
                        </div>
                        <div className='divButton'><OAuth /></div>
                    </Container>

         

        :  null }
    </>
  )
}

export default Login
{/* <Modal.Dialog>
    <Modal.Header>
      <Modal.Title className='d-flex justify-content-center'>
            <h2>SILSTECH APP</h2>
      </Modal.Title>
    </Modal.Header>

    <Modal.Body>
        <div> <OAuth /> </div> 
    </Modal.Body>

</Modal.Dialog> */}