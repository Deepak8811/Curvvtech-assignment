const userService = require('../../services/user.service');
const authService = require('../../services/auth.service');

const register = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        await userService.createUser(req.body);
        res.status(201).send({ success: true, message: 'User registered successfully' });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, tokens } = await authService.loginUserWithEmailAndPassword(email, password);
        res.send({ success: true, token: tokens.access.token, user });
    } catch (error) {
        res.status(401).send({ success: false, message: error.message });
    }
};

module.exports = {
    register,
    login,
};
