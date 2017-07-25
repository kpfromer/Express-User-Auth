const loggedOut = (req, res, next) => {
    if(req.session && req.session.userId) {
        return res.redirect('/profile');
    } else {
        next();
    }
};

const requiresLogin = (req, res, next) => {
    if(req.session && req.session.userId) {
        next();
    } else {
        const err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);
    }
};

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;