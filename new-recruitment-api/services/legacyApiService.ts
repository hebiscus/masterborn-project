const LEGACY_API_URL = "http://localhost:4040/candidates";
const LEGACY_API_KEY = "0194ec39-4437-7c7f-b720-7cd7b2c8d7f4"; // should be in env

export interface CandidateData {
  firstName: string;
  lastName: string;
  email: string;
}

export const createCandidateInLegacyApi = async (candidateData: CandidateData) => {
  try {
    const response = await fetch(LEGACY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": LEGACY_API_KEY,
      },
      body: JSON.stringify(candidateData),
    });

    if (response.status === 409) {
      return { status: 409, message: "email already used" };
    }

    if (response.status === 504) {
      return { status: 504, message: "legacy api unavailable" };
    }

    if (response.status === 400) {
      const { errors } = await response.json();
      return { status: 400, message: "validation failed:", errors };
    }

    if (response.ok) {
      const data = await response.json();
      return { status: 201, message: "candidate created successfully", candidate: data };
    }

    return { status: 500, message: "unexpected error" };
  } catch (error) {
    console.error("Error:", error);
    return { status: 500, message: "Internal server error" };
  }
};