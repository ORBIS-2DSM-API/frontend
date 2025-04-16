import { useState, useEffect } from "react";
import SponsorCard from "../components/SponsorCard";
import Dashboard from "../components/Dashboard";
import sponsors from "../data/sponsors.json"; // 👈 importa os dados do JSON

export default function Home() {
  const [selectedSponsor, setSelectedSponsor] = useState(null);

  useEffect(() => {
    document.body.style.overflow = selectedSponsor ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedSponsor]);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 text-center flex flex-col">
      <header className="bg-blue-950 p-4 flex justify-start items-center">
        <img src="/images/helpnei.webp" className="h-10 w-auto" alt="Helpnei Logo" />
      </header>

      <div className="flex-grow flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold mt-6 m-2">BEM VINDO À PÁGINA DE PATROCINADORES</h1>
          <p className="mb-8 text-gray-600">Clique em algum dos cards para mais informações</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-14 gap-y-10 px-4 mx-auto max-w-6xl">
          {sponsors.map((sponsor) => (
            <SponsorCard key={sponsor.id} sponsor={sponsor} onClick={() => setSelectedSponsor(sponsor)} />
          ))}
        </div>
      </div>

      {selectedSponsor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
          <Dashboard sponsor={selectedSponsor} onClose={() => setSelectedSponsor(null)} />
        </div>
      )}
    </div>
  );
}
