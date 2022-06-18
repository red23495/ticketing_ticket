import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import Ticket from "../../model/ticket";

describe("testing ticket creation endpoint", () => {
  it("allows post requests on /api/tickets", async () => {
    const response = await request(app).post("/api/tickets/").send();
    expect(response.statusCode).not.toEqual(404);
  });
  it("can only be accessed if user is signed in", async () => {
    await request(app)
      .post("/api/tickets/")
      .send({
        title: "adsas",
        price: 10,
      })
      .expect(403);
    const response = await request(app)
      .post("/api/tickets/")
      .set("Cookie", global.get_cookie())
      .send({
        title: "adsas",
        price: 10,
      });
    expect(response.statusCode).not.toEqual(403);
  });
  it("returns an error if invalid title is provided", async () => {
    await request(app)
      .post("/api/tickets/")
      .set("Cookie", global.get_cookie())
      .send({
        title: "",
        price: 10,
      })
      .expect(400);
    await request(app)
      .post("/api/tickets/")
      .set("Cookie", global.get_cookie())
      .send({
        price: 10,
      })
      .expect(400);
  });
  it("returns an error if invalid price is provided", async () => {
    await request(app)
      .post("/api/tickets/")
      .set("Cookie", global.get_cookie())
      .send({
        title: "adsas",
        price: -10,
      })
      .expect(400);
    await request(app)
      .post("/api/tickets/")
      .set("Cookie", global.get_cookie())
      .send({
        title: "asdas",
      })
      .expect(400);
  });
  it("creates a ticket with valid inputs", async () => {
    await request(app)
      .post("/api/tickets/")
      .set("Cookie", global.get_cookie())
      .send({
        title: "new ticket",
        price: 100,
      })
      .expect(201);
    expect((await Ticket.find({})).length).toEqual(1);
  });
});

describe("Testing show api", () => {
  it("throws 404 when ticket id is not valid", async () => {
    request(app).get("/api/tickets/asdsadasdas").send().expect(404);
  });
  it("returns ticket when id is valid", async () => {
    const title = "new item";
    const price = 10;
    const userId = new mongoose.Types.ObjectId().toHexString();
    const ticket = await Ticket.build({ title, price, userId }).save();
    const response = await request(app)
      .get(`/api/tickets/${ticket.id}/`)
      .send()
      .expect(200);
    expect(response.body.id).toEqual(ticket.id);
    expect(response.body.price).toEqual(price);
    expect(response.body.title).toEqual(title);
    expect(response.body.userId).toEqual(userId);
  });
});

async function createTicket() {
  const id = new mongoose.Types.ObjectId().toHexString();
  return await Ticket.build({ title: "A", price: 10, userId: id }).save();
}

describe("testing index api", () => {
  it("returns all tickets", async () => {
    await createTicket();
    await createTicket();
    await createTicket();
    const response = await request(app).get("/api/tickets/").send().expect(200);
    expect(response.body.length).toEqual(3);
  });
});

describe("testing update api", () => {
  it("returns 403 if user not authorized", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
      .put(`/api/tickets/${id}/`)
      .send({ title: "updated title", price: 20 })
      .expect(403);
  });
  it("returns 404 if ticket not valid", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    request(app)
      .put(`/api/tickets/${id}`)
      .set("Cookie", global.get_cookie())
      .send()
      .expect(404);
  });
  it("returns 403 if user not ticket owner", async () => {
    const ticket = await createTicket();
    const response = await request(app)
      .put(`/api/tickets/${ticket.id}`)
      .send({ title: "updated title", price: 20 })
      .expect(403);
  });
  it("returns 400 if price invalid", async () => {
    const cookie = global.get_cookie();
    const response = await request(app)
      .post("/api/tickets/")
      .set("Cookie", cookie)
      .send({
        title: "new ticket",
        price: 100,
      });
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ title: "updated title", price: -20 })
      .expect(400);
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ title: "updated title" })
      .expect(400);
  });
  it("returns 400 if title invalid", async () => {
    const cookie = global.get_cookie();
    const response = await request(app)
      .post("/api/tickets/")
      .set("Cookie", cookie)
      .send({
        title: "new ticket",
        price: 100,
      });
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ title: "", price: 20 })
      .expect(400);
    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ price: 20 })
      .expect(400);
  });
  it("returns updated ticket if input valid", async () => {
    const cookie = global.get_cookie();
    const title = "Updated Title";
    const price = 20;
    const response = await request(app)
      .post("/api/tickets/")
      .set("Cookie", cookie)
      .send({
        title: "new ticket",
        price: 100,
      });
    const ticketResponse = await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ title, price })
      .expect(200);
    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
  });
});
