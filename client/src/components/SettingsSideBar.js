/* Component for rendering the sidebar of the settings page
   Users can use this component to logout or switch tabs
*/

import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import SettingsIcon from "@material-ui/icons/Settings";
import SettingsTab from "./SettingsTab";
import { LOGOUT_ROUTE } from "../Routes";
import {EMAIL_TAG, LOGIN_URL} from "../Constants";
import { socket } from "../sockets";

const useStyles = makeStyles(theme => ({
    tab_container: {
        backgroundColor: "white",
        borderRight: "1px solid #ddd",
        padding: theme.spacing(6),
        [theme.breakpoints.down("sm")]: {
            padding: theme.spacing(4)
        },
        [theme.breakpoints.down("xs")]: {
            padding: theme.spacing(1)
        }
    },
    title_container: {
        position: "relative",
        marginBottom: theme.spacing(4)
    },
    title: {
        display: "inline",
        fontWeight: "bold"
    },
    icon: {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        marginLeft: theme.spacing(1),
        color: theme.primary
    }
}));

function SettingsSideBar(props) {
    const classes = useStyles();
    const [index, setIndex] = useState(0);
    const tabNames = ["Company", "Security", "Log out"];

    const handleLogOut = () => {
        setIndex(2);
        fetch(LOGOUT_ROUTE, {
            method: "POST"
        }).then(res => {
            socket.emit("logout", localStorage.getItem(EMAIL_TAG));
            localStorage.clear();
            socket.off("disconnect");  // prevents from trying to reconnect
            socket.close();
            props.history.push(LOGIN_URL);
        });
    };

    const tabFunctions = [() => setIndex(0), () => setIndex(1), handleLogOut];
    const tabs = tabNames.map((name, tabIndex) => (
        <SettingsTab key={name} active={index === tabIndex} click={tabFunctions[tabIndex]}>
            {name}
        </SettingsTab>
    ));

    return (
        <div className={classes.tab_container}>
            <Box className={classes.title_container}>
                <Typography variant="h4" className={classes.title}>
                    Settings
                </Typography>
                <SettingsIcon className={classes.icon} fontSize="large" />
            </Box>
            {tabs}
        </div>
    );
}

export default SettingsSideBar;
