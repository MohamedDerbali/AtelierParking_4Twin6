const express = require("express");
const router = express.Router();
const eventModel = require("../models/Event");

router.post("/", async (req, res) => {
  try {
    const { titre, nbre_participants, description, date_event } = req.body;
    const checkIfEventExist = await eventModel.findOne({ titre });
    if (checkIfEventExist) throw new Error("event already exist");
    if (nbre_participants > 30)
      throw new Error("le nombre de participants doit etre <=30");
    const event = await eventModel.create({
      titre,
      nbre_participants,
      description,
      date_event: new Date(date_event),
    });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async(req, res) => {
  try {
    const events = await eventModel.find();
    if(events.length === 0){
        throw new Error("events not found!");
    }
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
