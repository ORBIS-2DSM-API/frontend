import { useState, useEffect } from "react";
import SponsorCard from "../components/SponsorCard.jsx";
import Dashboard from "../components/Dashboard.jsx";
import sponsors from "../data/programas.json";

export default function Home() {
  const [selectedSponsor, setSelectedSponsor] = useState(null);

  useEffect(() => {
    document.body.style.overflow = selectedSponsor ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedSponsor]);

  return (
    <div className="relative w-full bg-gray-100 text-center flex flex-col">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center py-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E3A8A] mb-8">
            BEM-VINDO À PÁGINA DE PATROCINADORES
          </h1>
          <p className="text-[#1E3A8A] text-lg sm:text-xl max-w-3xl px-4">
            Clique nos cards para mais informações
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-8 px-4 mx-auto max-w-7xl">
          {sponsors.map((sponsor) => (
            <SponsorCard
              key={sponsor.id}
              sponsor={sponsor}
              onClick={() => setSelectedSponsor(sponsor)}
            />
          ))}
        </div>
      </div>

      {selectedSponsor && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
          <Dashboard
            sponsor={selectedSponsor}
            onClose={() => setSelectedSponsor(null)}
          />
        </div>
      )}
    </div>
  );
}
