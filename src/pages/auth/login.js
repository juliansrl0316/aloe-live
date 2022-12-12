import Head from "next/head";
import Layout from "../../layout/layout";
import Link from "next/link";
import Image from "next/image";
import { AtSymbolIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react"
import { useFormik } from "formik";
import { useRouter } from 'next/router';
import Swal from 'sweetalert2'

export default function Login() {

    const router = useRouter()
    const [show, setShow] = useState(false)
    const [loginError, setLoginError] = useState()
    const [formComplete, setFormComplete] = useState(false)


    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validate: loginValidate,
        onSubmit
    })

    async function onSubmit(values) {

        await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
            callbackUrl: `http://localhost:3000`
        }).then(res => {
            if (res.status == 200 && res.ok == true && res.error == null) {
                router.replace(res.url)
            } else {
                if(res.error == "Su cuenta actualmente se encuentra deshabilitada!"){
                    Swal.fire({
                        title: 'Error!',
                        text: res.error,
                        icon: 'error',
                        confirmButtonColor: '#056DA0',
                        confirmButtonText: 'Ok',
                      })
                }else{
                    setLoginError(res.error)    
                }
                
            }
        })

    }

    async function handleGoogleSignIn() {
        signIn('google', { callbackUrl: `http://localhost:3000` })
    }

    function loginValidate(values) {
        const errors = {};

        if (formComplete) {
            if (!values.email) {
                errors.email = '* El correo es obligatorio';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = '* Correo invalido';
            }

            if (!values.password) {
                errors.password = "* La contraseña es obligatorio";
            } else if (values.password.length < 8) {
                errors.password = "* La contraseña debe ser mayor a 8 caracteres";
            } else if (values.password.includes(" ")) {
                errors.password = "* Contraseña invalida";
            }
        }

        return errors;

    }


    return (
        <div>
            <Head>
                <title> Login </title>
            </Head>
            <Layout>

                <section className="w-3/4 mx-auto flex flex-col gap-10">
                    <div className="title">
                        <h1 className="test-gray-800 text-4xl font-bold py-4">Iniciar sesion </h1>
                        <p className="w-3/4 mx-auto text-gray-400">¡Bienvenido de vuelta!</p>
                        <p className="w-3/4 mx-auto text-gray-400">Por favor inicia sesion con tu cuenta de Aloe Live </p>
                    </div>

                    <form className="flex flex-col" onSubmit={formik.handleSubmit}>
                        <div className="input_group">
                            <input type="email"
                                name="email"
                                placeholder="Correo"
                                className="input_text"
                                {...formik.getFieldProps("email")}
                            />

                            <AtSymbolIcon className="icon flex items-center px-4 w-16 bg-white" />

                        </div>
                        {formik.errors.email ? <p className='text-left text-xs text-rose-500 mt-1'>{formik.errors.email}</p> : <></>}
                        <div className="input_group mt-4">
                            <input type={`${show ? "text" : "password"}`}
                                name="password"
                                placeholder="Contraseña"
                                className="input_text"
                                {...formik.getFieldProps("password")}
                            />
                            <span onClick={() => setShow(!show)} className="icon flex items-center px-4 w-16 bg-white">
                                {show ? <EyeSlashIcon className="cursor-pointer" /> : <EyeIcon className="cursor-pointer" />}
                            </span>
                        </div>

                        {formik.errors.password ? <p className='text-left text-xs text-rose-500 mt-1'>{formik.errors.password}</p> : <></>}
                        {loginError ? <p className='text-left text-md text-rose-500 mt-1'>{loginError}</p> : <></>}

                        <button className="w-full button mt-4" type="submit" onClick={() => setFormComplete(true)}>Iniciar sesion</button>

                        <button type="button" onClick={handleGoogleSignIn} className="w-full button_custom mt-4">Iniciar sesion con Google <Image src={"https://freesvg.org/img/1534129544.png"} width={20} height={20} /> </button>

                    </form>
                    <div className="text-center ">
                        ¿No tienes cuenta? <Link href={"/auth/register"} ><a className="text-blue-700 underline">Registrate</a></Link>
                    </div>
                </section>
            </Layout>

        </div>
    );
}