/* Component for rendering the navbar on the settings page */

import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "./NavBar";

const useStyles = makeStyles(theme => ({
    link: {
        textDecoration: "none",
        color: "inherit"
    }
}));

function SettingsNavBar(props) {
    const classes = useStyles();

    const { children, link } = props;

    return (
        <Navbar flexGrow={1}>
            <Link to={link} className={classes.link}>
                {children}
            </Link>
        </Navbar>
    );
}

export default SettingsNavBar;
