import React from "react";
import Header from "../components/Header";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectItems, selectTotal } from "../slices/basketSlice";
import Currency from "react-currency-formatter";
import { useSession } from "next-auth/react";
import CheckoutProduct from "../components/CheckoutProduct";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe("pk_test_51Ko9jPJG12VEnZfiEzS4OvLwbuJZElF4fxGlA2BA5VqzJDYSa16WYgNUfdk5Z30qmRzQvOeJNlKbFBMSu54pIPM000iIGwN9P7");

function Checkout() {
  const items = useSelector(selectItems);
  const total = useSelector(selectTotal);
  const { data: session } = useSession();

  const createCheckoutSession = async () => {
    const stripe = await stripePromise;

    const checkoutSession = await axios.post("/api/create-checkout-session", {
      items: items,
      email: session.user.email,
    });

    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id,
    });

    if (result.error) alert(result.error.message);
  };

  return (
    <div className="bg-gray-100">
      <Header setText={null}/>

      <main className="lg:flex max-w-screen-2xl mx-auto">
        <div className="flex-grow m-5 shadow-sm">
          <Image
            src="https://img.freepik.com/fotos-premium/pancarta-ancha-sobre-fondo-azul-concepto-compras-linea-compras-ventas-pascua-vacaciones-bolsa-regalo-orejas-conejo-huevos-pascua-foto-alta-calidad_436767-261.jpg?w=2000"
            width={1050}
            height={260}
            objectFit="contain"

          />
          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4">
              {items.length != 0 ? "Tu carrito de compras" : "Carrito de compras"}
            </h1>
            {items.map((item, i) => (
              <CheckoutProduct
                key={i}
                id={item.id}
                title={item.title}
                description={item.description}
                category={item.category}
                image={item.image}
                price={item.price}
                rating={item.rating}
                hasPrime={item.hasPrime}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col bg-white p-10 shadow-md">
          {items.length > 0 && (
            <>
              <h2 className="whitespace-nowrap">
                Subtotal ({items.length} items):{" "}
                {/* <span className="font-bold"> */}

                {<Currency
                  currency="COP"
                  pattern="! ##,### "
                  group="."
                  locale="es_CO"
                  className="font-bold"
                  quantity={total}
                />}
                {/* </span> */}
              </h2>
              <button
                role="link"
                onClick={createCheckoutSession}
                disabled={!session}
                className={`button mt-2 ${!session &&
                  "from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed"
                  }`}
              >
                {!session ? "Iniciar sesión para pagar" : "Proceder al pago"}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Checkout;
