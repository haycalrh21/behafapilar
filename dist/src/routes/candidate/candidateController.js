import { db } from "../../db/index.js";
import { candidatesTable } from "../../db/candidateSchema.js";
// Tangani pembuatan form
export const createForm = async (req, res) => {
    try {
        const { firstName, // Ensure these match the form field names
        lastName, dateOfBirth, gender, passportId, email, phoneNumber, department, position, cvFile, certificateFile, } = req.body;
        // Log incoming data for debugging
        console.log({
            firstName,
            lastName,
            dateOfBirth,
            gender,
            passportId,
            email,
            phoneNumber,
            department,
            position,
            cvFile,
            certificateFile,
        });
        // Insert data into database
        const project = await db
            .insert(candidatesTable)
            .values({
            firstname: firstName,
            lastname: lastName,
            dateOfBirth,
            gender,
            status: "Applied",
            passportNumber: passportId,
            email,
            phoneNumber,
            department,
            position,
            cv: cvFile,
            certificate: certificateFile,
        })
            .returning();
        res.status(201).json({
            message: "Data kandidat berhasil dibuat",
            project,
            cvUrl: cvFile.fileUrl,
            certificateUrl: certificateFile.fileUrl,
        });
    }
    catch (error) {
        console.error("Terjadi kesalahan:", error);
        res.status(500).json({
            error: "Gagal memproses permintaan",
            details: error instanceof Error ? error.message : "Kesalahan tidak diketahui",
        });
    }
};
export async function getCandidates(req, res) {
    try {
        // Fetch candidates from the database
        const candidates = await db
            .select({
            id: candidatesTable.id,
            fullname: candidatesTable.firstname,
            lastname: candidatesTable.lastname,
            dateOfBirth: candidatesTable.dateOfBirth,
            gender: candidatesTable.gender,
            status: candidatesTable.status,
            passportNumber: candidatesTable.passportNumber,
            email: candidatesTable.email,
            phoneNumber: candidatesTable.phoneNumber,
            department: candidatesTable.department,
            position: candidatesTable.position,
            cv: candidatesTable.cv,
            certificate: candidatesTable.certificate,
            createdAt: candidatesTable.createdAt,
        })
            .from(candidatesTable);
        // Respond with the list of candidates directly
        res.json(candidates);
    }
    catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).send({
            error: "An error occurred while fetching candidates",
        });
    }
}
