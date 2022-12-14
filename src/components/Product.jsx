import Image from "next/image";
import { useState } from "react";
import StarRating from "react-svg-star-rating";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";
import { addToBasket } from "../slices/basketSlice";

function Product({ id, title, category, description, image, price, rating }) {
  const dispatch = useDispatch();
  const [hasPrime] = useState(Math.random() < 0.5);
  const addItemToBasket = () => {
    const product = {
      id,
      title,
      category,
      description,
      image,
      price,
      rating,
      hasPrime
    };

    dispatch(addToBasket(product));
  };

  return (
    <div className="relative flex flex-col m-5 bg-white z-30 p-10">
      <p className="absolute top-2 right-2 text-xs italic text-gray-400">
        {category}
      </p>

      <Image src={image} height={200} width={200} objectFit="contain" />

      <h4 className="my-3">{title}</h4>

      <div className="flex items-center">
        <StarRating
          unit="float"
          count="5"
          size="20"
          activeColor="#ffa41c"
          innerRadius="20"
          initialRating={rating.rate}
          isReadOnly="true"
          containerClassName="flex h-5 "
          className="border border-yellow-700 "
        />
        <a className="text-[#007185] link ml-2 hover:text-[#c7511f] hover:no-underline">
          {rating.count}
        </a>
      </div>

      <p className="text-xs my-2 line-clamp-2">{description}</p>
      <div className="mb-4">
        <Currency quantity={price}
          currency="COP"
          pattern="! ##,### " 
          group="."
          locale="es_CO" />
      </div>

      {hasPrime && (
        <div className="flex items-center space-x-2 -mt-5">
          <p className="text-xs text-gray-500 my-3">Entrega GRATIS al día siguiente</p>
          <div className="w-12"/>
        </div>
      )}

      <button onClick={addItemToBasket} className="mt-auto button">
        Agregar al carrito
      </button>
    </div>
  );
}

export default Product;
