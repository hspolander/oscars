import React from "react";

import User from "./User";
import Logo from "./Logo";
import Search from "./Search";

import './banner.scss';

export default class Banner extends React.Component {

  render() {
    return (
        <div className="banner-main">
          <Logo />
          <Search />
          <User user={this.props.userLoggedIn} />
        </div>
    );
  }
}