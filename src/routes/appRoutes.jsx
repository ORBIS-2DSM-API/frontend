import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout";
import Home from "../pages/home";
import Detalhes from "../pages/detalhes";
import Programas from "../pages/programasPatrocinio";
import FormularioEmpresa from "../pages/formularioEmpresa";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/detalhes/:name" element={<Detalhes />} />
        <Route path="/programasPatrocinio" element={<Programas />} />
        <Route path="/formulario/:nomeEmpresa" element={<FormularioEmpresa />} />
      </Route>
    </Routes>
  );
}
