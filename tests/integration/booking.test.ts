import app, { init } from "@/app";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
    createBookingWithRoomIdAndUserId,
    createTicketTypeRemote,
    createEnrollmentWithAddress,
    createHotel,
    createRoomWithHotelId,
    createTicket,
    createTicketTypeWithHotel,
    createUser,
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

const server = supertest(app)

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

describe("GET /booking", () => {

    it("should respond with status 401 if no token is given", async () => {
        const response = await server.get("/hotels");

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if given token is not valid", async () => {
        const token = faker.lorem.word();

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is no session for given token", async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("Token is valid", () => {

        it("should respond with 404 if user don't have an enrollment", async () => {

            const user = await createUser()
            const token = await generateValidToken(user)

            const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404)

        })
        it("should respond with 404 if user don't have an ticket", async () => {

            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user);

            const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404)

        })
        it("should respond with 400 if ticket is remote", async () => {

            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

            const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
            
            expect(response.status).toBe(400)

        })
        it("should respond with 404 if user doesn't have book", async () => {

            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const createdHotel = await createHotel();
            const createdRoom = await createRoomWithHotelId(createdHotel.id);
            
            const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
            
            expect(response.status).toBe(404)

        })

        it("should respond with 200 and body if valid information", async () => {

            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const createdHotel = await createHotel();
            const createdRoom = await createRoomWithHotelId(createdHotel.id);
            const createdBooking = await createBookingWithRoomIdAndUserId(createdRoom.id, user.id)
            
            const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
            
            expect(response.status).toBe(200)

        })


    })
})

/*             
            const user = await createUser()
            const token = await generateValidToken(user)
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const response = await server.get("/booking").set("Authorization", `Bearer ${token}`); 
            const createdBooking = await createBookingWithRoomIdAndUserId(createdRoom.id, user.id)
            
            
*/