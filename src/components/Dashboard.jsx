export default function Dashboard({ sponsor, onClose }) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg w-2/3 relative">
        <button className="absolute top-2 right-2 text-lg" onClick={onClose}>✖</button>
        <h2 className="text-2xl font-bold mb-4">{sponsor.name}</h2>
        <p>Usuários impactados: 4520</p>
        <p>Total de lojas: 158</p>
        <p>Total de transações: 1.250.000</p>
        <div className="mt-4">
          <img src="/mapa-brasil.png" alt="Mapa" className="w-full" />
        </div>
      </div>
    );
  }
  