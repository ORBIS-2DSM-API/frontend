import { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { RxCross1 } from "react-icons/rx";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import L from "leaflet";
import vendedores from "../data/vendedores.json";
import comunidadesData from "../data/comunidades.json";
import { fetchSponsorStats } from "../services/api";

const blueIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-2">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-lg w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-50 px-4 py-3 border-b flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-950">{sponsor.nome}</h2>
          <div className="flex items-center gap-3">
            <Link
              to={`/detalhes/${sponsor.nome.toLowerCase()}`}
              className="text-blue-950 text-sm sm:text-base hover:underline font-bold"
            >
              Detalhes
            </Link>
            <button
              className="text-blue-950 text-lg font-bold hover:text-blue-900 transition-colors p-1"
              onClick={onClose}
            >
              <RxCross1 />
            </button>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-4">
            <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[340px] justify-between">
              {/* Cards */}
              <div className="w-full lg:w-[47%] flex flex-col gap-3 h-[280px] lg:h-full">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                {cards.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-4 rounded-xl shadow flex flex-col flex-1 justify-center"
                  >
                    <div className="grid grid-cols-[1fr_auto] items-center gap-3 w-full">
                      <span className="text-base sm:text-lg lg:text-xl font-semibold text-blue-950 text-left">
                        {item.label}
                      </span>
                      <span
                        className={`font-bold ${item.color} text-2xl sm:text-3xl lg:text-4xl`}
                      >
                        {item.value}
                      </span>
                    </div>
                    <div
                      className={`h-2.5 w-full mt-3 ${item.bar} rounded-full`}
                    ></div>
                  </div>
                ))}
              </div>

              {/* Mapa */}
              <div className="w-full lg:w-[47%] bg-gray-100 rounded-xl h-[340px] lg:h-full">
                <MapContainer
                  center={[-14.235, -51.9253]}
                  zoom={4}
                  style={{ width: "100%", height: "100%", borderRadius: "0.75rem" }}
                  className="shadow-inner"
                >
                  <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className="brightness-95 contrast-105"
                  />
                  {vendedores.map((vendedor, i) => (
                    <Marker 
                      key={i} 
                      position={[vendedor.lat, vendedor.lng]}
                      icon={blueIcon}
                    >
                      <Popup className="rounded-lg">
                        <div className="font-semibold text-sm">
                          <b>
                            {vendedor.cidade} - {vendedor.estado}
                          </b>
                          <br />
                          Quantidade de vendedores: {vendedor.quantidade}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
