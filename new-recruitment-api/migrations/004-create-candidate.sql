CREATE TABLE Candidate (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT NOT NULL,
    years_of_experience INTEGER NOT NULL,
    recruiter_notes TEXT,
    recruitment_status TEXT CHECK(recruitment_status IN ('new', 'in_progress', 'accepted', 'rejected')) DEFAULT 'new',
    consent_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
