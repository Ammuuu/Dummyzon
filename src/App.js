import React, { useEffect } from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Header from './Header';
import Home from './Home';
import Checkout from './Checkout';
import Login from './Login';
import { useStateValue } from './StateProvider';
import { auth, db } from './firebase';

function App() {
	const[{ user }, dispatch] = useStateValue();

	useEffect(() => {	
		const unsubscribe = auth.onAuthStateChanged(authUser => {
			if(authUser) {
			//user is logged in, we set the user in our reducer (so it can be accessed everywhere)
				dispatch({
					type: 'SET_USER',
					user: authUser
				})
			//update basket of the current user upon page load (currently logged in user)
				db.collection(`${user?.email} basket`)
				.onSnapshot(snapshot => {
					dispatch({
						type: 'UPDATE_BASKET',
						payload: snapshot.docs
					})	
				})

			} else {
			//user is logged out
				dispatch({
					type: 'SET_USER',
					user: null
				})
			}
		})

		//any cleanup operations go in here (on a refresh (unrender) this is run and everything cleans up)
		return () => {
			//returned from auth, this detaches the listener if refreshed, and reattaches it
			unsubscribe();
		}
	}, [dispatch, user?.email])	//when our user changes, we must run this again, in order to update

	return (
		<Router>
			<Switch>
				<Route path="/checkout">
					<Header />
					<Checkout />
				</Route>

				<Route path="/login">
					<Login />
				</Route>

				{/*default and fallback for any route*/}
				<Route path="/">
					<Header />  
					<Home />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
