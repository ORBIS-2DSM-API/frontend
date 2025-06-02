import { Link, useNavigate } from "react-router-dom";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import programasData from "../data/programas.json";

export default function Especificacoes() {
  const { nomePatrocinio } = useParams();
  const navigate = useNavigate();

  const programa = useMemo(
    () =>
      programasData.find(
        (p) => p.titulo === decodeURIComponent(nomePatrocinio)
      ),
    [nomePatrocinio]
  );

  if (!programa) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Programa não encontrado.
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gray-100 flex items-center justify-center overflow-y-auto md:overflow-hidden">
      <div className="absolute top-6 left-6 hidden lg:flex">
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 bg-[#1E3A8A] text-white rounded-full font-medium text-lg hover:bg-[#172554] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2 flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          <span>Voltar</span>
        </button>
      </div>

      <div className="flex flex-col items-center w-full">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg mx-auto overflow-hidden md:transform md:-translate-y-4">
          <div className="bg-[#1E3A8A] p-7 text-white text-center">
            <h1 className="text-3xl font-inter">{programa.titulo}</h1>
          </div>

          <div className="p-8 space-y-6">
            <section className="max-h-[calc(100vh-300px)] md:max-h-none">
              <h2 className="text-2xl font-semibold mb-4">Descrição</h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-6 not-italic">
                {programa.descricaoDetalhada}
              </p>
              <h2 className="text-2xl font-semibold mb-4">Requisitos</h2>
              <ul className="space-y-3 text-gray-700 list-disc list-inside not-italic">
                <li className="text-lg leading-relaxed">Idade mínima: {programa.idadeMin} anos</li>
                <li className="text-lg leading-relaxed">Escolaridade: {programa.nivelEscolaridade}</li>
                <li className="text-lg leading-relaxed">Vagas disponíveis: {programa.vagasDisponiveis}</li>
              </ul>
            </section>
          </div>

          <div className="p-6 text-center">
            <Link
              to={`/formulario/${encodeURIComponent(programa.nome)}`}
              className="inline-block px-8 py-3 bg-[#1E3A8A] text-white text-lg font-semibold rounded-full shadow hover:bg-[#172554] transition"
            >
              Candidatar‑se
            </Link>
          </div>
        </div>

        <div className="lg:hidden mt-12 mb-8 w-full flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-[#1E3A8A] text-white rounded-full font-medium text-lg hover:bg-[#172554] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:ring-offset-2 flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            <span>Voltar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
