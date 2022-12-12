import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function Banner() {
  return (
    <div className="relative">
      <div className="absolute w-full h-32 bg-gradient-to-t from-gray-100 to-transparent bottom-0 z-20" />
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showIndicators={false}
        showThumbs={false}
        interval={5000}
      >
        <div>
          <img loading="lazy" className="w-[1298px] h-[519px]" src="https://img.remediosdigitales.com/a24a73/depilacion-laser/1366_2000.jpeg" />
        </div>

        <div>
          <img loading="lazy" className="w-[1298px] h-[519px]" src="https://dirigentesdigital.com/multimedia/img/big/shutterstock-618714494_41-154438_20190429132438.jpg" />
        </div>

        <div>
          <img loading="lazy" className="w-[1298px] h-[519px]"  src="https://d1ih8jugeo2m5m.cloudfront.net/2021/11/productos-de-belleza-para-vender-4.jpg" />
        </div>
      </Carousel>
    </div>
  );
}

export default Banner;
