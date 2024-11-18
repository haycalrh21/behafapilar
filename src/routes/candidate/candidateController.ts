import { Request, Response, NextFunction } from "express";
import { db } from "../../db/index.js";
import { v2 as cloudinary } from "cloudinary";
import { candidatesTable } from "../../db/candidateSchema.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createForm = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      fullname,
      lastname,
      dateOfBirth,
      gender,
      passportNumber,
      email,
      phoneNumber,
      department,
      position,
      cv, // PDF file (base64)
      certificate, // PDF file (base64)
    } = req.body;

    // Validasi file PDF (harus dalam format base64)
    if (!cv || !cv.startsWith("data:application/pdf")) {
      res.status(400).json({ error: "Valid PDF file for CV is required" });
    }

    if (!certificate || !certificate.startsWith("data:application/pdf")) {
      res
        .status(400)
        .json({ error: "Valid PDF file for certificate is required" });
    }

    // Extract base64 part from the data URL
    const cvBase64 = cv.split(",")[1];
    const certificateBase64 = certificate.split(",")[1];

    // Upload CV PDF to Cloudinary
    const cvUploadResponse = await cloudinary.uploader.upload(
      `data:application/pdf;base64,${cvBase64}`,
      { resource_type: "raw", folder: "candidates/cv" } // Store as raw file in Cloudinary
    );

    // Upload Certificate PDF to Cloudinary
    const certificateUploadResponse = await cloudinary.uploader.upload(
      `data:application/pdf;base64,${certificateBase64}`,
      { resource_type: "raw", folder: "candidates/certificate" } // Store as raw file in Cloudinary
    );

    // Save data into the database, including the Cloudinary URLs
    const project = await db
      .insert(candidatesTable)
      .values({
        fullname,
        lastname,
        dateOfBirth,
        gender,
        passportNumber,
        email,
        phoneNumber,
        department,
        position,
        cv: cvUploadResponse.secure_url, // Store Cloudinary URL for CV
        certificate: certificateUploadResponse.secure_url, // Store Cloudinary URL for certificate
      })
      .returning();

    // Respond with success
    res.status(201).json({
      message: "Project created successfully",
      project,
      cvUrl: cvUploadResponse.secure_url,
      certificateUrl: certificateUploadResponse.secure_url,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
};

// export function getBlog(req: Request, res: Response) {
//   db.select({
//     blogId: blogTable.id,
//     title: blogTable.title,
//     category: blogTable.category,
//     createdAt: blogTable.createdAt,
//     imageUrls: blogTable.imageUrls,
//     content: blogTable.description,
//     userId: userTable.id, // Mengambil userId dari tabel user
//     username: userTable.name, // Contoh kolom lain dari tabel user
//   })
//     .from(blogTable)
//     .innerJoin(userTable, eq(blogTable.userId, userTable.id)) // Join berdasarkan relasi userId
//     .then((blogs) => {
//       res.json(blogs);
//     })
//     .catch((error) => {
//       console.error(error);
//       res.status(500).send({
//         error: "An error occurred while fetching projects",
//       });
//     });
// }

// export async function deleteBlogPost(
//   req: Request,
//   res: Response
// ): Promise<Response> {
//   const { id } = req.params;

//   try {
//     // Pastikan ID valid sebelum melakukan penghapusan
//     if (!id) {
//       return res.status(400).json({ message: "ID tidak valid" });
//     }

//     // Menghapus blog berdasarkan ID
//     const result = await db
//       .delete(blogTable)
//       .where(eq(blogTable.id, Number(id)));

//     // Mengembalikan respon sukses
//     return res.status(200).json({ message: "Blog berhasil dihapus" });
//   } catch (error) {
//     console.error("Error deleting blog post:", error);
//     return res.status(500).json({ message: "Terjadi kesalahan pada server" });
//   }
// }
// // export async function getProjectById(req: Request, res: Response) {
// //   const { id } = req.params;
// //   const [project] = await db
// //     .select()
// //     .from(projectTable)
// //     .where(eq(projectTable.id, Number(id)));
// //   if (project) {
// //     res.json(project);
// //   } else {
// //     res.status(404).send({ message: "Project was not found" });
// //   }
// // }
// // export function deleteProject(req: Request, res: Response) {
// //   res.send("delete project");
// // }
