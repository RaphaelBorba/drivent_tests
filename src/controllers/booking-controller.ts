import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import  enrollmentRepository  from "@/repositories/enrollment-repository/index"


export async function getBooking(req: AuthenticatedRequest, res:Response){

    const {userId} = req

    const enrollment = enrollmentRepository.findWithAddressByUserId(userId)

    console.log(enrollment)

    if(!enrollment) return res.sendStatus(404)
}