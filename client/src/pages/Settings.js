import React from "react";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import ViewListIcon from "@material-ui/icons/ViewList";
import SettingsNavBar from "../components/SettingsNavBar";
import SettingsBody from "../components/SettingsBody";
import SettingsSideBar from "../components/SettingsSideBar";
import { DASHBOARD_URL, LOGIN_URL, COMPANY_NAMES_TAG, SITES_TAG, EMAIL_TAG } from "../Constants";

const useStyles = makeStyles(theme => ({
    settings_layout: {
        display: "grid",
        gridTemplateColumns: "minmax(20%, 300px) 1fr",
        height: "100%",
        [theme.breakpoints.down("sm")]: {
            gridTemplateColumns: "minmax(225px, 1fr) 3fr"
        },
        [theme.breakpoints.down("xs")]: {
            gridTemplateColumns: "minmax(190px, 1fr) 3fr"
        }
    }
}));

function Settings(props) {
    const classes = useStyles();

    if (!localStorage.getItem(COMPANY_NAMES_TAG) || !localStorage.getItem(EMAIL_TAG) || !localStorage.getItem(SITES_TAG)) {
        return <Redirect to={LOGIN_URL} />;
    }

    return (
        <React.Fragment>
            <SettingsNavBar link={DASHBOARD_URL}>
                <ViewListIcon fontSize="large" />
            </SettingsNavBar>
            <div className={classes.settings_layout}>
                <SettingsSideBar history={props.history} />
                <SettingsBody history={props.history} />
            </div>
        </React.Fragment>
    );
}

export default Settings;
