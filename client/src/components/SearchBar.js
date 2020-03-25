import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import BuildRoundedIcon from "@material-ui/icons/BuildRounded";

// Debouncing timer
const DELAY = 2000;

const styles = theme => ({
    search_container: {
        display: "flex",
        alignItems: "center",
        width: 400,
        color: "black",
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "5px 20px"
    },
    search_bar: {
        flexGrow: 1
    },
    icon: {
        cursor: "pointer",
        color: theme.primary,
        marginRight: theme.spacing(1)
    }
});

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = { value: "", open: false };
        this.delayTimer = null;
        this.hasChanged = false;
        this.callTimer = this.callTimer.bind(this);
    }

    handleChange = e => {
        this.hasChanged = true;
        clearTimeout(this.delayTimer);
        const value = e.target.value;
        this.setState({ value }, this.callTimer);
    };

    callTimer(noDelay = false) {
        if (noDelay) {
            // Only send request if we need to
            if (this.hasChanged) {
                // Make sure we don't send the request again if they click twice
                this.hasChanged = false;

                clearTimeout(this.delayTimer);
                this.props.search(this.state.value);
            }
        } else {
            this.delayTimer = setTimeout(() => {
                this.props.search(this.state.value);
                this.hasChanged = false;
            }, DELAY);
        }
    }

    render() {
        const { classes, open } = this.props;

        return (
            <React.Fragment>
                <div className={classes.search_container}>
                    <InputBase
                        placeholder="Search…"
                        className={`${classes.className} ${classes.search_bar}`}
                        inputProps={{ "aria-label": "search" }}
                        value={this.state.value}
                        onChange={this.handleChange}
                    />
                    <div className={classes.icon}>
                        <BuildRoundedIcon onClick={open} fontSize="small" />
                    </div>
                    <div className={classes.icon}>
                        <SearchIcon onClick={() => this.callTimer(true)} />
                    </div>
                </div>
            </React.Fragment>
        );
    }

    componentWillUnmount() {
        clearTimeout(this.delayTimer);
    }
}

export default withStyles(styles)(SearchBar);
