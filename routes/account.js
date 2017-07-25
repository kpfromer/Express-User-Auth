const express = require('express');
const router = express.Router();

const User = require('../models/user');
const mid = require('../middleware');

router.get('/register', mid.loggedOut, (req, res) => {
    return res.render('register', {title: 'Sign up'});
});

router.post('/register', mid.loggedOut, (req, res, next) => {
    if (req.body.email &&
        req.body.name &&
        req.body.favoriteBook &&
        req.body.password &&
        req.body.confirmPassword){

        if (req.body.password !== req.body.confirmPassword){
            const err = new Error('Passwords do not match.');
            err.status = 400;
            return next(err);
        }

        const userData = {
            email: req.body.email,
            name: req.body.name,
            favoriteBook: req.body.favoriteBook,
            password: req.body.password
        };

        User.create(userData, function (error, user){
            if (error){
                return next(error);
            } else {
                req.session.userId = user._id;
                res.redirect('/profile');
            }
        });

    } else {
        const err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});


router.get('/login', mid.loggedOut, (req, res) => {
    return res.render('login', {title: 'Log In'});
});


router.post('/login', mid.loggedOut, (req, res, next) => {
    if (req.body.email && req.body.password){
        User.authenticate(req.body.email, req.body.password, function (error, user) {
            if (error || !user){
                const err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });
    } else {
        const err = new Error('Email and password are required.');
        err.status = 401;
        next(err);
    }
});

router.get('/profile', mid.requiresLogin, (req, res, next) => {
    if (!req.session.userId){
        const err = new Error('You are not authorized to view this page.');
        err.status = 403;
        return next(err);
    }
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if(error) {
                return next(error);
            } else {
                return res.render('profile', {title: 'Profile', name: user.name, favorite: user.favoriteBook});
            }
        });
});

router.get('/logout', mid.requiresLogin, (req, res, next) => {
    if (req.session.userId){
        req.session.destroy(function(err) {
            if (err) return next(err);
            else {
                return res.redirect('/');
            }
        });
    } else {
        const err = new Error('You are not currently logged in.');
        err.status = 401;
        return next(err);
    }
});

module.exports = router;