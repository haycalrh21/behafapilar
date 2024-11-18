import { Request, Response } from "express";
import { db } from "../../db/index.js";
import { partnerTable } from "../../db/partnerSchema.js";

export async function createPartner(req: Request, res: Response) {
  const { fullname, lastname, email, country, message } = req.body;

  try {
    // Insert into partnerTable
    const [partner] = await db
      .insert(partnerTable)
      .values({
        fullname: fullname.trim(),
        lastname: lastname.trim(),
        email: email.trim(),
        country: country.trim(),
        message: message.trim(),
      })
      .returning(); // Returning the newly inserted row

    // Respond with the inserted partner data
    res.status(200).json(partner);
  } catch (error) {
    console.error("Error creating partner:", error);
    res.status(500).json({ error: "Failed to create partner" });
  }
}
