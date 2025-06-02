import { Router } from "express";
import { sb } from "../../supabase/client";

const userRouter = Router();

userRouter

  // Get all users; GET /users
  .get("/users", async (req, res) => {
    try {
      const {
        data: { users },
        error,
      } = await sb.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      if (error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(200).json(users);
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  })

  // Get one user; GET /user/:id
  .get("/user/:id", async (req, res) => {
    try {
      const { data, error } = await sb.auth.admin.getUserById(req.params.id);
      if (error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(200).json(data);
      }
    } catch (error: any) {
      {
        res.status(400).json({ message: error.message });
      }
    }
  })

  // Create a user; POST /user
  .post("/user", async (req, res) => {
    try {
      const { error } = await sb.auth.admin.createUser({
        email: req.body.email,
        password: req.body.password,
        email_confirm: true,
      });
      if (error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(200).json({ message: "User created successfully" });
      }
    } catch (error: any) {
      {
        res.status(400).json({ message: error.message });
      }
    }
  })

  // Update a user; PUT /user/:id
  .put("/user/:id", (req, res) => {
    try {
    } catch (error: any) {}
  })

  // Delete a user; DELETE /user/:id
  .delete("/user/:id", (req, res) => {
    try {
    } catch (error: any) {}
  });

export { userRouter };
