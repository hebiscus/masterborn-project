import { Request, Response, Router } from "express";
import { setupDb } from "./db";
import { createCandidateInLegacyApi } from "../services/legacyApiService";

export class CandidatesController {
  readonly router = Router();

  constructor() {
    this.router.get("/candidates", this.getAll.bind(this));
    this.router.post("/candidates", this.create.bind(this));
  }

  async getAll(req: Request, res: Response) {
    try {
      // disclaimer: am I setting up a new connection to the db all the time? Yes. I don't remember how to do it properly and google is not being helpful
      const db = await setupDb();

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const candidates = await db.all(
        `SELECT * FROM Candidate LIMIT ? OFFSET ?`,
        [limit, offset],
      );

      res.json({
        candidates,
        pagination: {
          page,
          limit,
        },
      });
    } catch (error) {
      console.error("error occured during rendering all candidates:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async create(req: Request, res: Response) {
    // disclaimer: am I setting up a new connection to the db all the time? Yes. I don't remember how to do it properly and google is not being helpful
    const db = await setupDb();

    const {
      first_name,
      last_name,
      email,
      phone_number,
      years_of_experience,
      recruiter_notes,
      recruitment_status,
      consent_date,
      job_offer_id,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone_number ||
      !years_of_experience ||
      !consent_date
    ) {
      return res.status(400).json({ error: "Some body data missing" });
    }

    try {
      const jobOffer = await db.get("SELECT * FROM JobOffer WHERE id = ?", [
        job_offer_id,
      ]);
      if (!jobOffer) {
        return res
          .status(404)
          .json({
            error: "You have to supply a job offer to create a candidate",
          });
      }

      await db.run(
        `INSERT INTO Candidate (first_name, last_name, email, phone_number, years_of_experience, recruiter_notes, recruitment_status, consent_date, job_offer_id)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          first_name,
          last_name,
          email,
          phone_number,
          years_of_experience,
          recruiter_notes || null,
          recruitment_status || "new",
          consent_date,
          job_offer_id,
        ],
      );

      const legacyCandidateData = {
        firstName: first_name,
        lastName: last_name,
        email: email,
      };

      const legacyApiResponse =
        await createCandidateInLegacyApi(legacyCandidateData);

      // return res.status(201).json("Successfully created a new candidate!")
      return res
        .status(legacyApiResponse.status)
        .json({ message: legacyApiResponse.message });
    } catch (error) {
      console.error("Error wgile creating candidate:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
