import Token from "../models/Token.js";

// 🔔 Save Expo Push Token
export const saveToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }

    // 🔥 avoid duplicate
    const exists = await Token.findOne({ token });

    if (!exists) {
      await Token.create({ token });
    }

    res.json({
      success: true,
      message: "Token saved successfully..",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};