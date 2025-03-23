import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";

export default function SponsorCard({ sponsor, onClick }) {
  return (
    <div
      className="bg-white rounded-xl shadow-md p-11 text-center cursor-pointer w-64 h-[20rem] flex flex-col items-center justify-between"
      onClick={onClick}
    >
      <img
        src={sponsor.logo}
        alt={sponsor.name}
        className="h-32 mx-auto max-w-full" // Adicionado max-w-full
      />
      <div className="flex justify-center gap-6 mt-4">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <FaInstagram className="text-2xl text-black hover:text-pink-500 transition duration-300" />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <FaFacebook className="text-2xl text-black hover:text-blue-600 transition duration-300" />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <FaLinkedin className="text-2xl text-black hover:text-blue-700 transition duration-300" />
        </a>
      </div>
    </div>
  );
}