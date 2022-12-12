import Header from "../components/Header";
import { getSession, useSession } from "next-auth/react";
import moment from "moment";
import db from "../../firebase";
import Order from "../components/Order";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Image from "next/image";
import logo from "../../public/image/logo.png"

function Admin() {
    const { data: session } = useSession();
    const [userList, setUserList] = useState();

    useEffect(() => {
        getData()
    }, []);

    async function getData() {
        const usersCollection = await db
            .collection("user-info")
            .get();

        const users = await Promise.all(
            usersCollection.docs.map(async (user) => ({
                email: user.id,
                username: user.data().username,
                role: user.data().role,
                enabled: user.data().enabled
            }))
        );
        setUserList(users)
    }


    async function updateUser(enable, email, role) {

        (role == "admin") ? role = "user" : role = "admin"

        await db.collection('user-info')
            .doc(email)
            .update({
                enabled: enable,
                role: role
            }).then(() => getData())
    }

    return (
        <div className="p-5 h-screenbg-amazon_blue-light grid place-items-center">

            <div className=" to-white flex justify-evenly w-1/3 mb-5">
                <Image src={logo} className="object-contain" />
            </div>
            <h1 className="text-xl mb-2 flex justify-center ">Administracion de usuarios</h1>

            <div className=" flex justify-center items-center mt-5">

                <div className="overflow-auto rounded-lg shadow ">
                    <table className="w-full bg-white">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                            <tr>
                                <th className="w-50 p-3 text-sm font-semibold tracking-wide text-left">Correo</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-left">Rol</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-left">Nombre de usuario</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-left">Acciones</th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-left"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {userList?.map(({ email, username, role, enabled }) => (
                                <tr>
                                    <td className="p-3 text-sm text-gray-700 whitesapce-nowrap">{email}</td>
                                    <td className="p-3 text-sm text-gray-700 whitesapce-nowrap">
                                        {(role == "admin") ?
                                            <span className="p-1.5 text-xs font-medium uppercase tracking-wider text-blue-700	 bg-cyan-500  rounded-lg bg-opacity-50">
                                                {role}
                                            </span> :
                                            <span className="p-1.5 text-xs font-medium uppercase tracking-wider text-yellow-800 bg-yellow-200 rounded-lg bg-opacity-50">
                                                {role}
                                            </span>}
                                    </td>
                                    <td className="p-3 text-sm text-gray-700 whitesapce-nowrap">{username}</td>
                                    <td className="p-3 text-sm text-gray-700 whitesapce-nowrap ">

                                        <button className={` p-1.5 text-xs font-medium uppercase tracking-wider 
                                        ${(email == session?.user.email) ? "text-neutral-500 bg-slate-300" : (enabled) ? "text-red-900 bg-red-400" : "text-emerald-800 bg-lime-600"} 
                                        rounded-lg bg-opacity-50`}
                                            type="button"
                                            onClick={() => {
                                                if (email !== session.user.email) { return updateUser(!enabled, email, role) }
                                            }}
                                        >
                                            {(enabled) ? "Deshabilitar cuenta" : "Habilitar cuenta"}
                                        </button>
                                    </td>
                                    <td className="p-3 text-sm text-gray-700 whitesapce-nowrap ">

                                        <button className={`p-1.5 text-xs font-medium uppercase tracking-wider ${(role == "user") ? "text-yellow-800 bg-yellow-200" : "text-blue-700 bg-cyan-500"} rounded-lg bg-opacity-50`}
                                            type="button"
                                            onClick={() => updateUser(enabled, email, role)}
                                        >
                                            {(role == "user") ? "Cambiar rol a administrador" : "Cambiar rol a usuario"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Admin;
