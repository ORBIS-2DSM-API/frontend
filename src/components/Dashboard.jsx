import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { RxCross1 } from "react-icons/rx";
import "leaflet/dist/leaflet.css";

export default function Dashboard({ sponsor, onClose }) {

  const vendedores = [
    { lat: -23.55052, lng: -46.633308, cidade: "São Paulo", estado: "SP", quantidade: 20 },
    { lat: -22.906847, lng: -43.172897, cidade: "Rio de Janeiro", estado: "RJ", quantidade: 15 },
    { lat: -19.916681, lng: -43.934493, cidade: "Belo Horizonte", estado: "MG", quantidade: 10 },
    { lat: -30.034647, lng: -51.217659, cidade: "Porto Alegre", estado: "RS", quantidade: 8 },
    { lat: -22.90556, lng: -47.06083, cidade: "Campinas", estado: "SP", quantidade: 12 },
    { lat: -23.1896, lng: -45.8841, cidade: "São José dos Campos", estado: "SP", quantidade: 9 },
    { lat: -3.119, lng: -60.0217, cidade: "Manaus", estado: "AM", quantidade: 6 },
    { lat: -8.0476, lng: -34.877, cidade: "Recife", estado: "PE", quantidade: 15 },
    { lat: -3.7172, lng: -38.5433, cidade: "Fortaleza", estado: "CE", quantidade: 10 },
    { lat: -16.6869, lng: -49.2648, cidade: "Goiânia", estado: "GO", quantidade: 11 },
    { lat: -27.5954, lng: -48.548, cidade: "Florianópolis", estado: "SC", quantidade: 7 },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 sm:p-14 rounded-xl shadow-lg w-[90%] sm:w-3/4 max-h-[90vh] overflow-y-auto">
        <div className="relative flex justify-between items-start">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-wide text-gray-900">
            {sponsor.name}
          </h2>
          <button className="text-black text-2xl" onClick={onClose}>
            <RxCross1 />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start justify-between mt-8 sm:mt-12 gap-4 sm:gap-10">
          <div className="w-full sm:w-1/2 space-y-6 sm:space-y-12">
            <div className="bg-gray-100 p-5 rounded-lg">
              <p className="text-xl sm:text-3xl font-bold text-black">4.520</p>
              <p className="text-sm text-gray-600">Usuários impactados</p>
            </div>

            <div className="bg-gray-100 p-5 rounded-lg">
              <p className="text-xl sm:text-3xl font-bold text-black">158</p>
              <p className="text-sm text-gray-600">Total de lojas</p>
            </div>

            <div className="bg-gray-100 p-5 rounded-lg">
              <p className="text-xl sm:text-3xl font-bold text-black">1.250.000</p>
              <p className="text-sm text-gray-600">Total de transações</p>
            </div>
          </div>

          <div className="w-full sm:w-1/2 h-48 sm:h-96 rounded-lg overflow-hidden">
            <MapContainer
              center={[-14.235, -51.9253]} 
              zoom={4} 
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {vendedores.map((vendedor, index) => (
                <Marker key={index} position={[vendedor.lat, vendedor.lng]}>
                  <Popup>
                    <b>{vendedor.cidade} - {vendedor.estado}</b><br />
                    Quantidade de vendedores: {vendedor.quantidade}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}