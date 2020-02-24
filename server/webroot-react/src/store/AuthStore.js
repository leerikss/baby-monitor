import React, { createContext, useReducer, useContext } from 'react';

const authState = {
    authToken: null
}

const AuthContext = createContext(authState);

export const AuthActions = {
    ADD_AUTH_TOKEN: 'ADD_AUTH_TOKEN'
};

const authReducer = (state, action) => {
    switch (action.type) {
      case AuthActions.ADD_AUTH_TOKEN: {
            return {
                ...authState,
                authToken: action.authToken
            }
      }
      default: {
        throw new Error(`Unhandled action type: ${action.type}`)
      }
    }
}

export const AuthStore = ({ children }) => {
    return (
        <AuthContext.Provider value={ useReducer(authReducer, authState) }>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthStore = () => useContext(AuthContext);
