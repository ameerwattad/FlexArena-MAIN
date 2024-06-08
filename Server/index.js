import express from "express";

const app = express();
const port = 3000;
const PUBLISHABLE_KEY = "pk_test_1370KkDd7LEWuaI886nnZxQR";
const SECRET_KEY = "sk_test_1NEdQFJXrWhZaAbIMkeNl2C0";
import Stripe from 'stripe';
const stripe = Stripe(SECRET_KEY, {apiVersion:"2024-04-10" })

app.listen(port, () => {
console.log('Example app listening at http://localhost:${port}');

});

app.post("/create-payment-intent", async(req,res) =>{
try{
   const paymentIntent = await stripe.paymentIntents.create
({
    amount:1099,
    currency:"usd",
    payment_method_types:["card"],
});
    const clientSecret = paymentIntent.client_secret;
    res.json({
        clientSecret: clientSecret,
    });
}catch(e){
    console.log(e.message);
    res.json({error:e.message});
}
});
