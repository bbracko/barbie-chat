import React, { useState } from "react";

const TextSubmit = ({ onUserSubmit, user }) => {
  const [text, setText] = useState("");

  const handleTextSubmit = (event) => {
    event.preventDefault();

    if (text !== "") {
      console.log('user user');
      console.log(user);
      console.log(user.name);
      onUserSubmit({ text: text });
      setText("");
    }
  };

  return (
    <div>
      <form onSubmit={handleTextSubmit}>
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Text Message"
        />
        <button type="submit">Pošalji</button>
      </form>
    </div>
  );
};

export default TextSubmit;
