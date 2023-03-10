import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import enrollmentRepository from "@/repositories/enrollment-repository/index"
import ticketRepository from '@/repositories/ticket-repository'
import { getBookingDB, postBookingDB, updateBooking } from "@/repositories/booking-repository";
import hotelRepository from "@/repositories/hotel-repository";
import { checkIfRoomIsFull } from "@/services/booking-service";


export async function getBooking(req: AuthenticatedRequest, res: Response) {

    const { userId } = req

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)

    if (!enrollment) return res.sendStatus(404)

    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id)

    if (!ticket) return res.sendStatus(404)

    if (ticket.TicketType.isRemote === true) res.sendStatus(400)

    const booking = await getBookingDB(userId)

    if (!booking) return res.sendStatus(404)

    res.status(200).send(booking)

}

export async function postBooking(req: AuthenticatedRequest, res: Response) {

    const { userId } = req

    const room = await hotelRepository.getRoomById(req.body.roomId)

    if (!room) return res.sendStatus(404)

    if (await checkIfRoomIsFull(req.body.roomId)) return res.sendStatus(403)

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)

    if (!enrollment) return res.sendStatus(403)

    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id)

    if (!ticket) return res.sendStatus(403)

    if (ticket.status !== 'PAID') return res.sendStatus(403)

    if (ticket.TicketType.isRemote === true) res.sendStatus(403)

    try {

        const book = await postBookingDB(userId, req.body.roomId)

        res.status(200).send({bookingId: book.id})

    } catch (error) {
        res.sendStatus(500)

    }
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {

    const { userId } = req

    const { roomId } = req.body

    const room = await hotelRepository.getRoomById(req.body.roomId)

    if (!room) return res.sendStatus(404)

    if (await checkIfRoomIsFull(req.body.roomId)) return res.sendStatus(403)

    const booking = await getBookingDB(userId)

    if (!booking) return res.sendStatus(403)

    try {

        const newBooking = await updateBooking(booking.id, roomId)
        console.log(newBooking)
        res.status(200).send({bookingId: newBooking.id})

    } catch (error) {
        res.sendStatus(500)
    }
}