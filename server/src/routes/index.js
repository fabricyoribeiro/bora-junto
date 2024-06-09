import express from 'express';
import { userRoutes } from './user.routes.js';
import {postRoutes} from './post.routes.js'
import { commentRoutes } from './comment.routes.js';
import { goalRoutes } from './goal.routes.js';

const routes = express()

routes.use('/user', userRoutes)
routes.use('/post', postRoutes)
routes.use('/comment', commentRoutes)
routes.use('/goal', goalRoutes)

export {routes}