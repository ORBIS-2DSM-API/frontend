
import { Routes, Route } from "react-router-dom";
import Home from "../pages/home.jsx";
import Detalhes from "../pages/detalhes.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/detalhes/:name" element={<Detalhes />} />
    </Routes>
  );
}
