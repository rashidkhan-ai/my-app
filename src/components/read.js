import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import app from "../firebaseConfig"; // Import Firebase config

function Read() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const db = getDatabase(app);
    const dbRef = ref(db, "users"); // Fetch data from "users" node
    
    onValue(dbRef, (snapshot) => {
      const fetchedData = snapshot.val();
      if (fetchedData) {
        setData(Object.values(fetchedData)); // Convert object to array
      }
    });
  }, []);

  return (
    <div>
      <h2>Read Data from Firebase</h2>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li> // Display each item
        ))}
      </ul>
    </div>
  );
}

export default Read;
