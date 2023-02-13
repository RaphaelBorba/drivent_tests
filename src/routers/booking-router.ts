import { Router } from "express";
import { authenticateToken } from '@/middlewares/authentication-middleware'
import { getBooking, postBooking } from "@/controllers/booking-controller";
import { validateBody } from "@/middlewares";
import { bookingSchema } from "@/schemas/booking-schema";

const bookingRouter = Router()

bookingRouter
    .all("/*", authenticateToken)
    .get("/", getBooking)
    .post("/", validateBody(bookingSchema), postBooking)

export { bookingRouter}