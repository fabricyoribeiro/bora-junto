
import { prisma } from "../../lib/prisma.js";

export default { 

    async createEvent(req, res){
        const { description, event_date, user_id, location_id, privacy_id, eventCategoryId} = req.body
        try {
            const event = await prisma.event.create({
                data: {
                    description,
                    event_date,
                    user_id,
                    location_id,
                    privacy_id,
                    eventCategoryId,
                }
            })
            res.json(event)
        } catch (error) {
            console.error('Erro while creating event', error)
            res.status(500).json({error: 'Erro while creating event'})
        }

    },
    async deleteEvent(req, res){
        const {id} = req.params
        const event_id= parseInt(id)
        const event_exists = await prisma.event.findFirst({id: event_id})
        if(!event_exists) {
            res.status(500).json({erro: 'Event not found'})
        }
        try {
            
            const deleted_event = await prisma.event.delete({
                where: {
                    id: event_id
                }
            })
            res.json(deleted_event)
        } catch (error) {
            console.error('Erro while deleting event', error)
            res.status(500).json({erro: 'Erro while deleting event', error})
        }

    },
    async updateEvent(req, res){
        const {id} = req.params
        const {description, event_date, location_id, privacy_id} = req.body
        const event_id = parseInt(id)

        const event_exists = await prisma.event.findFirst({id: event_id})
        if(!event_exists) {
            res.status(500).json({erro: 'Event not found'})
        }

        try {
            const updated_event = await prisma.event.update({
                where: {
                    id: event_id,

                },
                data: {
                    description,
                    event_date,
                    location_id,
                    privacy_id,
                }
            })
            res.json(updated_event)
        } catch (error) {
            console.error('Erro while updating event', error)
            res.status(500).json({erro: 'Erro while updating event', error})
        }


    },
    async findEventById(req, res) {
        try {
            const { id } = req.params
            const event = await prisma.event.findUnique({ where: { id: Number(id),include:{location:true, privacy: true} }})
            if (!event) return res.json({ error: "Event does not exist" })
            return res.json(event)

        } catch (error) {
            return res.json({ error })
        }
    },
    async findAllEventsByUser(req, res) {
        try {
            const { id } = req.params
            const event = await prisma.event.findFirst({ where: { user_id: Number(id) },include:{location:true, privacy: true}})
            if (!event) return res.json({ error: "Event does not exist" })
            return res.json(event)

        } catch (error) {
            return res.json({ error })
        }
    },

    async findAllEventsByPrivacy(req, res) {
        try {
            const { id } = req.params
            const event = await prisma.event.findMany({ where: { privacy_id: Number(id),include:{location:true, privacy: true} }})
            if (!event) return res.json({ error: "Event does not exist" })
            return res.json(event)

        } catch (error) {
            return res.json({ error })
        }
    },
    async findAllEvents(req, res) { //erro de segurança, futuramente esse método vai ser alterado, por enquanto é só pra ir testando o mapa
        try {
            const event = await prisma.event.findMany({ where: {OR:[{privacy_id:3},{privacy_id:2},{privacy_id:1}]},include:{location:true, privacy: true}})//apenas simulação, no futuro vai ser pego somente public e friends-only
            if (!event) return res.json({ error: "Event does not exist" })
            return res.json(event)

        } catch (error) {
            return res.json({ error })
        }
    },

}
