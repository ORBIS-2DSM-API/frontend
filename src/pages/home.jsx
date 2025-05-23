import { useState, useEffect } from "react";
import SponsorCard from "../components/SponsorCard.jsx";
import Dashboard from "../components/Dashboard.jsx";
import sponsors from "../data/programas.json";
import FloatingDownloadButton from "../components/manual.jsx";


export default function Home() {
  const [selectedSponsor, setSelectedSponsor] = useState(null);

  useEffect(() => {
    document.body.style.overflow = selectedSponsor ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedSponsor]);

  return (
    <div className="relative w-full bg-gradient-to-b from-gray-100 to-gray-200 text-center flex flex-col">
      
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold mt-6 m-2 tracking-wider">
            BEM VINDO À PÁGINA DE PATROCINADORES
          </h1>
          <p className="mb-8 text-gray-600 italic">
            Clique em algum dos cards para mais informações
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-14 gap-y-10 px-4 mx-auto max-w-6xl">
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
      <FloatingDownloadButton />
    </div>
  );
}
