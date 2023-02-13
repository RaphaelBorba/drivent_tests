import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import  enrollmentRepository  from "@/repositories/enrollment-repository/index"


export async function getBooking(req: AuthenticatedRequest, res:Response){

    const {userId} = req

    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId)

    if(!enrollment) return res.sendStatus(404)

    res.send(200)
}