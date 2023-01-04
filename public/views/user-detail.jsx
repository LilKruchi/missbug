const { useState, useEffect } = React

import { BugList } from '../cmps/bug-list.jsx'

import { userService } from '../services/user.service.js'

export function UserDetails() {
    const [user, setUser] = useState(userService.getLoggedInUser())
    const [bugs, setBugs] = useState()

    useEffect(() => {
        userService.getUserPosts(user._id).then(res => setBugs(res))
    }, [])

    console.log(bugs);
    return <div>
        <div>
            <h2>Users fullname :{user.fullname}</h2>
            <h3>Username:{user.username}</h3>
            <div>
                {bugs && <BugList bugs={bugs} />}
            </div>
        </div>
    </div>
}