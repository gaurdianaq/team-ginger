/* Component for rendering the nav bar on the signup/login page */

/* Component for rendering the nav bar on all pages */

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Box from "@material-ui/core/Box";

import Logo from "../assets/logo.png";

const useStyles = makeStyles(theme => ({
    toolbar: {
        backgroundColor: theme.primary
    }
}));

function NavBar(props) {
    const classes = useStyles();

    // Dynamic styling on logo container so it can structured in different ways
    return (
        <AppBar position="static" elevation={0}>
            <Toolbar className={classes.toolbar}>
                <Box style={{ flexGrow: `${props.flexGrow}` }}>
                    <img src={Logo} alt="Logo" />
                </Box>

                {props.children}
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
