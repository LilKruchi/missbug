const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'


export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()

    useEffect(() => {
        bugService.getById(bugId)
            .then(bug => {
                setBug(bug)
            })
            .catch(err => {
                showErrorMsg('Cannot load bug', err)
            })
    }, [])
    if (!bug) return <h1>loadings....</h1>
    return bug && <div>
        <h2>Bug Details 🐛</h2>
        <h3>{bug[0].title}</h3>
        <p>{bug[0].description}</p>
        <p>Severity: <span>{bug[0].severity}</span></p>
        <Link to="/bug">Back to List</Link>
    </div>

}

