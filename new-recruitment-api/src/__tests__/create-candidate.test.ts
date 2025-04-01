import { Application } from "express";
import { setupApp } from "../app";
import { setupDb } from "../db";
import request from 'supertest';

describe('Create Candidate', () => {
    let app: Application;

    beforeAll(async () => {
        db = await setupDb(true);
        app = await setupApp();
    })

    afterAll(async () => {
        await db.close();
    });

    it('should create a new candidate successfully', async () => {
    })
})
