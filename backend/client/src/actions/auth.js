import {
	REGISTER_SUCCESS,
	LOGOUT,
	REGISTER_FAIL,
	AUTH_FAILED,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	USER_LOADED,
} from "./Types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

//Load User
export const loadUser = () => async (dispatch) => {
	if (localStorage.token) {
		setAuthToken(localStorage.token);
	}

	try {
		const res = await axios.get("/api/auth");
		dispatch({
			type: USER_LOADED,
			payload: res.data,
		});
	} catch (error) {
		dispatch({
			type: AUTH_FAILED,
		});
	}
};

// Register User
export const register = ({ name, password, email }) => async (dispatch) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	const body = JSON.stringify({ name, password, email });
	try {
		const res = await axios.post("/api/users", body, config);
		dispatch({
			type: REGISTER_SUCCESS,
			payload: res.data,
		});
		dispatch(loadUser());
	} catch (e) {
		return {
			type: REGISTER_FAIL,
			payload: e.response.data,
		};
	}
};

// Login User
export const login = (email, password) => async (dispatch) => {
	const config = {
		headers: {
			"Content-Type": "application/json",
		},
	};
	const body = JSON.stringify({ email, password });
	try {
		const res = await axios.post("/api/auth", body, config);
		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data,
		});
		dispatch(loadUser());
	} catch (e) {
		return {
			type: LOGIN_FAIL,
			payload: e.response.data,
		};
	}
};

export const logout = () => (dispatch) => {
	dispatch({
		type: LOGOUT,
	});
};
