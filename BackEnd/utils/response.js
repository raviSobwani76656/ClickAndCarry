const sendError = (res, statusCode, message) => {
  res.status(statusCode).json({ status: false, message });
};

const sendSuccess = (res, statusCode, message, data) => {
  res.status(statusCode).json({ status: true, message, data });
};

module.exports = { sendError, sendSuccess };
