import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import CardPatrocinio from "../components/CardPatrocinio.jsx";
import programasData from "../data/programas.json";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { EffectCoverflow, Pagination, Navigation } from "swiper";

export default function Programas() {
  const [programas, setProgramas] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setProgramas(programasData);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="relative min-h-full w-full bg-gray-100 text-center flex flex-col">
      <div className="flex flex-col gap-4 pb-4">
        <div className="flex flex-col items-center py-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E3A8A] mb-8">
            PATROCÍNIO QUE TRANSFORMA!
          </h1>
          <p className="text-[#1E3A8A] text-lg sm:text-xl w-full px-8 sm:px-12 lg:px-24 font-normal">
            Na HELPNEI, acreditamos no impacto das boas conexões. Por isso,
            reunimos programas de patrocínio que aproximam grandes marcas de
            pequenos empreendedores com talento e história. Confira as vagas
            disponíveis e inscreva-se para conquistar o apoio que seu potencial
            merece!
          </p>
        </div>

        <div className="container-swiper mb-0">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            initialSlide={1}
            loop={true}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
            }}
            navigation={true}
            pagination={{
              clickable: true,
            }}
            modules={[EffectCoverflow, Pagination, Navigation]}
            className="swiper_container"
          >
            {programas.map((item, index) => (
              <SwiperSlide key={index}>
                <CardPatrocinio {...item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
