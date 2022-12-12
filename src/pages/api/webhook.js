import { buffer } from "micro";
import * as admin from "firebase-admin";

const serviceAccount = require("../../../permissions.json");

const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();

const stripe = require("stripe")("sk_test_51Ko9jPJG12VEnZfi4FQh6LNAaSwynItVwqWHr5egvbLgtYJAdAx2ZRXPaF1UpfFmTl6ZXQFBb7jLqUjoSQMkIPPq00HUcwOPvA");

const endpointSecret = "whsec_d9286f5adaebec4efc64e7b650b235767325d72abf5eaf1da78baec8df4cc4de";

const fulfillOrder = async (session) => {


  return app
    .firestore()
    .collection("user-orders")
    .doc(session.metadata.email)
    .collection("orders")
    .doc(session.id)
    .set({
      amount: session.amount_total / 100,
      amount_shipping: session.total_details.amount_shipping / 100,
      images: JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log(`SUCCESS: order ${session.id} added to DB`);
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });;
};

export default async (req, res) => {
  if (req.method === "POST") {
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      console.log("ERROR: ", error.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(event.type === "checkout.session.completed")

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      return fulfillOrder(session)
        .then(() => res.status(200))
        .catch((err) => res.status(400).send(`webhook Error: ${err.message}`));
    }
  }
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  },
};
