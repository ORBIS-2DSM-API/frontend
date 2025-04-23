import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import sponsors from "../data/programas.json";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function Detalhes() {
  const { nome } = useParams();
  const [sponsor, setSponsor] = useState(null);
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [cidadeSelecionada, setCidadeSelecionada] = useState("");

  useEffect(() => {
    const sponsorFound = sponsors.find(
      (s) => s.nome.toLowerCase() === nome.toLowerCase()
    );
    setSponsor(sponsorFound);
    setEstadoSelecionado("");
    setCidadeSelecionada("");
  }, [nome]);

  if (!sponsor) return <p>Patrocinador não encontrado.</p>;

  const estados = Object.keys(sponsor.locaisAtuacao || {});
  const cidades =
    estadoSelecionado && sponsor.locaisAtuacao[estadoSelecionado]
      ? sponsor.locaisAtuacao[estadoSelecionado].cidades
      : [];

  return (
    <div className="h-full bg-gray-100 flex flex-col items-center px-4 md:px-8 lg:px-16">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center m-8">
        Detalhes - {sponsor.nome}
      </h1>
      <div className="w-full max-w-[88vw]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <InfoBox title="Usuários Impactados" value={sponsor.usuariosImpactados} change="+20,1%" />
          <InfoBox title="Usuários Impact." sub=" (Último Mês)" value={sponsor.usuariosImpactadosUltimoMes} change="+141" />
          <InfoBox title="Comunidades Criadas" value={sponsor.comunidadesCriadas} change="+2" />
          <InfoBox title="Planos Adquiridos" value={sponsor.planosAdquiridos} change="+15" />
          <InfoBox title="Planos Distribuídos" value={sponsor.planosDistribuidos} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-7">
          <div className="lg:col-span-3">
            <div className="h-[35rem] w-full rounded-lg overflow-hidden">
              <MapContainer
                center={[-14.235, -51.9253]}
                zoom={4}
                className="w-full h-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              </MapContainer>
            </div>
          </div>
          <div className="lg:col-span-2 min-h-[30rem] flex items-stretch sm:h-[40rem] lg:h-[35rem] mb-16">
            <div className="bg-white rounded-lg shadow px-7 flex flex-col justify-around w-full sm:justify-evenly lg:justify-around">
              <Dropdown
                label="Estado"
                options={estados}
                value={estadoSelecionado}
                onChange={(e) => {
                  setEstadoSelecionado(e.target.value);
                  setCidadeSelecionada("");
                }}
              />
              <Dropdown
                label="Cidade"
                options={cidades}
                value={cidadeSelecionada}
                onChange={(e) => setCidadeSelecionada(e.target.value)}
                disabled={!estadoSelecionado}
              />
              <Dropdown label="Comunidades" options={["Total de Comunidades", "Novas Comunidades (último mês)"]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ title, sub, value, change }) {
  return (
    <div className="bg-gray-200 p-4 rounded-lg shadow text-center flex flex-col size-auto gap-2">
      <div className="flex justify-center items-center gap-2">
        <p className="text-lg font-bold text-gray-800">{title}</p>
        <p className="text-sm font-bold text-gray-800">{sub}</p>
      </div>
      <p className="text-2xl font-semibold text-black">{value}</p>
      {change && (
        <p className="text-green-600 text-lg font-medium">
          {change}
        </p>
      )}
    </div>
  );
}

function Dropdown({ label, options = [], value, onChange, disabled = false }) {
  return (
    <div className="flex flex-col text-left">
      <label className="text-lg font-medium mb-1 text-gray-700">{label}</label>
      <select
        className="p-2 border border-gray-300 rounded"
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        <option value="">{disabled ? "Selecione o estado primeiro" : "Selecione..."}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Detalhes;
