const express = require('express')
const cookieParser = require('cookie-parser')

const bugService = require('./services/bug-service.js')
const userService = require('./services/user-service.js')

const app = express()
const PORT = 3030

// Cookies lifespan is 7 sec's
const COOKIE_AGE = 1000 * 7
const IS_PREMIUM = false

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// List bugs
app.get('/api/bug', (req, res) => {
    const filteredBy = req.query
    bugService.query(filteredBy).then(bugs => {
        res.send(bugs)
    })
})

app.get('/api/bug/save_pdf', (req, res) => {
    bugService.createPDF()
    res.send()
})

app.put('/api/bug/:bugId', (req, res) => {
    const bug = req.body
    bugService.save(bug).then(savedBug => res.send(savedBug))
})

app.post('/api/bug', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status('cannot add bug')
    const bug = req.body
    bugService.save(bug, loggedinUser).then(savedBug => { res.send(savedBug) })
})

// Read bug - getById
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    let visitCountIds = req.cookies.visitCountIds || []

    if (!visitCountIds.includes(bugId)) {
        if (visitCountIds.length >= 3 && !IS_PREMIUM) {
            return res.status(401).send('Wait for a bit')
        }
        visitCountIds.push(bugId)
    }

    bugService.get(bugId).then(bug => {
        res.cookie('visitCountIds', visitCountIds, { maxAge: COOKIE_AGE })
        res.send(bug)
    })
})

// Remove bug
app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status('cannot add bug')
    console.log(loggedinUser);
    const { bugId } = req.params

    bugService.remove(bugId, loggedinUser)
        .then(bug => {
            res.send(bug)
        })
})



// User
app.get('/api/user', (req, res) => {
    const filterBy = req.query
    userService.query()
        .then(users => {
            console.log(users);
            res.send(users)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot get users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    console.log(userId);
    userService.get(userId)
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
        })
})

app.post('/api/user/signup', (req, res) => {
    const { fullname, username, password } = req.body
    userService.signup({ fullname, username, password })
        .then(user => {
            const loginToken = userService.loginToken(user)
            res.cookie('loginToken', loginToken, { maxAge: 1000 * 60 * 60 * 60 })
            res.send(user)
        })
})

app.post('/api/user/login', (req, res) => {
    const { username, password } = req.body
    userService.login({ username, password })
        .then(user => {
            const loginToken = userService.loginToken(user)
            res.cookie('loginToken', loginToken, { maxAge: 1000 * 60 * 60 * 60 })
            res.send(user)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(400).send('Cannot signup')
        })
})

app.post('/api/user/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged out')
})

app.post('/api/user/delete/:userId', (req, res) => {
    const { userId } = req.params
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}: http://localhost:${PORT}/`))