import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
  username: string;
}

export function getDecodedToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Invalid token");
    return null;
  }
}
