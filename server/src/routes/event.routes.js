
import event from "../modules/Event/index.js";
import { Router } from "express";

const eventRoutes = Router();

eventRoutes.post("/", event.createEvent)
eventRoutes.get("/list", event.findAllEvents)
eventRoutes.get("/privacy/:id", event.findAllEventsByPrivacy)
eventRoutes.get("/user/:id", event.findAllEventsByUser)
eventRoutes.get("/:id", event.findEventById)
eventRoutes.get("/date/:date", event.findAllEventsByDate)
eventRoutes.put("/:id", event.updateEvent)
eventRoutes.delete("/:id", event.deleteEvent)

eventRoutes.get("/category/list", event.findAllCategories)


export {eventRoutes}