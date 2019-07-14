import React, { useReducer } from "react";
import axios from "axios";
import AuthContext from "./authContext";
import AuthReducer from "./authReducer";
import SetAuthToken from "../../utils/setAuthToken";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS
} from "../types";
import setAuthToken from "../../utils/setAuthToken";

const AuthState = props => {
  const initialState = {
    // token is going to be stored in local storage
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null
  };
  // state allows us to access anything in our state
  // allows us to dispatch objects to the reducer
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // Load User
  const loadUser = async () => {
    // set our token into a global header
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      // check your token and see if you're a valid user
      const res = await axios.get("/api/auth");

      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: AUTH_ERROR
      });
    }
  };

  // Register User
  const register = async formData => {
    // since were making a POST request and were sending data,
    // we need the content type header of application/json
    const config = {
      headers: {
        "Content-type": "application/json"
      }
    };

    try {
      //
      const res = await axios.post("/api/users", formData, config);

      dispatch({
        type: REGISTER_SUCCESS,
        // res data is the token
        payload: res.data
      });
      loadUser();
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data.msg
      });
    }
  };

  // Login User
  const login = () => {
    console.log("login");
  };

  // Logout
  const logout = () => {
    console.log("logout");
  };

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        loadUser,
        login,
        logout,
        clearErrors
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
