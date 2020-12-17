const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    //check json web token exists
    if (token) {
        jwt.verify(token, '60F86D370CD72739392926ACEFF5F8AF776EBFF5E8FCE9735EFFCEB3F19A581A', (err, decoded) => {
            if (err) {
                res.json({
                    isAuth: false, token: null, message: "Authentication Failed"
                });
            } else {
                res.json({
                    isAuth: true, token: token
                });
                next();
            }
        })
    } else {
        res.json({
            isAuth: false, token: null, message: "Authentication Failed"
        });
    }
}

module.exports = { requireAuth };
