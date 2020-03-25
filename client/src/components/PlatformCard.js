/* Component for the sidebar items of the dashboard
   Users can toggle if they want to track mentions on a particular platform
   using this component
   Just using Reddit for now
 */

import React from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";
import { SITES_ROUTE, JOBS_ROUTE } from "../Routes";
import { RESPONSE_TAG, GOOD_SNACKBAR, BAD_SNACKBAR, LOGIN_URL, SITES_TAG, SAVE_EVENT_TAG } from "../Constants";
import { useSnackbar } from "notistack";
import { socket } from "../sockets";

const CRAWLING_MESSAGE = (site, isEnabled) => `${site} crawling has been ${isEnabled ? "enabled" : "disabled"}`;

const useStyles = makeStyles(theme => ({
    card: {
        display: "grid",
        gridTemplateColumns: "1fr 2fr 1fr",
        width: "100%",
        height: 100,
        alignItems: "center",
        justifyItems: "center",
        borderBottom: "1px solid #ddd"
    },
    platform_logo: {
        width: "70%"
    },
    platform_name: {
        justifySelf: "left",
        fontWeight: "bold",
        marginLeft: theme.spacing(1)
    }
}));

function PlatformCard(props) {
    const classes = useStyles();
    const { site_name, site_img, isToggled, history } = props;
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();

    // When the user clicks the toggle
    const handleClick = () => {
        fetch(SITES_ROUTE + site_name, {
            method: "POST"
        }).then(res => {
            if (res.status === 200) {
                let sites = JSON.parse(localStorage.getItem(SITES_TAG));
                sites[site_name] = !sites[site_name];
                socket.emit(SAVE_EVENT_TAG, JSON.stringify({ sites: sites }));
                fetch(JOBS_ROUTE + site_name, {
                    method: "POST"
                }).then(res => {
                    if (res.status === 200) {
                        enqueueSnackbar(CRAWLING_MESSAGE(site_name, !isToggled), GOOD_SNACKBAR);
                    } else {
                        console.log(
                            `Something went wrong with setting up the ${site_name} crawl, reverting crawl database back.`
                        );
                        res.json().then(data => {
                            console.log(res.status, data[RESPONSE_TAG]);
                            enqueueSnackbar(data[RESPONSE_TAG], BAD_SNACKBAR);
                        });
                        fetch(SITES_ROUTE + site_name, {
                            method: "POST"
                        }).then(res => {
                            sites[site_name] = !sites[site_name];
                            socket.emit(SAVE_EVENT_TAG, JSON.stringify({ sites: sites }));
                            if (res.status === 200) {
                                console.log("Database reverted...");
                            } else {
                                console.log(
                                    "Crap something really went wrong since this request worked just a moment ago..."
                                );
                            }
                        });
                    }
                });
            } else if (res.status === 401) {
                localStorage.clear();
                history.push(LOGIN_URL);
            }
        });
    };
    const CustomSwitch = withStyles({
        switchBase: {
            color: theme.primary,
            "&$checked": {
                color: theme.primary
            },
            "&$checked + $track": { backgroundColor: theme.primary }
        },
        checked: {},
        track: {}
    })(Switch);

    return (
        <div className={classes.card}>
            <img src={site_img} className={classes.platform_logo} alt={"Platform logo"} />
            <Typography className={classes.platform_name}>{site_name}</Typography>
            <CustomSwitch checked={isToggled} onClick={handleClick} inputProps={{ "aria-label": site_name + " checkbox" }} />
        </div>
    );
}

export default React.memo(PlatformCard, (prev, next) => prev.isToggled === next.isToggled);
