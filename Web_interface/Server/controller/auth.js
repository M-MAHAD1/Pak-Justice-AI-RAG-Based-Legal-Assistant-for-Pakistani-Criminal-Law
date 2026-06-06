import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body ?? {};

        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const normalizedUsername = String(username).trim();
        const normalizedEmail = String(email).trim().toLowerCase();

        if (!normalizedUsername || !normalizedEmail) {
            return res.status(400).json({ message: "Invalid username or email" });
        }

        const hashedPassword = bcrypt.hashSync(String(password), 10);
        const newUser = new User({
            username: normalizedUsername,
            email: normalizedEmail,
            password: hashedPassword,
        });

        await newUser.save();
        return res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        // Duplicate username (unique index)
        if (err?.code === 11000) {
            return res.status(409).json({ message: "Username already exists" });
        }
        return res.status(500).json({ message: "Error registering user" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body ?? {};
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const normalizedEmail = String(email).trim().toLowerCase();

        // --- Admin shortcut (demo / local deployment) ---
        // Prefer env vars; falls back to requested defaults.
        const adminEmail = String(process.env.ADMIN_EMAIL || "mahad@gmail.com").trim().toLowerCase();
        const adminPassword = String(process.env.ADMIN_PASSWORD || "mahad").trim();
        if (normalizedEmail === adminEmail && String(password) === adminPassword) {
            const token = jwt.sign(
                { userId: "admin", role: "admin", email: normalizedEmail },
                process.env.JWT_SECRET
            );
            return res.status(200).json({ message: "Login successful", token });
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Google-created users have no password.
        if (!user.password) {
            return res.status(400).json({ message: "This account uses Google sign-in" });
        }

        const isValidPassword = bcrypt.compareSync(String(password), user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id, role: "user" }, process.env.JWT_SECRET);
        return res.status(200).json({ message: "Login successful", token });
    } catch {
        return res.status(500).json({ message: "Error logging in" });
    }
};


export const googleLogin = async (req, res) => {
    try {
        const user=await User.findOne({ email: req.body.email });
        if (!user) {
            const newUser = new User({
                username: req.body.name,
                email: req.body.email,
                password: null, // No password for Google users
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id}, process.env.JWT_SECRET);
            return res.cookie("token", token, {
                httpOnly: true,
            }).status(200).json({ token });
        }
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
        res.cookie("token", token, {
            httpOnly: true,
        }).status(200).json({ token });

}
 catch (err) {
        return res.status(500).json({ message: "Google login failed" });
    }
}

export const logout = async (req, res) => {
    try {
        // Clear cookie token if present (Google login flow sets it).
        res.clearCookie("token", {
            httpOnly: true,
        });
        return res.status(200).json({ message: "Logged out" });
    } catch {
        return res.status(500).json({ message: "Logout failed" });
    }
};

