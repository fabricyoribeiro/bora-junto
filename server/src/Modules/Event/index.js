
import { prisma } from "../../lib/prisma.js";

export default { 

    async createEvent(req, res){
        const { description, event_date, user_id, location_id, privacy_id } = req.body
        try {
            const event = await prisma.event.create({
                data: {
                    description,
                    event_date,
                    user_id,
                    location_id,
                    privacy_id,
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


    
    async getAllEvents(req, res){

    },

    async getAllEventsById(req, res){

    },

}
