import { Request, Response } from "express";
import { db } from "../../db/index.js";
import { partnerTable } from "../../db/partnerSchema.js";
import { asc, desc } from "drizzle-orm";

export async function createPartner(
  req: Request,
  res: Response
): Promise<void> {
  const {
    firstName,
    lastName,
    email,
    country,
    Message,
    whatsapp,
    companyWebsite,
    companyName,
  } = req.body;

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
  } catch (error) {
    console.error("Error creating partner:", error);
    res.status(500).json({ error: "Failed to create partner" });
  }
}

export async function getPartners(req: Request, res: Response) {
  try {
    // Get query parameters for pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Query to get candidates with pagination, sorted by createdAt ASC
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
      .from(partnerTable)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(partnerTable.createdAt));

    const totalCountResult = await db.$count(partnerTable);
    const totalCount = totalCountResult;

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Send response with the data and pagination information
    res.json({
      data: partners,
      currentPage: page,
      totalCount: totalCount,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).send({
      error: "An error occurred while fetching candidates",
    });
  }
}

export async function getAllPartners(req: Request, res: Response) {
  try {
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
      .from(partnerTable)

      .orderBy(desc(partnerTable.createdAt));

    // Respond with the fetched partners
    res.json({
      data: partners,
    });
  } catch (error) {
    console.error("Error fetching partners:", error);
    res.status(500).json({ error: "Failed to fetch partners" });
  }
}
