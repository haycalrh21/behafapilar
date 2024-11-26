import express, { json, urlencoded } from "express";
import authRouter from "./routes/auth/index.js";
import candidateRouter from "./routes/candidate/index.js";
import partnerRouter from "./routes/partner/index.js";
import countryRouter from "./routes/country/index.js";
import cors from "cors";
import serverless from "serverless-http";
import cookieParser from "cookie-parser";
const port = 4000;
const app = express();
app.use(cookieParser());
app.use(urlencoded({ extended: false, limit: "50mb" }));
app.use(json({ limit: "50mb" }));
const allowedOrigins = ["http://localhost:3000"];
// Middleware CORS yang diperbarui
app.use(cors({
    origin: allowedOrigins, // Menentukan origin yang diizinkan
    credentials: true, // Mengizinkan cookies
}));
// Middleware untuk memvalidasi origin secara manual
const checkOrigin = (req, res, next) => {
    const origin = req.headers.origin;
    const appOrigin = req.headers["x-app-origin"]; // Header kustom untuk React Native
    console.log("Origin:", origin, "App Origin:", appOrigin);
    if (allowedOrigins.includes(origin ?? "") || // Memeriksa jika origin termasuk yang diizinkan
        appOrigin === "react-native-app" // Pengecekan untuk React Native
    ) {
        next();
    }
    else {
        res.status(403).send("Origin not allowed");
    }
};
// Route configuration
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/auth", authRouter);
app.use("/candidate", candidateRouter);
app.use("/partner", partnerRouter);
app.use("/country", countryRouter);
if (process.env.NODE_ENV === "dev") {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}
export const handler = serverless(app);
