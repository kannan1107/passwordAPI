import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        status: "error",
        message: "Name and email are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User with this email already exists",
      });
    }

    const plainPassword = password || "password123";
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: plainPassword,
      role: role || "user",
    });

    console.log("Attempting to send email to:", email);

    try {
      const emailResult = await sendEmail({
        to: email,
        subject: "Welcome to Password Manager",
        text: `Hello ${name},\n\nYour account has been created successfully.\n\nYour login credentials are:\nEmail: ${email}\nPhone: ${phone}\nPassword: ${plainPassword}\n\nPlease change your password after logging in for the first time.\n\nThank you!`,
      });
      console.log("✅ Email sent successfully via Brevo");
    } catch (emailError) {
      console.error("❌ Email failed:", emailError.message);
    }

    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  // Login functionality to be implemented
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email and password are required",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Invalid credentials",
    });
  }

  if (user.password !== password) {
    return res.status(400).json({
      status: "error",
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_AUTH_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    token,
  });
  console.log(token);
  console.log(user);
  console.log(user.role);
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        status: "error",
        message: "Role is required",
      });
    }
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { name, email, password, role, phone },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.send(`
      <html>
        <head><title>Reset Password</title></head>
        <body>
          <h2>Invalid Reset Link</h2>
          <p>The reset link is invalid or expired.</p>
        </body>
      </html>
    `);
  }

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Reset Password</title>
        <style>
          body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f0f2f5; }
          .card { background: #fff; padding: 32px; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
          h2 { margin-top: 0; color: #333; }
          label { display: block; margin-bottom: 6px; color: #555; font-size: 14px; }
          input[type="password"] { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 5px; font-size: 14px; box-sizing: border-box; margin-bottom: 16px; }
          input[type="password"]:focus { outline: none; border-color: #007bff; }
          button { width: 100%; padding: 11px; background: #007bff; color: #fff; border: none; border-radius: 5px; font-size: 15px; cursor: pointer; }
          button:hover { background: #0056b3; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Reset Your Password</h2>
          <form action="/api/update-password" method="POST">
            <input type="hidden" name="token" value="${token}">
            <label>New Password</label>
            <input type="password" name="password" placeholder="Enter new password" required minlength="6">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" placeholder="Confirm new password" required minlength="6">
            <button type="submit">Reset Password</button>
          </form>
        </div>
        <script>
          document.querySelector('form').addEventListener('submit', function(e) {
            const p = document.querySelector('[name=password]').value;
            const c = document.querySelector('[name=confirmPassword]').value;
            if (p !== c) { e.preventDefault(); alert('Passwords do not match!'); }
          });
        </script>
      </body>
    </html>
  `);
};

export const updatePassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password) {
      return res.send("<h2>Missing token or password</h2>");
    }

    if (password !== confirmPassword) {
      return res.send("<h2>Passwords do not match</h2>");
    }

    const decoded = jwt.verify(token, process.env.JWT_AUTH_SECRET_KEY);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.send("<h2>User not found</h2>");
    }

    user.password = password;
    await user.save();

    res.send(`
      <html>
        <body>
          <h2>Password Reset Successful</h2>
          <p>Your password has been updated successfully.</p>
          <script>
            setTimeout(() => {
              window.location.href = 'http://localhost:5173/login';
            }, 2000);
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Password reset error:", error);
    res.send(`<h2>Invalid or expired token</h2><p>Error: ${error.message}</p>`);
  }
};
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found with this email",
      });
    }

    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_AUTH_SECRET_KEY,
      { expiresIn: "1h" }
    );

    const resetLink = `http://localhost:${
      process.env.PORT || 6500
    }/api/reset-password?token=${resetToken}`;

    try {
      await sendEmail({
        to: email,
        subject: "Password Reset Request",
        link: resetLink,
      });
      console.log("✅ Password reset email sent via Brevo");
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError.message);
    }

    res.status(200).json({
      status: "success",
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
