import * as authService from "../services/authServices.js"

export async function createUser(req, res) {
    const {email, username, password} = req.body
    authService.validateSignup({username, email, password});

    const user_id = await authService.createUser(username, email, password);
    await authService.createSession(user_id, req);

    res.status(201).json({message: 'signup success'});
}

export async function createSession(req, res) {
    const { email, password } = req.body;
    authService.validateLogin({email, password})
    
    const user = await authService.authUser(email, password);
    await authService.createSession(user.rows[0].user_id, req);

    res.status(200).json({message: 'login successful'})
}

export async function deleteSession(req, res) {
    req.session.destroy((error) =>{
        if(error) {
            res.status(500).json({message: 'log-out failed, please try again'})
            return;
        }
        res.status(200).json({message: 'session deleted'});
    })
}

export async function checkSession(req, res) {
    const isAuthenticated = req.session.auth;

    if(isAuthenticated) {
        res.status(200).json({message: 'User has active session', session: true});
        return
    }
    
    if(!isAuthenticated) {
        res.status(200).json({message: 'User has no active session', session: false})
        return
    }
}

