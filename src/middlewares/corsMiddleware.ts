import cors from "cors";

const allowedOrigins = [
  "http://localhost:3000", // Origin untuk pengembangan
  "https://webspacefrontend.vercel.app", // Origin untuk produksi
];

const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Jika tidak ada origin (misalnya dari Postman), izinkan
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Izinkan origin yang valid
    } else {
      console.log(`Blocked CORS request from origin: ${origin}`); // Debug log
      callback(new Error("Not allowed by CORS")); // Tolak origin yang tidak valid
    }
  },
  credentials: true, // Izinkan pengiriman cookie
});

export default corsMiddleware;
