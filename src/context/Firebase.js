import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    sendPasswordResetEmail
} from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import sendExpiryEmail from "../components/emailService"

const FirebaseContext = createContext(null);

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APPID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
export const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);


export const useFirebase = () => {
    const firebase = useContext(FirebaseContext);
    if (!firebase) {
        throw new Error("useFirebase must be used within a FirebaseProvider");
    }
    return firebase;
}

export const FirebaseProvider = (props) => {
    const [user, setUser] = useState(() => {
        // Initialize user state from localStorage
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const addUser = (email, password, name, phno) => {
        createUserWithEmailAndPassword(firebaseAuth, email, password)
            .then((userCredential) => {
                const loggedInuser = userCredential.user;
                const user = {
                    name,
                    phno,
                    email,
                    userId: loggedInuser.uid
                };
                const userDocRef = doc(firestore, 'users', loggedInuser.uid);

                setDoc(userDocRef, user)
                    .then(() => {
                        console.log('User document created with UID: ', loggedInuser.uid);
                    })
                    .catch((error) => {
                        console.error('Error creating user document: ', error);
                    });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        onAuthStateChanged(firebaseAuth, user => {
            if (user) {
                // Store user in localStorage when logged in
                const userData = {
                    uid: user.uid,
                    email: user.email,
                    // Add any other user properties you need
                };
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
            } else {
                // Remove user from localStorage when logged out
                localStorage.removeItem('user');
                setUser(null);
            }
        })
    }, [])

    const handleCreateNewListing = async (pname, quantity, brand, coverPic, expiry, category) => {
        const fileName = coverPic.name || `image-${Date.now()}.jpg`;
        const imageRef = ref(storage, `uploads/images/${Date.now()}-${fileName}`);
        try {
            const uploadResult = await uploadBytes(imageRef, coverPic);
            console.log('uploadResult:', uploadResult);
            const randomId = Math.random().toString(36).substring(2, 15);
            const messageDetail = {
                pname,
                brand,
                quantity,
                imageURL: uploadResult.ref.fullPath,
                userId: user.uid,
                userEmail: user.email, // This is the registered user's email
                id: randomId,
                expiry,
                category
            };
            const messageDocRef = doc(firestore, 'items', randomId);
            await setDoc(messageDocRef, messageDetail);
    
            // Send expiry email to the registered user
            sendExpiryEmail(user.email, pname, expiry); // Pass user.email here
    
            console.log('Product added with ID:', randomId);
            return randomId;
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    };

    const getImageURL = (path) => {
        return getDownloadURL(ref(storage, path));
    };

    const sendPReset = (email) => {
        sendPasswordResetEmail(firebaseAuth, email);
    };

    const listAllItems = async () => {
        if (user) {
            try {
                const qr = query(
                    collection(firestore, "items"),
                    where("userId", "==", user.uid)
                );
                const querySnap = await getDocs(qr);
                const fetchedItems = [];
                querySnap.forEach((doc) => {
                    fetchedItems.push(doc);
                });
                return fetchedItems;
            } catch (error) {
                console.error("Error fetching item data:", error);
                return [];
            }
        } else {
            console.log("User is null in listAllItems");
            return [];
        }
    };

    const listOnExpiry = async () => {
        try {
            if (!user) {
                console.log("User is not authenticated");
                return [];
            }

            const userId = user.uid;
            const twoDaysFromNow = new Date();
            twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 7);

            const formattedTwoDaysFromNow = `${twoDaysFromNow.getFullYear()}-${(twoDaysFromNow.getMonth() + 1).toString().padStart(2, '0')}-${twoDaysFromNow.getDate().toString().padStart(2, '0')}`;

            const qr = query(
                collection(firestore, "items"),
                where("userId", "==", userId),
                where("expiry", "<=", formattedTwoDaysFromNow)
            );

            const querySnap = await getDocs(qr);

            const approachingExpiryItems = [];
            querySnap.forEach((doc) => {
                const itemData = doc.data();
                approachingExpiryItems.push(itemData);

                // Send expiry email
                sendExpiryEmail(user.email, itemData.pname, itemData.expiry);
            });

            console.log('Items approaching expiry within two days:', approachingExpiryItems);
            return approachingExpiryItems;
        } catch (error) {
            console.error('Error querying items approaching expiry within two days:', error);
            return [];
        }
    };

    const listCategories = async () => {
        try {
            if (!user) {
                console.log("User is not authenticated");
                return [];
            }

            const userId = user.uid;
            const twoDaysFromNow = new Date();
            twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

            const formattedTwoDaysFromNow = `${twoDaysFromNow.getFullYear()}-${(twoDaysFromNow.getMonth() + 1).toString().padStart(2, '0')}-${twoDaysFromNow.getDate().toString().padStart(2, '0')}`;

            const qr = query(
                collection(firestore, "items"),
                where("userId", "==", userId),
                where("expiry", "<=", formattedTwoDaysFromNow)
            );

            const querySnap = await getDocs(qr);

            const approachingExpiryItems = [];
            const categoriesSet = new Set(); // Using Set to ensure unique categories

            querySnap.forEach((doc) => {
                const itemData = doc.data();
                approachingExpiryItems.push(itemData);
                categoriesSet.add(itemData.category); // Add category to Set
            });

            const approachingExpiryCategories = Array.from(categoriesSet); // Convert Set to Array

            console.log('Items approaching expiry within two days:', approachingExpiryItems);
            console.log('Categories of items approaching expiry:', approachingExpiryCategories);

            return approachingExpiryCategories;
        } catch (error) {
            console.error('Error querying items approaching expiry within two days:', error);
            return [];
        }
    };

    const deleteItem = async (id) => {
        await deleteDoc(doc(firestore, "items", id));
    };

    const signinUserWithEmailAndPassword = (email, password) => {
        signInWithEmailAndPassword(firebaseAuth, email, password);
    };

    const signinWithGoogle = () => {
        signInWithPopup(firebaseAuth, googleProvider);
    };

    const isLoggedIn = user ? true : false;

    const handleLogout = async () => {
        try {
            await signOut(firebaseAuth);
        } catch (error) {
            console.error('Error occurred during logout:', error);
        }
    };

    return (
        <FirebaseContext.Provider value={{
            addUser,
            signinUserWithEmailAndPassword,
            signinWithGoogle,
            isLoggedIn,
            handleCreateNewListing,
            deleteItem,
            listAllItems,
            getImageURL,
            listOnExpiry,
            user,
            listCategories,
            handleLogout,
            sendPReset,
            sendExpiryEmail // Add this line
        }}>
            {props.children}
        </FirebaseContext.Provider>
    );
};
