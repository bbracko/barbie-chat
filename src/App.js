import React, { useState } from "react";
import "./App.css";
import TextSubmit from "./components/TextSubmit";

function App() {
  const generateRandomNumber = () => {
    const max = userNames.length - 1;
    return Math.floor(Math.random() * (max - 0 + 1)) + 0;
  };

  const userNames = [
    "Branka",
    "Dario",
    "Valentina",
    "Passtela",
    "Bobby",
    "Sherlock",
  ];
  const [currentUserId, setCurrentUserId] = useState(generateRandomNumber());
  const [drone, setDrone] = useState("");
  const [droneUserId, setDroneUserId] = useState(0);
  const [user, setUser] = useState({});
  const [texts, setTexts] = useState([
    /*
      { id: 1, userName: "Branka", text: "1 poruka" },
      { id: 2, userName: "Dario", text: "2 poruka" },
      { id: 3, userName: "Valentina", text: "3 poruka" },
      */
  ]);

  // Funkcija hendla slanje teksta iz forme
  const setTextSubmit = ({ text }) => {
    // Tekst šaljemo na ScaleDrone, a ne da ga odma dodavamo ovdje u array s porukama
    drone.publish({
      room: roomName,
      message: text,
    });
  };

  var newUser = {
    id: currentUserId,
    name: userNames[currentUserId],
    color: randomBoja(),
  };

  const roomName = "observable-bbracko";

  /* Scaledrone */
  const scaleDroneChannelId = "kI09uaMfJUgGCFUU";

  if (!droneUserId) {
    const droneConnection = new window.Scaledrone(scaleDroneChannelId, {
      data: newUser,
    });

    droneConnection.on("open", (error) => {
      if (error) {
        alert("greška");
        return console.error(error);
      }

      setDroneUserId(droneConnection.clientId);
      newUser.droneId = droneConnection.clientId;
      setUser(newUser);
      setDrone(droneConnection);

      const roomConnection = droneConnection.subscribe(roomName);

      roomConnection.on("message", (message) => {
        console.log("message");
        console.log(message);
        setTexts((prevTexts) => [
          ...prevTexts,
          {
            id: message.id,
            userId: message.clientId,
            userName: message.member.clientData.name,
            color: message.member.clientData.color,
            text: message.data,
          },
        ]);
      });
    });
  }

  return (
    <div className="chApp">
      <div className="titleApp">
        <h1>Barbie Bare Minimum Chat App</h1>
      </div>
      <ul className="chText">
        {console.log("texts")}
        {console.log(texts)}
        {texts.map((text) => (
          <li
            key={text.id}
            className={
              text.userId === droneUserId ? "currentUser" : "otherUser"
            }
            style={{ backgroundColor: text.color }}
          >
            <div className="userAndContent">
              <span className="userName">{getUserName(user, text)}</span>
              <span className="messageContent">{text.text}</span>
            </div>
          </li>
        ))}
      </ul>
      <hr />
      <div className="chForm">
        {drone && (
          <TextSubmit
            onUserSubmit={setTextSubmit}
            user={user}
            setCurrentUser={setCurrentUserId}
          />
        )}
      </div>
    </div>
  );
  
}

export default App;

function getUserName(user, text) {
  return text.userName;
}

function randomBoja() {
  var letters = "012345".split("");
  var color = "#";
  color += letters[Math.round(Math.random() * 5)];
  letters = "0123456789ABCDEF".split("");
  for (var i = 0; i < 5; i++) {
    color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}
