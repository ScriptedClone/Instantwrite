function isValidSession(req) {
    if (req.session.auth) {
        return true;
    }
    return false;
}

export function sessionValidation(req,res,next) {
    if (isValidSession(req)) {
        next();
    }
    else {
        return res.status(401).json({message: 'invalid session'})
    }
}