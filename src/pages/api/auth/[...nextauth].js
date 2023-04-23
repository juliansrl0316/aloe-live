import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials"
import { FirestoreAdapter } from "@next-auth/firebase-adapter"
import { compare } from 'bcryptjs';
import db from "../../../../firebase";

export default NextAuth({
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    GoogleProvider({
      clientId: "490212316937-rtc0uphs0t9smkvfvdm05rj7dv6nlunc.apps.googleusercontent.com",
      clientSecret: "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"
    }),
    CredentialProvider({
      id: 'credentials',
      type: "credentials",
      name: "credentials",
      async authorize(credentials, req) {

        const existingUser = await db.collection('user-info')
          .doc(credentials.email)
          .get();

        if (existingUser.exists) {

          if(!existingUser.data().enabled){
            throw new Error("Su cuenta actualmente se encuentra deshabilitada!")
          }

          const password = existingUser.data().password
          const username = existingUser.data().username
          const role = existingUser.data().role

          const checkPassword = await compare(credentials.password, password);


          if (!checkPassword || existingUser.id !== credentials.email) {
            throw new Error("La contraseña es incorrecta");
          }

          const user = {
            email: existingUser.id,
            name: username,
            role: role
          }

          return user;

        } else {
          throw new Error("No hay ningun usuario registrado con ese email, por favor registrese...!")
        }

      },
    })
  ],
  secret: "BHeLbiWrEcAjHd7FGyXrAVzgJDP3xkB75Q+RjMS0hNw=",

})