import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from '../src/app.module';

describe('Full Project Integration and Edge Case Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('User Module', () => {
    it('should create a new user with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/user')
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'testuser@example.com',
          phone: '1234567890',
          role: 'member',
          isActive: true,
        })
        .expect(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('testuser@example.com');
    });

    it('should fail to create user with missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/user')
        .send({
          firstName: 'Test',
          // missing lastName and email
        })
        .expect(400);
    });

    it('should update user email successfully', async () => {
      // Create user first
      const createRes = await request(app.getHttpServer()).post('/user').send({
        firstName: 'Update',
        lastName: 'User',
        email: 'updateuser@example.com',
        phone: '1234567890',
        role: 'member',
        isActive: true,
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const userId = createRes.body.id;

      // Update email
      const updateRes = await request(app.getHttpServer())
        .patch(`/user/${userId}`)
        .send({ email: 'updatedemail@example.com' })
        .expect(200);
      expect(updateRes.body.email).toBe('updatedemail@example.com');
    });

    it('should return 404 when updating non-existent user', async () => {
      await request(app.getHttpServer())
        .patch('/user/nonexistentid')
        .send({ email: 'noone@example.com' })
        .expect(404);
    });
  });

  describe('Auth Module', () => {
    it('should login with valid credentials', async () => {
      // Assuming a user exists with these credentials
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'password123',
        })
        .expect(201);
      expect(response.body).toHaveProperty('accessToken');
    });

    it('should fail login with invalid credentials', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('Tenant Module', () => {
    it('should create a tenant', async () => {
      const response = await request(app.getHttpServer())
        .post('/tenant')
        .send({
          name: 'Test Tenant',
          subdomain: 'testtenant',
        })
        .expect(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Tenant');
    });

    it('should fail to create tenant with duplicate subdomain', async () => {
      await request(app.getHttpServer())
        .post('/tenant')
        .send({
          name: 'Another Tenant',
          subdomain: 'testtenant', // duplicate
        })
        .expect(400);
    });
  });

  describe('Membership Module', () => {
    it('should create a membership plan', async () => {
      const response = await request(app.getHttpServer())
        .post('/membership/plan')
        .send({
          name: 'Basic Plan',
          price: 50,
        })
        .expect(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Basic Plan');
    });

    it('should fail to create plan with negative price', async () => {
      await request(app.getHttpServer())
        .post('/membership/plan')
        .send({
          name: 'Invalid Plan',
          price: -10,
        })
        .expect(400);
    });
  });

  // Add more tests for other modules and edge cases as needed
});
