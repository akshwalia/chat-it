const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    let token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({'message': 'Access denied'});
    };

    token = token.split(" ")[1];
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({'message': 'Invalid token'});
    };
};