import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, hashHistory} from "react-router";

import Layout from "./components/Layout";

const content = document.getElementById('content');


ReactDOM.render(<Router history={hashHistory}>
		<Route path="/" component={Layout}>
		</Route>
	</Router>,
	content);

	//<Layout/>, content);