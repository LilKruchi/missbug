import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const BASE_URL = '/api/bug/'
// const STORAGE_KEY = 'bugDB'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getEmptyBug,
    getPDF,
    getDefaultFilter
}


function query(filterBy = getDefaultFilter()) {

    const searchQuery = `?title=${filterBy.title}&pageIdx=${filterBy.pageIdx}&ownerId=${filterBy.ownerId}`
    return axios.get(BASE_URL + searchQuery)
        .then(res => res.data)

    // return axios.get(BASE_URL).then(res => res.data)
    //     .then(bugs => {
    //         if (filterBy.title) {
    //             console.log('bug');
    //             const regex = new RegExp(filterBy.title, 'i')
    //             bugs = bugs.filter(bug => regex.test(bug.title))
    //         }
    //         return bugs
    //     })
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
    console.log(bug);
    const url = (bug._id) ? BASE_URL + `${bug._id}` : BASE_URL
    const method = (bug._id) ? 'put' : 'post'
    console.log(method);
    // return axios.get(BASE_URL + 'save' + queryParams).then(res => res.data)
    return axios[method](url, bug).then(res => res.data)
}

function getEmptyBug(id = '', title = '', description = '', severity = 0, createdAt = 0) {
    return { id, title, description, severity, createdAt }
}

function getPDF() {
    return axios.get(BASE_URL + 'save_pdf')
}

function getDefaultFilter() {
    return { title: '', pageIdx: 0, ownerId: '' }
}