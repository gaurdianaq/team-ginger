/* Component for rendering the nav bar on the signup/login page */

import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "./NavBar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
    account_msg: {
        marginRight: theme.spacing(2)
    },
    account_btn: {
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),
        borderRadius: theme.spacing(4),
        fontSize: 12
    },
    link: {
        textDecoration: "none",
        color: "inherit"
    }
}));

function AccountNavBar(props) {
    const classes = useStyles();

    return (
        <Navbar flexGrow={1}>
            <Typography variant="subtitle1" className={classes.account_msg}>
                {props.accountMsg}
            </Typography>

            <Link to={props.link} className={classes.link}>
                <Button variant="outlined" color="inherit" className={classes.account_btn}>
                    {props.btnMsg}
                </Button>
            </Link>
        </Navbar>
    );
}

export default AccountNavBar;
