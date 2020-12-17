const User = require('../models/User');
const Budget = require('../models/Budget');
const jwt = require('jsonwebtoken');
// handle errors method
const handleErrors = (err) => {

    let errors = { email: '', password: ''};

    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }

    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }

    // duplicate error code
    if (err.code === 11000) {
        errors.email = 'That email is already registered';
        return errors;
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}
// 60F86D370CD72739392926ACEFF5F8AF776EBFF5E8FCE9735EFFCEB3F19A581A pb backend secret
const maxAge = 60;
const createToken = (id) => {
    return jwt.sign({ userId: id }, '60F86D370CD72739392926ACEFF5F8AF776EBFF5E8FCE9735EFFCEB3F19A581A', {
        expiresIn: maxAge
    })
}

module.exports.isUserAuth = (req, res) => {
    res.status(202);
}

module.exports.signup_get = (req, res) => {
    res.status(202);
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, sameSite: 'None', secure: true });
        res.status(201).json({ token, isAuth: true });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}
module.exports.login_get = (req, res) => {
    res.status(202);
}
module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, sameSite: 'None', secure: true });
        res.status(200).json({ isAuth: true, user: user._id, token });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { httpOnly: true, maxAge: 1, sameSite: 'None', secure: true });
    res.json({ isAuth: false, token: null });
}

module.exports.budget_get = async (req, res) => {
    const token = req.cookies.jwt;

    await jwt.verify(token, '60F86D370CD72739392926ACEFF5F8AF776EBFF5E8FCE9735EFFCEB3F19A581A', (err, decoded) => {
        if (err) {
            res.json({
                isAuth: false, message: "Authentication Failed"
            });
        } else {
            const { userId } = decoded;
            Budget.find({ userId }).then(function(budgets){
                res.send(budgets);
            });
        }
    })
}

const handleBVErrors = (err) => {

    let errors = { title: '', budget: '', month:''};

    // validation errors
    if (err.message.includes('budget validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

module.exports.budget_post = async (req, res) => {
    await Budget.create(req.body).then(function(budget){
        res.send(budget);
    }).catch((err) => {
        const errors = handleBVErrors(err);
        res.status(400).json({ errors });
    });
};

module.exports.budget_deleteAll = async (req, res) => {
    const token = req.cookies.jwt;

    await jwt.verify(token, '60F86D370CD72739392926ACEFF5F8AF776EBFF5E8FCE9735EFFCEB3F19A581A', (err, decoded) => {
        if (err) {
            res.json({
                isAuth: false, message: "Authentication Failed"
            });
        } else {
            const { userId } = decoded;
            Budget.deleteMany({ userId }).then(function(budgets){
                res.send(budgets);
            });
        }
    })
}

module.exports.budget_delete = async (req, res) => {
    const token = req.cookies.jwt;

    await jwt.verify(token, '60F86D370CD72739392926ACEFF5F8AF776EBFF5E8FCE9735EFFCEB3F19A581A', (err, decoded) => {
        if (err) {
            res.json({
                isAuth: false, message: "Authentication Failed"
            });
        } else {
            const { userId } = decoded;
            Budget.deleteOne({ userId }).then(function(budgets){
                res.send(budgets);
            });
        }
    })
}

module.exports.refresh_get = async (req, res) => {
    const token = req.cookies.jwt;
    await jwt.verify(token, '60F86D370CD72739392926ACEFF5F8AF776EBFF5E8FCE9735EFFCEB3F19A581A', (err, decoded) => {
        if (err) {
            res.json({
                isAuth: false, message: "Authentication Failed"
            });
        } else {
            const { userId } = decoded;
            const token = createToken(userId);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, sameSite: 'None', secure: true });
            res.status(200).json({ isAuth: true, token });
        }
    })
}


