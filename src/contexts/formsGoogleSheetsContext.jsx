import React, { createContext, useContext, useState, useEffect } from "react";
import { gapi } from "gapi-script";

// Configuración de Google Sheets API y People API
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SPREADSHEET_ID = import.meta.env.VITE_SPREADSHEET_ID;
const DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
  "https://people.googleapis.com/$discovery/rest?version=v1"
];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/contacts.readonly";

const REDIRECT_URI = "https://webappsils.netlify.app/callback";  // Asegúrate de que esta URL esté configurada correctamente

// Contexto
const GoogleSheetsContext = createContext();

// Hook para acceder al contexto
export const useGoogleSheets = () => useContext(GoogleSheetsContext);

// Proveedor del contexto
export const GoogleSheetsProvider = ({ children }) => {
  const [gapiLoaded, setGapiLoaded] = useState(false);
  const [gisLoaded, setGisLoaded] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [dataForm, setDataForm] = useState([]);
  const [dataUserLog, setDataUserLog] = useState([]);  
  const [dataUsers, setDataUsers] = useState([]);  
  const [dataTurnos, setDataTurnos] = useState([]);  

  useEffect(() => {
    function loadGapi() {
      gapi.load("client", async () => {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: DISCOVERY_DOCS,
        });
        setGapiLoaded(true);
        checkStoredToken(); // Verifica si hay un token guardado
      });
    }

    function loadGis() {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        redirect_uri: REDIRECT_URI, 
        callback: (resp) => {
          if (resp.error) return;
          localStorage.setItem("google_token", JSON.stringify(resp)); // Guarda el token
          setIsAuthorized(true);
        },
      });
      setTokenClient(client);
      setGisLoaded(true);
    }

    function checkStoredToken() {
      const storedToken = localStorage.getItem("google_token");
      if (storedToken) {
        const parsedToken = JSON.parse(storedToken);
        gapi.client.setToken(parsedToken);
        setIsAuthorized(true);
      }
    }

    // Cargar las librerías de Google
    const script1 = document.createElement("script");
    script1.src = "https://apis.google.com/js/api.js";
    script1.async = true;
    script1.defer = true;
    script1.onload = loadGapi;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://accounts.google.com/gsi/client";
    script2.async = true;
    script2.defer = true;
    script2.onload = loadGis;
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthorized) return;

      await fetchDataUsers();
      await fetchDataTurnos();
      await fetchUserProfile();
      await fetchDataForm();
    };

    fetchData();
  }, [isAuthorized]); // ✅ Solo se ejecuta cuando cambia `isAuthorized`

  const handleAuthClick = () => {
    if (!tokenClient) return;
    tokenClient.requestAccessToken({ prompt: isAuthorized ? "" : "consent" });
  };

  const handleSignoutClick = () => {
    gapi.client.setToken("");
    localStorage.removeItem("google_token"); // Elimina el token
    setIsAuthorized(false);
    setDataForm([]);
    setDataUserLog([]);
    setDataUsers([]);
    setDataTurnos([]);
  };

  const transformArrayToObjects = (data) => {
    const headers = data[0]; // La primera fila será el header
    const values = data.slice(1); // El resto son los valores
  
    return values.map(row => {
      let obj = {};
      row.forEach((value, index) => {
        obj[headers[index]] = value; // Asocia cada valor con su header correspondiente
      });
      return obj;
    });
  };

  // PETICIONES -----------------------------------------------------------------------------------------------


  // USUSARIOS 
  const fetchDataUsers = async () => {
    try {
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "USUARIOS!A:G",
      });

      let values = response.result.values || [];
      if (values.length === 0) {
        console.error("ERROR: no se encontraron datos en USUARIOS");
        return;
      }

      values = transformArrayToObjects(values);

      if (JSON.stringify(dataUsers) !== JSON.stringify(values)) {
        setDataUsers(values);
      }
    } catch (err) {
      console.error("Error al obtener usuarios:", err.message);
    }
  };

  const fetchUserProfile = async () => {
    try {
      if (!gapi.client || !gapi.client.people) return;

      const response = await gapi.client.people.people.get({
        resourceName: 'people/me',
        personFields: 'names,emailAddresses',
      });

      let userProfile = {
        name: response.result.names[0].displayName,
        email: response.result.emailAddresses[0].value
      };

      if (JSON.stringify(dataUserLog) !== JSON.stringify(userProfile)) {
        setDataUserLog(userProfile);
      }
    } catch (error) {
      console.error("Error al obtener el perfil del usuario:", error);
    }
  };

  const createUser = async (nuevoUsuario) => {
    try {
      if (!isAuthorized) {
        console.error("No autorizado para modificar datos.");
        return;
      }
  
      const range = "USUARIOS!A:F"; // Asegura que coincida con las columnas de la hoja
      const values = [nuevoUsuario]; // Debe coincidir con el formato esperado en la hoja
  
      const response = await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
        valueInputOption: "RAW",
        resource: { values: values },
      });
  
      console.log("Nuevo usuario agregado:", response);
      fetchDataUsers(); // Recarga los usuarios después de agregar uno nuevo
    } catch (err) {
      console.error("Error al agregar el usuario:", err.message);
    }
  };


  //FORMS
 
  const fetchDataForm = async () => {
    try {
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "FORM!A:R",
      });
  
      const values = response.result.values;
      if (!values || values.length === 0) {
        console.warn("No se encontraron datos en la hoja de cálculo.");
        setDataForm([]); // ✅ Devuelve un array vacío en lugar de un string
        return;
      }
  
      setDataForm(transformArrayToObjects(values));
    } catch (err) {
      console.error("Error al obtener datos:", err.message);
      setDataForm([]); // ✅ Si hay error, mantiene dataForm como un array vacío
    }
  };

  const fetchDataTurnos = async () => {
    try {
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: "TURNOS!A:L",
      });
  
      let values = response.result.values || [];
      if (values.length === 0) {
        console.error("ERROR: no se encontraron datos en TURNOS");
        return;
      }
  
      values = transformArrayToObjects(values);
  
      // 🔹 Esta línea fuerza a React a detectar cambios
      setDataTurnos(prevTurnos => JSON.stringify(prevTurnos) !== JSON.stringify(values) ? values : prevTurnos);
      
    } catch (err) {
      console.error("Error al obtener turnos:", err.message);
    }
  };


   
  const addNewRow = async (newRowData) => {
    try {
      // Define la hoja y el rango donde agregar los datos
      const range = "FORM!A:P"; // Rango de la hoja donde agregarás la fila
  
      // Formatea la fila de datos para que coincida con la estructura de la hoja
      const values = [newRowData]; // newRowData debe ser un array que coincida con las columnas de la hoja
  
      // Usa el método spreadsheets.values.append() para agregar la fila
      const response = await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID, // ID de la hoja de cálculo
        range: range,
        valueInputOption: "RAW", // Usa 'RAW' para insertar los datos tal como están
        resource: {
          values: values, // Datos a insertar
        },
      });
  
      // Puedes manejar la respuesta aquí, por ejemplo, confirmando que los datos fueron agregados
      console.log("Nuevo dato agregado:", response);
      fetchDataForm(); // Vuelve a cargar los datos después de agregar la fila
  
    } catch (err) {
      console.error("Error al agregar la fila:", err.message);
    }
  };

  
  //TURNOS


  const updateTurnoEstado = async (id, nuevoEstado, descripcionTecnico) => {
    try {
      if (!isAuthorized) {
        console.error("No autorizado para modificar datos.");
        return;
      }
  
      // Buscar el índice de la fila que coincide con el ID
      const index = dataTurnos.findIndex((turno) => turno.ID === id.toString());
  
      if (index === -1) {
        console.error(`No se encontró un turno con ID: ${id}`);
        return;
      }
  
      const rowIndex = index + 2; // +2 porque la hoja es indexada desde 1 y la primera fila son encabezados
  
      // Actualizar ESTADO (columna A)
      await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `TURNOS!A${rowIndex}`, 
        valueInputOption: "RAW",
        resource: { values: [[nuevoEstado]] }, // Solo actualiza la columna A
      });
  
      // Actualizar DESCRIPCIÓN_TÉCNICO (columna H)
      await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `TURNOS!H${rowIndex}`,
        valueInputOption: "RAW",
        resource: { values: [[descripcionTecnico]] }, // Solo actualiza la columna H
      });
  
      console.log(`Turno ${id} actualizado: Estado -> ${nuevoEstado}, Descripción -> ${descripcionTecnico}`);
      fetchDataTurnos(); // Recargar datos para reflejar cambios
  
    } catch (error) {
      console.error("Error al actualizar estado y descripción del turno:", error);
    }
  };
 
  const createTurno = async (nuevoTurno) => {
    try {
      if (!isAuthorized) {
        console.error("No autorizado para modificar datos.");
        return;
      }
  
      const range = "TURNOS!A:L"; // Asegura que coincida con las columnas de la hoja
      const values = [nuevoTurno]; // Debe coincidir con el formato esperado en la hoja
  
      const response = await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: range,
        valueInputOption: "RAW",
        resource: { values: values },
      });
  
      console.log("Nuevo turno agregado:", response);
      fetchDataTurnos(); // Recarga los turnos después de agregar uno nuevo
    } catch (err) {
      console.error("Error al agregar el turno:", err.message);
    }
  };
  
  const deleteTurno = async (id) => {
    try {
      if (!isAuthorized) {
        console.error("No autorizado para modificar datos.");
        return;
      }
  
      // Buscar el índice de la fila que coincide con el ID
      const index = dataTurnos.findIndex((turno) => turno.ID === id.toString());
  
      if (index === -1) {
        console.error(`No se encontró un turno con ID: ${id}`);
        return;
      }
  
      const rowIndex = index + 2; // +2 porque la hoja es indexada desde 1 y la primera fila son encabezados
  
      // Borrar la fila correspondiente al turno
      await gapi.client.sheets.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: `TURNOS!A${rowIndex}:K${rowIndex}`, // A:L para borrar todas las columnas de la fila
      });
  
      console.log(`Turno con ID ${id} eliminado.`);
      fetchDataTurnos(); // Recargar los turnos después de eliminar el turno
  
    } catch (error) {
      console.error("Error al eliminar el turno:", error);
    }
  };
  
  return (
    <GoogleSheetsContext.Provider
      value={{
        isAuthorized,
        dataTurnos,
        dataUsers,
        dataUserLog,
        dataForm,
        handleAuthClick,
        handleSignoutClick,
        fetchDataTurnos,
        fetchDataForm,
        fetchUserProfile,
        fetchDataUsers,
        updateTurnoEstado,
        addNewRow,
        createTurno,
        deleteTurno,
        createUser,
      }}
    >
      {children}
    </GoogleSheetsContext.Provider>
  );
};
