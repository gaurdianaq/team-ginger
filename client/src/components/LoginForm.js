import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import AccountForm from "./AccountForm";
import { LOGIN_ROUTE } from "../Routes";
import { COMPANY_NAMES_TAG, DASHBOARD_URL, EMAIL_TAG, SITES_TAG } from "../Constants";

const INCORRECT_ERR_MSG = "Incorrect email or password";

const styles = theme => ({
    signup_form__inputs: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        padding: theme.spacing(2),
        width: 300,
        display: "block"
    }
});

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.email = React.createRef();
        this.password = React.createRef();
        // Using state to keep track of errors and respond appropriately
        this.state = { emailErr: false, passwordErr: false, emailErrMsg: "", passwordErrMsg: "" };
    }

    // Remove Error messages on change
    handleChange = () => {
        this.setState({ emailErr: false, passwordErr: false, emailErrMsg: "", passwordErrMsg: "" });
    };

    handleSubmit = e => {
        e.preventDefault();

        let email = this.email.current.value;
        let password = this.password.current.value;
        fetch(LOGIN_ROUTE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
            .then(res => {
                // Token received => success
                if (res.status === 200) {
                    res.json().then(data => {
                        localStorage.setItem(EMAIL_TAG, data[EMAIL_TAG]);
                        localStorage.setItem(COMPANY_NAMES_TAG, data[COMPANY_NAMES_TAG]);
                        localStorage.setItem(SITES_TAG, JSON.stringify(data[SITES_TAG]));
                        this.props.history.push(DASHBOARD_URL);
                    });
                } else {
                    this.setState({
                        emailErr: true,
                        emailErrMsg: INCORRECT_ERR_MSG,
                        passwordErr: true,
                        passwordErrMsg: INCORRECT_ERR_MSG
                    });
                }
            })
            .catch(err => console.error("Error: ", err));
    };

    render() {
        const { classes } = this.props;
        return (
            <AccountForm mainMsg="Welcome back!" subMsg="Login to your account" btnMsg="Log in" submit={this.handleSubmit}>
                <TextField
                    className={classes.signup_form__inputs}
                    variant="outlined"
                    fullWidth
                    placeholder="Your email"
                    type="email"
                    inputProps={{ "aria-label": "email" }}
                    required
                    inputRef={this.email}
                    error={this.state.emailErr}
                    helperText={this.state.emailErrMsg}
                    onChange={this.handleChange}
                />

                <TextField
                    className={classes.signup_form__inputs}
                    variant="outlined"
                    fullWidth
                    placeholder="Your password"
                    type="password"
                    inputProps={{ "aria-label": "password" }}
                    required
                    inputRef={this.password}
                    error={this.state.passwordErr}
                    helperText={this.state.passwordErrMsg}
                    onChange={this.handleChange}
                />
            </AccountForm>
        );
    }
}

export default withStyles(styles)(LoginForm);
