// app.js
import controllers from "./controllers/controllers.js";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import { pool } from './data/connection.js';
const app = express();
const PORT = 5000;
const JWT_SECRET = "your_jwt_secret"; // Use a strong, secure key in production

app.use(bodyParser.json());
app.use(cors());

const generarHashEjemplo = async () => {
  const saltRounds = 10;
  const plainTextPassword = "1234";
  const hash = await bcrypt.hash(plainTextPassword, saltRounds);
  console.log(`Hashed password for '${plainTextPassword}': ${hash}`);
};

generarHashEjemplo();

const users = []; // Dummy database (use a real DB in production)

// Middleware: Verify Token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Routes
// app.js

app.post("/signin", async (req, res) => {
    // CAMBIO 1: Aquí debe decir 'passwd'
    const { email, passwd } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const user = result.rows[0];

        // CAMBIO 2: Aquí también debe decir 'passwd'
        const isPasswordValid = await bcrypt.compare(passwd, user.password);
        
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        
        res.status(200).json({ token });

    } catch (error) {
        console.error("Error during signin:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.get("/users", verifyToken, controllers.getUsers);
app.get("/users/:id", verifyToken, controllers.getUserById);
app.post("/users", verifyToken, controllers.createUser);
app.put("/users/:id", verifyToken, controllers.updateUser);
app.delete("/users/:id", verifyToken, controllers.deleteUser);


app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`)
);

