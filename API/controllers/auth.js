import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP, sendOTPEmail, storeOTP, verifyOTP } from "../services/emailService.js";

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

export const register = (req, res) => {
  //CHECK USER IF EXISTS
  const q = "SELECT * FROM users WHERE username = ?";
  // console.log(req.body.password)
  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");
    
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q =
      "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)";

    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};


// export const register = (req, res) => {
  
//   const checkUserQuery = "SELECT * FROM users WHERE username = ?";
//   db.query(checkUserQuery, [req.body.username], (err, data) => {
//     if (err) return res.status(500).json(err);
//     if (data.length) return res.status(409).json("User already exists!");


//     const salt = bcrypt.genSaltSync(10);
//     const hashedPassword = bcrypt.hashSync(req.body.password, salt);

//     const insertUserQuery = `
//       INSERT INTO users (username, email, password, name) 
//       VALUES (?, ?, ?, ?)
//     `;
//     const values = [
//       req.body.username,
//       req.body.email,
//       hashedPassword,
//       req.body.name,
//     ];

//     db.query(insertUserQuery, [values], (err, data) => {
//       if (err) return res.status(500).json(err);
//       return res.status(200).json("User has been created.");
//     });
//   });
// };



export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword)
      return res.status(400).json("Wrong password or username!");

    const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET);

    const { password, ...others } = data[0];

    res
      .cookie("accessToken", token, cookieOptions)
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  //console.log("working")
  res.clearCookie("accessToken",{
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax"
  }).status(200).json("User has been logged out.")
};

// Send OTP for email verification
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json("Email is required");
    }

    // Check if user exists
    const q = "SELECT * FROM users WHERE email = ?";
    db.query(q, [email], async (err, data) => {
      if (err) return res.status(500).json(err);
      
      if (data.length === 0) {
        return res.status(404).json("User not found with this email");
      }

      // Generate and send OTP
      const otp = generateOTP();
      const emailSent = await sendOTPEmail(email, otp);
      
      if (emailSent) {
        storeOTP(email, otp);
        return res.status(200).json("OTP sent successfully");
      } else {
        return res.status(500).json("Failed to send OTP email");
      }
    });
  } catch (error) {
    console.error("Error in sendOTP:", error);
    return res.status(500).json("Internal server error");
  }
};

// Verify OTP and login
export const verifyOTPLogin = (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json("Email and OTP are required");
    }

    // Verify OTP
    const verification = verifyOTP(email, otp);
    
    if (!verification.valid) {
      return res.status(400).json(verification.message);
    }

    // Get user data
    const q = "SELECT * FROM users WHERE email = ?";
    db.query(q, [email], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length === 0) return res.status(404).json("User not found!");

      const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET);
      const { password, ...others } = data[0];

      res
        .cookie("accessToken", token, cookieOptions)
        .status(200)
        .json(others);
    });
  } catch (error) {
    console.error("Error in verifyOTPLogin:", error);
    return res.status(500).json("Internal server error");
  }
};

// Register with OTP verification
export const registerWithOTP = async (req, res) => {
  try {
    const { username, email, password, name, otp } = req.body;
    
    if (!username || !email || !password || !name || !otp) {
      return res.status(400).json("All fields including OTP are required");
    }

    // Verify OTP first
    const verification = verifyOTP(email, otp);
    if (!verification.valid) {
      return res.status(400).json(verification.message);
    }

    // Check if user already exists
    const checkUserQuery = "SELECT * FROM users WHERE username = ? OR email = ?";
    db.query(checkUserQuery, [username, email], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length) return res.status(409).json("User already exists!");

      // Hash password and create user
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const insertUserQuery = `
        INSERT INTO users (username, email, password, name) 
        VALUES (?, ?, ?, ?)
      `;
      const values = [username, email, hashedPassword, name];

      db.query(insertUserQuery, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User has been created successfully!");
      });
    });
  } catch (error) {
    console.error("Error in registerWithOTP:", error);
    return res.status(500).json("Internal server error");
  }
};
