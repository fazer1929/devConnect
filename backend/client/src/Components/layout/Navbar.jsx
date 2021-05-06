import React from "react";
import { Link } from "react-router-dom";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	IconButton,
	makeStyles,
} from "@material-ui/core";
import PropTypes from "prop-types";
import MenuIcon from "@material-ui/icons/Menu";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
}));
const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
	const authLinks = (
		<>
			<Button color="inherit" onClick={logout}>
				Logout
			</Button>
		</>
	);
	const guestLinks = (
		<>
			<Button color="inherit" component={Link} to="/register">
				Signup
			</Button>
			<Button component={Link} to="/login" color="inherit">
				Login
			</Button>
		</>
	);
	const classes = useStyles();
	return (
		<AppBar position="static">
			<Toolbar>
				<IconButton
					className={classes.menuButton}
					edge="start"
					color="inherit"
					aria-label="menu"
				>
					<MenuIcon />
				</IconButton>

				<Typography className={classes.title} variant="h6">
					News
				</Typography>
				<Button color="inherit">Home</Button>

				{!loading && <>{isAuthenticated ? authLinks : guestLinks}</>}
			</Toolbar>
		</AppBar>
	);
};
const mapStateToProps = (state) => ({
	auth: state.authReducer,
});
Navbar.propTypes = {
	auth: PropTypes.object,
	logout: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { logout })(Navbar);
