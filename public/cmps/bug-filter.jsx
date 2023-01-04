const { useState, useEffect, useRef } = React

import { bugService } from "../services/bug.service.js"

export function BugFilter({ onSetFilter }) {

    const [filterByToEdit, setFilterByToEdit] = useState(bugService.getDefaultFilter())

    useEffect(() => {
        // update father cmp that filters change very type
        onSetFilter(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        let { value, name: field, type } = target
        value = (type === 'number') ? +value : value
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        // update father cmp that filters change on submit
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    function changePage(pageDiff) {
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, pageIdx: prevFilter.pageIdx + (pageDiff) }))

    }

    return <section>
        <h2>Filter our cars</h2>
        <form onSubmit={onSubmitFilter}>

            <label htmlFor="title">title:</label>
            <input type="text"
                id="title"
                name="title"
                placeholder="By title"
                value={filterByToEdit.title}
                onChange={handleChange} />

            <label htmlFor="pageIdx">Page:</label>
            <input type="number"
                id="pageIdx"
                name="pageIdx"
                placeholder="0"
                value={filterByToEdit.pageIdx}
                onChange={handleChange} />

            <button>Filter cars!</button>
        </form>

        <button onClick={() => changePage(1)}>Next</button>
        <button onClick={() => changePage(-1)}>Prev</button>
    </section>
}