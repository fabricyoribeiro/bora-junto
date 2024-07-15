import { prisma } from "../../lib/prisma.js";

export default {
  async createEvent(req, res) {
    const {
      title,
      description,
      event_date,
      user_id,
      location_id,
      privacy_id,
      category_id,
      location
    } = req.body;
    console.log("TESTE",location_id, privacy_id, category_id)
    try {
      const event = await prisma.event.create({
        data: {
          title,
          description,
          event_date,
          // user_id,
          // location_id,
          // privacy_id,
          // category_id,
          user: {
            connect: {
              id: user_id,
            },
          },
          privacy: {
            connect: {
              id: privacy_id,
            },
          },
          eventCategory: {
            connect: {
              id: category_id,
            },
          },
          location: {
            create: {
              id: location_id,
            },
          }

        },
      });
      res.json(event);
    } catch (error) {
      console.error("Erro while creating event", error);
      res.status(500).json({ error: "Erro while creating event" });
    }
  },
  async deleteEvent(req, res) {
    const { id } = req.params;
    const event_id = parseInt(id);
    const event_exists = await prisma.event.findMany({ where: { id: event_id } });
    if (!event_exists) {
      res.status(500).json({ erro: "Event not found" });
    }
    try {
      const deleted_event = await prisma.event.delete({
        where: {
          id: event_id,
        },
      });
      res.json(deleted_event);
    } catch (error) {
      console.error("Erro while deleting event", error);
      res.status(500).json({ erro: "Erro while deleting event", error });
    }
  },
  async updateEvent(req, res) {
    console.log("aquiiii");
    const { id } = req.params;
    const { user_id, title, description, event_date, location_id, privacy_id } =
      req.body;
    const event_id = parseInt(id);

    const event_exists = await prisma.event.findUnique({
      where: { id: event_id },
    });
    if (!event_exists) {
      res.status(500).json({ erro: "Event not found" });
    }

    try {
      const updated_event = await prisma.event.update({
        where: {
          id: event_id,
        },
        data: {
          user_id,
          title,
          description,
          event_date,
          location_id,
          privacy_id,
        },
      });
      res.json(updated_event);
    } catch (error) {
      console.error("Erro while updating event", error);
      res.status(500).json({ erro: "Erro while updating event", error });
    }
  },
  async findEventById(req, res) {
    try {
      const { id } = req.params;
      const event = await prisma.event.findUnique({
        where: { id: Number(id), include: { location: true, privacy: true } },
      });
      if (!event) return res.json({ error: "Event does not exist" });
      return res.json(event);
    } catch (error) {
      return res.json({ error });
    }
  },
  async findAllEventsByUser(req, res) {
    try {
      const { id } = req.params;
      const event = await prisma.event.findMany({
        where: { user_id: id },
        include: { location: true, privacy: true },
      });
      if (!event) return res.json({ error: "Event does not exist" });
      return res.json(event);
    } catch (error) {
      return res.json({ error });
    }
  },

  async findAllEventsByPrivacy(req, res) {
    try {
      const { id } = req.params;
      const event = await prisma.event.findMany({
        where: {
          privacy_id: Number(id),
          include: { location: true, privacy: true },
        },
      });
      if (!event) return res.json({ error: "Event does not exist" });
      return res.json(event);
    } catch (error) {
      return res.json({ error });
    }
  },
  async findAllEvents(req, res) {
    //erro de segurança, futuramente esse método vai ser alterado, por enquanto é só pra ir testando o mapa
    try {
      const event = await prisma.event.findMany({
        include: { location: true, privacy: true, eventCategory: true},
      }); //apenas simulação, no futuro vai ser pego somente public e friends-only
      if (!event) return res.json({ error: "Event does not exist" });
      return res.json(event);
    } catch (error) {
      return res.json({ error });
    }
  },
  async findAllEventsByDate(req, res) {
    const { date } = req.params;
    const user_id  = req.query.user_id;

    console.log("USUARIO",user_id)

    // Parse the date string to create a Date object
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Set the start and end of the day in UTC
    const startOfDay = new Date(dateObj);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(dateObj);
    endOfDay.setUTCHours(23, 59, 59, 999);

    try {
      // Fetch events within the start and end of the day
      const events = await prisma.event.findMany({
        where: {
          user_id,
          event_date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      if (!events || events.length === 0) {
        return res.json({ error: "No events found for this date" });
      }

      return res.json(events);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  async findAllCategories(req, res) {
    try {
      const categories = await prisma.eventCategory.findMany();
      if (!categories) return res.json({ error: "No categories" });
      return res.json(categories);
    } catch (error) {
      return res.json({ error });
    }
  },
};
