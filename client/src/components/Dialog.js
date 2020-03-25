/* Component for rendering the detailed view of a mention
   when the user clicks on a mention
*/
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { DIALOG_ROUTE } from "../Routes";
import { RESPONSE_TAG, DASHBOARD_URL, LOGIN_URL } from "../Constants";
import Box from "@material-ui/core/Box";
import { default as Modal } from "@material-ui/core/Dialog";
import MentionContainer from "./MentionContainer";
import MentionHeader from "./MentionHeader";
import MentionInfo from "./MentionInfo";
import MentionText from "./MentionText";

const LOADING_MESSAGE = "Loading Mention";
const NOT_FOUND_MESSAGE = "No Mention Found";
const NO_SNIPPET_MESSAGE = "There is no text for this mention";

const styles = theme => ({
    simpleContainer: {
        padding: theme.spacing(4),
        margin: "auto"
    },
    container: {
        display: "grid",
        gridTemplateColumns: "1fr 9fr",
        gridGap: theme.spacing(2),
        padding: theme.spacing(4),
        width: "fit-content",
        maxWidth: 1000,
        margin: "auto"
    },
    info: {
        marginLeft: theme.spacing(2),
        maxWidth: 900
    },
    snippet: {
        gridColumn: "span 2",
        wordBreak: "break-word"
    }
});

class Dialog extends Component {
    constructor(props) {
        super(props);
        this.state = { mention: null, message: LOADING_MESSAGE };
    }

    handleClose = () => {
        this.props.history.push(DASHBOARD_URL);
    };

    shouldComponentUpdate(nextProps, nextState) {
        return (
            !this.state.mention ||
            this.state.mention.favourite !== nextState.mention.favourite ||
            this.state.message !== nextState.message
        );
    }

    // When the mentions gets deleted due to an unfavourite
    handleDelete = () => {
        this.handleClose();
        this.props.delete(this.props.id);
    };

    handleFavourite = value => {
        this.setState({ mention: { ...this.state.mention, favourite: value } });
        this.props.favourite([this.props.id, value, !this.props.favouriteTrigger]);
    };

    render() {
        const { classes, bold, history, id } = this.props;
        const { mention, message } = this.state;

        if (mention) {
            const snippet = mention.snippet.length !== 0 ? mention.snippet : NO_SNIPPET_MESSAGE;
            const snippetColor = mention.snippet.length !== 0 ? "initial" : "textSecondary";
            const { site, hits, url, title, sentiment, date } = mention;

            return (
                <Modal open={true} onClose={this.handleClose} maxWidth="xl" scroll="paper">
                    <MentionContainer container={classes.container} img={mention.thumbnail} site={site}>
                        <Box className={classes.info}>
                            <MentionHeader
                                titleVariant="h5"
                                bold={bold}
                                title={title}
                                id={id}
                                sentiment={sentiment}
                                favourite={mention.favourite}
                                unmount={this.handleDelete}
                                handleFavourite={this.handleFavourite}
                            />
                            <MentionInfo
                                site={site}
                                favourite={mention.favourite}
                                history={history}
                                siteVariant="h5"
                                hitsVariant="h5"
                                hits={hits}
                                url={url}
                                urlVariant="h5"
                                date={date}
                                dateVariant="h5"
                            />
                        </Box>

                        <Box className={classes.snippet}>
                            <MentionText variant="body1" color={snippetColor} bold={bold} text={snippet} />
                        </Box>
                    </MentionContainer>
                </Modal>
            );
        }
        return (
            <Modal open={true} onClose={this.handleClose} maxWidth="xl" scroll="paper">
                <MentionContainer container={classes.simpleContainer}>
                    <MentionText variant="h5" color="textSecondary" text={message} />
                </MentionContainer>
            </Modal>
        );
    }

    componentDidMount() {
        fetch(DIALOG_ROUTE + this.props.id, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(res => {
            res.json().then(data => {
                if (res.status === 200) {
                    this.setState({ mention: data });
                } else if (res.status === 401) {
                    localStorage.clear();
                    this.props.history.push(LOGIN_URL);
                } else if (res.status === 404) {
                    this.setState({ message: NOT_FOUND_MESSAGE });
                } else {
                    console.log(res.status, data[RESPONSE_TAG]);
                }
            });
        });
    }
}

export default withStyles(styles)(Dialog);
