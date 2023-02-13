import { prisma } from "@/config";


export async function getBookingDB(userId:number) {
    
    return prisma.booking.findFirst({
        where:{userId},
        include:{
            Room: true
        }
    })
}

export async function postBookingDB(userId: number, roomId:number){

    return prisma.booking.create({
        data:{
            roomId,
            userId
        }
    })
}