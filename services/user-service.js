const fs = require('fs')

const Cryptr = require('cryptr')
const cryptr = new Cryptr('vesoevesrhvsio29337dvheoeivch')

var users = require('../data/user.json')

module.exports = {
    query,
    get,
    remove,
    login,
    signup,
    loginToken,
    validateToken
}

function loginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(token) {
    try {
        const json = cryptr.decrypt(token)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('invalid token')
    }
    return null
}

function query(filterBy) {
    let filteredUsers = users
    return Promise.resolve(filteredUsers)
}

function get(userId) {
    const user = users.find(user => user._id === userId)
    if (!user) return Promise.reject('User not found')
    return Promise.resolve(user)
}

function remove(userId) {
    const idx = users.findIndex(user => user._id === userId)
    if (idx === -1) return Promise.reject('Cannot find user to remove')
    users.splice(idx, 1)
}

function login(credentials) {
    const user = users.find(u => u.username === credentials.username)
    if (!user) return Promise.reject('Login failed')
    return Promise.resolve(user)
}

function signup({ fullname, username, password }) {
    const saveUser = {
        _id: _makeId(),
        fullname,
        username,
        password,
        isAdmin: false
    }
    users.push(saveUser)
    return _writeUsersToFile().then(() => saveUser)
}

function _makeId(length = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function _writeUsersToFile() {
    return new Promise((res, rej) => {
        const data = JSON.stringify(users, null, 2)
        fs.writeFile('./data/user.json', data, (err) => {
            if (err) return rej(err)
            // console.log("File written successfully\n");
            res()
        })
    })
}
