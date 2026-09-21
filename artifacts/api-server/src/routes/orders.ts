import { Router, type IRouter } from "express";
import { CreateOrderBody, CreateOrderResponse } from "@workspace/api-zod";
import { products } from "./catalog";

const router: IRouter = Router();

router.post("/orders", (req, res) => {
  const input = CreateOrderBody.parse(req.body);
  const total = input.items.reduce((sum, item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const order = CreateOrderResponse.parse({
    id: `FC-${Math.floor(100000 + Math.random() * 900000)}`,
    status: "confirmed",
    total,
    eta: "20–30 min",
    paymentMethod: input.paymentMethod,
  });

  res.status(201).json(order);
});

export default router;