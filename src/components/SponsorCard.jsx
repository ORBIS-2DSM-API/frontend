import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";

export default function SponsorCard({ sponsor, onClick }) {
  // Função para determinar a classe de tamanho do logo
  const getLogoClass = (sponsorName) => {
    if (sponsorName === 'Google') {
      return "h-12 w-auto object-contain"; // Google mantém menor
    }
    
    if (sponsorName === 'Boticario') {
      return "h-40 w-auto object-contain"; // Boticário com tamanho extra grande
    }

    const smallerLogos = ['Windows', 'Itaú', 'Avon'];
    const largeLogos = ['Tramontina', 'Petrobras'];
    const extraLargeLogos = ['Santander'];

    if (smallerLogos.includes(sponsorName)) {
      return "h-24 w-auto object-contain"; // Logos menores
    }
    if (largeLogos.includes(sponsorName)) {
      return "h-32 w-auto object-contain"; // Logos grandes
    }
    if (extraLargeLogos.includes(sponsorName)) {
      return "h-36 w-auto object-contain"; // Logos extra grandes
    }
    return "h-28 w-auto object-contain"; // Tamanho padrão para os demais
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md p-6 text-center cursor-pointer w-56 h-[16rem] flex flex-col items-center 
      transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
      onClick={onClick}
    >
      <div className="flex-1 w-full flex items-center justify-center">
        <img
          src={sponsor.logo}
          alt={sponsor.name}
          className={`${getLogoClass(sponsor.nome)} mx-auto`}
        />
      </div>
      <div className="flex justify-center gap-4">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <FaInstagram className="text-xl text-black hover:text-pink-500 transition duration-300" />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <FaFacebook className="text-xl text-black hover:text-blue-600 transition duration-300" />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <FaLinkedin className="text-xl text-black hover:text-blue-700 transition duration-300" />
        </a>
      </div>
    </div>
  );
}
