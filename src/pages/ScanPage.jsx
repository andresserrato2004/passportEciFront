import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ScanPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let qrScanner = null;

    const startCamera = async () => {
      try {
        setError(null);
        
        if (videoRef.current) {
          qrScanner = new QrScanner(
            videoRef.current,
            result => {
              console.log('QR detectado:', result.data);
              processQRCode(result.data);
            },
            {
              returnDetailedScanResult: true,
              highlightScanRegion: true,
              highlightCodeOutline: true,
              preferredCamera: 'environment', // Cámara trasera
            }
          );

          await qrScanner.start();
          setIsScanning(true);
        }
      } catch (err) {
        console.error('Error al acceder a la cámara:', err);
        setError('No se pudo acceder a la cámara. Asegúrate de dar permisos.');
      }
    };

    startCamera();

    return () => {
      if (qrScanner) {
        qrScanner.stop();
        qrScanner.destroy();
      }
      setIsScanning(false);
    };
  }, []);

  const handleManualInput = async () => {
    const placeId = prompt("Ingresa el ID del lugar:");
    if (placeId) {
      await processQRCode(placeId);
    }
  };

  const processQRCode = async (decodedText) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/passport/visit`,
        { code: decodedText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/passport");
    } catch (err) {
      alert("Error registrando lugar: " + err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-lg flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/passport")}
              className="text-gray-600 hover:text-blue-600 transition-colors flex items-center"
            >
              <span className="mr-1">←</span> Volver
            </button>
            <h1 className="text-lg font-bold text-gray-800 flex items-center">
              <span className="mr-2">📱</span>
              Escanear QR
            </h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4 py-3 max-w-2xl mx-auto w-full">
        {error && (
          <div className="mb-3 bg-red-50 border-l-4 border-red-400 p-3 rounded-r-lg flex-shrink-0">
            <div className="flex items-center">
              <span className="text-red-400 mr-2">⚠️</span>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Cámara - Elemento principal con altura controlada */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden flex-shrink-0">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 flex-shrink-0">
            <h3 className="text-white font-semibold flex items-center justify-center text-sm">
              <span className="mr-2">🎯</span>
              Zona de Escaneo
              {isScanning && (
                <span className="ml-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></span>
                  Activo
                </span>
              )}
            </h3>
          </div>
          
          <div className="relative bg-gray-900 h-80 flex items-center justify-center">
            <video 
              ref={videoRef}
              autoPlay 
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Marco de escaneo optimizado */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-48 h-48 border-2 border-white border-dashed rounded-xl animate-pulse"></div>
                
                {/* Esquinas del marco más pequeñas */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-l-2 border-t-2 border-green-400 rounded-tl-lg"></div>
                <div className="absolute -top-1 -right-1 w-6 h-6 border-r-2 border-t-2 border-green-400 rounded-tr-lg"></div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-2 border-b-2 border-green-400 rounded-bl-lg"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-green-400 rounded-br-lg"></div>
                
                {/* Línea de escaneo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-0.5 bg-green-400 opacity-80 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-2 bg-gray-50 text-center flex-shrink-0">
            <p className="text-gray-600 text-xs">
              Coloca el código QR dentro del marco
            </p>
          </div>
        </div>

        {/* Instrucciones compactas */}
        <div className="flex gap-2 my-3 flex-shrink-0">
          <div className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2 shadow-lg">
            <div className="flex items-center justify-center text-xs text-white">
              <span className="mr-1">1️⃣</span>
              <span>Permite cámara</span>
            </div>
          </div>
          <div className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2 shadow-lg">
            <div className="flex items-center justify-center text-xs text-white">
              <span className="mr-1">2️⃣</span>
              <span>Apunta al QR</span>
            </div>
          </div>
          <div className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2 shadow-lg">
            <div className="flex items-center justify-center text-xs text-white">
              <span className="mr-1">3️⃣</span>
              <span>Mantén en marco</span>
            </div>
          </div>
        </div>

        {/* Botones de acción compactos */}
        <div className="space-y-2 flex-shrink-0">
          <button
            onClick={handleManualInput}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
          >
            <span>⌨️</span>
            <span>Ingresar código manualmente</span>
          </button>
          
          <button
            onClick={() => navigate("/passport")}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 text-sm"
          >
            <span>🏠</span>
            <span>Volver al pasaporte</span>
          </button>
        </div>
      </div>
    </div>
  );
}
