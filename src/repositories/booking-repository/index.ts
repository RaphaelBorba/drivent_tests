import { prisma } from "@/config";


export async function getBookingDB(userId:number) {
    
    return prisma.booking.findFirst({
        where:{userId},
        include:{
            Room: true
        }
    })
}