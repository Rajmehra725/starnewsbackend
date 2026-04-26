import Notification from "../models/Notification.js";

// 🔔 Create Notification
export const createNotification = async (req, res) => {
  try {
    const { title, message, type, newsId, image } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type,
      newsId,
      image,
    });

    res.json({
      success: true,
      data: notification,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 📥 Get Notifications
export const getNotifications = async (req, res) => {
  try {
    const data = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Mark as Read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, {
      isRead: true,
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🗑️ Delete Notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndDelete(id);

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};