/* Component rendering the sidebar of the dashboard page
   Users can use this component to display mentions from
   chosen platforms
*/

import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import PlatformCard from "./PlatformCard";
import RedditImg from "../assets/reddit.png";
import TwitterImg from "../assets/twitter.png";
import { REDDIT, TWITTER, SITES_TAG, UPDATE_EVENT_TAG, PLATFORMS, COMPANY_NAMES_TAG, EMAIL_TAG } from "../Constants";
import { socket } from "../sockets";

const PLATFORM_IMAGES = [RedditImg, TwitterImg];

const styles = theme => ({
    platform_container: {
        backgroundColor: "white",
        borderRight: "1px solid #ddd"
    }
});

class DashboardSideBar extends Component {
    constructor(props) {
        super(props);
        const sites = JSON.parse(localStorage.getItem(SITES_TAG));
        this.state = { toggles: [sites[REDDIT] === true, sites[TWITTER] === true] };
    }

    render() {
        const { classes, history } = this.props;
        const { toggles } = this.state;
        const platformCards = PLATFORMS.map((platform, index) => (
            <PlatformCard
                key={index}
                site_img={PLATFORM_IMAGES[index]}
                site_name={platform}
                history={history}
                isToggled={toggles[index]}
                index={index}
            />
        ));
        return <div className={classes.platform_container}>{platformCards}</div>;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.toggles !== this.state.toggles;
    }

    componentDidMount() {
        socket.on(UPDATE_EVENT_TAG, data => {
            const parsed_data = JSON.parse(data);
            if (parsed_data[SITES_TAG]) {
                const parsed_sites = parsed_data[SITES_TAG];
                localStorage.setItem(SITES_TAG, JSON.stringify(parsed_sites));
                const { toggles } = this.state;
                const newToggles = [...toggles];
                for (let i = 0; i < PLATFORMS.length; ++i) {
                    newToggles[i] = parsed_sites[PLATFORMS[i]];
                }
                this.setState({ toggles: newToggles });
            } else if (parsed_data[COMPANY_NAMES_TAG]) {
                localStorage.setItem(COMPANY_NAMES_TAG, parsed_data[COMPANY_NAMES_TAG]);
            } else if (parsed_data[EMAIL_TAG]) {
                localStorage.setItem(EMAIL_TAG, parsed_data[EMAIL_TAG]);
            }
        });
    }

    componentWillUnmount() {
        socket.off(UPDATE_EVENT_TAG);
    }
}

export default withStyles(styles)(DashboardSideBar);
