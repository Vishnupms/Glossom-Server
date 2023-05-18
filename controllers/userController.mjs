import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/userSchema.mjs'
import createHttpError from "http-errors";
import nodemailer from 'nodemailer'

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);

var Name;
var Email;
var Phone;
var Password;

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",

  auth: {
    user: "angelfitnessecoms@gmail.com",
    pass: "sazgjfbgvnzowree",
  },  
});
//.......................................................
export const sendOtp = async (req, res, next) => {
    Name = req.body.values.username;
    Email = req.body.values.email;
    Phone = req.body.values.phone;
    Password = req.body.values.password;
    try {
        const existingEmail = await userModel.findOne({ email: Email }).exec()
        if (existingEmail) return next(createHttpError(409, "Email address is already taken. Please choose another one or log in instead"));
        if (!existingEmail) {
            var mailOptions = {
                to: req.body.values.email,
                subject: "OTP FOR Glossom registration is: ",
                html:
                    "<h3>OTP for Glossom account verification is </h3>" +
                    "<h1 style='font-weight:bold;'>" +
                    otp +
                    "</h1>", // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("Message sent: %s", info.messageId);
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

                res.json({
                    status: "success",
                });
            });
        }
    } catch (error) {
        next(error)
    }
}
//...............................................................   
export const resendOtp = (req, res, next) => {
    try {
        var mailOptions = {
            to: Email,
            subject: "Otp for registration is: ",
            html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>" // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            res.render('otp', { msg: "otp has been sent" });
        });
    } catch (error) {
        error
    }

}
    


//...................................................................
export const userSignup = async (req, res) => {
        let userOtp = req.body.otpvalue
      
    
        if (userOtp == otp) {
            const newUser = userModel({
                username: Name,
                email: Email,
                phone: Phone,
                password: Password
            });
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(() => {
    
                            res.json({ newUser, status: "success" });
                        })
                        .catch((err) => {
                          
                            res.json({ status: failed })
                        })
                })
            })
        }
}
//........................................................................
export const userLogin = async (req, res, next) => {
    const email = req.body.values.email
    const passwordRaw = req.body.values.password
    try {
        const user = await userModel.findOne({ email })
        if (!user) return next(createHttpError(404, "User not found"));
        if (user.isBanned) return next(createHttpError(403, "you are banned from this website"));
        const passwordValidate = await bcrypt.compare(passwordRaw, user.password)
        if (!passwordValidate) return next(createHttpError(404, "Password does not match"));
        
        const token = jwt.sign({
            userId: user._id,
        }, process.env.JWT_SECRET, { expiresIn: "24h" })
        return res.json({success:true, user, token, msg: "Login successfull.." });
    } catch (error) {
        next(error)
    }
}
//...............................................................................
export const checkUser = async (req, res) => {

    let { userId } = req.decodedToken
    try {

        const user = await userModel.findOne({ _id: userId })
        res.status(200).send({ status: true, user })

    } catch (error) {

    }
    
}
//..................................................................................

export const updateProfile = async (req, res) => {
  const { editedName, imageUrl } = req.body;
  const id = req.params.id;

  try {
    let updateFields = {};
    if (editedName) {
      updateFields.username = editedName;
    }
    if (imageUrl) {
      updateFields.imgUrl = imageUrl;
    }
    const profile = await userModel.findOneAndUpdate(
      { _id: id },
      updateFields,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
    
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }

};


  //.......................................................
  export const getProfile = async (req, res) => {
    const { id } = req.params;
    try {
      const profile = await userModel.findOne({ _id: id });
      if (profile) {
        res.json({ profile, success: true });
      }
    } catch (error) {
      return res.status(404).send({ message: error.message });
    }
  };
  //.....................
  export const likeSongs = async (req, res) => {
    const { userId, trackId } = req.params;
    try {
      const user = await userModel.findOne({ _id: userId });
      const index = user.likedSongs.indexOf(trackId);
      if (index === -1) {
        user.likedSongs.push(trackId);
        await user.save();
        return res.json({ success: true, message: 'Liked the song' });
      } else {
        user.likedSongs.splice(index, 1);
        await user.save();
        return res.json({ success: false, message: 'song Removed from Liked songs' });
      }
    } catch (error) {
      return res.status(404).send({ message: error.message });
    }
  };
  //................................................................
  export const getLikedSongs = async (req, res) => {
    const id = req.decodedToken.userId
    try {
      const user = await userModel.findById(id).populate('likedSongs')
      const songs = user.likedSongs;
      if (songs.length > 0) {
        return res.json({ success: true, songs });
      } else {
        return res.json({ success: false, message: 'Empty' });
      }
    } catch (error) {
      return res.status(404).send({ message: error.message });
    }
  };
  //...........................................................
  export const checkLiked = async (req, res) => {
    const { id, songId } = req.params;
    try {
      const user = await userModel.findOne({ _id: id });
      if (user.likedSongs.includes(songId)) {
        return res.json({ success: true });
      } else {
        return res.json({ success: false });
      }
    } catch (error) {
      return res.status(404).send({ message: error.message });
    }
  };