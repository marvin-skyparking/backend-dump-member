// src/__tests__/app.test.ts
import request from 'supertest';
import app from '../app';

describe('Test the root path', () => {
  it('should respond with a Hello, World! message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello, World!');
  });
});

describe('Test the transactions route', () => {
  it('should create a new transaction', async () => {
    const transactionData = {
      fullname: 'John Doe',
      phonenumber: '1234567890',
      membershipStatus: 'new',
      email: 'john.doe@example.com',
      vehicletype: 'car',
      NoCard: '1234',
      PlateNumber: 'AB123CD',
    };

    const response = await request(app)
      .post('/transactions')
      .send(transactionData);

    expect(response.status).toBe(201);
    expect(response.body.fullname).toBe(transactionData.fullname);
    expect(response.body.email).toBe(transactionData.email);
  });
});
