const jwt = require("jsonwebtoken");
const config = require("../config");

const authenticateToken = (req, res, next) => {
  let authHeader = req.headers.authorization;

  if (authHeader) {
    let token = authHeader.split(' ')[1]; //Split because of the Bearer prefix and we dont want that

    jwt.verify(token, config.key, (err, result) => {
      if (err) {
        return res.send(err);
      }
      req.result = result;

      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
  authenticateToken: authenticateToken,
};
