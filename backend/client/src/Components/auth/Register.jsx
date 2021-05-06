import { Grid, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
	Avatar,
	Button,
	Paper,
	Box,
	Typography,
	TextField,
	Container,
} from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import { register } from "../../actions/auth";
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
const Register = ({ register, isAuthenticated }) => {
	const classes = useStyles();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		conPassword: "",
	});
	const handleChange = (e) => {
		const newFormData = {
			...formData,
			[e.target.name]: e.target.value,
		};
		setFormData(newFormData);
	};
	const handleSubmit = () => {
		const { name, password, conPassword, email } = formData;
		if (password != conPassword) {
			console.log("Shit");
			return;
		}
		register({ name, password, email });
	};
	if (isAuthenticated) {
		return <Redirect to="/dashboard" />;
	}
	return (
		<Container className={classes.root}>
			<Grid container justify="center" alignItems="center">
				<Grid xs={0} lg={8}></Grid>
				<Grid xs={10} lg={4} component={Paper} elevation={3} square>
					<div className={classes.paper}>
						<Typography component="h1" variant="h5">
							Sign Up
						</Typography>
						<form noValidate className={classes.form}>
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								id="name"
								label="Name"
								value={formData.name}
								onChange={(e) => handleChange(e)}
								name="name"
								autoComplete="name"
								autoFocus
							/>

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
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								value={formData.conPassword}
								onChange={(e) => handleChange(e)}
								name="conPassword"
								label="Confirm Password"
								type="password"
								id="conPassword"
								autoComplete="current-password"
							/>

							<Button
								// type="submit"
								fullWidth
								variant="contained"
								onClick={handleSubmit}
								color="primary"
								className={classes.submit}
							>
								Sign Up
							</Button>
							<Grid container>
								<Grid item xs></Grid>
								<Grid item>
									<Link to="/login" variant="body2">
										{"Already have an account? Sign In"}
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
Register.propTypes = {
	register: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.authReducer.isAuthenticated,
});
export default connect(mapStateToProps, { register })(Register);
