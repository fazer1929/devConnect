import React from "react";
import { connect } from "react-redux";
const Landing = ({ isAuthenticated }) => {
	console.log(isAuthenticated);
	return (
		<div>
			<h1>Landing Page</h1>
		</div>
	);
};
const mapStateToProps = (state) => {
	return state.isAuthenticated;
};
export default connect(mapStateToProps)(Landing);
