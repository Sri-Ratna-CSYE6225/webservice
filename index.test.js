import express from 'express';
import  request  from 'supertest';
const app = new express();
import router from './index';
app.use(router);

describe('Index JS routes', () => {
    test("GET /healthz", async () => {
        const res = await request(app).get('/healthz');
        expect(res.statusCode).toBe(100);
      });
});
