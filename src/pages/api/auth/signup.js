import db from "../../../../firebase"
import { hash } from "bcryptjs"

export default async function handler(req, res) {


    if (req.method === 'POST') {

        if (!req.body) return res.status(404).json({ error: "No hay datos...!" });
        const { username, email, password } = req.body;

        const existingUser = await db.collection('user-info')
            .doc(email).get();

        if (!existingUser.exists) {

            return await db.collection('user-info')
                .doc(email)
                .set({
                    password: await hash(password, 12),
                    username: username,
                    role: "user",
                    enabled:true
                })
                .then(() => {
                    res.status(201).json({ status: true })
                })
                .catch((error) => {
                    res.status(404).json({ error });
                });
        } else {
            return res.status(422).json({ message: "El correo electronico ya se encuentra registado!" });
        }


    } else {
        res.status(500).json({ message: "Solo se acepta el metodo POST" })
    }

}