import {signOut} from 'firebase/auth';
import React from 'react';
import auth from '../firebase.init';
import {Outlet} from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Widgets from './Widgets/Widgets';
import { useAuthState} from 'react-firebase-hooks/auth';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const user = useAuthState(auth)
    const { t } = useTranslation();

    const handleLogout=()=> {
        signOut(auth)
    }
    return (
        <div className='app'>
            <Sidebar handleLogout={handleLogout} user={user} />
            <Outlet />
            <Widgets />
        </div>
    );
};
export default Home;