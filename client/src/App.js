import React, { Fragment, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Landing from './components/layouts/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layouts/Alert';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';

//REdux
import { Provider } from 'react-redux';
import store from './store';

if (localStorage.token) {
	setAuthToken(localStorage.token);
}

const App = () => {
	useEffect(() => {
		store.dispatch(loadUser());
	}, []);
	return (
		<Provider store={store}>
			<Router>
				<Fragment>
					<Navbar />
					<Route exact path="/" component={Landing} />
					<section className="container">
						<Alert />
						<Switch>
							<Route exact path="/Register" component={Register} />
							<Route exact path="/Login" component={Login} />
							<PrivateRoute exact path="/dashboard" component={Dashboard} />
							<PrivateRoute exact path="/create-profile" component={CreateProfile} />
							<PrivateRoute exact path="/edit-profile" component={EditProfile} />
						</Switch>
					</section>
				</Fragment>
			</Router>
		</Provider>
	);
};
export default App;
