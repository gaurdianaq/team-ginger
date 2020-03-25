/* Component for rendering a single mention on dashboard and possibly
   weekly report 
*/

import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import MentionContainer from "./MentionContainer";
import MentionHeader from "./MentionHeader";
import MentionText from "./MentionText";
import { DASHBOARD_URL } from "../Constants";

const useStyles = makeStyles(theme => ({
    link: {
        textDecoration: "none",
        width: "100%",
        "&:last-child": {
            marginBottom: theme.spacing(10)
        }
    },
    container: {
        display: "flex",
        padding: theme.spacing(2),
        width: "100%",
        boxSizing: "border-box",
        marginBottom: theme.spacing(2)
    },

    text: {
        marginLeft: theme.spacing(2),
        wordBreak: "break-word",
        width: "100%"
    }
}));

function Mention(props) {
    const classes = useStyles();
    const { id, img, title, site, snippet, bold, sentiment, date, favourite, history, unmount, handleFavourite } = props;

    return (
        <Link to={`${DASHBOARD_URL}/mention/${id}`} className={classes.link}>
            <MentionContainer container={classes.container} img={img} site={site}>
                <Box className={classes.text}>
                    <MentionHeader
                        titleVariant="body1"
                        bold={bold}
                        title={title}
                        sentiment={sentiment}
                        site={site}
                        siteVariant="body1"
                        favourite={favourite}
                        id={id}
                        history={history}
                        date={date}
                        dateVariant="body2"
                        unmount={unmount}
                        handleFavourite={handleFavourite}
                    />
                    <MentionText variant="caption" bold={bold} text={snippet} />
                </Box>
            </MentionContainer>
        </Link>
    );
}

export default React.memo(Mention, (prev, next) => prev.id === next.id && prev.favourite === next.favourite);
