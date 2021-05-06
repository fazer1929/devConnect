import {
	AUTH_FAILED,
	LOGIN_FAIL,
	LOGIN_SUCCESS,
	LOGOUT,
	REGISTER_FAIL,
	REGISTER_SUCCESS,
	USER_LOADED,
} from "../actions/Types";

const initialState = {
	loading: true,
	isAuthenticated: null,
	token: localStorage.getItem("token"),
	user: null,
};

const authReducer = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case REGISTER_SUCCESS:
		case LOGIN_SUCCESS:
			localStorage.setItem("token", payload.token);
			return {
				...state,
				loading: false,
				token: payload.token,
				isAuthenticated: true,
			};
		case USER_LOADED:
			return {
				...state,
				isAuthenticated: true,
				loading: false,
				user: payload,
			};

		case AUTH_FAILED:
		case REGISTER_FAIL:
		case LOGIN_FAIL:
		case LOGOUT:
			return {
				...state,
				loading: false,
				isAuthenticated: false,
				token: null,
			};
		default:
			return state;
	}
};

export default authReducer;
