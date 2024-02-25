import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase-config'; // Import the Firestore database instance
import { Button, Table } from 'react-bootstrap';
import { collection, getDocs, doc, deleteDoc,where,query , batch} from 'firebase/firestore';
import { auth } from '../../firebase/firebase-config';

const ViewUserDetails = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const deleteUser = async (userId) => {
        try {

            try {
                // Disable user account
                await auth.updateUser(userId, {
                    disabled: true
                });
                console.log('User account disabled successfully');
            } catch (error) {
                console.error('Error disabling user account:', error);
            }
        
            // Delete user from Firebase Authentication
            try {
                console.log('Deleting user:', userId)
                await auth.deleteUser(userId);
                // User deleted successfully
            } catch (error) {
                console.error('Error deleting user:', error);
            }
    
            // Delete corresponding queries made by the user from Firestore
            const querySnapshot = await getDocs(query(collection(db, 'queries'), where('userId', '==', userId)));
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref); // Delete each query document
            });
            
    
            // Delete user from the users collection
            await deleteDoc(doc(db, 'users', userId));
            
            // Update local state
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };
    return (
        <div>
            <h2>User Management</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.email}>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <Button variant="danger" onClick={() => deleteUser(user.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ViewUserDetails;
