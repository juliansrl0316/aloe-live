import Head from 'next/head'
import Layout from "../../layout/layout";
import Link from "next/link";
import { AtSymbolIcon, EyeIcon, EyeSlashIcon, UserIcon } from "@heroicons/react/24/outline";
import { useState } from 'react';
import { signIn, signOut } from "next-auth/react"
import { useFormik } from "formik";
import { useRouter } from 'next/router';

export default function Register() {

    const [show, setShow] = useState(false)
    const router = useRouter()
    const [formComplete, setFormComplete] = useState(false)
    const [showCP, setShowCP] = useState(false)
    const [saveError, setSaveError] = useState()

    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            cpassword: ""
        },
        validate: registerValidate,
        onSubmit
    })

    async function onSubmit(values) {
        const options = {
            method: "POST",
            mode: "cors",
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(values)
        }

        await fetch(`https://aloe-live.vercel.app/api/auth/signup`, options)
            .then(res => res.json().then(data => ({
                data: data,
                status: res.status,
                ok: res.ok
            })))
            .then((res) => {
                if (res.status == 201 && res.ok == true) {
                    signIn('credentials', {
                        redirect: false,
                        email: values.email,
                        password: values.password,
                        callbackUrl: `${process.env.HOST}`
                    }).then(res => {
                        router.push(res.url)
                    })
                } else {
                    setSaveError(res.data.message)
                }
            })
    }

    function registerValidate(values) {
        const errors = {};

        if (formComplete) {
            if (!values.username) {
                errors.username = "* El nombre de usuario es obligatorio";
            } else if (values.username.includes(" ")) {
                errors.username = "nombre de usuario invalido...!"
            }

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

            if (!values.cpassword) {
                errors.cpassword = "* Este campo es obligatorio";
            } else if (values.password !== values.cpassword) {
                errors.cpassword = "* La contraseña no coincide...!"
            } else if (values.cpassword.includes(" ")) {
                errors.cpassword = "* Confirmacion de contraseña invalida"
            }
        }

        return errors;
    }

    return (
        <div>
            <Head>
                <title>Register</title>
            </Head>
            <Layout>

                <section className='w-3/4 mx-auto flex flex-col gap-10'>
                    <div className="title">
                        <h1 className="test-gray-800 text-4xl font-bold py-4">Registro</h1>
                        <p className='w-3/4 mx-auto text-gray-400'>¿Que esperas para hacer parte de la comunidad Aloe Live?</p>
                    </div>

                    <form className='flex flex-col ' onSubmit={formik.handleSubmit}>
                        <div className="input_group">
                            <input
                                type="text"
                                name='username'
                                placeholder='Nombre de usuario'
                                className="input_text"
                                {...formik.getFieldProps("username")}

                            />
                            <UserIcon className="icon flex items-center px-4 w-16" />
                        </div>
                        {formik.errors.username ? <p className='text-left text-xs text-rose-500 mt-1'>{formik.errors.username}</p> : <></>}
                        <div className="input_group mt-4">
                            <input
                                type="email"
                                name='email'
                                placeholder='Correo'
                                className="input_text"
                                {...formik.getFieldProps("email")}

                            />

                            <AtSymbolIcon className="icon flex items-center px-4 w-16" />
                        </div>
                        {formik.errors.email ? <p className='text-left text-xs text-rose-500 mt-1'>{formik.errors.email}</p> : <></>}
                        <div className="input_group  mt-4">
                            <input
                                type={`${show ? "text" : "password"}`}
                                name='password'
                                placeholder='Contraseña'
                                className="input_text"
                                {...formik.getFieldProps("password")}

                            />
                            <span onClick={() => setShow(!show)} className="icon flex items-center px-4 w-16">
                                {show ? <EyeSlashIcon className="cursor-pointer" /> : <EyeIcon className="cursor-pointer" />}
                            </span>
                        </div>
                        {formik.errors.password ? <p className='text-left text-xs text-rose-500 mt-1'>{formik.errors.password}</p> : <></>}

                        <div className="input_group  mt-4">
                            <input
                                type={`${showCP ? "text" : "password"}`}
                                name='cpassword'
                                placeholder='Confirmar contraseña'
                                className="input_text"
                                {...formik.getFieldProps("cpassword")}
                            />
                            <span onClick={() => setShowCP(!showCP)} className="icon flex items-center px-4 w-16">
                                {showCP ? <EyeSlashIcon className="cursor-pointer" /> : <EyeIcon className="cursor-pointer" />}
                            </span>
                        </div>
                        {formik.errors.cpassword ? <p className='text-left text-xs text-rose-500 mt-1'>{formik.errors.cpassword}</p> : <></>}

                        {saveError ? <p className='text-left text-md text-rose-500 mt-1'>{saveError}</p> : <></>}
                        <button className="w-full button mt-4" type="submit" onClick={() => setFormComplete(true)}>
                            Crear cuenta
                        </button>

                    </form>

                    <div className='text-center'>
                        ¿Ya tienes una cuenta? <Link href={'/auth/login'}><a className="text-blue-700 underline">Inicia sesion</a>
                        </Link>
                    </div>
                </section>
            </Layout>
        </div>

    )
}