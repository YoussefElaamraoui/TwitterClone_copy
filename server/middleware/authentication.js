// Authentication of the user by using jsonwebtoken
function authentication(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader?.startsWith('Bearer')) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.ACCES_SECRET_TOKEN, async (err, decoded) => {
            if (err) {
                console.error('JWT Verification Error:', err); // Add this line to log the error
                req.user = {};
                return next();
            }

            const user = await User.findOne({ username: decoded.id }).select({ password: 0, refresh_token: 0 }).exec();

            if (user) {
                req.user = user.toObject({ getters: true });
            } else {
                req.user = {};
            }

            return next();
        });
    } else {
        req.user = {};
        return next();
    }
}

module.exports = authentication;
