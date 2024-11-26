// uploadRouter.ts
import { createUploadthing, type FileRouter } from "uploadthing/express";

// Initialize Uploadthing
const f = createUploadthing();

// Configure Upload Router
export const uploadRouter: FileRouter = {
  pdf: f({
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 2,
    },
  }).onUploadComplete((data) => {
    console.log("Upload complete:", data);
  }),
};
