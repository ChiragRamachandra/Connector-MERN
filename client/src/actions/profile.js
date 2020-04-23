import axios from 'axios';

import { GET_PROFILE, PROFILE_ERROR } from './types';
import { setAlert } from './alert';

//Get current users profile
export const getCurrentProfile = () => async (dispatch) => {
	try {
		const res = await axios.get('/api/profile/me');

		console.log(res);
		dispatch({
			type: GET_PROFILE,
			payload: res.data
		});
	} catch (error) {
		console.log(error);
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: error.response.statusText, status: error.response.status }
		});
	}
};

//Create or Update profie
export const createProfile = (FormData, history, edit = false) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		};

		const res = await axios.post('/api/profile', FormData, config);
		dispatch({
			type: GET_PROFILE,
			payload: res.data
		});
		dispatch(setAlert(edit ? 'Profile updated' : 'Profile created', 'success'));

		if (!edit) {
			history.push('/dashboard');
		}
	} catch (error) {
		console.log(error);
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: error.response.statusText, status: error.response.status }
		});
	}
};

//Add Experience

export const addExperience = (formData, history) => async (dispatch) => {
    
};
