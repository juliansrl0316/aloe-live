import { useState } from "react";
import Image from "next/image";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useSelector } from "react-redux";
import { selectItems } from "../slices/basketSlice";
import logo from "../../public/image/logo.png"
import { Router, useRouter } from "next/router";

function Header(props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const items = useSelector(selectItems);

  let inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  if (props.setText != undefined) {
    props.setText(inputText)
  }

  return (
    <div>
      <div className="flex items-center bg-amazon_blue p1 flex-grow py-2">
        <div className=" flex items-center flex-grow sm:flex-grow-0 object-contain">
          <Image
            onClick={() => router.push("/")}
            src={logo}
            width={150}
            height={40}
            className="cursor-pointer"
          />
        </div>

        <div className="hidden sm:flex items-center h-10 rounded-md flex-grow cursor-pointer bg-amazon_blue-base hover:bg-amazon_blue-hover">
          <input
            type="text"
            className="p-2 h-full w-6 flex-grow flex-shrink rounded-l-md focus:outline-none px-4"
            onChange={inputHandler}
          />
          <MagnifyingGlassIcon className="h-12 p-4" />
        </div>



        <div className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap">
          <div onClick={!session ? signIn : null} className={ `${!session ? "link" : ""}` } >
            <p /* className={`${session ? "" : "font-extrabold md:text-sm"}`}  */>Bienvenido</p>
            <p className={`${session ? "font-extrabold md:text-sm" : "font-extrabold md:text-sm"}`} >{session ? `${session.user.name}` : "Iniciar sesion"}</p>
          </div>

          <div onClick={session ? signOut : ""} className="link" id="cerrarSesion">
            <p>{session ? `Cerrar` : <></>}</p>
            <p className="font-extrabold md:text-sm">{session ? "sesion" : <></>}</p>
          </div>

          {
          (session?.role && session.role == "admin") ?
            <div onClick={() => session?.role ? router.push("/admin") : <></>} className="link">
              <p>Panel de</p>
              <p className="font-extrabold md:text-sm">administracion</p>
            </div> : <></>
            }


          <div className="link" onClick={() => router.push("/orders")}>
            <p>Devolucion</p>
            <p className="font-extrabold md:text-sm">& Ordenes</p>
          </div>

          <div
            onClick={() => router.push("/checkout")}
            className="relative link flex items-center"
          >
            <span className="absolute top-0 right-0 md:right-10 h-4 w-4 bg-amazon_blue-hover text-center rounded-full text-white font-bold">
              {items.length}
            </span>
            <ShoppingCartIcon className="h-10" />
            <p className="hidden md:inline font-extrabold md:text-sm mt-2">
              Carrito
            </p>
          </div>
        </div>
      </div>

      {/* <div className="flex items-center space-x-3 p-2 pl-6 bg-amazon_blue-light text-neutral-500 text-sm relative ">
        <p className="link flex items-center">
          <MenuIcon className="h-6 mr-1" />
          All
        </p>
        <p className="link">Masajes</p>
        <p className="link ">Depilacion</p>
        <p className="link ">Limpieza</p>
        <p className="link ">Belleza</p>
        <p className="link hidden lg:inline-flex">Tratamientos</p>
        <p className="link hidden lg:inline-flex">Lociones</p>
        <p className="link hidden lg:inline-flex">Cremas</p>
        <p className="link hidden lg:inline-flex">Fajas</p>
      </div> */}
    </div>
  );
}

export default Header;
