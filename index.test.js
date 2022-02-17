const supertest = require('supertest');
const app = require('./index');
describe("Index JS file", () => {
  it("should return response code 200", (done) => 
  {supertest(app).get("/healthz").expect(200).end((err, res) => 
  {if (err) return done(err);return done();});
});
});

