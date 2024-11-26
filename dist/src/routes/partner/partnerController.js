import { db } from "../../db/index.js";
import { partnerTable } from "../../db/partnerSchema.js";
export async function createPartner(req, res) {
    const { firstName, lastName, email, country, Message, whatsapp, companyWebsite, companyName, } = req.body;
    try {
        // Insert into partnerTable
        // Insert into partnerTable
        const [partner] = await db
            .insert(partnerTable)
            .values({
            companyName,
            companyWebsite,
            firstName,
            whatsapp,
            lastName,
            email,
            country,
            message: Message,
        })
            .returning(); // Returning the newly inserted row
        // Respond with the inserted partner data
        res.status(200).json(partner);
    }
    catch (error) {
        console.error("Error creating partner:", error);
        res.status(500).json({ error: "Failed to create partner" });
    }
}
export async function getPartners(req, res) {
    try {
        // Fetch all partners from the database
        const partners = await db
            .select({
            id: partnerTable.id,
            fullname: partnerTable.firstName,
            lastname: partnerTable.lastName,
            whatsapp: partnerTable.whatsapp,
            companyName: partnerTable.companyName,
            companyWebsite: partnerTable.companyWebsite,
            email: partnerTable.email,
            country: partnerTable.country,
            message: partnerTable.message,
            createdAt: partnerTable.createdAt,
        })
            .from(partnerTable);
        // Respond with the fetched partners
        res.json(partners);
    }
    catch (error) {
        console.error("Error fetching partners:", error);
        res.status(500).json({ error: "Failed to fetch partners" });
    }
}
