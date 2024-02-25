import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase-config'; // Import the Firestore database instance
import { collection, getDocs } from 'firebase/firestore';
import { auth } from '../../firebase/firebase-config';

const ViewQueries = () => {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQueries = async () => {
            setLoading(true);
            try {
                // Check if the user is authenticated
                if (!auth.currentUser) {
                    throw new Error('User is not authenticated');
                }

                // Fetch queries from Firestore
                const queriesSnapshot = await getDocs(collection(db, 'queries'));
                const queriesData = queriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setQueries(queriesData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching queries:', error);
                setError('Error fetching queries');
                setLoading(false);
            }
        };

        fetchQueries();
    }, []);

    return (
        <div>
            <h2>View Queries</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <ul>
                {queries.map(query => (
                    <li key={query.id}>
                        <strong>User ID:</strong> {query.userId}<br />
                        {query.imageURL && <img src={query.imageURL} alt="Query Image" style={{ maxWidth: '200px' }} />} Image <br />
                        {query.recordingURL && <audio controls><source src={query.recordingURL} type="audio/mp3" />Your browser does not support the audio element.</audio>} <br />
                        <strong>Query:</strong> {query.query}<br />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewQueries;
