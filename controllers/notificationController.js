// controllers/notificationController.js

// Send a notification (admin/moderator only)
exports.sendNotification = (req, res) => {
  const { title, message, recipients } = req.body;

  res.status(201).json({
    message: 'Notification sent successfully.',
    data: {
      title,
      message,
      recipients
    }
  });
};

// Get notifications for the current user
exports.getUserNotifications = (req, res) => {
  const userId = req.user.id;
  const { page, limit } = req.query;

  res.status(200).json({
    message: `Fetched notifications for user ${userId}.`,
    filters: { page, limit },
    notifications: [] // Replace with real data later
  });
};

// Mark a specific notification as read
exports.markNotificationRead = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  res.status(200).json({
    message: `Notification ${id} marked as read by user ${userId}.`
  });
};

// Mark all notifications as read
exports.markAllNotificationsRead = (req, res) => {
  const userId = req.user.id;

  res.status(200).json({
    message: `All notifications marked as read for user ${userId}.`
  });
};

// Delete a specific notification
exports.deleteNotification = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  res.status(200).json({
    message: `Notification ${id} deleted for user ${userId}.`
  });
};

// Get notification stats for the current user
exports.getNotificationStats = (req, res) => {
  const userId = req.user.id;

  res.status(200).json({
    message: `Notification stats for user ${userId}.`,
    stats: {
      total: 0,
      unread: 0
    }
  });
};
