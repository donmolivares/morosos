import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./App.css";

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
  const [filteredLista, setFilteredLista] = useState([]); // lista filtrada
  const [editId, setEditId] = useState(null);
  const [adminMode, setAdminMode] = useState(false);
  const [clave, setClave] = useState("");
  const [showClave, setShowClave] = useState(false);
  const [search, setSearch] = useState(""); // búsqueda por texto
  const [condominioFilter, setCondominioFilter] = useState(""); // filtro por condominio

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

  useEffect(() => {
    applyFilters();
  }, [search, condominioFilter, lista]);

  const getData = async () => {
    try {
      const res = await axios.get(`${API_URL}/morosos`);
      setLista(res.data);
      setFilteredLista(res.data);
    } catch (error) {
      console.error("Error al obtener morosos:", error);
    }
  };

  // FILTROS Y BÚSQUEDA
  const applyFilters = () => {
    let filtered = [...lista];

    // filtro por búsqueda
    if (search.trim() !== "") {
      filtered = filtered.filter(
        (item) =>
          item.nombre.toLowerCase().includes(search.toLowerCase()) ||
          item.rut.toLowerCase().includes(search.toLowerCase()) ||
          item.ciudad.toLowerCase().includes(search.toLowerCase())
      );
    }

    // filtro por condominio
    if (condominioFilter !== "") {
      filtered = filtered.filter((item) => item.condominio === condominioFilter);
    }

    setFilteredLista(filtered);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.rut || !form.nombre) {
      alert("RUT y Nombre son obligatorios");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API_URL}/morosos/${editId}`, form);
        setEditId(null);
      } else {
        await axios.post(`${API_URL}/morosos`, form);
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
      alert("Error al guardar registro");
    }
  };

  const verificarClave = () => {
    if (clave === "123") {
      setAdminMode(true);
      setShowClave(false);
    } else {
      alert("Clave incorrecta");
    }
    setClave("");
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este registro?")) {
      await axios.delete(`${API_URL}/morosos/${id}`);
      getData();
    }
  };

  // obtener lista única de condominios para filtro
  const condominios = [...new Set(lista.map((item) => item.condominio))];

  return (
    <div className="appContainer">
      <header className="appHeader">
        <h2>Corretaje de Propiedades</h2>
      </header>

      <main className="mainContent">
        {/* FORMULARIO */}
        <div className="card">
          <h2>{editId ? "Editar Registro" : "Nuevo Registro"}</h2>
          <div className="grid">
            <input ref={rutRef} name="rut" placeholder="RUT" onChange={handleChange} value={form.rut} />
            <input ref={nombreRef} name="nombre" placeholder="Nombre" onChange={handleChange} value={form.nombre} />
            <input ref={montoRef} name="monto_adeudado" type="number" placeholder="Monto Adeudado" onChange={handleChange} value={form.monto_adeudado} />
            <input ref={condominioRef} name="condominio" placeholder="Condominio" onChange={handleChange} value={form.condominio} />
            <input ref={ciudadRef} name="ciudad" placeholder="Ciudad" onChange={handleChange} value={form.ciudad} />
            <input ref={mesesRef} name="meses_mora" type="number" placeholder="Meses en Mora" onChange={handleChange} value={form.meses_mora} />
            <input ref={corredorRef} name="corredor_responsable" placeholder="Corredor Responsable" onChange={handleChange} value={form.corredor_responsable} />
          </div>

          <div className="buttonGroup">
            <button ref={btnRef} className="primaryBtn" onClick={handleSubmit}>
              {editId ? "Actualizar" : "Guardar"}
            </button>
            <button className="secondaryBtn" onClick={() => setShowClave(!showClave)}>
              Opciones
            </button>
          </div>

          {showClave && (
            <div className="claveContainer">
              <input ref={claveRef} type="password" placeholder="Ingrese clave" value={clave} onChange={(e) => setClave(e.target.value)} />
              <button className="primaryBtn" onClick={verificarClave}>Verificar</button>
            </div>
          )}
        </div>

        {/* FILTROS */}
        <div className="card">
          <h2>Filtros y Búsqueda</h2>
          <div className="grid">
            <input
              type="text"
              placeholder="Buscar por RUT, Nombre o Ciudad"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={condominioFilter} onChange={(e) => setCondominioFilter(e.target.value)}>
              <option value="">Todos los Condominios</option>
              {condominios.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
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
                {filteredLista.map((item) => (
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
                          <button className="editBtn" onClick={() => handleEdit(item)}>Editar</button>
                          <button className="deleteBtn" onClick={() => handleDelete(item.id)}>Eliminar</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="appFooter">
        <h2>© 2026 Corretaje de Propiedades</h2>
      </footer>
    </div>
  );
}

export default App;