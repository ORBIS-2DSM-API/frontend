import { Link } from "react-router-dom"

export default function Header(){
    return(<header className="bg-blue-950 py-4 px-7 flex justify-between items-center">
        <Link
            to={`/`}
        >
            <img
              src="/images/helpnei.webp"
              className="h-10 w-auto"
              alt="Helpnei Logo"
            />
        </Link>
        <Link
          to={`/programasPatrocinio`}
          className="text-white text-lg hover:text-gray-200 font-bold"
        >
          Vagas de Patrocínio
        </Link>
      </header>)
}