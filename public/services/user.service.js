import { bugService } from "./bug.service.js"

const BASE_URL = '/api/user/'

export const userService = {
    get,
    getEmptyUser,
    getLoggedInUser,
    logout,
    login,
    signup,
    getUserPosts
}

function get(userId) {
    return axios.get(BASE_URL + userId).then(res => res.data)
}

function signup(userDetail) {
    return axios.post(BASE_URL + 'signup', userDetail)
        .then(res => res.data)
        .then(user => {
            _saveLoggedinUser(user)
            return user
        })
}

function getEmptyUser(fullname = '', username = '', password = 'pass123') {
    return { fullname, username, password }
}


function logout() {
    return axios.post(BASE_URL + 'logout')
        .then(() => {
            sessionStorage.removeItem('loggedinUser')
        })
}

function login(credentials) {
    return axios.post(BASE_URL + 'login', credentials)
        .then(res => res.data)
        .then(user => {
            _saveLoggedinUser(user)
            return user
        })
}

function signup(credentials) {
    return axios.post(BASE_URL + 'signup', credentials)
        .then(res => res.data)
        .then(user => {
            _saveLoggedinUser(user)
            return user
        })
}

function getUserPosts(userId) {
    return bugService.query({ title: '', pageIdx: '', ownerId: userId }).then(res => res)
}

function getLoggedInUser() {
    console.log(sessionStorage.getItem('loggedinUser'));
    return JSON.parse(sessionStorage.getItem('loggedinUser'))
}

function _saveLoggedinUser(user) {
    console.log(user);
    sessionStorage.setItem('loggedinUser', JSON.stringify(user))
}