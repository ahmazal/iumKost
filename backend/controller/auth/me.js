const sendRes = require("../../res"); // atau lokasi file Anda
const jwt = require("jsonwebtoken");
const SECRET_KEY = "secret123";

exports.me = (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return sendRes(401, null, "Token tidak ditemukan", res);
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return sendRes(403, null, "Token tidak valid atau expired", res);
            }

            // decoded berisi: { id, username, role, iat, exp }
            const userData = {
                id: decoded.id,
                username: decoded.username,
                role: decoded.role
            };

            return sendRes(200, userData, "Token valid", res);
        });

    } catch (error) {
        return sendRes(500, null, "Internal server error", res);
    }
};
