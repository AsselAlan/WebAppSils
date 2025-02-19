import React, { useEffect, useState } from 'react';
import { useGoogleSheets } from '../../contexts/formsGoogleSheetsContext';
import CreateNoticia from './createNoticia';
import { Form } from 'react-bootstrap';

import './home.css'

const Home = () => {
  const { fetchDataUsers, fetchUserProfile, dataUsers, dataUserLog, dataNoticias } = useGoogleSheets();
  const [userLog, setUserLog] = useState();
  const [filtro, setFiltro] = useState("fecha"); // Estado para manejar el filtro seleccionado

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

  let colorImportancia = (importancia) => {
    if (importancia === "MUY") return "rgba(255, 0, 0, 0.1)";
    if (importancia === "NO") return "rgba(0, 128, 0, 0.1)";
    if (importancia === "SI") return "rgba(255, 165, 0, 0.1)";
  };

  // Ordena las noticias según el filtro seleccionado
  const noticiasOrdenadas = [...dataNoticias].sort((a, b) => {
    if (filtro === "fecha") {
      return new Date(b.FECHA) - new Date(a.FECHA); // Ordenar por fecha (más reciente primero)
    } else if (filtro === "importancia") {
      const importanciaOrden = { "MUY": 1, "SI": 2, "NO": 3 };
      return importanciaOrden[a.IMPORTANCIA] - importanciaOrden[b.IMPORTANCIA]; // Ordenar por importancia
    }
    return 0;
  });

  return (
    <div className='container-noticias'>
      <div className='d-flex justify-content-between m-3'>
        <h1>Noticias :</h1>
        {userLog && userLog.ACCESO === "MONITOREO" ? <CreateNoticia />: null}
      </div>

      {/* Selector de filtro */}
      <div className="d-flex justify-content-end m-3">
        <Form.Select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="w-auto">
          <option value="fecha">Ordenar por Fecha</option>
          <option value="importancia">Ordenar por Importancia</option>
        </Form.Select>
      </div>

      {/* Renderizado de noticias filtradas */}
      {noticiasOrdenadas.map((noticia, index) => {
        let color = colorImportancia(noticia.IMPORTANCIA);

        if (noticia.PARA_ROL === "TODOS" || (userLog && noticia.PARA_ROL === userLog.ACCESO)) {
          return (
            <div key={index} className='m-3' style={{border: `3px solid rgba(0, 0, 0, 0.1)`, padding: "10px", margin: "10px 0", borderRadius: "15px", background:`${color}`}}>
              <h2>{noticia.TITULO}</h2>
              <hr />
              <p>{noticia.MENSAJE}</p>
              <strong>
              {dataUsers?.map((user, i) => {
                if (user.EMAIL === noticia.CREADOR) {
                  return (<p key={i}>{user.NOMBRE} {user.APELLIDO} - {user.EMAIL}</p>);
                }
              })}
              </strong>
              <p><strong>{noticia.FECHA}</strong></p>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default Home;
