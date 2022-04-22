const request = require("supertest");
const { query } = require("../db-connection");
const app = require("../src/app");

const user = {
  firstname: "Xave",
  lastname: "Gere",
  tel_number: "0123456789",
  email: "test@gmail.com",
  club_role: "member",
  website_admin: 0,
};

describe("app", () => {
  beforeAll(async () => {
    let sql = "SET FOREIGN_KEY_CHECKS=0";
    await query(sql);
    sql = "TRUNCATE TABLE user";
    await query(sql);
    sql = "SET FOREIGN_KEY_CHECKS=1";
    await query(sql);
  });

  it("GETs /api/users/ and should obtain []", async () => {
    expect.assertions(1);
    const res = await request(app).get("/api/users/").expect(200);
    expect(res.body.length).toEqual(0);
  });

  xit("POSTs /api/users/ and should obtain { id:1, firstname: 'Xave', lastname: 'Gere', email: 'test@gmail.com', club_role: 'member' , website_admin: 0}", async () => {
    expect.assertions(2);
    const res = await request(app).post("/api/users/").send(user).expect(201);
    expect(res.body.id).toEqual(1);
    expect(res.body.firstname).toEqual("Xave");
  });

  xit("GETs /api/users/1 and should obtain { id:1, firstname: 'Xave', lastname: 'Gere', email: 'test@gmail.com' club_role: 'member' , website_admin: 0}", async () => {
    expect.assertions(2);
    const res = await request(app).get("/api/users/1").expect(200);
    expect(res.body.id).toEqual(1);
    expect(res.body.lastname).toEqual("Gere");
  });
});
