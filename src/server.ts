import express, { Request, Response } from "express";
import Stripe from "stripe";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const stripe = new Stripe(
  "sk_test_51PjEEdRr139V5pLekIe6HYDGiElRNwm70N5VkHqNX0eQF1Q5BErcwuHmZGLpTYgmp8UW8R4vlR0ozc1fHSEzUoMb001NOZv16S"
);
const PORT = 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.get("/", (request: Request, response: Response) => {
  response.status(200).send("Hello World");
});

app.post("/stripe-api/payment-sheet", async (req, res) => {
  const { amount } = req.body;

  if (!amount || typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2024-06-20" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: +amount * 100,
    currency: "brl",
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey:
      "pk_test_51PjEEdRr139V5pLehJoVuZdXmCIE4EvCsnkFOgIBlaaV02efykVaQvhNEZD9FyYA8Fv7eDMDKh0xTbJILqd7KK2y00LmIDts0C",
  });
});

app.listen(PORT, async () => {
  try {
    console.log(`Server is running.`);
  } catch (error) {
    console.error(error);
    throw new Error("Server error.");
  }
});

export default app;
