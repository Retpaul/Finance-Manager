import User from "../models/user";



export async function getUserById(id:string) {
  return await User.findById(id);
}
export async function findUserByEmail(email:string) {
 
  return await User.findOne({email});
}
