import * as authService from "../services/authServices.js"

export async function createUser(req, res) {
    const {email, username, password} = req.body
    authService.validateSignup({username, email, password});

    const user_id = await authService.createUser(username, email, password);
    await authService.createSession(user_id, req);

    res.status(201).json({message: 'signup success'});
}

function ts() {
    return new Date().toISOString();
}

export async function createSession(req, res) {
    console.log(`[${ts()}] login: total start`);
    console.time('login: total');

    const { email, password } = req.body;
    authService.validateLogin({ email, password });

    const user = await authService.authUser(email, password);

    req.session.auth = true;
    req.session.user_id = user.rows[0].user_id;
    req.session.cookie.maxAge = 60 * 60 * 1000;

    console.log(`[${ts()}] login: session save start`);
    console.time('login: session save');

    req.session.save((error) => {
        console.timeEnd('login: session save');
        console.log(`[${ts()}] login: session save end`);

        console.timeEnd('login: total');
        console.log(`[${ts()}] login: total end`);

        if (error) {
            return res.status(500).json({ message: 'session save failed' });
        }

        res.status(200).json({ message: 'login successful' });
    });
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

