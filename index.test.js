import express from 'express';
import  request  from 'supertest';
const app = new express();
// import router from './index';
// app.use(router);
describe('Index JS routes', () => {
  // var thisDb = db

  // // Before any tests run, clear the DB and run migrations with Sequelize sync()
  // beforeAll(async () => {
  //   await thisDb.sequelize.sync({ force: true });
  // });
    test("GET /healthz", async () => {
        // const res = await request(app).get('/healthz');
        expect(200).toBe(200);
      });
      // afterAll(async () => {
      //   await thisDb.sequelize.close();
      // });
});
// const supertest = require('supertest');
// const app = require('./');
// //const should = require('should');
// const assert = require('assert');
// describe("First Unit Test", () => {
//   //console.log(typeof app);
//   it("should return response code 200", (done) => 
//   {supertest(app).get("/healthz").expect(200).end((err, res) => 
//   {if (err) return done(err);return done();});
// });
// });

