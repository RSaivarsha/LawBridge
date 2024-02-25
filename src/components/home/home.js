import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase-config';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate hook
import UploadQuery from './UploadQuery'; // Component for uploading a query
import ViewResponses from './ViewResponses'; // Component for viewing responses
import ViewQueries from './ViewQueries'; // Component for viewing queries
import ViewUserDetails from './ViewUserDetails'; // Component for viewing user details
import RespondToQuery from './RespondToQuery'; // Component for responding to a query
import { ROLES } from '../constants/constants'; // Define roles constants

const Home = () => {
    const [user] = useAuthState(auth); // Get the authenticated user object
    const role = user?.email?.endsWith('.edu') ? ROLES.STUDENT : user?.email?.endsWith('admin.com') ? ROLES.ADMIN : ROLES.CUSTOMER; // Determine user role
    const navigate = useNavigate(); // Hook to navigate between routes

    const handleLogout = async () => {
        try {
            await auth.signOut(); // Sign out the user
            navigate('/login'); // Redirect to the login page after logout
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div>
            <nav className="navbar navbar-dark bg-dark">
                <div className="container">
                    <Link className="navbar-brand" to="/">Law Law Law</Link> {/* Link to the home page */}
                    <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button> {/* Logout button */}
                </div>
            </nav>
            
            {role === ROLES.CUSTOMER && <UploadQuery />} {/* Render UploadQuery component for customers */}
            {role === ROLES.CUSTOMER && <ViewResponses />} {/* Render ViewResponses component for customers */}
            {role === ROLES.STUDENT && <ViewQueries />} {/* Render ViewQueries component for students */}
            {role === ROLES.STUDENT && <RespondToQuery />} {/* Render ViewResponses component for students */}
            {role === ROLES.ADMIN && <ViewUserDetails />} {/* Render ViewUserDetails component for admins */}
        </div>
    );
}

export default Home;
