import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { app } from "./firebaseConfig";

// Helper: Converts data to an array if it's an object; if it's already an array, returns it; if falsy, returns an empty array.
const convertToArray = (data) => {
  if (!data) return [];
  return Array.isArray(data) ? data : Object.values(data);
};

function Read() {
  const [users, setUsers] = useState({});

  useEffect(() => {
    const db = getDatabase(app);
    const dbRef = ref(db, "users");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUsers(data);
      }
    });
  }, []);

  // Download user data as a JSON file.
  const downloadUserData = (userId) => {
    const userData = users[userId];
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${userId}_data.pdf`;
    link.click();
  };

  return (
    <div>
      <h2>User Data</h2>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Location</th>
            <th>Gallery</th>
            <th>Call Logs</th>
            <th>Contacts</th>
            <th>Notes</th>
            <th>Provider</th>
            <th>Profile Picture</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(users).map(([userId, userData]) => (
            <tr key={userId}>
              <td>{userId}</td>

              {/* Location: If exists and is an object, display as formatted string */}
              <td>
                {userData.location && typeof userData.location === "object"
                  ? `Lat: ${userData.location.latitude || "N/A"}, Lon: ${userData.location.longitude || "N/A"}`
                  : "N/A"}
              </td>

              {/* Gallery: Convert to array and render each image */}
              <td>
                {userData.gallery ? (
                  convertToArray(userData.gallery).map((img, index) => (
                    <img key={index} src={img} alt="Gallery" width="50" style={{ marginRight: 4 }} />
                  ))
                ) : (
                  "No Images"
                )}
              </td>

             {/* Call Logs: Show phone number and call type properly */}
              <td>
                {userData.call_logs ? (
                  <ul style={{ paddingLeft: "20px", margin: 0 }}>
                    {Object.entries(userData.call_logs).map(([phone, type]) => (
                      <li key={phone}>
                        {phone}: {type}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "No Call Logs"
                )}
              </td>

              {/* Contacts: Show name and number properly */}
              <td>
                {userData.contact_list ? (
                  <ul style={{ paddingLeft: "20px", margin: 0 }}>
                    {Object.entries(userData.contact_list).map(([name, number]) => (
                      <li key={name}>
                        {name}: {number}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "No Contacts"
                )}
              </td>

              {/* Notes: Render notes as string (stringify if an object) */}
              <td>
                {userData.notes
                  ? typeof userData.notes === "object"
                    ? JSON.stringify(userData.notes)
                    : userData.notes
                  : "No Notes"}
              </td>

              {/* Provider: Render provider as string (stringify if an object) */}
              <td>
                {userData.provider
                  ? typeof userData.provider === "object"
                    ? JSON.stringify(userData.provider)
                    : userData.provider
                  : "Unknown"}
              </td>

              {/* Profile Picture */}
              <td>
                {userData.profilePicture ? (
                  <img src={userData.profilePicture} alt="Profile" width="50" />
                ) : (
                  "No Profile Picture"
                )}
              </td>

              {/* Download Button */}
              <td>
                <button onClick={() => downloadUserData(userId)}>Download</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Read;
