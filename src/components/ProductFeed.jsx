import Product from "./Product";
import Header from "./Header";
import Banner from "./Banner";
import db from "../../firebase";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Swal from 'sweetalert2'

function ProductFeed({ products }) {
  const [inputText, setInputText] = useState("");
  const { data: session } = useSession();
  const filterData = (text) => setInputText(text)

/*   useEffect(() => {
    validateUser()
  }, []); */


  const filteredProducts = products.filter((elemente) => {
    if (inputText.trim() === "") {
      return elemente;
    }
    else {
      return elemente.title.toLowerCase().includes(inputText)
    }
  })

   /* async function validateUser() {

    if (session) {
      const authUser = await db.collection('user-info')
        .doc(session.user.email).get();

      if (!authUser.data().enabled) {
        return Swal.fire({
          title: 'Error!',
          text: "Su cuenta actualmente se encuentra deshabilitada!",
          icon: 'error',
          confirmButtonColor: '#056DA0',
          confirmButtonText: 'Cerrar sesion',
          allowOutsideClick: false
        })
        .then((result) => (result) ? signOut : signOut)
      }

    } 
    }*/


  return (
    <div>
      <Header setText={filterData} />
      <main className="max-w-screen-2xl mx-auto">
        <Banner />

        <div className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:-mt-52 mx-auto ">
          {
            filteredProducts.length > 0 ?
              filteredProducts
                .map(({ id, title, description, category, image, price, rating }) => (
                  <Product
                    key={id}
                    id={id}
                    title={title}
                    description={description}
                    category={category}
                    image={image}
                    price={price}
                    rating={rating}
                  />
                ))
              :
              products
                .map(({ id, title, description, category, image, price, rating }) => (
                  <Product
                    key={id}
                    id={id}
                    title={title}
                    description={description}
                    category={category}
                    image={image}
                    price={price}
                    rating={rating}
                  />
                ))
          }
        </div>
      </main>
    </div>
  );
}

export default ProductFeed;
