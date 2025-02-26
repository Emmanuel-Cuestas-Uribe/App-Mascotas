import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { FaSearch, FaPlus, FaTrash } from "react-icons/fa"; 

function App() {
  const [mascotas, setMascotas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [raza, setRaza] = useState("");
  const [edad, setEdad] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    fetchMascotas();
  }, []);

  const fetchMascotas = async () => {
    try {
      const response = await axios.get("https://3.21.206.240/mascotas");
      setMascotas(response.data);
    } catch (error) {
      console.error("Error fetching mascotas:", error);
    }
  };

  const agregarMascota = async () => {
    if (!nombre) {
      alert("El nombre es obligatorio");
      return;
    }
    try {
      const response = await axios.post("https://3.21.206.240/mascotas", {
        nombre,
        raza,
        edad,
      });
      setMascotas([...mascotas, response.data]);
      setNombre("");
      setRaza("");
      setEdad("");
      setModalAbierto(false);
    } catch (error) {
      console.error("Error agregando mascota:", error);
    }
  };

  const eliminarMascota = async (id) => {
    try {
      await axios.delete(`https://3.21.206.240/mascotas/${id}`);
      setMascotas(mascotas.filter((mascota) => mascota.id !== id));
    } catch (error) {
      console.error("Error eliminando mascota:", error);
    }
  };

  const mascotasFiltradas = mascotas.filter((mascota) =>
    mascota.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container">
      <h1>🐾 Lista de Mascotas QA 🐾</h1>

      {/* Buscador */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <FaSearch className="search-icon" />
      </div>

      {/* Botón para abrir el modal */}
      <button className="button" onClick={() => setModalAbierto(true)}>
        <FaPlus /> Agregar Mascota
      </button>

      {/* Lista de mascotas */}
      <div className="mascota-list">
        {mascotasFiltradas.length > 0 ? (
          mascotasFiltradas.map((mascota) => (
            <div key={mascota.id} className="mascota-item">
              <div>
                <p>🐶 {mascota.nombre}</p>
                <p>
                  {mascota.raza} - {mascota.edad} años
                </p>
              </div>
              <button onClick={() => eliminarMascota(mascota.id)}>
                <FaTrash /> Eliminar
              </button>
            </div>
          ))
        ) : (
          <p>No se encontraron mascotas.</p>
        )}
      </div>

      {/* Modal para agregar mascotas */}
      <div className={`modal ${modalAbierto ? "open" : ""}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>➕ Agregar Mascota</h2>
            <button onClick={() => setModalAbierto(false)}>×</button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Raza"
                value={raza}
                onChange={(e) => setRaza(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Edad"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="button" onClick={agregarMascota}>
              <FaPlus /> Agregar
            </button>
            <button className="button" onClick={() => setModalAbierto(false)}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
