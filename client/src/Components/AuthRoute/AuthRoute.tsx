import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../Config/firebase';
import logging from '../../Config/logging';

export interface IAuthRouteProps {
    children: React.ReactNode;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = ({ children }) => {
    if (!auth.currentUser) {
        logging.warn('No user detected, redirecting');
        return <Navigate to="/prijava" />;
    }

    return <div>{children}</div>;
};

export default AuthRoute;
