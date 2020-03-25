import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { USERS_ROUTE } from "../Routes";
import { DASHBOARD_URL, EMAIL_TAG, COMPANY_NAMES_TAG, SITES_TAG } from "../Constants";
import AccountForm from "../components/AccountForm";

const MIN_PASSWORD_LENGTH = 7;
const MIN_PASSWORD_ERR_MSG = `Your password must be at least ${MIN_PASSWORD_LENGTH} characters long`;
const DIFFERENT_PASSWORD_MSG = "Passwords do not match";
const TAKEN_EMAIL_ERR_MSG = "That email is already taken";
const INTERNAL_SERVER_ERR_MSG = "Server has malfunctioned. Please try again later";

const styles = theme => ({
    signup_form__inputs: {
        padding: theme.spacing(2),
        width: 300,
        display: "block"
    }
});

class SignupForm extends Component {
    constructor(props) {
        super(props);
        this.email = React.createRef();
        this.name = React.createRef();
        this.password = React.createRef();
        this.confirm = React.createRef();
        // Using state to keep track of errors and respond appropriately
        this.state = {
            emailErr: false,
            passwordErr: false,
            confirmErr: false,
            emailErrMsg: "",
            passwordErrMsg: "",
            confirmErrMsg: ""
        };
    }

    // Remove Error messages on change
    handleChange = index => {
        switch (index) {
            case 0: {
                this.setState({ emailErr: false, emailErrMsg: "" });
                break;
            }
            case 1: {
                this.setState({ passwordErr: false, passwordErrMsg: "" });
                break;
            }
            case 2: {
                this.setState({ confirmErr: false, confirmErrMsg: "" });
                break;
            }
            default: {
                return;
            }
        }
    };

    handleSubmit = e => {
        e.preventDefault();

        const email = this.email.current.value;
        const name = this.name.current.value;
        const password = this.password.current.value;
        const confirm = this.confirm.current.value;

        if (this.validate(email, password, confirm)) {
            fetch(USERS_ROUTE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, companies: name, password })
            })
                .then(res => {
                    // Token received => success
                    if (res.status === 201) {
                        res.json().then(data => {
                            localStorage.setItem(EMAIL_TAG, data[EMAIL_TAG]);
                            localStorage.setItem(COMPANY_NAMES_TAG, data[COMPANY_NAMES_TAG]);
                            localStorage.setItem(SITES_TAG, JSON.stringify(data[SITES_TAG]));
                            this.props.history.push(DASHBOARD_URL);
                        });
                    } else if (res.status >= 500) {
                        this.setState({
                            emailErr: true,
                            emailErrMsg: INTERNAL_SERVER_ERR_MSG
                        });
                    } else {
                        res.json().then(data => {
                            this.setState({
                                emailErr: true,
                                emailErrMsg: TAKEN_EMAIL_ERR_MSG,
                                passwordErr: false,
                                passwordErrMsg: ""
                            });
                        });
                    }
                })
                .catch(err => console.error("Error: ", err));
        }
    };

    // Helper function to check for incorrect inputs (short password, invalid character, etc)
    validate = (email, password, confirm) => {
        let valid = true;
        if (password.length < MIN_PASSWORD_LENGTH) {
            this.setState({ passwordErr: true, passwordErrMsg: MIN_PASSWORD_ERR_MSG });
            valid = false;
        }
        if (password !== confirm) {
            this.setState({
                passwordErr: true,
                confirmErr: true,
                passwordErrMsg: DIFFERENT_PASSWORD_MSG,
                confirmErrMsg: DIFFERENT_PASSWORD_MSG
            });
            valid = false;
        }
        return valid;
    };

    render() {
        const { classes } = this.props;
        return (
            <AccountForm mainMsg="Let's get Started!" subMsg="Create an account" btnMsg="Create" submit={this.handleSubmit}>
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
                    onChange={() => this.handleChange(0)}
                />

                <TextField
                    className={classes.signup_form__inputs}
                    variant="outlined"
                    fullWidth
                    placeholder="Your company name"
                    inputProps={{ "aria-label": "company name" }}
                    required
                    inputRef={this.name}
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
                    onChange={() => this.handleChange(1)}
                />

                <TextField
                    className={classes.signup_form__inputs}
                    variant="outlined"
                    fullWidth
                    placeholder="Confirm password"
                    type="password"
                    inputProps={{ "aria-label": "password" }}
                    required
                    inputRef={this.confirm}
                    error={this.state.confirmErr}
                    helperText={this.state.confirmErrMsg}
                    onChange={() => this.handleChange(2)}
                />
            </AccountForm>
        );
    }
}

export default withStyles(styles)(SignupForm);
