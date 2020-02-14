/* Component for rendering the input field in the settings page
   Users can use this component to add or remove company names
*/
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
    input_btn: {
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`
    },
    btn_remove: {
        color: theme.primary,
        backgroundColor: theme.secondary,
        "&:hover": {
            color: theme.secondary,
            backgroundColor: theme.primary
        }
    }
}));

function CompanyNames(props) {
    const classes = useStyles();
    // filled determines whether the company name is on file or the user wants it on file
    // filled = true => name is on file
    const { filled, val, add } = props;

    const [name, setName] = useState(filled ? val : "");
    // Handle the removing of a name (not implemented yet)
    // I think this will just queue up a remove rather than send a request
    // Since the user might decide to change their mind and not hit save
    // The save button will handle the request and response
    const handleRemove = () => {
        console.log("Removed", name, "... Not!");
    };

    const handleAdd = () => {
        if (name !== "") {
            add(name);
            setName("");
        }
    };

    return (
        <Paper className={props.classIC}>
            <InputBase
                placeholder="Company email"
                className={props.classI}
                value={name}
                onChange={filled ? undefined : e => setName(e.target.value)}
                autoComplete="new-password"
                inputProps={{ "aria-label": "Company email" }}
            />
            {filled ? (
                <Button className={`${classes.input_btn} ${classes.btn_remove}`} onClick={handleRemove}>
                    Remove
                </Button>
            ) : (
                <Button className={classes.input_btn} onClick={handleAdd}>
                    Add
                </Button>
            )}
        </Paper>
    );
}

export default CompanyNames;
