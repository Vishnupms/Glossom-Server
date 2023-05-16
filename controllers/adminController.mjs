import artistModel from "../models/artistModel.mjs";
import userModel from "../models/userSchema.mjs";
import categoryModel from "../models/categoryModel.mjs";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import adminModel from "../models/adminModel.mjs";
import songModel from "../models/songModel.mjs";
import moment from "moment/moment.js";

//..........AUTH.................
export const adminLogin = async (req, res, next) => {
  const email = req.body.values.email;
  const passwordRaw = req.body.values.password;
  try {
    const admin = await adminModel.findOne({ email });
    console.log(admin, "admin");
    if (!admin) return next(createHttpError(404, "Admin not found"));
    const passwordValidate = await bcrypt.compare(passwordRaw, admin.password);
    if (!passwordValidate)
      return next(createHttpError(404, "Password does not match"));
    const token = jwt.sign(
      {
        adminId: admin._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    console.log("reached");
    return res.json({
      success: true,
      admin,
      token,
      msg: "Login successfull..",
    });
  } catch (error) {
    next(error, "here ther");
  }
};

//............SHOW_MANAGEMENT..............
export const showUsers = async (req, res) => {
  let user = await userModel.find();
  res.status(200).json(user);
};

export const checkAdmin = async (req, res) => {
  let { adminId } = req.decodedToken;
  try {
    const admin = await adminModel.findOne({ _id: adminId });
  
    res.status(200).send({ status: true, admin });
  } catch (error) {

  }
};

//.............ARTIST MANAGEMENT..............
export const showArtist = async (req, res) => {
  try {
    const artist = await artistModel.find();
    res.status(200).json(artist);
  } catch (error) {
    return res.status(200).send({ message: "error in listing Artist" });
  }
};

export const verifyArtist = async (req, res) => {
  try {
    const artistId = req.params.id;
    console.log(artistId);
    const artist = await artistModel.findById(artistId);
    if (artist.isVerified === false) {
      await artist.updateOne({ $set: { isVerified: true } });
    } else {
      await artist.updateOne({ $set: { isVerified: false } });
    }
    res.json({ status: "success", message: "artist status has changed" });
  } catch (error) {
    return res.status(400).send({ message: error.message, success: false });
  }
};
export const blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
     await userModel.updateOne({_id:userId},{$set:{
      isBanned:true
    }});
    console.log(userId,"pppppppppppppppppppppppppp");
    if (userId) {
      // user.isBanned = !user.isBanned; // Toggle the isBanned property
      // await user.save(); // Save the updated user object
      res
        .status(200)
        .json({ status: "success", message: "User status has been updated" });
    } else {
      res.status(404).json({ status: "error", message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const addGenre = async (req, res) => {
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
};

export const getGenre = async (req, res) => {
  try {
    const Category = await categoryModel.find();
    res.json({ category: Category });
  } catch (error) {
    return res
      .status(200)
      .send({ message: "Error in finding user", success: false });
  }
};

export const getCount = async (req, res) => {
  try {
    const users = await userModel.find().countDocuments();
    const artist = await artistModel.find().countDocuments();
    const songs = await songModel.find().countDocuments();

    res.status(200).send({
      message: "Got count successfully",
      success: true,
      users,
      artist,
      songs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Error in retrieving counts",
      success: false,
    });
  }
};

export const userChart = async (req, res) => {
  const currentDate = new Date();
  const fiveWeeksAgo = new Date(currentDate.getTime() - (5 * 7 * 24 * 60 * 60 * 1000));

  const weekNumber = moment(fiveWeeksAgo).week();
  const data = [
    { _id: weekNumber + 1 },
    { _id: weekNumber + 2 },
    { _id: weekNumber + 3 },
    { _id: weekNumber + 4 },
    { _id: weekNumber + 5 },
  ];
  
  try {
    const users = await userModel.aggregate([
      { $match: { createdAt: { $gt: fiveWeeksAgo } } },
      {
        $group: {
          _id: { $week: '$createdAt' },
          userCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    
    const weeks = ['5th Week', '4th Week', '3rd Week', '2nd Week', '1st Week'];
    
    for (let i = 0; i < data.length; i++) {
      const weekData = users.find((element) => element._id === data[i]._id);
      
      if (weekData) {
        data[i].userCount = weekData.userCount;
      } else {
        data[i].userCount = 0;
      }
      
      data[i].name = weeks[i];
    }
    
    res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
export const ArtistChart = async (req, res) => {
  const currentDate = new Date();
  const fiveWeeksAgo = new Date(currentDate.getTime() - (5 * 7 * 24 * 60 * 60 * 1000));

  const weekNumber = moment(fiveWeeksAgo).week();
  const data = [
    { _id: weekNumber + 1 },
    { _id: weekNumber + 2 },
    { _id: weekNumber + 3 },
    { _id: weekNumber + 4 },
    { _id: weekNumber + 5 },
  ];
  
  try {
    const artist = await artistModel.aggregate([
      { $match: { createdAt: { $gt: fiveWeeksAgo } } },
      {
        $group: {
          _id: { $week: '$createdAt' },
          artistCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    
    const weeks = ['5th Week', '4th Week', '3rd Week', '2nd Week', '1st Week'];
    
    for (let i = 0; i < data.length; i++) {
      const weekData = artist.find((element) => element._id === data[i]._id);
      
      if (weekData) {
        data[i].artistCount = weekData.artistCount;
      } else {
        data[i].artistCount = 0;
      }
      
      data[i].name = weeks[i];
    }
    
    res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
