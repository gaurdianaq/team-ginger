/* Component for rendering the dashboard header and tabs  */
import React from "react";
import { makeStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Tab from "@material-ui/core/Tab";

const useStyles = makeStyles(theme => ({
    top_section: {
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: 800,
        margin: `0 auto ${theme.spacing(4)}px auto`
    },
    mention_header: {
        flexGrow: 1
    },
    mention_tabs: {
        backgroundColor: theme.secondary,
        // High border radius to give a 'pill' look
        borderRadius: 500
    },
    mention_tab: {
        borderRadius: 500
    },
    tab_active: {
        backgroundColor: theme.primary,
        color: "white"
    },
    tab_inactive: {
        backgroundColor: "transparent",
        color: theme.primary
    }
}));

function DashboardHead(props) {
    const classes = useStyles();
    const { tab, click1, click2, click3 } = props;
    return (
        <div className={classes.top_section}>
            <Typography variant="h4" className={classes.mention_header}>
                My Mentions
            </Typography>
            <div className={classes.mention_tabs}>
                <Tab
                    label="Most Recent"
                    className={`${classes.mention_tab} ${tab === 0 ? classes.tab_active : classes.tab_inactive}`}
                    onClick={click1}
                />
                <Tab
                    label="Most Popular"
                    className={`${classes.mention_tab} ${tab === 1 ? classes.tab_active : classes.tab_inactive}`}
                    onClick={click2}
                />
                <Tab
                    label="Favourites"
                    className={`${classes.mention_tab} ${tab === 2 ? classes.tab_active : classes.tab_inactive}`}
                    onClick={click3}
                />
            </div>
        </div>
    );
}

export default React.memo(DashboardHead, (prev, next) => prev.tab === next.tab);
