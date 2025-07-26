import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PassportPage() {
  const [stamps, setStamps] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStamps = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/passport/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const allPlacesData = res.data;
        const visitedPlaces = allPlacesData.filter(place => place.isVisited === true);
        
        setAllPlaces(allPlacesData);
        setStamps(visitedPlaces);
        console.log("Todos los lugares:", allPlacesData);
        console.log("Lugares visitados:", visitedPlaces);
        
        axios.get(`${import.meta.env.VITE_API_URL}/auth/profile`, { 
            headers:{ Authorization: `Bearer ${token}` }
        })
        .then(res => setUser(res.data))
        .catch(err => console.error("Error cargando informacion del usuario: ", err))
      } catch (err) {
        alert("Error loading stamps");
        navigate("/");
      }
    };
    fetchStamps();
  }, [navigate]);

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white shadow-lg flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎓</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Pasaporte ECI</h1>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido con scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Tarjeta de usuario */}
          {user && (
            <div className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl overflow-hidden">
              <div className="p-4 text-white">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-lg">👤</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">¡Hola, {user.name}!</h2>
                    <p className="text-blue-100 text-sm">📚 {user.carrer}</p>
                    <p className="text-blue-100 text-sm">📅 Año 2025</p>
                  </div>
                </div>
                <div className="mt-3 bg-white bg-opacity-10 rounded-lg p-2">
                  <p className="text-xs">
                    🏆 Lugares visitados: <span className="font-bold">{stamps.length} de {allPlaces.length} </span>
                  </p>
                </div>
              </div>
            </div>
          )}


          {/* Sección de estampillas */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">🎪</span>
                Tus Estampillas
              </h3>
              
            </div>

            {allPlaces.length === 0 ? (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg p-6 text-center border border-white border-opacity-50">
                <div className="text-4xl mb-3">🗺️</div>
                <h4 className="text-lg font-semibold text-gray-600 mb-2">
                  Cargando lugares...
                </h4>
                <p className="text-gray-500 text-sm">
                  Espera mientras cargamos todos los lugares disponibles.
                </p>
              </div>
            ) : (
              /* Contenedor con scroll independiente para todos los lugares */
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg overflow-hidden border border-white border-opacity-50">
                <div className="p-3 bg-white bg-opacity-30 border-b border-white border-opacity-30">
                  <p className="text-xs text-gray-700 text-center">
                    📜 Desliza para ver todos los lugares disponibles
                  </p>
                </div>
                <div className="h-64 overflow-y-auto p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {allPlaces.map((place, index) => (
                      <div
                        key={place.id}
                        className={`rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border ${
                          place.isVisited 
                            ? 'bg-white bg-opacity-80 backdrop-blur-sm border-white border-opacity-60' 
                            : 'bg-gray-200 bg-opacity-60 border-gray-300 border-opacity-60'
                        }`}
                      >
                        <div className={`h-1 ${
                          place.isVisited 
                            ? 'bg-gradient-to-r from-green-400 to-blue-500' 
                            : 'bg-gray-400'
                        }`}></div>
                        <div className="p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                              place.isVisited 
                                ? 'bg-gradient-to-r from-green-400 to-blue-500' 
                                : 'bg-gray-400'
                            }`}>
                              {place.isVisited ? '✓' : '?'}
                            </div>
                            <div className="text-sm">
                              {place.isVisited ? '📍' : '📍'}
                            </div>
                          </div>
                          <h4 className={`font-bold text-sm mb-1 ${
                            place.isVisited ? 'text-gray-800' : 'text-gray-500'
                          }`}>
                            {place.name}
                          </h4>
                          <div className="flex items-center text-xs">
                            {place.isVisited ? (
                              <>
                                <span className="mr-1 text-green-500">✅</span>
                                <span className="text-green-600">Visitado</span>
                              </>
                            ) : (
                              <>
                                <span className="mr-1 text-gray-400">⏳</span>
                                <span className="text-gray-500">Pendiente por visitar</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Indicador de scroll */}
                {allPlaces.length > 4 && (
                  <div className="p-2 bg-white bg-opacity-30 border-t border-white border-opacity-30 text-center">
                    <p className="text-xs text-gray-700">
                      ⬇️ Desliza hacia abajo para ver más lugares
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
                    {/* Botón de escanear - Movido arriba */}
          <div className="text-center mb-4">
            <button
              onClick={() => navigate("/scan")}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center mx-auto space-x-2"
            >
              <span className="text-lg">📱</span>
              <span>Escanear nuevo lugar</span>
              <span className="text-lg">✨</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
