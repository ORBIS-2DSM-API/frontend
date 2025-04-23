import { Link } from "react-router-dom";

const CardPatrocinio = ({ nome, titulo, descricao, logo }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md p-10 text-center w-[23rem] h-[28rem] flex flex-col items-center justify-between
      transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl font-manrope"
    >
      <img
        src={logo}
        alt={nome}
        className="h-36 w-auto mx-auto object-contain"
      />
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-inter">{titulo}</h2>
        <p className="text-base text-gray-600 text-center mb-4">{descricao}</p>
      </div>
      <Link to={`/programasPatrocinio/${titulo}`}>
        <button className="px-8 py-3 bg-blue-900 text-white rounded-full font-medium text-sm hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
          Candidatar-se
        </button>
      </Link>
    </div>
  );
};

export default CardPatrocinio;
