class WorkerIdValidator {
  static validateWorkerId(workerId) {
    if (!workerId || isNaN(workerId)) {
      throw new Error("Invalid Worker ID");
    }
  }
}
//
class ApiKeyValidator {
  static validateApiKey(req, res, next) {
    const apiKey = req.headers["x-api-key"];
    const VALID_API_KEY = process.env.API_KEY;

    if (!apiKey || apiKey !== VALID_API_KEY) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    next();
  }
}

class UserNameValidator {
  static validateUserName(name) {
    const nameRegex = /^[a-zA-Z\s]{3,50}$/;
    if (!name || !nameRegex.test(name)) {
      throw new Error("Invalid User Name");
    }
  }
}

export { WorkerIdValidator, ApiKeyValidator, UserNameValidator };
