const sendRes = require("../../res");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;

exports.me = (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return sendRes(401, null, "Token tidak ditemukan", res);
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("Token error:", err.message); // debug
                return sendRes(403, null, "Token tidak valid atau expired", res);
            }

            // decoded berisi: { id, email, username, role, iat, exp }
            const userData = {
                id: decoded.id,
                email: decoded.email,
                username: decoded.username,
                role: decoded.role
            };

            return sendRes(200, userData, "Token valid", res);
        });

    } catch (error) {
        console.error("Server error:", error); // debug
        return sendRes(500, null, "Internal server error", res);
    }
};