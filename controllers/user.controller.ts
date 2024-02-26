import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user/userService.js';
class UserController{

    async createUser(req:Request, res:Response, next:NextFunction) {
        try {
          const userData = req.body;
          const newUser = await new UserService().createUser(userData);
          res.status(201).json(newUser);
        } catch (error) {
          next(error);
        }
      }
    
    async updateUser(req:Request, res:Response, next:NextFunction) {
        try {
          const userId = req.params.userId;
          const userData = req.body;
          const updatedUser = await new UserService().updateUser(userId,userData);
          if(updatedUser){
            res.status(200).json(updatedUser);
          }else{
            res.status(404).json({message:"User not found"});
          }
        } catch (error) {
          next(error);
        }
      }

        async deleteUser(req:Request, res:Response, next:NextFunction) {
            try {
            const userId = req.params.userId;
            const deletedUser = await new UserService().deleteUser(userId);
            if(deletedUser){
                res.status(200).json(deletedUser);
            }else{
                res.status(404).json({message:"User not found"});
            }
            } catch (error) {
            next(error);
            }
        }

        async getUsers(req:Request, res:Response, next:NextFunction) {
            try {
            const users = await new UserService().getUsers();
            res.status(200).json(users);
            } catch (error) {
            next(error);
            }
        }

        async getUser(req:Request, res:Response, next:NextFunction) {
            try {
            const userId = req.params.userId;
            const user = await new UserService().getUser(userId);
            if(user){
                res.status(200).json(user);
            }else{
                res.status(404).json({message:"User not found"});
            }
            } catch (error) {
            next(error);
            }
        }
}
export default new UserController();