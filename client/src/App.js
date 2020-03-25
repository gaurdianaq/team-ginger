import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import { BrowserRouter, Route } from "react-router-dom";

import { theme } from "./themes/theme";
import LandingPage from "./pages/Landing";
import SignUpPage from "./pages/SignUp";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import SettingsPage from "./pages/Settings";

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
                <BrowserRouter>
                    <Route exact path="/" component={LandingPage} />
                    <Route path="/signup" component={SignUpPage} />
                    <Route path="/login" component={LoginPage} />
                    <Route path="/dashboard" component={DashboardPage} />
                    <Route path="/settings" component={SettingsPage} />
                </BrowserRouter>
            </SnackbarProvider>
        </MuiThemeProvider>
    );
}

export default App;
