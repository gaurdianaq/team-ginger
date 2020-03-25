/* Component for rendering the title, source site, and sentiment icon of a mention */
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";
import SentimentVeryDissatisfiedOutlinedIcon from "@material-ui/icons/SentimentVeryDissatisfiedOutlined";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied";
import SentimentSatisfiedAltIcon from "@material-ui/icons/SentimentSatisfiedAlt";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import SentimentVerySatisfiedOutlinedIcon from "@material-ui/icons/SentimentVerySatisfiedOutlined";
import SvgIcon from "@material-ui/core/SvgIcon";
import FavouriteIcon from "./FavouriteIcon";
import { GET_DATE_STRING } from "../Constants";

// Given a sentiment value in [-1, 1] return an appropriate Icon
function SentimentToIcon(sentiment) {
    // neutral
    if (Math.abs(sentiment) < 0.2) {
        return (
            <SvgIcon fontSize="large">
                <path d="M9 14h6v1.5H9z" />
                <circle cx="15.5" cy="9.5" r="1.5" />
                <circle cx="8.5" cy="9.5" r="1.5" />
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
            </SvgIcon>
        );
    }
    if (sentiment < 0) {
        if (sentiment < -0.8) {
            return <SentimentVeryDissatisfiedOutlinedIcon fontSize="large" />;
        }
        if (sentiment < -0.5) {
            return <SentimentVeryDissatisfiedIcon fontSize="large" />;
        }
        return <SentimentDissatisfiedIcon fontSize="large" />;
    } else {
        if (sentiment > 0.8) {
            return <SentimentVerySatisfiedOutlinedIcon fontSize="large" />;
        }
        if (sentiment > 0.5) {
            return <SentimentVerySatisfiedIcon fontSize="large" />;
        }
        return <SentimentSatisfiedAltIcon fontSize="large" />;
    }
}

const useStyles = makeStyles(theme => ({
    header: {
        display: "flex",
        marginBottom: theme.spacing(1)
    },
    title: {
        flexGrow: 1,
        marginRight: theme.spacing(1)
    },
    sentiment: {
        color: theme.primary
    }
}));

function MentionHeader(props) {
    const classes = useStyles();
    const sentiment = Number(props.sentiment * 100).toFixed(2);
    const {
        title,
        bold,
        titleVariant,
        site,
        siteVariant,
        dateVariant,
        favourite,
        id,
        history,
        unmount,
        handleFavourite
    } = props;
    const date = props.date && GET_DATE_STRING(new Date(props.date * 1000));

    return (
        <Box className={classes.header}>
            <Box className={classes.title}>
                <Typography variant={titleVariant}>{bold(title)}</Typography>
                <Typography variant={siteVariant} color="textSecondary">
                    {site}
                </Typography>
                <Typography variant={dateVariant} color="textSecondary">
                    {date}
                </Typography>
            </Box>
            <FavouriteIcon
                className={classes.favourite_icon}
                favourite={favourite}
                id={id}
                history={history}
                unmount={unmount}
                handleFavourite={handleFavourite}
            />
            <Tooltip
                title={`Score: ${sentiment}`}
                placement="top"
                aria-label="Sentiment score"
                className={classes.sentiment}
            >
                {SentimentToIcon(props.sentiment)}
            </Tooltip>
        </Box>
    );
}

export default MentionHeader;
