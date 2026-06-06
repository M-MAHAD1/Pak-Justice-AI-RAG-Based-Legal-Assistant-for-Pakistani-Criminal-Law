import jwt from "jsonwebtoken";

function getBearerToken(req) {
  const header = req.headers?.authorization;
  if (!header) return "";
  const value = String(header).trim();
  if (!value.toLowerCase().startsWith("bearer ")) return "";
  return value.slice(7).trim();
}

export function requireAuth(req, res, next) {
  try {
    const token = getBearerToken(req);
    if (!token) return res.status(401).json({ message: "Missing Authorization token" });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: "Server misconfigured: JWT_SECRET is missing" });

    const payload = jwt.verify(token, secret);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireAdmin(req, res, next) {
  return requireAuth(req, res, () => {
    const role = req.user?.role;
    if (role !== "admin") return res.status(403).json({ message: "Admin access required" });
    return next();
  });
}
