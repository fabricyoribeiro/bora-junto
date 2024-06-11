import { prisma } from "../../lib/prisma.js"

export default {
    async createMessage(req, res){
        const { sender_id, receiver_id, content, status } = req.body
        console.log(sender_id, receiver_id, content)
        
        try {
            const new_message = await prisma.message.create({
                data: {
                    sender_id: parseInt(sender_id),
                    receiver_id: parseInt(receiver_id),
                    content,
                    status: 0,
                }
            })
            return res.json(new_message)
        } catch (error) {
            console.error('Erro while creating message', error)
            res.status(500).json({error: 'Erro while creating message'})        
        }
    },
    async getAllMessagesByUser(req, res){
        const {id} = req.params
        const receiver_id = parseInt(req.query.receiver_id, 10);

        console.log('receiver:',receiver_id)

        try {
            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        {
                            sender_id: Number(id),
                            receiver_id: Number(receiver_id)
                        },
                        {
                            sender_id: Number(receiver_id),
                            receiver_id: Number(id)
                        }
                    ]
                },
                orderBy: {
                    created_at: 'desc' // or 'desc' for descending order
                }
            });
            return res.json(messages);

        } catch (error) {
            console.error('Erro while getting messages', error)
            res.status(500).json({error: 'Erro while getting messages'})
        }
    },
    // async updateGoal(req, res){
    //     const {id , title, description, status} = req.body
        
    //     try {
    //         const goal = await prisma.goal.update({
    //             where: { id: Number(id) }, 
    //             data: {
    //                 title,
    //                 description,
    //                 status,
    //             }

    //         })
    //         return res.json(goal)
    //     } catch (error) {
    //         console.error('Erro while updating goal', error)
    //         res.status(500).json({error: 'Erro while updating goal'})  
    //     }
    // },
    // async deleteGoalById(req, res){
    //     const {id} = req.body
        
    //     try {
    //         const goal = await prisma.goal.delete({
    //             where: { id: Number(id) }
    //         })
    //         return res.json(goal)
    //     } catch (error) {
    //         console.error('Erro while deleting goal', error)
    //         res.status(500).json({error: 'Erro while deleting goal'})  
    //     }
    // },
    // async deleteAllGoalsByUser(req, res){
    //     const {user_id} = req.body
    //     try {
    //         const goals = await prisma.goal.deleteMany({
    //             where: {
    //                 user_id: Number(user_id)
    //             }
    //         })
    //         return res.json(goals)
    //     } catch (error) {
    //         console.error('Erro while deleting all goals', error)
    //         res.status(500).json({error: 'Erro while deleting all goals'})  
    //     }
    // },
}