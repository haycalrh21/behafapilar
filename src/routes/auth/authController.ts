import { Request, Response } from "express";
import { db } from "../../db/index.js";
import { eq } from "drizzle-orm";
import { userTable } from "../../db/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import https from "https";
const generateUserToken = (user: any) => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET || "",
    {
      expiresIn: "30d",
    }
  );
};

export async function loginUser(req: Request, res: Response): Promise<void> {
  try {
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
  } catch (e) {
    console.error(e); // Tambahkan log untuk error
  }
}

export async function registerUser(req: Request, res: Response) {
  const { email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10); // hash password

  try {
    const data = {
      email,
      password: hashPassword,
      role: "admin",
    };

    // Insert pengguna baru ke dalam tabel
    const [user] = await db.insert(userTable).values(data).returning();
    res.status(200).json({
      user,
      message: "User registered successfully",
    }); // mengirimkan response JSON dengan status 200
  } catch (error) {
    console.error(error); // log error untuk debugging
    res.status(500).json({ error: "Failed to register user" });
  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await db.select().from(userTable);
    res.json({
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch users",
    });
  }
}
