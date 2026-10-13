import { useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";

import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

import { auth, db } from "./firebase";
import { dbx } from "./dropbox";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    user
  } = useAuth0();

  // Firebase Registration
  async function register() {
    try {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      setMessage("Registration successful");
    } catch (error) {
      console.error("Registration error:", error);
      setMessage(error.message);
    }
  }

  // Firebase Login
  async function login() {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      setMessage("Login successful");
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.message);
    }
  }

  // Select File
  function selectFile(event) {
    setFile(event.target.files[0] || null);
  }

  // Upload File to Dropbox
  async function uploadFile() {
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    try {
      await dbx.filesUpload({
        path: "/" + file.name,
        contents: file
      });

      setMessage("File uploaded to Dropbox successfully");
    } catch (error) {
      console.error("Dropbox error:", error);
      setMessage("File upload failed: " + error.message);
    }
  }

  // Save Data to MongoDB Atlas through Backend
  async function saveToMongoDB() {
    try {
      const response = await fetch(
        "http://localhost:5000/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email,
            fileName: file ? file.name : ""
          })
        }
      );

      const result = await response.text();

      if (!response.ok) {
        throw new Error(result || "MongoDB request failed");
      }

      setMessage(result);
    } catch (error) {
      console.error("MongoDB error:", error);
      setMessage("MongoDB save failed: " + error.message);
    }
  }

  // Save Data to Cloud Firestore
  async function saveToFirestore() {
    if (!email.trim()) {
      setMessage("Please enter your email first");
      return;
    }

    try {
      const docRef = await addDoc(
        collection(db, "users"),
        {
          email: email.trim(),
          fileName: file ? file.name : "",
          createdAt: serverTimestamp()
        }
      );

      console.log("Firestore document ID:", docRef.id);

      setMessage("Data saved to Firestore successfully!");
    } catch (error) {
      console.error("Firestore error:", error);
      setMessage("Firestore save failed: " + error.message);
    }
  }

  return (
    <div>
      <h1>Cloud File App</h1>

      <h2>Firebase Login</h2>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={register}>
        Register
      </button>

      {" "}

      <button onClick={login}>
        Login
      </button>

      <hr />

      <h2>Dropbox File Upload</h2>

      <input
        type="file"
        onChange={selectFile}
      />

      <br />
      <br />

      <button onClick={uploadFile}>
        Upload File
      </button>

      <hr />

      <h2>MongoDB Atlas</h2>

      <button onClick={saveToMongoDB}>
        Save to MongoDB
      </button>

      {" "}

      <button onClick={saveToFirestore}>
        Save to Firestore
      </button>

      <hr />

      <h2>Auth0 Login</h2>

      {isAuthenticated ? (
        <div>
          <h3>Welcome {user?.name}</h3>

          <button
            onClick={() =>
              logout({
                logoutParams: {
                  returnTo: window.location.origin
                }
              })
            }
          >
            Logout
          </button>
        </div>
      ) : (
        <button onClick={() => loginWithRedirect()}>
          Login with Auth0
        </button>
      )}

      <h3>{message}</h3>
    </div>
  );
}

export default App;
