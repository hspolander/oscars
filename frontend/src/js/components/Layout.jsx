import React from "react";

import Banner from "./banner/Banner";
import Welcome from "./Welcome";

export default class Layout extends React.Component {
  constructor() {
    super();
    this.state = {userLoggedIn :{name: "Henrik Spolander"}};
  }

  render() {
    return (
      <div className="react-root">
        <Banner userLoggedIn={this.state.userLoggedIn} />
        <Welcome />
        <div className="footer"></div>
      </div>
    );
  }
}