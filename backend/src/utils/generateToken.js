import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { Config } from '../config/index.js';

const generateTokenAndSetCookie = (userId, res) => {
    // Create the JWT token
    const token = jwt.sign({ id: userId }, Config.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

    // Set the token in a cookie
    res.setHeader('Set-Cookie', cookie.serialize('jwt-token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60,
        path: '/',
    }));
};

export { generateTokenAndSetCookie };
