import React, { useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { app } from "./firebase.jsx";

const auth = getAuth(app);
const db = getFirestore(app);

const AuthContext = React.createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [firstTimeDone, setFirstTimeDone] = useState(null); // null = loading
  const [sortingCompleted, setSortingCompleted] = useState(null); // null = loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setFirstTimeDone(userData.firstTimeDone || false);
            setSortingCompleted(userData.sortingCompleted || false);
          } else {
            // New user - create document with default values
            await setDoc(docRef, {
              email: currentUser.email,
              firstTimeDone: false,
              sortingCompleted: false,
              createdAt: new Date().toISOString(),
            });
            setFirstTimeDone(false);
            setSortingCompleted(false);
          }
        } catch (error) {
          console.error("Error handling user data:", error);
          setFirstTimeDone(false);
          setSortingCompleted(false);
        }
      } else {
        setUser(null);
        setFirstTimeDone(null);
        setSortingCompleted(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCompleteFirstTimeStep = async () => {
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, { firstTimeDone: true });
        setFirstTimeDone(true);
      } catch (error) {
        console.error("Error updating first time step:", error);
      }
    }
  };

  const handleCompleteSorting = async () => {
    if (user) {
      try {
        console.log('Updating sorting completion in Firebase...');
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, { 
          sortingCompleted: true,
          sortingCompletedAt: new Date().toISOString()
        });
        console.log('Firebase updated, setting local state...');
        setSortingCompleted(true);
        console.log('Sorting completion marked as true');
      } catch (error) {
        console.error("Error updating sorting completion:", error);
        throw error; // Re-throw to handle in SortingHat component
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      currentUser: user, // Adding alias for backward compatibility
      firstTimeDone, 
      sortingCompleted,
      handleCompleteFirstTimeStep,
      handleCompleteSorting
    }}>
      {children}
    </AuthContext.Provider>
  );
};