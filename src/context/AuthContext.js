import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { db } from "./../firebase";
import { useHistory } from "react-router-dom";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    setCurrentUser(null);
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  const history = useHistory();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("aksdnasndkasd", user);
      user
        ? db
            .child("user")
            .child(user.uid)
            .child("UserInfo")
            .get()
            .then((snapshot) => {
              if (snapshot.exists()) {
                console.log("user info", snapshot.val());
                setCurrentUser(snapshot.val());
                history.replace("/");
              } else {
                console.log("No data available");
              }
              setLoading(false);
            })
            .catch((error) => {
              console.error("fetching user error", error);
              setLoading(false);
            })
        : setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    setCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
