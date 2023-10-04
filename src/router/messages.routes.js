const { Router } = require("express");
const { messagesModel } = require("../models/messages.model.js");


const messagesRouter = Router();

messagesRouter.get("/", async (req, res) => {
  try {
    let products = await messagesModel.find();
    res.send({ result: "success", payload: products });
  } catch (error) {
    console.log(error);
  }
});

messagesRouter.post("/", async (req, res) => {
  let { user, message } = req.body;

  if (!user || !message) {
    res.send({ status: "error", error: "Incomplete data" });
  }
  let result = await messagesModel.create({
    user,
    message,
  });
  res.send({ result: "success", payload: result });
});

messagesRouter.put("/:id", async (req, res) => {
  let { id } = req.params;
  let editMessage = req.body;
  if (!editMessage.message) {
    res.send({ status: "error", error: "No message to edit" });
  }
  let result = await messagesModel.updateOne({ _id: id }, editMessage);
  res.send({ result: "success", payload: result });
});

messagesRouter.delete("/:id", async (req, res) => {
  let { id } = req.params;
  let result = await messagesModel.deleteOne({ _id: id });
  res.send({ result: "success", payload: result });
});

module.exports = messagesRouter;