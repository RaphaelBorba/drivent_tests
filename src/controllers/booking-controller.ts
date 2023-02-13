import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import enrollmentRepository from "@/repositories/enrollment-repository/index"
import ticketRepository from '@/repositories/ticket-repository'
import { getBookingDB } from "@/repositories/booking-repository";


export async function getBooking(req: AuthenticatedRequest, res: Response) {

    const { userId } = req

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)

    if (!enrollment) return res.sendStatus(404)

    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id)

    if (!ticket) return res.sendStatus(404)

    if (ticket.TicketType.isRemote === true) res.sendStatus(400)



    try {
        const booking = await getBookingDB(userId)

        if (!booking) return res.sendStatus(404)
        console.log(booking)
        res.status(200).send(booking)

    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
}