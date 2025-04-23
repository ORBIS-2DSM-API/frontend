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
    <div className="relative h-full w-full bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col min-h-screen py-12 px-4">
      <div className="absolute top-6 left-6 hidden lg:flex">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 px-4 py-1.5 border border-gray-300 rounded-full bg-blue-950 shadow-sm hover:shadow-md transition-shadow duration-200 text-white"
        >
          <ArrowLeft size={18} />
          <span className="font-manrope">Voltar</span>
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg mx-auto overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-7 text-white text-center">
          <h1 className="text-3xl font-inter">{programa.titulo}</h1>
        </div>

        <div className="p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Descrição</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {programa.descricaoDetalhada}
            </p>
            <h2 className="text-xl font-semibold">Requisitos</h2>
            <ul className="mt-2 space-y-1 text-lg opacity-90 text-black list-disc list-inside">
              <li>Idade mínima: {programa.idadeMin} anos</li>
              <li>Escolaridade: {programa.nivelEscolaridade}</li>
              <li>Vagas disponíveis: {programa.vagasDisponiveis}</li>
            </ul>
          </section>
        </div>

        <div className=" p-6 text-center">
          <Link
            to={`/formulario/${encodeURIComponent(programa.nome)}`}
            className="inline-block px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-full shadow hover:bg-blue-700 transition"
          >
            Candidatar‑se
          </Link>
        </div>
      </div>
    </div>
  );
}
