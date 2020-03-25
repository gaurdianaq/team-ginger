import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { BY_FAVOURITE, BY_POPULAR, BY_RECENT, MENTIONS_ROUTE, SEARCH_QUERY } from "../Routes";
import { LOGIN_URL, DISCONNECT_EVENT_TAG, MENTIONS_EVENT_TAG } from "../Constants";
import Mention from "./Mention";
import DashboardHead from "./DashboardHead";
import InfiniteScroll from "react-infinite-scroll-component";
import { socket } from "../sockets";
import { withSnackbar } from "notistack";
import Button from "@material-ui/core/Button";

const COMPANY_PREFIX = "company_";
const LOADING_MESSAGE = "Loading Mentions";
const NO_MENTION_MESSAGE = "There's nothing here! Make sure you have at least one platform tracked";
// Max character limit of mention title and snippet
const MAX_TITLE_CHARACTERS = 100;
const MAX_SNIPPET_CHARACTERS = 280;

const styles = theme => ({
    container: {
        width: "90%",
        margin: `${theme.spacing(4)}px auto`
    },
    infinite_scroller: {
        width: "100%",
        boxSizing: "border-box",
        maxWidth: 800,
        margin: "auto",
        paddingRight: theme.spacing(10),
        height: "70vh",
        scrollBehavior: "smooth"
    },
    empty_msg: {
        alignSelf: "center",
        marginBottom: theme.spacing(10)
    },
    snackbar_btn: {
        backgroundColor: "transparent",
        textTransform: "none",
        "&:hover": {
            backgroundColor: "white",
            color: "#2979ff"
        }
    }
});

class DashboardBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabValue: 0,
            page: 1,
            sort: BY_RECENT,
            mentions: [],
            hasMore: true,
            regex: props.regex
        };
    }

    handleTabChange = tabValue => {
        if (this.state.tabValue !== tabValue) {
            let sort;
            switch (tabValue) {
                case 0:
                    sort = BY_RECENT;
                    break;
                case 1:
                    sort = BY_POPULAR;
                    break;
                case 2:
                    sort = BY_FAVOURITE;
                    break;
                default:
                    sort = BY_RECENT;
                    break;
            }
            this.setState({ tabValue, page: 1, mentions: [], hasMore: true, sort }, () => this.fetchMentions(false));
        }
    };

    fetchMentions = (incrementPage = true) => {
        const { searchString, platformFilters, nameFilters, history } = this.props;
        const actualPage = Math.max(this.state.page - (incrementPage ? 0 : 1), 1);
        let filters = Object.entries(platformFilters)
            .map(([platform, filter]) => `${platform}=${filter}`)
            .join("&");
        filters +=
            "&" +
            Object.entries(nameFilters)
                .map(([name, filter]) => `${COMPANY_PREFIX}${name}=${filter}`)
                .join("&");
        const url = `${MENTIONS_ROUTE + this.state.sort}/${actualPage}?${SEARCH_QUERY}=${searchString}&${filters}`;

        fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(res => {
            if (res.status === 401) {
                history.push(LOGIN_URL);
            } else if (res.ok) {
                res.json().then(data => {
                    const hasMore = !data.end;
                    if (hasMore || data.mentions.length > Object.keys(this.state.mentions).length) {
                        this.setState({
                            mentions: data.mentions.reduce((acc, mention) => ({ ...acc, [mention.id]: mention }), {}),
                            page: actualPage + 1,
                            hasMore: hasMore
                        });
                        return;
                    }
                    // there was no new mentions to fetch
                    this.setState({ hasMore });
                });
            } else {
                res.json().then(data => console.log(data));
            }
        });
    };

    summarizeString = (string, limit) => {
        if (string.length < limit) {
            return string;
        }
        const match = string.match(this.props.regex);

        if (match) {
            // Index of first match
            const index = match.index;
            // Index is in the first limit characters
            if (index < limit) {
                return string.substring(0, limit) + "...";
            }
            // Index is in the last limit characters
            else if (index > string.length - limit) {
                return "..." + string.substring(string.length - limit);
            }
            // Index is somewhere in the middle
            else {
                return "..." + string.substring(index - limit / 2, index + limit / 2) + "...";
            }
        } else {
            // Could not find company name so return first limit characters
            return string.substring(0, limit) + "...";
        }
    };

    render() {
        const { classes, history, bold } = this.props;
        const { tabValue, mentions, hasMore } = this.state;

        const renderMentions = [];
        if (Object.keys(mentions).length !== 0) {
            Object.entries(mentions).forEach(([key, mention]) => {
                // summarize long snippets and titles
                let snippet = this.summarizeString(mention.snippet, MAX_SNIPPET_CHARACTERS);
                let title = this.summarizeString(mention.title, MAX_TITLE_CHARACTERS);

                renderMentions.push(
                    <Mention
                        key={key}
                        id={mention.id}
                        img={mention.thumbnail}
                        title={title}
                        snippet={snippet}
                        site={mention.site}
                        sentiment={mention.sentiment}
                        date={mention.date}
                        bold={bold}
                        favourite={mention.favourite}
                        history={history}
                        unmount={this.deleteMention(mention.id)}
                        handleFavourite={value => this.favouriteMention(mention.id, value)}
                    />
                );
            });
        } else {
            return (
                <div className={classes.container}>
                    <DashboardHead
                        tab={tabValue}
                        click1={() => this.handleTabChange(0)}
                        click2={() => this.handleTabChange(1)}
                        click3={() => this.handleTabChange(2)}
                    />
                    <Typography variant="h5" align="center" color="textSecondary" className={classes.empty_msg}>
                        {NO_MENTION_MESSAGE}
                    </Typography>
                </div>
            );
        }
        return (
            <div className={classes.container}>
                <DashboardHead
                    tab={tabValue}
                    click1={() => this.handleTabChange(0)}
                    click2={() => this.handleTabChange(1)}
                    click3={() => this.handleTabChange(2)}
                />

                <InfiniteScroll
                    className={classes.infinite_scroller}
                    dataLength={renderMentions.length}
                    next={this.fetchMentions}
                    hasMore={hasMore}
                    height={"70vh"}
                    loader={
                        <Typography variant="h5" align="center" color="textSecondary">
                            {LOADING_MESSAGE}
                        </Typography>
                    }
                >
                    {renderMentions}
                </InfiniteScroll>
            </div>
        );
    }

    deleteMention = id => () => {
        delete this.state.mentions[id];
        this.setState({ mentions: { ...this.state.mentions } });
    };

    favouriteMention = (id = this.props.favouriteID, value = this.props.favouriteValue) => {
        const newMention = this.state.mentions[id];
        if (newMention) {
            newMention.favourite = value;
            this.forceUpdate();
        }
    };

    shouldComponentUpdate(nextProps, nextState) {
        const { searchString, platformFilters, nameFilters, deleteID, favouriteTrigger } = this.props;
        const { tabValue, page, sort, mentions, hasMore } = this.state;

        return (
            nextProps.searchString !== searchString ||
            nextProps.platformFilters !== platformFilters ||
            nextProps.nameFilters !== nameFilters ||
            nextProps.deleteID !== deleteID ||
            nextProps.favouriteTrigger !== favouriteTrigger ||
            nextState.tabValue !== tabValue ||
            nextState.page !== page ||
            nextState.sort !== sort ||
            nextState.hasMore !== hasMore ||
            nextState.mentions !== mentions
        );
    }

    notifyNewMentions() {
        const { enqueueSnackbar, closeSnackbar, classes } = this.props;

        const action = key => (
            <Fragment>
                <Button
                    className={classes.snackbar_btn}
                    onClick={() => {
                        if (this.state.tabValue === 0) {
                            // scroll to top instead of changing state
                            const scroller = document.querySelector(`.${classes.infinite_scroller}`);
                            if (scroller) {
                                scroller.scrollTo(0, 0);
                            }
                        } else {
                            this.handleTabChange(0);
                        }
                        closeSnackbar(key);
                    }}
                >
                    View
                </Button>
            </Fragment>
        );
        enqueueSnackbar("New mentions!", {
            variant: "info",
            anchorOrigin: {
                vertical: "top",
                horizontal: "center"
            },
            autoHideDuration: 4000,
            action
        });
    }

    componentDidMount() {
        this.fetchMentions(false);
        socket.on(MENTIONS_EVENT_TAG, () => {
            console.log("fetching new mentions");
            this.fetchMentions(false);
            this.notifyNewMentions();
        });
        socket.on(DISCONNECT_EVENT_TAG, () => {
            console.log("connection was lost, attempting to reconnect");
            socket.open();
        });
    }

    componentDidUpdate(prevProps) {
        const { searchString, platformFilters, nameFilters, deleteID, favouriteTrigger } = this.props;
        if (
            prevProps.searchString !== searchString ||
            prevProps.platformFilters !== platformFilters ||
            prevProps.nameFilters !== nameFilters
        ) {
            this.setState({ page: 1, mentions: [], hasMore: true }, () => this.fetchMentions(false));
        } else if (prevProps.deleteID !== deleteID) {
            this.deleteMention(deleteID)();
        } else if (prevProps.favouriteTrigger !== favouriteTrigger) {
            this.favouriteMention();
        }
    }

    componentWillUnmount() {
        socket.off(MENTIONS_EVENT_TAG);
    }
}
export default withSnackbar(withStyles(styles)(DashboardBody));
