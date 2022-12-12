import { getSession, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import ProductFeed from "../components/ProductFeed";
import db from "../../firebase";
import Swal from 'sweetalert2'
import { useState, useEffect } from "react";

export default function Home({ products }) {
  const { data: session } = useSession();


  useEffect(() => {
    validateUser()
  }, []);

  async function validateUser() {

    if (session) {
      const authUser = await db.collection('user-info')
        .doc(session.user.email).get();

      if (!authUser.data().enabled) {
        return  Swal.fire({
          title: 'Error!',
          text: "Su cuenta actualmente se encuentra deshabilitada!",
          icon: 'error',
          confirmButtonColor: '#056DA0',
          confirmButtonText: 'Cerrar sesion',
          allowOutsideClick: false
        })
          .then((result) => (result) ? document.getElementById("cerrarSesion").click() : document.getElementById("cerrarSesion").click())
      }

    }
  }

  return (
    <div className="bg-amazon_blue-light">
      <Head>
        <title>Aloe Live</title>
      </Head>

      <main>
        <ProductFeed products={products} />
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  var session = await getSession(context)
  var role = "";

  if (session && session.user.image) {
    const existingUser = await db.collection('user-info')
      .doc(session.user.email).get();

    if (!existingUser.exists) {

      await db.collection('user-info')
        .doc(session.user.email)
        .set({
          username: session.user.name,
          role: "user",
          enabled:true
        })
    }
  }

  const productCollection = await db
    .collection("products")
    .get();

  const products = await Promise.all(
    productCollection.docs.map(async (product) => ({
      id: product.id,
      title: product.data().title,
      price: product.data().price,
      description: product.data().description,
      category: product.data().category,
      image: product.data().image,
      rating: product.data().rating
    }))
  );

  if (session) {
    const authUser = await db.collection('user-info')
    .doc(session.user.email).get();
    
    role = authUser.data().role;
    session = {
      ...session,
      role: role
    }

     /* if(!authUser.data().enabled){
      Swal.fire({
        title: 'Error!',
        text: "Su cuenta actualmente se encuentra deshabilitada!",
        icon: 'error',
        confirmButtonColor: '#056DA0',
        confirmButtonText: 'Cerrar sesion',
        allowOutsideClick: false
      })
      .then((result) => (result) ? signOut : signOut)
    }  */
    
  }
  return {
    props: {
      session,
      products
    },
  };
}
