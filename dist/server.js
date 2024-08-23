"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const stripe = new stripe_1.default("sk_test_51PjEEdRr139V5pLekIe6HYDGiElRNwm70N5VkHqNX0eQF1Q5BErcwuHmZGLpTYgmp8UW8R4vlR0ozc1fHSEzUoMb001NOZv16S");
const PORT = 3000;
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (request, response) => {
    response.status(200).send("Hello World");
});
app.post("/payment-sheet", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount } = req.body;
    if (!amount || typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
    }
    // Use an existing Customer ID if this is a returning customer.
    const customer = yield stripe.customers.create();
    const ephemeralKey = yield stripe.ephemeralKeys.create({ customer: customer.id }, { apiVersion: "2024-06-20" });
    const paymentIntent = yield stripe.paymentIntents.create({
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
        publishableKey: "pk_test_51PjEEdRr139V5pLehJoVuZdXmCIE4EvCsnkFOgIBlaaV02efykVaQvhNEZD9FyYA8Fv7eDMDKh0xTbJILqd7KK2y00LmIDts0C",
    });
}));
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`Server is running.`);
    }
    catch (error) {
        console.error(error);
        throw new Error("Server error.");
    }
}));
exports.default = app;
