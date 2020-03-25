import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
    overrides: {
        MuiButton: {
            root: {
                color: "white",
                backgroundColor: "#6583F2",
                borderRadius: 500,
                "&:hover": {
                    color: "#6583F2",
                    backgroundColor: "#EAEEFD"
                }
            }
        },
        MuiCheckbox: {
            root: {
                color: "#6583F2"
            }
        }
    },
    typography: {
        fontFamily: '"Roboto"'
    },
    primary: "#6583F2",
    secondary: "#EAEEFD",
    error: "#d8000c",
    bgcolor: "#fafbff"
});
