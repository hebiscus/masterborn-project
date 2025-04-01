import { Application } from "express";
import { setupApp } from "../app";
import { setupDb } from "../db";
import { Database } from 'sqlite';
import request from 'supertest';

describe('Create Candidate', () => {
    let app: Application;
    let db: Database

    beforeAll(async () => {
        db = await setupDb(true);
        app = await setupApp();
    })

    afterAll(async () => {
        await db.close();
    });

    it('should create a new candidate successfully', async () => {
        const jobOffer = await db.run(
            `INSERT INTO JobOffer (title, description, salary_range, location)
            VALUES (?, ?, ?, ?)`,
            ['Software Developer', 'Develop new features', '50000-70000', 'Remote']
        );
        const jobOfferId = jobOffer.lastID;

        const body = {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.dosse@example.com',
            phone_number: '123-456-7890',
            years_of_experience: 5,
            recruiter_notes: 'Yes, this was ai generated indeed',
            recruitment_status: 'new',
            consent_date: '2025-04-01',
            job_offer_id: jobOfferId,
        };

        const response = await request(app)
            .post('/candidates')
            .send(body)
            .expect('Content-Type', /json/)
            .expect(201)

        expect(response.body.first_name).toBe('John');
    })
})
