import React, { useReducer } from "react";
import uuid from "uuid";
import ContactContext from "./contactContext";
import ContactReducer from "./contactReducer";
import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACT,
  CLEAR_FILTER
} from "../types";

const ContactState = props => {
  const initialState = {
    contacts: [
      {
        id: 1,
        name: "Devon Hunt",
        email: "devondhunt@gmail.com",
        phone: "123-456-7890",
        type: "personal"
      },
      {
        id: 2,
        name: "Gregory Row",
        email: "rowgregory@gmail.com",
        phone: "111-111-4444",
        type: "personal"
      },
      {
        id: 3,
        name: "Sarah Smith",
        email: "ssmith@gmail.com",
        phone: "111-111-1111",
        type: "professional"
      }
    ],
    // when we click edit I want whatever that contact that we edit
    // to be put into this piece of state which will be an object
    current: null,
    filtered: null
  };
  // state allows us to access anything in our state
  // allows us to dispatch objects to the reducer
  const [state, dispatch] = useReducer(ContactReducer, initialState);

  // Add Contact
  const addContact = contact => {
    contact.id = uuid.v4();
    dispatch({ type: ADD_CONTACT, payload: contact });
  };

  // Delete Contact
  const deleteContact = id => {
    dispatch({ type: DELETE_CONTACT, payload: id });
  };

  // Set Current Contact
  const setCurrent = contact => {
    dispatch({ type: SET_CURRENT, payload: contact });
  };

  // Clear Current Contact
  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  // Update Contact
  const updateContact = contact => {
    dispatch({ type: UPDATE_CONTACT, payload: contact });
  };

  // Filter Contact
  const filterContacts = text => {
    dispatch({ type: FILTER_CONTACT, payload: text });
  };

  // Clear Filter
  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  return (
    <ContactContext.Provider
      value={{
        contacts: state.contacts,
        current: state.current,
        filtered: state.filtered,
        addContact,
        deleteContact,
        setCurrent,
        clearCurrent,
        updateContact,
        filterContacts,
        clearFilter
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

export default ContactState;
