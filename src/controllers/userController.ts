import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";

// create a new user
export const createUser = async (req: Request, res: Response): Promise<any> => {
  const {
    username,
    firstname,
    lastname,
    email,
    password,
    role,
    referralCode,
    points,
  } = req.body;

  try {
    if (!username || !firstname || !lastname || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const userRole = role === "ORGANIZER" ? "ORGANIZER" : "CUSTOMER";
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        firstname,
        lastname,
        email,
        password: hashedPassword,
        role: userRole,
        referralCode,
        points: points || 0,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Something went wrong when creating the user." });
  }
};
//get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Something went wrong when fetching users." });
  }
};

//get user by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Something went wrong when fetching the user." });
  }
};

//update user
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    username,
    firstname,
    lastname,
    email,
    imgProfile,
    isVerified,
    points,
    role,
  } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        username,
        firstname,
        lastname,
        email,
        imgProfile,
        isVerified,
        points,
        role,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Something went wrong when updating the user." });
  }
};

//delete user
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedUser = await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.status(200).json(deletedUser);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Something went wrong when deleting the user." });
  }
};
