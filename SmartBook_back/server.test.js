import request from 'supertest';
import { app, server } from './server';
import { getConnection } from './config/db.config.js';

describe('GET /test', () => {
  let connection;

  beforeAll(async () => {
    connection = getConnection();
  });

  afterAll(async () => {
    await connection.end();
    await new Promise(resolve => server.close(resolve));
    console.log('Server closed');
  });

  it('should return 200 and solution', async () => {
    const res = await request(app).get('/test');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty('solution', 2);
  });
});