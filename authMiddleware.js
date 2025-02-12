import express from 'express';
const { Request, Response, NextFunction } = express;

import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  // Extract the token from the cookies
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/login'); // Redirect to login page if no token is present
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Handle invalid or expired tokens
    return res.redirect('/login'); // Redirect to login page if token is invalid
  }
};