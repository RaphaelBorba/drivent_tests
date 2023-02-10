import { Router } from "express";
import {authenticateToken} from '@/middlewares/authentication-middleware'
import { getBooking } from "@/controllers/booking-controller";

const bookingRouter = Router()

bookingRouter
.get("/booking", authenticateToken, getBooking)