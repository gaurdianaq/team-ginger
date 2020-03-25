/* Component for rendering the dialog that allows the user to filter mentions by
   platform and company name
*/

import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import { SITE_TO_IMG } from "../Constants";

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(4)
    },
    header: {
        marginBottom: theme.spacing(2)
    },
    platforms: {
        display: "grid",
        gridGap: theme.spacing(3),
        gridTemplateColumns: `repeat(auto-fit, minmax(${100}px, 1fr))`,
        maxWidth: `${Object.keys(SITE_TO_IMG).length * 150}px`,
        margin: `${theme.spacing(3)}px auto`
    },
    names: {
        display: "grid",
        gridGap: theme.spacing(3),
        gridTemplateColumns: `repeat(auto-fit, minmax(${100}px, 1fr))`,
        margin: `${theme.spacing(3)}px auto`
    },
    platform_container: {
        display: "grid",
        justifyItems: "center"
    },
    platform_logo: {
        width: 100,
        height: 100
    },
    platform_filter: {
        width: "100%",
        justifyContent: "center"
    },
    submit_btn: {
        display: "block",
        borderRadius: 500,
        width: 150,
        margin: "auto",
        padding: theme.spacing(2),
        boxShadow: `0 0 5px ${theme.primary}`
    }
}));

function FilteringDialog(props) {
    const classes = useStyles();
    const { open, onClose, pFilters, nFilters, filter } = props;

    const [platformFilters, setPlatforms] = useState(pFilters);
    const [nameFilters, setNames] = useState(nFilters);

    const handleOpen = () => {
        setPlatforms(pFilters);
        setNames(nFilters);
    };

    const handlePlatformChange = platform => e => setPlatforms({ ...platformFilters, [platform]: e.target.checked });
    const handleNameChange = name => e => setNames({ ...nameFilters, [name]: e.target.checked });

    const handleApply = () => {
        onClose();
        filter(platformFilters, nameFilters);
    };

    // List of platforms and companies to render on dialog
    let platforms = [];
    let companies = [];

    // Build platform components
    Object.entries(SITE_TO_IMG).forEach(([platform, logo]) => {
        platforms.push(
            <div key={platform} className={classes.platform_container}>
                <img src={logo} className={classes.platform_logo} alt={platform} />
                <FormControlLabel
                    labelPlacement="top"
                    className={classes.platform_filter}
                    control={
                        <Checkbox
                            color="default"
                            className={classes.checkbox}
                            checked={platformFilters[platform]}
                            onChange={handlePlatformChange(platform)}
                            inputProps={{ "aria-label": `${platform} checkbox` }}
                        />
                    }
                    label={platform}
                />
            </div>
        );
    });

    // Build companies components
    Object.entries(nameFilters).forEach(([name, filter]) => {
        companies.push(
            <div key={name} className={classes.platform_container}>
                <FormControlLabel
                    labelPlacement="top"
                    className={classes.platform_filter}
                    control={
                        <Checkbox
                            color="default"
                            className={classes.checkbox}
                            checked={filter}
                            onChange={handleNameChange(name)}
                            inputProps={{ "aria-label": `${name} checkbox` }}
                        />
                    }
                    label={name}
                />
            </div>
        );
    });

    return (
        <Dialog open={open} onClose={onClose} onEnter={handleOpen} className={classes.dialog} maxWidth="md">
            <Paper className={classes.container}>
                <Typography variant="h5" align="center" className={classes.header}>
                    Filter Search Results
                </Typography>
                <Typography variant="body1" align="center">
                    Platforms
                </Typography>
                <div className={classes.platforms}>{platforms}</div>
                <Typography variant="body1" align="center">
                    Company Names
                </Typography>
                <div className={classes.names} style={{ maxWidth: `${Object.keys(nFilters).length * 250}px` }}>
                    {companies}
                </div>
                <Button type="submit" className={classes.submit_btn} onClick={handleApply}>
                    Apply
                </Button>
            </Paper>
        </Dialog>
    );
}

export default FilteringDialog;
