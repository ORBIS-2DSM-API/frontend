import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import CardPatrocinio from "../components/CardPatrocinio.jsx";
import programasData from "../data/programas.json";


import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { EffectCoverflow, Pagination, Navigation } from "swiper";

export default function Programas() {
  const [programas, setProgramas] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const swiperRef = useRef(null);

  useEffect(() => {
    setIsClient(true);
    setProgramas(programasData);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="relative min-h-full w-full bg-gradient-to-b from-gray-100 to-gray-200 text-center flex flex-col">
      <div className=" flex flex-col gap-8 items-center">
        <div className="flex flex-col items-center gap-2 max-w-[80vw] mt-10">
          <h1>PATROCÍNIO QUE TRANSFORMA!</h1>
          <p className="font-medium text-black text-lg mt-1">
            Na HELPNEI, acreditamos no impacto das boas conexões. Por isso,
            reunimos programas de patrocínio que aproximam grandes marcas de
            pequenos empreendedores com talento e história. Confira as vagas
            disponíveis e inscreva-se para conquistar o apoio que seu potencial
            merece!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 py-16">
          {programas.map((item, index) => (
            <div key={index}>
              <CardPatrocinio {...item} />
            </div>
          ))}
        </div>


      </div>
    </div>
  );
}