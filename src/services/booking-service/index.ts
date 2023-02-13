import { prisma } from "@/config";


export async function checkIfRoomIsFull(roomId:number){

    const bookings = await prisma.booking.findMany({
        where:{
            roomId
        }
    })
    const room = await prisma.room.findFirst({
        where:{
            id:roomId
        }
    })
    if(bookings.length >= room.capacity){
        return true
    }
    return false
}