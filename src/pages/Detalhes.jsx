import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import sponsors from "../data/programas.json";
import comunidadesData from "../data/comunidades.json";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const blueIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function FlyTo({ lat, lng, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], zoom);
    }
  }, [lat, lng, zoom]);
  return null;
}

function Detalhes() {
  const { nome } = useParams();
  const [sponsor, setSponsor] = useState(null);
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [cidadeSelecionada, setCidadeSelecionada] = useState("");
  const [tipoComunidade, setTipoComunidade] = useState("Total de Comunidades");
  const [cidadeIndex, setCidadeIndex] = useState(0);

  const [mapaPosicao, setMapaPosicao] = useState({ lat: -14.235, lng: -51.9253, zoom: 4 });
  const [marcadores, setMarcadores] = useState([]);
  const [cidadesDaLista, setCidadesDaLista] = useState([]);
  const [comunidadesVisiveis, setComunidadesVisiveis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sponsorFound = sponsors.find(
      (s) => s.nome.toLowerCase() === nome.toLowerCase()
    );
    if (sponsorFound) {
      setSponsor(sponsorFound);
      setEstadoSelecionado("");
      setCidadeSelecionada("");
    }
    setLoading(false);
  }, [nome]);

  useEffect(() => {
    if (!sponsor) return;

    const filterCommunities = () => {
      let comunidadesFiltradas = comunidadesData.filter(
        (c) => c.patrocinador === sponsor.nome
      );

      if (tipoComunidade === "Novas Comunidades (último mês)") {
        const umMesAtras = new Date();
        umMesAtras.setMonth(umMesAtras.getMonth() - 1);
        comunidadesFiltradas = comunidadesFiltradas.filter((c) => {
          const criadaEm = new Date(c.criadaEm);
          return criadaEm >= umMesAtras;
        });
      }

      let comunidadesSelecionadas = comunidadesFiltradas;
      if (estadoSelecionado) {
        comunidadesSelecionadas = comunidadesSelecionadas.filter(c => c.estado === estadoSelecionado);
      }
      if (cidadeSelecionada) {
        comunidadesSelecionadas = comunidadesSelecionadas.filter(c => c.cidade === cidadeSelecionada);
      }

      return comunidadesSelecionadas;
    };

    const comunidadesSelecionadas = filterCommunities();

    setComunidadesVisiveis(comunidadesSelecionadas);

    if (!estadoSelecionado) {
      const estadosUnicos = [...new Set(comunidadesSelecionadas.map(c => c.estado))];
      setMapaPosicao({ lat: -14.235, lng: -51.9253, zoom: 4 });
      setMarcadores(estadosUnicos.map((estado, i) => ({
        key: `estado-${i}`,
        lat: comunidadesSelecionadas.find(c => c.estado === estado).estado_lat,
        lng: comunidadesSelecionadas.find(c => c.estado === estado).estado_lng,
        label: `Estado: ${estado}`,
      })));
    } else if (!cidadeSelecionada) {
      const cidadesUnicas = [...new Set(comunidadesSelecionadas.map(c => c.cidade))];
      if (cidadesUnicas.length > 0) {
        setMapaPosicao({ lat: comunidadesSelecionadas[0].cidade_lat, lng: comunidadesSelecionadas[0].cidade_lng, zoom: 8 });
        setCidadesDaLista(cidadesUnicas);
      }
      setMarcadores(cidadesUnicas.map((cidade, i) => ({
        key: `cidade-${i}`,
        lat: comunidadesSelecionadas.find(c => c.cidade === cidade).cidade_lat,
        lng: comunidadesSelecionadas.find(c => c.cidade === cidade).cidade_lng,
        label: `Cidade: ${cidade}`,
      })));
    } else {
      if (comunidadesSelecionadas.length > 0) {
        setMapaPosicao({
          lat: comunidadesSelecionadas[0].lat,
          lng: comunidadesSelecionadas[0].lng,
          zoom: 12,
        });
      }
      setMarcadores(comunidadesSelecionadas.map((comunidade, i) => ({
        key: `comunidade-${i}`,
        lat: comunidade.lat,
        lng: comunidade.lng,
        label: comunidade.nome,
      })));
    }
  }, [estadoSelecionado, cidadeSelecionada, sponsor, tipoComunidade]);

  const proximaCidade = () => {
    const novaIndex = (cidadeIndex + 1) % cidadesDaLista.length;
    setCidadeIndex(novaIndex);
    const cidade = cidadesDaLista[novaIndex];
    setCidadeSelecionada(cidade);
    setMapaPosicao({ lat: cidade.lat, lng: cidade.lng, zoom: 10 });
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!sponsor) {
    return <p>Patrocinador não encontrado.</p>;
  }

  const comunidadesFiltradas = comunidadesData.filter(
    (c) => c.patrocinador === sponsor.nome
  );

  const estados = [...new Set(comunidadesFiltradas.map((c) => c.estado))];
  const cidades = estadoSelecionado
    ? [...new Set(
        comunidadesFiltradas
          .filter((c) => c.estado === estadoSelecionado)
          .map((c) => c.cidade)
      )]
    : [];

  const dadosResumo = {
    usuariosImpactados: comunidadesVisiveis.reduce((sum, c) => sum + (c.usuariosImpactados || 0), 0),
    usuariosImpactadosUltimoMes: comunidadesVisiveis.reduce((sum, c) => sum + (c.usuariosImpactadosUltimoMes || 0), 0),
    comunidadesCriadas: comunidadesVisiveis.length,
    planosAdquiridos: comunidadesVisiveis.reduce((sum, c) => sum + (c.planosAdquiridos || 0), 0),
    planosDistribuidos: comunidadesVisiveis.reduce((sum, c) => sum + (c.planosDistribuidos || 0), 0),
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 md:px-8 lg:px-16">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center m-8">
        Detalhes - {sponsor.nome}
      </h1>
      <div className="w-full max-w-[88vw]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <InfoBox title="Usuários Impactados" value={dadosResumo.usuariosImpactados} change={dadosResumo.change} />
          <InfoBox title="Usuários Impact." sub=" (Último Mês)" value={dadosResumo.usuariosImpactadosUltimoMes} change="+141" />
          <InfoBox title="Comunidades Criadas" value={dadosResumo.comunidadesCriadas} change="+2"/>
          <InfoBox title="Planos Adquiridos" value={sponsor.planosAdquiridos} change="+15"  />
          <InfoBox title="Planos Distribuídos" value={sponsor.planosDistribuidos}  />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-7">
          <div className="lg:col-span-3">
            <div className="h-[35rem] w-full rounded-lg overflow-hidden relative">
              <MapContainer
                center={[mapaPosicao.lat, mapaPosicao.lng]}
                zoom={mapaPosicao.zoom}
                className="w-full h-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FlyTo lat={mapaPosicao.lat} lng={mapaPosicao.lng} zoom={mapaPosicao.zoom} />
                {marcadores.map((m) => (
                  <Marker
                    key={m.key}
                    position={[m.lat, m.lng]}
                    icon={blueIcon}
                    eventHandlers={{
                      click: () => {
                        if (m.label.startsWith("Estado: ")) {
                          setEstadoSelecionado(m.label.replace("Estado: ", ""));
                          setCidadeSelecionada("");
                        } else if (m.label.startsWith("Cidade: ")) {
                          const cidadeNome = m.label.replace("Cidade: ", "");
                          setCidadeSelecionada(cidadeNome);
                          const idx = cidadesDaLista.findIndex(c => c.cidade === cidadeNome);
                          setCidadeIndex(idx !== -1 ? idx : 0);
                        }
                      },
                    }}
                  >
                    <Popup>{m.label}</Popup>
                  </Marker>
                ))}
              </MapContainer>
              {cidadeSelecionada && cidadesDaLista.length > 1 && (
                <button
                  onClick={proximaCidade}
                  className="absolute right-4 top-4 z-[1000] bg-blue-600 text-white p-2 rounded shadow"
                >
                  Próxima Cidade ➜
                </button>
              )}
            </div>
          </div>
          <div className="lg:col-span-2 min-h-[30rem] flex items-stretch sm:h-[40rem] lg:h-[35rem] sm:mb-30 lg:mb-20">
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
                onChange={(e) => {
                  setCidadeSelecionada(e.target.value);
                  const idx = cidadesDaLista.findIndex(c => c.cidade === e.target.value);
                  setCidadeIndex(idx !== -1 ? idx : 0);
                }}
                disabled={!estadoSelecionado}
              />
              <Dropdown
                label="Comunidades"
                options={["Total de Comunidades", "Novas Comunidades (último mês)"]} 
                value={tipoComunidade}
                onChange={(e) => setTipoComunidade(e.target.value)}
              />
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
