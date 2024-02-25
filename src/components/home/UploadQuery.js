import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage, auth } from '../../firebase/firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const UploadQuery = () => {
    const [query, setQuery] = useState("");
    const [recording, setRecording] = useState(null);
    const [image, setImage] = useState(null);

    const handleQueryChange = (e) => {
        setQuery(e.target.value);
    };

    const handleRecordingChange = (e) => {
        const file = e.target.files[0];
        setRecording(file);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Upload recording and image to Firestore Storage
            const recordingRef = ref(storage, `recordings/${recording.name}`);
            await uploadBytes(recordingRef, recording);
            const recordingUrl = await getDownloadURL(recordingRef);
            console.log("Recording uploaded with URL: ", recordingUrl)

            const imageRef = ref(storage, `images/${image.name}`);
            await uploadBytes(imageRef, image);
            const imageUrl = await getDownloadURL(imageRef);
            console.log("Image uploaded with URL: ", imageUrl)
            
           

            // Get the current user ID
            const userId = auth.currentUser.uid;

            // Add query data to Firestore
            const queryRef = await addDoc(collection(db, 'queries'), {
                query: query,
                recordingUrl: recordingUrl,
                imageUrl: imageUrl,
                userId: userId, // Include the user ID in the document data
                // Add other query data fields as needed
            });

            console.log("Query uploaded with ID: ", queryRef.id);

            // Clear form fields after successful upload
            setQuery("");
            setRecording(null);
            setImage(null);
        } catch (error) {
            console.error('Error uploading query:', error);
        }
    };

    return (
        <div className="container">
            <h2>Upload Query</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="query" className="form-label">Query</label>
                    <textarea
                        className="form-control"
                        id="query"
                        value={query}
                        onChange={handleQueryChange}
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="recording" className="form-label">Recording</label>
                    <input
                        type="file"
                        className="form-control"
                        id="recording"
                        onChange={handleRecordingChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">Image</label>
                    <input
                        type="file"
                        className="form-control"
                        id="image"
                        onChange={handleImageChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default UploadQuery;
