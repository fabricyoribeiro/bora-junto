
import user from "../Modules/User/index.js";
import { Router } from "express";

const userRoutes = Router();

userRoutes.post("/", user.createUser)
userRoutes.get("/list", user.findAllUsers)
userRoutes.get("/:id", user.findUserById)
userRoutes.get("/username/:username", user.findUserByUserName)
userRoutes.put("/:id", user.updateUser)
userRoutes.delete("/:id", user.deleteUserById)


export {userRoutes}