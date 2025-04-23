import { useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { RxCross1 } from "react-icons/rx";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import vendedores from "../data/vendedores.json";

export default function Dashboard({ sponsor, onClose }) {
  const modalRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-white p-4 sm:p-10 rounded-2xl shadow-lg w-[95%] sm:w-[85%] min-h-[80vh] sm:h-[80vh] overflow-y-auto"
      >
        <div className="flex flex-row sm:flex-row justify-between items-start sm:items-center">
          <div className="flex justify-between items-center w-full">
            <img src={sponsor.logo} alt="Logo" className="h-16 sm:h-20" />

            <div className="flex justify-between gap-10">
              <Link
                to={`/detalhes/${sponsor.nome.toLowerCase()}`}
                className="text-black text-lg hover:underline mt-2 sm:mt-0 font-bold"
              >
                Ir para Detalhes
              </Link>
              <button className="text-black text-2xl font-bold" onClick={onClose}>
                <RxCross1 />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 mt-6 sm:mt-10">
          <div className="w-full flex flex-col justify-between gap-11 h-full">
            {[
              {
                label: "Usuários impactados",
                value: "4.520",
                color: "text-blue-500",
                bar: "bg-blue-500",
              },
              {
                label: "Total de lojas",
                value: "158",
                color: "text-blue-700",
                bar: "bg-blue-700",
              },
              {
                label: "Total de transações",
                value: "1.250.000",
                color: "text-blue-900",
                bar: "bg-blue-900",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 p-8 rounded-lg shadow flex flex-col"
              >
                <div className="grid grid-cols-[auto_1fr] items-center gap-8 w-full">
                  <span
                    className={`font-bold ${item.color} text-lg sm:text-2xl md:text-4xl break-words`}
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

          <div className="w-full h-64 sm:h-[32rem] rounded-lg overflow-hidden">
            <MapContainer
              center={[-14.235, -51.9253]}
              zoom={4}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {vendedores.map((vendedor, index) => (
                <Marker key={index} position={[vendedor.lat, vendedor.lng]}>
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
