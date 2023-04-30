import artistModel from '../models/artistModel.mjs'
import userModel from '../models/userSchema.mjs'
import categoryModel from '../models/categoryModel.mjs'
import bcrypt from 'bcrypt'
import createHttpError from "http-errors";
import jwt from 'jsonwebtoken'

//..........AUTH.................
export const adminLogin = async (req, res, next) => {
  const email = req.body.values.email
  const passwordRaw = req.body.values.password
  try {
      const admin = await userModel.findOne({ email })
      if (admin.isAdmin===false) return next(createHttpError(404, "Admin not found"));
      const passwordValidate = await bcrypt.compare(passwordRaw, admin.password)
      if (!passwordValidate) return next(createHttpError(404, "Password does not match"));
      
      const token = jwt.sign({
          userId: admin._id,
      }, process.env.JWT_SECRET, { expiresIn: "24h" })
      console.log("reached")
      return res.json({success:true, admin, token, msg: "Login successfull.." });
  } catch (error) {
      next(error)
  }
}

//............SHOW_MANAGEMENT..............
export const showUsers = async (req,res)=>{
    let user = await userModel.find({})
    res.status(200).json(user)
}



//.............ARTIST MANAGEMENT..............
export const showArtist = async(req,res)=>{
  try {
    const artist = await artistModel.find({})
    res.status(200).json(artist)
    
}catch (error) {
  return res.status(200).send({ message: "error in listing Artist" });
}
}

export const verifyArtist = async(req,res)=>{
    try {
        const artistId = req.params.id;
        console.log(artistId)
        const artist = await artistModel.findById(artistId);
        if(artist.isVerified === false) {
            await artist.updateOne({$set:{isVerified:true}})
        }
        else{
            await artist.updateOne({$set:{isVerified:false}})
        } 
        res.json({ status: 'success', message: 'artist status has changed' });
      } catch (error) {
        return res.status(400).send({ message: error.message, success: false });
      }


}
export const blockUser = async(req,res)=>{
    try {
        const userId = req.params.id
        console.log(userId)
        const user = await userModel.findById(userId);
       if(user.isBanned == false){
        await user.updateOne({$set:{isBanned:true}})
       }
       else{
        await user.updateOne({$set:{isBanned:false}})
       }
        await user.save();
        res.json({ status: "success", message: "User Status has Changed" });
      } catch (error) {
        return res
          .status(200)
          .send({ message: "Error in Blocking user", success: false });
      }
}

export const addGenre= async (req, res) => {
    const name = req.body.Category;
    const { description } = req.body;
    console.log(name, description);
    try {
      const newCategory = await categoryModel({
        name: name,
        description: description,
      });
      await newCategory.save();
      res.status(200).send({
        message: "Category added successfully",
        success: true,
      });
    } catch (error) {
      return res
        .status(200)
        .send({ message: "Error in adding category", success: false });
    }
  }

  export const getGenre = async (req, res) => {
    try {
      const Category = await categoryModel.find();
      res.json({ category: Category });
    } catch (error) {
      return res
        .status(200)
        .send({ message: "Error in finding user", success: false });
    }
  }

