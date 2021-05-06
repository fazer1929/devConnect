import { Grid, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
	Avatar,
	Button,
	Checkbox,
	Paper,
	Box,
	Typography,
	TextField,
	Container,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../../actions/auth";
import { Redirect } from "react-router";
const useStyles = makeStyles((theme) => ({
	root: {
		height: "100vh",
		display: "flex",
		alignItems: "center",
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	paper: {
		margin: theme.spacing(8, 4),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
}));

const Login = ({ login, isAuthenticated }) => {
	const classes = useStyles();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const handleChange = (e) => {
		const newFormData = {
			...formData,
			[e.target.name]: e.target.value,
		};
		setFormData(newFormData);
	};
	const handleSubmit = () => {
		login(formData.email, formData.password);
	};

	//Redirect If Logged In
	if (isAuthenticated) {
		return <Redirect to="/dashboard" />;
	}
	return (
		<Container className={classes.root}>
			<Grid container justify="center" alignItems="center">
				<Grid xs={false} lg={8}></Grid>
				<Grid xs={12} sm={10} lg={4} component={Paper} elevation={3} square>
					<div className={classes.paper}>
						<Typography component="h1" variant="h5">
							Sign In
						</Typography>
						<form noValidate className={classes.form}>
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								id="email"
								value={formData.email}
								onChange={(e) => handleChange(e)}
								label="Email Address"
								name="email"
								autoComplete="email"
								autoFocus
							/>
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								name="password"
								value={formData.password}
								onChange={(e) => handleChange(e)}
								label="Password"
								type="password"
								id="password"
								autoComplete="current-password"
							/>
							<Button
								fullWidth
								variant="contained"
								onClick={handleSubmit}
								color="primary"
								className={classes.submit}
							>
								Sign In
							</Button>
							<Grid container>
								<Grid item xs></Grid>
								<Grid item>
									<Link to="/register" variant="body2">
										{"Don't have an account? Sign Up"}
									</Link>
								</Grid>
							</Grid>
						</form>
					</div>
				</Grid>
			</Grid>
		</Container>
	);
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.authReducer.isAuthenticated,
});
Login.propTypes = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};
export default connect(mapStateToProps, { login })(Login);
