import { RxCross1 } from "react-icons/rx";

export default function Dashboard({ sponsor, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 sm:p-14 rounded-xl shadow-lg w-[90%] sm:w-3/4 max-h-[90vh] overflow-y-auto">
        <div className="relative flex justify-between items-start">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-wide text-gray-900">
            {sponsor.name}
          </h2>
          <button
            className="text-black text-2xl"
            onClick={onClose}
          >
            <RxCross1 />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start justify-between mt-8 sm:mt-12 gap-4 sm:gap-10">
          <div className="w-full sm:w-1/2 space-y-6 sm:space-y-12">
            <div className="bg-gray-100 p-5 rounded-lg">
              <p className="text-xl sm:text-3xl font-bold text-black">4.520</p>
              <p className="text-sm text-gray-600">Usuários impactados</p>
            </div>

            <div className="bg-gray-100 p-5 rounded-lg">
              <p className="text-xl sm:text-3xl font-bold text-black">158</p>
              <p className="text-sm text-gray-600">Total de lojas</p>
            </div>

            <div className="bg-gray-100 p-5 rounded-lg">
              <p className="text-xl sm:text-3xl font-bold text-black">1.250.000</p>
              <p className="text-sm text-gray-600">Total de transações</p>
            </div>
          </div>

          <div className="w-full sm:w-1/2 flex items-center justify-center bg-gray-300 rounded-lg h-48 sm:h-96">
            <span className="text-gray-600">Mapa Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
}