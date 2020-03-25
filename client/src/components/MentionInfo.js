/* Component for rendering the all the mention information except for the title and snippet
   on the dialog
*/
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import CallMadeIcon from "@material-ui/icons/CallMade";
import { GET_DATE_STRING } from "../Constants";

const useStyles = makeStyles(theme => ({
    container: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(50%, 300px))"
    }
}));

function MentionInfo(props) {
    const classes = useStyles();
    const { site, siteVariant, hits, hitsVariant, url, urlVariant, dateVariant } = props;
    const date = GET_DATE_STRING(new Date(props.date * 1000));
    return (
        <Box className={classes.container}>
            <Typography variant={siteVariant} color="textSecondary">
                {site}
            </Typography>
            <Typography variant={hitsVariant} color="textSecondary">
                Hits: {hits}
            </Typography>
            <Typography variant={dateVariant} color="textSecondary">
                {date}
            </Typography>
            <Link href={url} variant={urlVariant} target="_blank">
                Source <CallMadeIcon />
            </Link>
        </Box>
    );
}

export default MentionInfo;
