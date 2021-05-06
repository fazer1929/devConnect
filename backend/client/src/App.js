import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Landing from "./Components/layout/Landing";
import Navbar from "./Components/layout/Navbar";
import Login from "./Components/auth/Login";
import Register from "./Components/auth/Register";
//Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import { useEffect } from "react";
import setAuthToken from "./utils/setAuthToken";
if (localStorage.token) {
	setAuthToken(localStorage.token);
}
function App() {
	useEffect(() => {
		store.dispatch(loadUser());
	}, []);
	return (
		<Provider store={store}>
			<Router>
				<Navbar />
				<Switch>
					<Route path="/" exact component={Landing} />
					<Route path="/login" exact component={Login} />
					<Route path="/register" exact component={Register} />
				</Switch>
			</Router>
		</Provider>
	);
}

export default App;
