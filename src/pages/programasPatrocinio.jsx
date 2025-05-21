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

        <div className="container-swiper">
          <Swiper
            ref={swiperRef}
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            loop={"auto"}
            loopPreventsSliding={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
            }}
            pagination={{ el: ".swiper-pagination", clickable: true }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
              clickable: true,
            }}
            modules={[EffectCoverflow, Pagination, Navigation]}
            className="swiper_container"
          >
            {programas.map((item, index) => (
              <SwiperSlide key={index}>
                <div key={index}>
                  <CardPatrocinio {...item} />
                </div>
              </SwiperSlide>
            ))}

            <div className="slider-controler">
              <div className="swiper-button-prev slider-arrow">
                <ion-icon name="arrow-back-outline"></ion-icon>
              </div>
              <div className="swiper-button-next slider-arrow">
                <ion-icon name="arrow-forward-outline"></ion-icon>
              </div>
              <div className="swiper-pagination"></div>
            </div>
          </Swiper>
        </div>

      </div>
    </div>
  );
}
