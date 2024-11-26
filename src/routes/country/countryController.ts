import { Request, Response } from "express";
import { db } from "../../db/index.js";
import { countryTable } from "../../db/countrySchema.js";
import { eq, inArray } from "drizzle-orm";

export const createCountry = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { countries } = req.body;

    // Validasi jika `countries` adalah array
    if (!Array.isArray(countries)) {
      res
        .status(400)
        .json({ error: "Invalid data format. 'countries' must be an array." });
      return;
    }

    // Ekstrak nama-nama negara
    const countryNames = countries.map((country) => country.name);

    // Cari negara yang sudah ada di database
    const existingCountries = await db
      .select({ name: countryTable.name })
      .from(countryTable)
      .where(inArray(countryTable.name, countryNames));

    const existingCountryNames = existingCountries.map(
      (country) => country.name
    );

    // Filter negara baru yang belum ada di database
    const newCountries = countryNames
      .filter((name) => !existingCountryNames.includes(name))
      .map((name) => ({ name }));

    if (newCountries.length === 0) {
      res.status(200).json({
        message: "Tidak ada negara baru untuk disimpan.",
      });
      return;
    }

    // Proses penyimpanan batch ke database
    const savedCountries = await db
      .insert(countryTable)
      .values(newCountries)
      .returning();

    // Response berhasil
    res.status(201).json({
      message: "Data countries berhasil disimpan.",
      savedCountries,
    });
  } catch (error) {
    console.error("Error saat menyimpan data negara:", error);
    res.status(500).json({
      error: "Gagal menyimpan data negara.",
      details:
        error instanceof Error ? error.message : "Kesalahan tidak diketahui.",
    });
  }
};
export async function getCountry(req: Request, res: Response) {
  try {
    // Fetch candidates from the database
    const country = await db
      .select({
        id: countryTable.id,
        name: countryTable.name,
      })
      .from(countryTable);

    res.json(country);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).send({
      error: "An error occurred while fetching candidates",
    });
  }
}
