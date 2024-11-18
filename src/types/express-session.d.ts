// types/express-session.d.ts
import "express-session";

declare module "express-session" {
  interface SessionData {
    userId: number; // atau number, tergantung pada tipe ID user kamu
    token: string;
  }
}
