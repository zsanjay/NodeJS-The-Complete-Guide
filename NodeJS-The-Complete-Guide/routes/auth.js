const express = require('express');
const { check, body } = require('express-validator/check');
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', [
    body(
        'email',
        'Please enter a valid email address.'
    )
        .isEmail()
        .normalizeEmail(),
    body(
        'password',
        'Please enter a password with only numbers and text and at least 5 characters.'
    )
        .isAlphanumeric()
        .isLength({ min: 5 })
        .trim()
],
    authController.postLogin
);

router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email address.')
            .custom((value, { req }) => {
                // if (value === 'test@gmail.com') {
                //     throw new Error('This email address if forbidden.');
                // }
                // return true;
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject('E-Mail exists already, please pick a different one.');
                        }
                    })
            })
            .normalizeEmail(),
        body(
            'password',
            'Please enter a password with only numbers and text and at least 5 characters.'
        )
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),
        body(
            'confirmPassword'
        ).trim().custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password and Confirm Password doesn\'t match');
            }
            return true;
        })
    ],
    authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;