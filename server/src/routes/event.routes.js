
import event from "../Modules/Event/index.js";
import { Router } from "express";

const eventRoutes = Router();

eventRoutes.post("/", event.createEvent)
eventRoutes.get("/list", event.findAllEvents)
eventRoutes.get("/privacy/:id", event.findAllEventsByPrivacy)
eventRoutes.get("/user/:id", event.findAllEventsByUser)
eventRoutes.get("/:id", event.findEventById)
eventRoutes.put("/:id", event.updateEvent)
eventRoutes.delete("/:id", event.deleteEvent)


export {eventRoutes}