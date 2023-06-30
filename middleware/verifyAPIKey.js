const userModel = require("../models/usermodel");

async function authenticateAPIKey(req, res, next) {
  let APIKey = req.headers["x-api-key"]?.toString();
  console.log(APIKey);

  if (!APIKey) {
    return res.status(401).json({
      success: false,
      message:
        "API Key required in the Bearer Authorization! Sign up to get a key",
      data: {},
      errorCode: 401,
    });
  }

  APIKey = APIKey.trim();
  const keyExists = await userModel.findOne({ APIKey });

  if (!keyExists) {
    return res.status(401).json({
      success: false,
      message:
        "Invalid API Key. Have you forgotten your API Key? Regenerate another one at the `/get-new-key` route",
      data: {},
      errorCode: 401,
    });
  }

  next();
}

module.exports = authenticateAPIKey;
