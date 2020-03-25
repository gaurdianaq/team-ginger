/* Component for rendering the main text(snippet or info message) of a mention */
import React from "react";
import Typography from "@material-ui/core/Typography";

function MentionText(props) {
    const { variant, color, bold, text } = props;
    return (
        <Typography variant={variant} color={color}>
            {bold ? bold(text) : text}
        </Typography>
    );
}

export default MentionText;
