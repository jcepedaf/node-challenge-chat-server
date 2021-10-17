const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const messages = [{ id: 0, from: "Bart", text: "Welcome to CYF chat system!" }];

function getNextId() {
  const lastMessageIndex = messages.length - 1;
  if (lastMessageIndex === -1) {
    return 0;
  } else {
    const nextId = lastMessageIndex + 1;
    return nextId;
  }
}

function isValidMessage(message) {
  if (message.text && message.from) {
    return true;
  }
  return false;
}

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.get("/messages", (req, res) => {
  res.status(201).send(messages);
});

app.get("/messages/search", (req, res) => {
  const searchTerm = req.query.text.toLowerCase();
  const result = messages.filter((item) =>
    item.text.toLowerCase().includes(searchTerm)
  );
  res.send(result);
});

app.get("/messages/lastten", (req, res) => {
  let result = messages.slice(-10);
  res.send(result);
});

app.get("/messages/:id", (req, res) => {
  const messageId = parseInt(req.params.id);
  const message = messages.find((message) => message.id === messageId);
  if (message) {
    res.status(201).send(message);
  } else {
    res.status(404).send("This message does not exist");
  }
});

app.post("/messages", (req, res) => {
  const message = {
    id: getNextId(),
    from: req.body.from,
    text: req.body.text,
  };

  if (!isValidMessage(message)) {
    res.status(404).send("This message is not complete.");
    return;
  }
  messages.push(message);
  res.status(201).send(message);
});

app.put("/messages/:id", (req, res) => {
  const messageId = parseInt(req.params.id);
  let updatedMessage = req.body;

  let message = messages.find((message) => message.id === messageId);
  if (!message) {
    res.status(404).send("This message does not exist");
  }
  message.from = updatedMessage.from;
  message.text = updatedMessage.text;
  timeSent = message.timeSent;
  res.status(201).send(updatedMessage);
});

app.delete("/messages/:id", (req, res) => {
  const messageId = req.params.id;

  const index = messages.findIndex((message) => message.id == messageId);
  if (index === -1) {
    res.status(404).send();
    return;
  }
  messages.splice(index, 1);
  res.status(201).send({ success: true });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
