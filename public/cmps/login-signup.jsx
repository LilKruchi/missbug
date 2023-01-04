import { userService } from '../services/user.service.js'
import { LoginForm } from './login-form.jsx'

const { useState } = React

export function LoginSignup({ onChangeLoginStatus }) {

    const [isSignup, setIsSignUp] = useState(false)

    function onLogin(credentials) {
        isSignup ? signup(credentials) : login(credentials)
    }

    function login(credentials) {
        userService.login(credentials)
            .then(onChangeLoginStatus)
            .then(() => { console.log('Logged in successfully') })
            .catch((err) => { console.log('Oops try again') })
    }

    function signup(credentials) {
        userService.signup(credentials)
            .then(onChangeLoginStatus)
            .then(() => { console.log('Signed in successfully') })
            .catch((err) => { console.log('Oops try again') })
    }

    return (
        <div className="login-page">
            <LoginForm
                onLogin={onLogin}
                isSignup={isSignup}
            />
            <div className="btns">
                <a href="#" onClick={() => setIsSignUp(!isSignup)}>
                    {isSignup ?
                        'Already a member? Login' :
                        'New user? Signup here'
                    }
                </a >
            </div>
        </div >
    )
}
