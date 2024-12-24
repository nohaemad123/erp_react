import { TokenPayload } from "@/@types/auth";
import { jwtDecode } from "jwt-decode";

export function isTokenExpired(token: string) {
  if (!token) return true;

  try {
    const decode = jwtDecode<TokenPayload>(token);
    return Date.now() >= decode.exp * 1000;
  } catch {
    return true;
  }
}
