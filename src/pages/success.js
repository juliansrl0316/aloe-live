import Header from "../components/Header";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";

function success() {
  const router = useRouter();

  return (
    <div className="bg-gray-100 h-screen">
      <Header />
      <main className="max-w-screen-lg mx-auto  ">
        <div className="grid place-items-center p-10 bg-white">
          <div className="flex items-center space-x-2 mb-5 ">
            <CheckCircleIcon className="text-green-500 h-10 " />
            <h1 className="text-3xl">
              Gracias, su pedido ha sido confirmado.
            </h1>
          </div>
          <p>
            Gracias por comprar con nosotros. Le enviaremos una confirmación de que los artículos se han enviado,
            si desea verificar el estado de su(s) pedido(s), presione el enlace a continuación
          </p>
          <button
            onClick={() => router.push("/orders")}
            className="button mt-8"
          >
            Ir a mis pedidos
          </button>
        </div>
      </main>
    </div>
  );
}

export default success;
