import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import sponsors from "../data/sponsors.json";

function Detalhes() {
    const { name } = useParams();
    const [sponsor, setSponsor] = useState(null);
  
    useEffect(() => {
      // busca o patrocinador com nome igual ao da URL (ignorando maiúsculas/minúsculas)
      const sponsorFound = sponsors.find(
        (s) => s.name.toLowerCase() === name.toLowerCase()
      );
      setSponsor(sponsorFound);
    }, [name]);
  
    if (!sponsor) {
      return <p>Patrocinador não encontrado.</p>;
    }
  
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 text-center flex flex-col">
        <header className="bg-blue-950 p-4 flex justify-start items-center">
        <img src="/images/helpnei.webp" className="h-10 w-auto" alt="Helpnei Logo" />
      </header>
      <h1 className="text-2xl font-bold mt-6 m-2">Detalhes - {sponsor.name}</h1>

    
    </div>
  );
}


export default Detalhes;
