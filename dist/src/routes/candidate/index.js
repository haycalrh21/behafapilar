import { Router } from "express";
import { createForm } from "./candidateController.js";
const router = Router();
// Skema validasi untuk mendukung array imageUrls
// export const createBlogSchema = z.object({
//   // title: z.string({ message: "Title is required" }).min(5),
//   // description: z.string({ message: "Description is required" }).min(5),
//   // category: z.string({ message: "Category is required" }).min(1),
//   images: z
//     .array(
//       z.string().refine(
//         (img) => {
//           // Memastikan bahwa string dimulai dengan "data:image/"
//           return img.startsWith("data:image/");
//         },
//         {
//           message: "Each image must be a valid base64 string",
//         }
//       )
//     )
//     .nonempty("At least one image is required"),
// });
router.get("/");
router.get("/:id");
router.post("/", createForm);
// router.delete("/:id", async (req, res) => {
//   await deleteBlogPost(req, res);
// });
export default router;
