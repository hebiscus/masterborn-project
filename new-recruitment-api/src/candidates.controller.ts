import { Request, Response, Router } from "express";
import { setupDb } from "./db";

export class CandidatesController {
    readonly router = Router();

    constructor() {
        this.router.get('/candidates', this.getAll.bind(this));
        this.router.post('/candidates', this.create.bind(this));
    }

    async getAll(req: Request, res: Response) {
        try {
            const db = await setupDb();

            const candidates = await db.all(`SELECT * FROM Candidate`);

            res.json({ candidates: candidates });
        } catch (error) {
            console.error("error occured during rendering all candidates:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    create(req: Request, res: Response) {
        res.json({});
    }
}
