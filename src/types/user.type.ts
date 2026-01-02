export interface User {
  id: number;
  telegram_id: number;
  username: string;
  role: "user" | "admin";
  created_at: string;
}
