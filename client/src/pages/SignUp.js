import React from "react";
import AccountNavBar from "../components/AccountNavBar";
import SignupForm from "../components/SignupForm";
import { LOGIN_URL } from "../Constants";

function SignUp(props) {
    return (
        <div>
            <AccountNavBar accountMsg="Already have an account?" btnMsg="Login" link={LOGIN_URL} />
            <SignupForm history={props.history} />
        </div>
    );
}

export default SignUp;
