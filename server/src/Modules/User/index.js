// import { prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";

export default {
  async createUser(req, res) {
    const {
      id,
      name,
      username,
      user_category_id,
      profile_pic_url,
      phone,
      email,
      location_id,
    } = req.body;
    console.log(
      "usuario no create",
      name,
      username,
      user_category_id,
      profile_pic_url,
      phone,
      email,
    );
    console.log("usuario", username);

    try {
      const user = await prisma.user.create({
        data: {
          id,
          name,
          username,
          email,
          phone,
          user_category_id: parseInt(user_category_id),
          profile_pic_url,
          location_id,
        },
      });

      res.json(user);
    } catch (error) {
      console.error("Error while creating user:", error);
      res.status(500).json({ error: "Error while creating user" });
    }
  },

  async findAllUsers(req, res) {
    try {
      const users = await prisma.user.findMany();
      return res.json(users);
    } catch (error) {
      return res.json({ error });
    }
  },

  async findUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });
      if (!user) return res.json({ error: "User does not exist" });
      return res.json(user);
    } catch (error) {
      return res.json({ error });
    }
  },
//   async fidUserIdByEmail(req, res) {
//     const email  = req.query.email
//     console.log("email server", email);
//     try {
//       const userId = await prisma.user.findUnique({
//         where: {
//           email,
//         },select: {
//             id:true
//         }
//       });
//       if (!user) {
//         return res.status(404).json({ error: "User not found" });
//       }
  

//       console.log("id server", userId);
//       return res.json(userId);
//     } catch (error) {
//       console.error("Erro while getting user id", error);
//       res.status(500).json({ error: "Erro while getting user id" });
//     }
//   },

  async findUserByUserName(req, res) {
    try {
      const { username } = req.params;
      const users = await prisma.$queryRaw`
            SELECT * FROM "User"
            WHERE LOWER("username") LIKE ${`%${username.toLowerCase()}%`}            
        `;

      if (!users || users.length === 0) {
        return res.json({ error: "User does not exist" });
      }

      return res.json(users);
    } catch (error) {
      console.error("Error while searching for users.", error);
      return res
        .status(500)
        .json({ error: "Error while searching for users." });
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;

      const {
        username,
        user_category,
        profile_pic_url,
        phone,
        email,
        birth_date,
      } = req.body;

      let user = await prisma.user.findUnique({ where: { id: Number(id) } });
      if (!user) return res.status(404).json({ error: "User does not exist" });

      user = await prisma.user.update({
        where: { id: Number(id) },
        data: {
          username,
          email,
          phone,
          user_category,
          profile_pic_url,
          birth_date,
          updated_at: Date.now(),
        },
      });
      return res.json(user);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "It was not possible to update user" });
    }
  },

  async findFollowersByUser(req, res) {
    try {
      const { id } = req.params;
      const followers = await prisma.following.findMany({
        where: { following: Number(id) },
        include: { follower: true },
      });
      return res.json(followers);
    } catch (error) {
      return res.json({ error });
    }
  },
  async findFollowingByUser(req, res) {
    try {
      const { id } = req.params;
      const following = await prisma.following.findMany({
        where: { follower: Number(id) },
        include: { following: true },
      });
      return res.json(following);
    } catch (error) {
      return res.json({ error });
    }
  },

  async deleteUserById(req, res) {
    try {
      const { id } = req.params;
      let user = await prisma.user.findUnique({ where: { id: Number(id) } });
      if (!user) return res.json({ error: "User does not exist" });
      await prisma.user.delete({ where: { id: Number(id) } });
      return res.json({ message: "User deleted" });
    } catch (error) {
      return res.json({ error });
    }
  },
};
