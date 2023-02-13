import { Router } from "express";
import { authenticateToken } from '@/middlewares/authentication-middleware'
import { getBooking, postBooking, putBooking } from "@/controllers/booking-controller";
import { validateBody } from "@/middlewares";
import { bookingSchema } from "@/schemas/booking-schema";

const bookingRouter = Router()

bookingRouter
    .all("/*", authenticateToken)
    .get("/", getBooking)
    .post("/", validateBody(bookingSchema), postBooking)
    .put("/:bookingId", validateBody(bookingSchema), putBooking)

export { bookingRouter}