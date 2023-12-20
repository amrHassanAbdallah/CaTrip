const logger = require('../../config/logger');

module.exports = (req, res, next) => {
  const start = Date.now();

  // Capture the response size
  const originalSend = res.send;
  res.send = (...args) => {
    res.responseSize = Buffer.from(args[0]).length || 0;
    originalSend.apply(res, args);
  };

  // Continue with the request
  next();

  // Log response details after the response is sent
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const responseSize = res.responseSize || 0; // Change '_responseSize' to 'responseSize'
    const { statusCode } = res; // Extract status code

    // Log request duration, response size, and status code
    logger.info({
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      message: 'Request completed',
      duration_in_sec: duration,
      responseSize,
      statusCode,
    });
  });
};
