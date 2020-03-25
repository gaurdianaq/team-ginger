/* Component rendering the body or the main content of the settings page
   Users can use this component to add company names or change weekly email
*/

import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { USERS_ROUTE, COMPANIES_ROUTE } from "../Routes";
import CompanyNames from "./CompanyNames";
import {
    COMPANY_NAMES_TAG,
    SAVE_EVENT_TAG,
    EMAIL_TAG,
    RESPONSE_TAG,
    GOOD_SNACKBAR,
    BAD_SNACKBAR,
    LOGIN_URL,
    UPDATE_EVENT_TAG,
    SITES_TAG
} from "../Constants";
import { withSnackbar } from "notistack";
import { socket } from "../sockets";

const MAX_NAME_LIMIT = 5;
const NO_NAME_MESSAGE = "Must have at least one name";
const DUPLICATE_NAME_MESSAGE = "Cannot have two identical names";
const EMPTY_NAME_MESSAGE = "Cannot have an empty name";
const EMAIL_CHANGE_MESSAGE = "Email succesfully changed";
const NAME_CHANGE_MESSAGE = "Company names succesfully changed";
const BOTH_CHANGE_MESSAGE = "Email and Company names successfully changed";

const styles = theme => ({
    container: {
        width: "80%",
        margin: `${theme.spacing(6)}px auto ${theme.spacing(20)}px auto`,
        display: "grid",
        alignItems: "center",
        gridGap: theme.spacing(1),
        gridTemplateColumns: "1fr 3fr",
        gridAutoRows: "65px",
        paddingRight: theme.spacing(10),
        overflow: "auto",
        height: "80vh"
    },
    input_container: {
        display: "flex",
        borderRadius: 500,
        padding: theme.spacing(1)
    },
    input: {
        flexGrow: 1,
        paddingLeft: theme.spacing(1)
    },
    save_btn: {
        maxWidth: 125
    }
});

class SettingsBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            names: localStorage.getItem(COMPANY_NAMES_TAG).split(","),
            email: localStorage.getItem(EMAIL_TAG)
        };
    }

    // When a user adds a name
    addName = name => {
        const { names } = this.state;
        const { enqueueSnackbar } = this.props;
        // Prevent duplicate and empty names
        if (name === "") {
            this.props.enqueueSnackbar(EMPTY_NAME_MESSAGE, BAD_SNACKBAR);
        } else if (!names.find(entry => entry === name)) {
            this.setState({ names: names.concat(name) });
        } else {
            enqueueSnackbar(DUPLICATE_NAME_MESSAGE, BAD_SNACKBAR);
        }
    };

    // When a user removes a name
    removeName = name => {
        const { names } = this.state;
        const { enqueueSnackbar } = this.props;
        if (names.length > 1) {
            let index = names.findIndex(n => n === name);
            this.setState({ names: names.slice(0, index).concat(names.slice(index + 1, names.length)) });
        } else {
            enqueueSnackbar(NO_NAME_MESSAGE, BAD_SNACKBAR);
        }
    };

    isEqualNames = () => {
        const oldNames = localStorage
            .getItem(COMPANY_NAMES_TAG)
            .split(",")
            .sort();
        const newNames = this.state.names.sort();
        let isSame = oldNames.length === newNames.length;
        if (isSame) {
            oldNames.forEach((oldName, index) => (isSame = isSame && oldName === newNames[index]));
        }

        return isSame;
    };

    handleEmailChange = (resolve, reject) =>
        fetch(USERS_ROUTE, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: this.state.email })
        })
            .then(res => resolve(res))
            .catch(err => reject(err));

    handleNamesChange = (resolve, reject) => {
        fetch(COMPANIES_ROUTE, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [COMPANY_NAMES_TAG]: this.state.names })
        })
            .then(res => resolve(res))
            .catch(err => reject(err));
    };

    //  When the user hits save
    handleSave = () => {
        let requestedEmailChange = false;
        let requestedNameChange = false;
        let emailChanged = false;
        let namesChanged = false;
        let emailPromise = Promise.resolve(true);
        let namesPromise = Promise.resolve(true);
        const { enqueueSnackbar, history } = this.props;
        const { email, names } = this.state;

        if (localStorage.getItem(EMAIL_TAG) !== email) {
            emailPromise = new Promise(this.handleEmailChange);
            requestedEmailChange = true;
        }

        if (!this.isEqualNames()) {
            namesPromise = new Promise(this.handleNamesChange);
            requestedNameChange = true;
        }

        Promise.all([emailPromise, namesPromise]).then(function([emailResponse, namesResponse]) {
            if (requestedEmailChange) {
                if (emailResponse.status === 200) {
                    localStorage.setItem(EMAIL_TAG, email);
                    emailChanged = true;
                    socket.emit(SAVE_EVENT_TAG, JSON.stringify({ email: email }));
                } else if (emailResponse.status === 401) {
                    localStorage.clear();
                    history.push(LOGIN_URL);
                    return;
                } else {
                    emailResponse.json().then(data => {
                        enqueueSnackbar(data[RESPONSE_TAG], BAD_SNACKBAR);
                    });
                }
            }

            if (requestedNameChange) {
                if (namesResponse.status === 200) {
                    localStorage.setItem(COMPANY_NAMES_TAG, names);
                    namesChanged = true;
                    socket.emit(SAVE_EVENT_TAG, JSON.stringify({ companies: localStorage.getItem(COMPANY_NAMES_TAG) }));
                } else if (namesResponse.status === 401) {
                    localStorage.clear();
                    history.push(LOGIN_URL);
                    return;
                } else {
                    namesResponse.json().then(data => {
                        enqueueSnackbar(`Error: ${data[RESPONSE_TAG]}`, BAD_SNACKBAR);
                    });
                }
            }

            if (emailChanged) {
                if (namesChanged) {
                    enqueueSnackbar(BOTH_CHANGE_MESSAGE, GOOD_SNACKBAR);
                } else {
                    enqueueSnackbar(EMAIL_CHANGE_MESSAGE, GOOD_SNACKBAR);
                }
            } else if (namesChanged) {
                enqueueSnackbar(NAME_CHANGE_MESSAGE, GOOD_SNACKBAR);
            }
        });
    };

    render() {
        const { classes } = this.props;
        const { names, email } = this.state;

        const filledNames = names.map(name => (
            <React.Fragment key={name}>
                <CompanyNames
                    filled={true}
                    val={name}
                    remove={this.removeName}
                    classIC={classes.input_container}
                    classI={classes.input}
                />
                <div></div>
            </React.Fragment>
        ));

        // Note that there are empty columns on the grid to force some spacing
        return (
            <div className={classes.container}>
                <Typography variant="h6">Your Company</Typography>
                {filledNames}

                {names.length >= MAX_NAME_LIMIT ? (
                    <div></div>
                ) : (
                    <CompanyNames
                        filled={false}
                        val={""}
                        add={this.addName}
                        classIC={classes.input_container}
                        classI={classes.input}
                    />
                )}

                <div></div>
                <div></div>

                <Typography variant="h6">Weekly Report</Typography>
                <Paper className={classes.input_container}>
                    <InputBase
                        type="email"
                        placeholder="Company email"
                        className={classes.input}
                        value={email}
                        onChange={e => this.setState({ email: e.target.value })}
                        inputProps={{ "aria-label": "Company email" }}
                    />
                </Paper>

                <div></div>
                <div></div>

                <Button className={classes.save_btn} onClick={this.handleSave}>
                    Save
                </Button>
            </div>
        );
    }

    componentDidMount() {
        socket.on(UPDATE_EVENT_TAG, data => {
            let parsed_data = JSON.parse(data);
            if (parsed_data[SITES_TAG]) {
                localStorage.setItem(SITES_TAG, JSON.stringify(parsed_data[SITES_TAG]));
            } else if (parsed_data[COMPANY_NAMES_TAG]) {
                let names = parsed_data[COMPANY_NAMES_TAG];

                localStorage.setItem(COMPANY_NAMES_TAG, names);
                this.setState({ names: names.split(",") });
            } else if (parsed_data[EMAIL_TAG]) {
                let email = parsed_data[EMAIL_TAG];
                localStorage.setItem(EMAIL_TAG, email);
                this.setState({ email: email });
            }
        });
    }

    componentWillUnmount() {
        socket.off(UPDATE_EVENT_TAG);
    }
}

export default withSnackbar(withStyles(styles)(SettingsBody));
