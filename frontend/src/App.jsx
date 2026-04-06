import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./App.css";

// Axios toma la URL base desde la variable de entorno
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [form, setForm] = useState({
    rut: "",
    nombre: "",
    monto_adeudado: "",
    condominio: "",
    ciudad: "",
    meses_mora: "",
    corredor_responsable: "",
  });

  const [lista, setLista] = useState([]);
  const [editId, setEditId] = useState(null);
  const [adminMode, setAdminMode] = useState(false); // controla visibilidad botones
  const [clave, setClave] = useState(""); // input clave
  const [showClave, setShowClave] = useState(false); // mostrar input clave

  // Refs para Enter
  const rutRef = useRef();
  const nombreRef = useRef();
  const montoRef = useRef();
  const condominioRef = useRef();
  const ciudadRef = useRef();
  const mesesRef = useRef();
  const corredorRef = useRef();
  const btnRef = useRef();
  const claveRef = useRef();

  useEffect(() => {
    getData();
  }, []);

  // Obtener datos desde el backend
  const getData = async () => {
    try {
      const res = await axios.get(`${API_URL}/morosos`);
      setLista(res.data);
    } catch (error) {
      console.error("Error al obtener morosos:", error);
      throw error;
    }
  };

  // Actualizar form al cambiar input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Navegación con Enter entre inputs
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  // Guardar o actualizar registro
  const handleSubmit = async () => {
    if (!form.rut || !form.nombre) {
      alert("RUT y Nombre son obligatorios");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form);
        setEditId(null);
      } else {
        await axios.post(`${API_URL}`, form);
      }
      setForm({
        rut: "",
        nombre: "",
        monto_adeudado: "",
        condominio: "",
        ciudad: "",
        meses_mora: "",
        corredor_responsable: "",
      });
      getData();
      rutRef.current.focus();
    } catch (error) {
      console.error("Error al guardar registro:", error);
    }
  };

  // Activar admin mode si clave es correcta
  const verificarClave = () => {
    if (clave === "123") {
      setAdminMode(true);
      setShowClave(false);
    } else {
      alert("Clave incorrecta");
    }
    setClave("");
  };

  // Editar registro
  const handleEdit = (item) => {
    setForm(item);
    setEditId(item.id);
  };

  // Eliminar registro
  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este registro?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        getData();
      } catch (error) {
        console.error("Error al eliminar registro:", error);
      }
    }
  };

  return (
    <div className="container">
      <h1 className="title">Sistema de Morosos</h1>

      {/* FORMULARIO */}
      <div className="card">
        <h2>{editId ? "Editar Registro" : "Nuevo Registro"}</h2>
        <div className="grid">
          <input
            ref={rutRef}
            name="rut"
            placeholder="RUT"
            onChange={handleChange}
            value={form.rut}
            onKeyDown={(e) => handleKeyDown(e, nombreRef)}
          />
          <input
            ref={nombreRef}
            name="nombre"
            placeholder="Nombre"
            onChange={handleChange}
            value={form.nombre}
            onKeyDown={(e) => handleKeyDown(e, montoRef)}
          />
          <input
            ref={montoRef}
            name="monto_adeudado"
            type="number"
            placeholder="Monto Adeudado"
            onChange={handleChange}
            value={form.monto_adeudado}
            onKeyDown={(e) => handleKeyDown(e, condominioRef)}
          />
          <input
            ref={condominioRef}
            name="condominio"
            placeholder="Condominio"
            onChange={handleChange}
            value={form.condominio}
            onKeyDown={(e) => handleKeyDown(e, ciudadRef)}
          />
          <input
            ref={ciudadRef}
            name="ciudad"
            placeholder="Ciudad"
            onChange={handleChange}
            value={form.ciudad}
            onKeyDown={(e) => handleKeyDown(e, mesesRef)}
          />
          <input
            ref={mesesRef}
            name="meses_mora"
            type="number"
            placeholder="Meses en Mora"
            onChange={handleChange}
            value={form.meses_mora}
            onKeyDown={(e) => handleKeyDown(e, corredorRef)}
          />
          <input
            ref={corredorRef}
            name="corredor_responsable"
            placeholder="Corredor Responsable"
            onChange={handleChange}
            value={form.corredor_responsable}
            onKeyDown={(e) => handleKeyDown(e, btnRef)}
          />
        </div>

        <div className="buttonGroup">
          <button
            ref={btnRef}
            className="primaryBtn"
            onClick={handleSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          >
            {editId ? "Actualizar" : "Guardar"}
          </button>

          <button
            className="secondaryBtn"
            onClick={() => setShowClave(!showClave)}
          >
            Opciones
          </button>
        </div>

        {showClave && (
          <div className="claveContainer">
            <input
              ref={claveRef}
              type="password"
              placeholder="Ingrese clave"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") verificarClave();
              }}
            />
            <button className="primaryBtn" onClick={verificarClave}>
              Verificar
            </button>
          </div>
        )}
      </div>

      {/* TABLA */}
      <div className="card">
        <h2>Listado de Morosos</h2>
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>RUT</th>
                <th>Nombre</th>
                <th>Monto</th>
                <th>Condominio</th>
                <th>Ciudad</th>
                <th>Meses</th>
                <th>Corredor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((item) => (
                <tr key={item.id}>
                  <td>{item.rut}</td>
                  <td>{item.nombre}</td>
                  <td>${item.monto_adeudado}</td>
                  <td>{item.condominio}</td>
                  <td>{item.ciudad}</td>
                  <td>{item.meses_mora}</td>
                  <td>{item.corredor_responsable}</td>
                  <td>
                    {adminMode && (
                      <>
                        <button
                          className="editBtn"
                          onClick={() => handleEdit(item)}
                        >
                          Editar
                        </button>
                        <button
                          className="deleteBtn"
                          onClick={() => handleDelete(item.id)}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;