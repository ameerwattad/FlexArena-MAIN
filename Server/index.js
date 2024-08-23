import express from "express";
import Stripe from 'stripe';

const app = express();
const port = 3000;
const PUBLISHABLE_KEY = "pk_test_1370KkDd7LEWuaI886nnZxQR";
const SECRET_KEY = "sk_test_1NEdQFJXrWhZaAbIMkeNl2C0";
const stripe = Stripe(SECRET_KEY, { apiVersion: "2024-04-10" });

app.use(express.json()); // Middleware to parse JSON request bodies

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body; // Receive amount from the request body

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    const clientSecret = paymentIntent.client_secret;
    res.json({
      clientSecret: clientSecret,
    });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
});
