import { db } from "../../db/index.js";
import { eq } from "drizzle-orm";
import { userTable } from "../../db/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import https from "https";
const generateUserToken = (user) => {
    return jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || "", {
        expiresIn: "30d",
    });
};
export async function loginUser(req, res) {
    try {
        // Mencetak origin dan referer
        const { email, password } = req.body;
        const [user] = await db
            .select()
            .from(userTable)
            .where(eq(userTable.email, email));
        if (!user) {
            res.status(401).json({ error: "Authentication failed" });
            return; // Akhiri fungsi setelah mengirim respons
        }
        const matched = await bcrypt.compare(password, user.password);
        // console.log(matched);
        if (!matched) {
            res.status(401).json({ error: "Account not found" });
            return; // Akhiri fungsi setelah mengirim respons
        }
        const token = generateUserToken(user);
        // console.log(token);
        // console.log(user);
        res.cookie("jwt", token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 6 * 24 * 60 * 60 * 1000, // 6 hari
            path: "/", // Set path ke root
        });
        // @ts-ignore
        delete user.password;
        res.status(200).json({ token, user }); // Pastikan untuk return di sini
    }
    catch (e) {
        console.error(e); // Tambahkan log untuk error
    }
}
export async function registerUser(req, res) {
    const data = req.body;
    data.password = await bcrypt.hash(data.password, 10); // hash password
    try {
        // Periksa jumlah pengguna dalam database
        const existingUsers = await db.select().from(userTable);
        // Tentukan role berdasarkan jumlah pengguna yang ada
        data.role = existingUsers.length === 0 ? "admin" : "user";
        // Insert pengguna baru ke dalam tabel
        const [user] = await db.insert(userTable).values(data).returning();
        res.status(200).json(user); // mengirimkan response JSON dengan status 200
    }
    catch (error) {
        console.error(error); // log error untuk debugging
        res.status(500).json({ error: "Failed to register user" });
    }
}
export async function botPost(req, res) {
    const chatId = "739761453"; // Ganti dengan chat ID yang ingin Anda kirim pesan
    const message = req.body.message; // Pesan yang ingin dikirim dari body permintaan
    const token = "7932535528:AAFO5hrI_Q9ZKFboAh5WWlWMIevQ5ormAHg"; // Ganti dengan token bot Anda
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
    https
        .get(url, (response) => {
        let data = "";
        // Mengumpulkan data dari response
        response.on("data", (chunk) => {
            data += chunk;
        });
        // Setelah selesai menerima data
        response.on("end", () => {
            res.json({ success: true, data: JSON.parse(data) });
        });
    })
        .on("error", (err) => {
        console.error(err);
        res
            .status(500)
            .json({ success: false, message: "Failed to send message" });
    });
}
export async function getUpdates(req, res) {
    const token = "7932535528:AAFO5hrI_Q9ZKFboAh5WWlWMIevQ5ormAHg"; // Ganti dengan token bot Anda
    const url = `https://api.telegram.org/bot${token}/getUpdates`;
    https
        .get(url, (response) => {
        let data = "";
        // Mengumpulkan data dari response
        response.on("data", (chunk) => {
            data += chunk;
        });
        // Setelah selesai menerima data
        response.on("end", () => {
            try {
                const jsonData = JSON.parse(data);
                if (jsonData.ok && jsonData.result) {
                    // Mengambil pesan dari data yang diterima
                    const messages = jsonData.result.map((update) => ({
                        id: update.message?.message_id || "No ID", // Menambahkan message_id
                        text: update.message?.text || "",
                        date: update.message?.date || "",
                        from: update.message?.from?.username || "Unknown",
                    }));
                    // Mengirimkan data pesan ke frontend
                    res.json({ success: true, messages });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: "Failed to fetch updates",
                    });
                }
            }
            catch (error) {
                console.error("Error parsing JSON:", error);
                res.status(500).json({
                    success: false,
                    message: "Failed to parse response data",
                });
            }
        });
    })
        .on("error", (err) => {
        console.error("Request error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to get updates",
        });
    });
}
