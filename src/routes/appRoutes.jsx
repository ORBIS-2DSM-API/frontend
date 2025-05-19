import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout.jsx";
import Home from "../pages/home.jsx";
import Detalhes from "../pages/Detalhes.jsx";
import Programas from "../pages/programasPatrocinio.jsx";
import FormularioEmpresa from "../pages/formularioEmpresa.jsx";
import Especificacoes from "../pages/especificacoesPatrocinio.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/detalhes/:nome" element={<Detalhes />} />
        <Route path="/programasPatrocinio" element={<Programas />} />
        <Route path="/programasPatrocinio/:nomePatrocinio" element={<Especificacoes />} />
        <Route path="/formulario/:nomeEmpresa" element={<FormularioEmpresa />} />
      </Route>
    </Routes>
  );
}
