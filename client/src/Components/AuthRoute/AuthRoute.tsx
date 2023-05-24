import React from 'react';

import { auth } from '../../Config/firebase';
import logging from '../../Config/logging';
import { Navigate } from 'react-router';

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
