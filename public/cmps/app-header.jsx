const { Link, NavLink } = ReactRouterDOM
const { useEffect, useState } = React

import { LoginSignup } from './login-signup.jsx'
import { userService } from '../services/user.service.js'

export function AppHeader() {
    const [user, setUser] = useState(userService.getLoggedInUser())

    function onChangeLoginStatus(user) {
        setUser(user)
    }

    function onLogout() {
        userService.logout()
            .then(() => {
                setUser(null)
            })
    }

    return (
        <header>
            <nav>
                <NavLink to="/">Home</NavLink> |
                <NavLink to="/bug">Bugs</NavLink> |
                <NavLink to="/about">About</NavLink>
            </nav>
            {user ? (
                < section >
                    <h2>Hello {user.fullname}</h2>
                    <Link to="/user-details">User details </Link>
                    <button onClick={onLogout}>Logout</button>
                </ section >
            ) : (
                <section>
                    <LoginSignup onChangeLoginStatus={onChangeLoginStatus} />
                </section>
            )}
            <h1>Bugs are Forever</h1>
        </header>
    )
}
