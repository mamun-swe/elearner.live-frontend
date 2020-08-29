import {
    COURSE_REQUEST,
    GET_COURSE_SUCCESS,
    GET_COURSE_FAILED,
    COURSE_ADD,
    COURSE_ADD_FAILED
} from '../types';

import axios from 'axios';
const api = "https://jsonplaceholder.typicode.com/"

export const coursesList = () => {
    return async (dispatch) => {
        try {
            dispatch({ type: COURSE_REQUEST })
            const response = await axios.get(`${api}users`)
            dispatch({
                type: GET_COURSE_SUCCESS,
                payload: response.data
            })
        } catch (error) {
            dispatch({
                type: GET_COURSE_FAILED,
                payload: error.message
            })
        }
    }
}

export const addCourse = (data) => {
    return async (dispatch) => {
        try {
            dispatch({ type: COURSE_ADD, payload: data })
        } catch (error) {
            dispatch({
                type: COURSE_ADD_FAILED,
                payload: error.message
            })
        }
    }
}