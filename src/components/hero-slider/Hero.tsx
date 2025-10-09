import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Ahora que los archivos existen, estos imports funcionarán
import slide01 from "../../assets/slide-ac-01.jpg";
import slide02 from "../../assets/slide-ac-02.jpg";
import slide03 from "../../assets/slide-ac-03.jpg";

interface SlideData {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
}

const slideImages: SlideData[] = [
  {
    src: slide01.src,
    alt: "Auto de lujo en la carretera",
    title: "Encuentra el auto perfecto para ti",
    subtitle: "Te asesoramos en la compra y venta de tu auto.",
  },
  {
    src: slide02.src,
    alt: "Mujer recibiendo llaves de auto",
    title: "Calidad y Confianza Garantizada",
    subtitle: "Vehículos seleccionados y revisados por expertos.",
  },
  {
    src: slide03.src,
    alt: "Llaves de auto en mano de vendedor",
    title: "Financiamiento a tu Medida",
    subtitle: "Obtén el mejor crédito automotriz con nuestros partners.",
  },
];

const HeroSlider: React.FC = () => {
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .swiper-button-next,
      .swiper-button-prev {
        color: #20B3C2 !important; /* Color personalizado */
      }
      .swiper-pagination-bullet-active {
        background: #20B3C2 !important; /* Color personalizado */
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <section className="hero-section my-14 py-8 sm:py-12 lg:py-16 relative overflow-hidden">
      <div className="md:w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          speed={1000}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          navigation={true}
          pagination={{ clickable: true, dynamicBullets: true }}
          className="w-full h-full"
        >
          {slideImages.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-80 sm:h-96 md:h-[450px] lg:h-[500px] overflow-hidden rounded-[20px] sm:rounded-[30px] lg:rounded-[50px]">
                <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-black/50 flex items-center rounded-[20px] sm:rounded-[30px] lg:rounded-[50px]">
                  <div className="container mx-auto px-12 sm:px-8 lg:px-[130px]">
                    <div className="max-w-full sm:max-w-2xl lg:max-w-3xl text-white">
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-4 sm:mb-6 lg:mb-8 leading-relaxed opacity-90">
                        {slide.subtitle}
                      </p>
                      
                      {/* --- BOTÓN ACTUALIZADO --- */}
                      <a
                        href="/catalogo"
                        className="group inline-flex items-center justify-center px-8 py-3 bg-ac-blue text-white font-bold text-base rounded-full shadow-lg hover:shadow-xl hover:scale-105 hover:brightness-110 transition-all duration-300 transform"
                      >
                        Ver Stock
                        <svg
                          className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          ></path>
                        </svg>
                      </a>
                      {/* --- FIN DEL BOTÓN --- */}

                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HeroSlider;