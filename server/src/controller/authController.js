import * as authService from "../services/auth.js"

export async function createUser(req, res) {
    const {email, username, password} = req.body

    try {
        authService.validateSignup({username, email, password});
        const user_id = await authService.createUser(username, email, password);
        await authService.createSession(user_id, req);

        res.status(201).json({message: 'signup success'});
    } catch (error) {
        res.status(error.status || 500).json({message: error.message || "server error"});
    }
}

export async function createSession(req, res) {
    const { email, password } = req.body;

    try {
        authService.validateLogin({email, password})
        const user = await authService.authUser(email, password);
        await authService.createSession(user.rows[0].user_id, req);

        res.status(200).json({message: 'login successful'})
    } catch (error) {
        res.status(error.status || 500).json({message: error.message})
    }
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

