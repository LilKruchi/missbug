const { Link } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { BugList } from '../cmps/bug-list.jsx'
import { BugEdit } from '../cmps/bug-edit.jsx'
import { BugFilter } from '../cmps/bug-filter.jsx'

const { useState, useEffect } = React

export function BugIndex() {

    const [bugs, setBugs] = useState([])
    const [openModal, setOpenModal] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [newBug, setNewBug] = useState(null)

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function onSetFilter(filterBy) {
        setFilterBy(filterBy)
    }
    function loadBugs() {
        bugService.query(filterBy).then(setBugs)
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch(err => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug(ev) {
        ev.preventDefault()

        bugService.save(newBug)
            .then(savedBug => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch(err => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })

        setOpenModal(false)
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService.save(bugToSave)
            .then(savedBug => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map(currBug => (currBug._id === savedBug._id) ? savedBug : currBug)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    return (
        <main>
            <h3>Bugs App</h3>
            <main>
                <button onClick={() => setOpenModal(!openModal)}>Add Bug ⛐</button>
                <button onClick={() => {
                    bugService.getPDF()
                    showSuccessMsg('Bug updated')
                }}>Export ⛐ to PDF</button>
                <div>
                    <BugFilter onSetFilter={onSetFilter} />
                </div>
                {openModal && <BugEdit newBug={setNewBug} onAddBug={onAddBug} isOpen={openModal} />}
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </main>
    )
}
