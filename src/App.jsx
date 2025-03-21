// app.jsx
import { useState } from "react";
import SponsorCard from "./components/SponsorCard";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [selectedSponsor, setSelectedSponsor] = useState(null);

  let sponsors = [
    { id: 1, name: "VALPA", logo: "/images/valpa_logo.webp" },
    { id: 2, name: "VALPA", logo: "/images/valpa_logo.webp" },
    { id: 3, name: "VALPA", logo: "/images/valpa_logo.webp" },
  ];

  return (
    <div className="relative w-screen h-screen bg-gray-100 text-center flex flex-col gap-8">
      <header className="bg-blue-950 p-4 flex justify-start items-center">
        <img src="/images/helpnei.webp" className="h-10 w-auto" alt="Helpnei Logo" />
      </header>
      <div className="">
        <h1 className="text-2xl font-bold mt-6 m-2">BEM VINDO À PÁGINA DE PATROCINADORES</h1>
        <p className="mb-8 text-gray-600">Clique em algum dos cards para mais informações</p>
      </div>
      <div className="flex justify-center gap-10">
        {sponsors.map((sponsor) => (
          <SponsorCard key={sponsor.id} sponsor={sponsor} onClick={() => setSelectedSponsor(sponsor)} />
        ))}
      </div>

      {selectedSponsor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Dashboard sponsor={selectedSponsor} onClose={() => setSelectedSponsor(null)} />
        </div>
      )}
    </div>
  );
}
