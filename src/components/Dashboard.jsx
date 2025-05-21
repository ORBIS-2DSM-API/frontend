import { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { RxCross1 } from "react-icons/rx";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import vendedores from "../data/vendedores.json";
import comunidadesData from "../data/comunidades.json";
import { fetchSponsorStats } from "../services/api";

export default function Dashboard({ sponsor, onClose, impactedUsers, totalStores, totalCommunities }) {
  const modalRef = useRef();
  const [stats, setStats] = useState({
    impactedUsers: 0,
    totalStores: 0,
    totalCommunities: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fecha modal ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);


  // useEffect(() => {
  //   if (!sponsor || !sponsor.id) return;

  //   setLoading(true);
  //   setError(null);

  //   fetchSponsorStats(sponsor.id)
  //     .then(data => {
  //       setStats({
  //         impactedUsers: data.impactedUsers,
  //         totalStores: data.totalStores,
  //         totalCommunities: data.totalCommunities
  //       });
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       setError("Não foi possível carregar as estatísticas");
  //     })
  //     .finally(() => setLoading(false));
  // }, [sponsor]);

  // Monta o array de cards (mantendo a aparência original)
  const cards = [
    {
      label: "Usuários impactados",
      value: sponsor.usuariosImpactados,
      color: "text-blue-500",
      bar: "bg-blue-500",
    },
    {
      label: "Total de lojas",
      value: sponsor.totalLojas,
      color: "text-blue-700",
      bar: "bg-blue-700",
    },
    {
      label: "Total de comunidades",
      value: sponsor.comunidadesCriadas,
      color: "text-blue-900",
      bar: "bg-blue-900",
    },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-white p-4 sm:p-10 rounded-2xl shadow-lg w-[95%] sm:w-[85%] min-h-[80vh] sm:h-[80vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <img src={sponsor.logo} alt="Logo" className="h-16 sm:h-20" />
          <div className="flex items-center gap-6">
            <Link
              to={`/detalhes/${sponsor.nome.toLowerCase()}`}
              className="text-black text-lg hover:underline font-bold"
            >
              Ir para Detalhes
            </Link>
            <button
              className="text-black text-2xl font-bold"
              onClick={onClose}
            >
              <RxCross1 />
            </button>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
          {/* Cards */}
          <div className="w-full flex flex-col gap-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {cards.map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 p-8 rounded-lg shadow flex flex-col"
              >
                <div className="grid grid-cols-[auto_1fr] items-center gap-8 w-full">
                  <span
                    className={`font-bold ${item.color} text-lg sm:text-2xl md:text-4xl`}
                  >
                    {item.value}
                  </span>
                  <span className="text-sm sm:text-lg md:text-xl font-bold text-gray-600 text-right">
                    {item.label}
                  </span>
                </div>
                <div
                  className={`h-5 sm:h-6 w-full mt-3 ${item.bar} rounded-md`}
                ></div>
              </div>
            ))}
          </div>

          {/* Mapa */}
          <div className="w-full h-64 sm:h-[32rem] rounded-lg overflow-hidden">
            <MapContainer
              center={[-14.235, -51.9253]}
              zoom={4}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {vendedores.map((vendedor, i) => (
                <Marker key={i} position={[vendedor.lat, vendedor.lng]}>
                  <Popup>
                    <b>
                      {vendedor.cidade} - {vendedor.estado}
                    </b>
                    <br />
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
