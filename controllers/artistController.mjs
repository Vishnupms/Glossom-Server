import artistModel from "../models/artistModel.mjs";
import bcrypt from 'bcrypt'
import createHttpError from "http-errors";
import jwt from 'jsonwebtoken'

export const artistSignup = async(req,res,next)=>{
    const {username,phone,email,password}  = req.body.values
    console.log(req.body.values)
    let Existingartist= await artistModel.findOne({email}).exec()
    if(Existingartist) return next(createHttpError(409,"Email address is already taken. Please choose another one or log in instead"))
    if(!Existingartist){
        const newArtist = artistModel({
            username,
            phone,
            email,
            password
        });
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newArtist.password,salt,(err,hash)=>{
                if(err) throw err;
                newArtist.password = hash
                newArtist
                .save()
                .then(()=>{
                    res.json({newArtist,status:"success"});

                })
                .catch((err)=>{
                    console.log(err)
                    res.json({status:"failed"})
                })
            })
        })
    }
    }


export const artistLogin = async (req, res, next) => {
    const email = req.body.values.email
    const passwordRaw = req.body.values.password
    try {
        const artist = await artistModel.findOne({ email })
        if (!artist) return next(createHttpError(404, "Artist not found"));
        const passwordValidate = await bcrypt.compare(passwordRaw, artist.password)
        if (!passwordValidate) return next(createHttpError(404, "Password does not match"));
        if(artist.isBanned) return next (createHttpError(404,"you cannot access to this website"))
        if(!artist.isVerified) return next (createHttpError(401,"your Artist account is not verified yet, we will inform you when your accoount is veified"))

         
        const token = jwt.sign({
            artistId: artist._id,
        }, process.env.JWT_SECRET, { expiresIn: "24h" })
        console.log(artist)
        return res.status(201).json({ artist, token, msg: "Login successfull.." });
    } catch (error) {
        next(error)
    }
}

export const checkArtist = async (req, res) => {

    let { artistId } = req.decodedToken

    try {

        const artist = await artistModel.findOne({ _id: artistId })
        res.status(200).send({ status: true, artist })

    } catch (error) {
        console.log(error);
    }
    
}
    
export const updateProfileArtist = async (req, res) => {
    const { editedName, imageUrl } = req.body;
    const id = req.params.id;
  
    try {
      let updateFields = {};
      if (editedName) {
        updateFields.username = editedName;
      }
      if (imageUrl) {
        updateFields.imgURL = imageUrl;
      }
      const profile = await artistModel.findOneAndUpdate(
        { _id: id },
        updateFields,
        { new: true }
      );
      console.log("reached")
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: profile,
      });
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  
  };
  
