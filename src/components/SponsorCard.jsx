import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";

export default function SponsorCard({ sponsor, onClick }) {
  return (
    <div
      className="bg-white rounded-xl shadow-md p-8 text-center cursor-pointer w-64 h-88 flex flex-col items-center justify-between gap-4"
      onClick={onClick}
    >
      <img src={sponsor.logo} alt={sponsor.name} className="h-32 mx-auto" />
      <h2 className="font-poppins font-semibold text-xl text-gray-800 tracking-wide">{sponsor.name}</h2>
      <div className="flex justify-center gap-6 mt-4">
        <a href="#" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
          <FaInstagram className="text-2xl text-black hover:text-gray-500 transition duration-300" />
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
          <FaFacebook className="text-2xl text-black hover:text-gray-500 transition duration-300" />
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
          <FaLinkedin className="text-2xl text-black hover:text-gray-500 transition duration-300" />
        </a>
      </div>
    </div>
  );
}
