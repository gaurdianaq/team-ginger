import React from "react";
import AccountNavBar from "../components/AccountNavBar";
import LoginForm from "../components/LoginForm";
import { SIGNUP_URL } from "../Constants";

function Login(props) {
    return (
        <div>
            <AccountNavBar accountMsg="Don't have an account?" btnMsg="Sign Up" link={SIGNUP_URL} />
            <LoginForm history={props.history} />
        </div>
    );
}

export default Login;
