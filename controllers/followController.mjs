import followSchema from "../models/followSchema.mjs";
import moment from "moment/moment.js";
import mongoose from "mongoose";

export const followArtist = async (req, res) => {
  const { id, artistId } = req.params;
  console.log(id,artistId,"idsss")
  try {
    const newFollowing = new followSchema({
      follower: artistId,
      following: id,
    });
    await newFollowing.save();
    if (newFollowing) {
      return res.json({ success: true, message: 'Following Artist successfully' });
    }
  } catch (error) {
    return res.status(404).send({ message: error.message });
  }
};

export const isfollowing = async (req, res) => {
  const { id, artistId } = req.params;
  try {
    const following = await followSchema.findOne({
      follower: artistId,
      following: id,
    });
    if (following) {
      return res.json({ success: true, message: 'Following' });
    // eslint-disable-next-line no-else-return
    } else {
      return res.json({ success: false, message: 'Not following' });
    }
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
};


export const unFollowing = async (req, res) => {
  const { id, artistId } = req.params;
  try {
    const unFollowing = await followSchema.deleteOne({
      follower: artistId,
      following: id,
    });
    console.log(unFollowing);
    if (unFollowing) {
      return res.json({ success: true, message: 'Unfollowing Artist successfully' });
    }
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
};
//..........................FOLLOW CHARTS...................
export const artistChart = async (req, res) => {
  const currentDate = new Date();
  const fiveWeeksAgo = new Date(currentDate.getTime() - (5 * 7 * 24 * 60 * 60 * 1000));

  console.log(fiveWeeksAgo);
  const { id } = req.params;
  const weekNumber = moment(fiveWeeksAgo).week();
  const data = [{ _id: weekNumber + 1 }, { _id: weekNumber + 2 }, { _id: weekNumber + 3 }, { _id: weekNumber + 4 }, { _id: weekNumber + 5 }];
  try {
    const followers = await followSchema.aggregate([
      { $match: { follower: new mongoose.Types.ObjectId(id) } },
      { $match: { createdAt: { $gt: fiveWeeksAgo } } },
      {
        $group: {
          _id: { $week: '$createdAt' },
          followers: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    const weeks = ['5th Week', '4th Week', '3rd Week', '2nd Week', '1st Week'];
    for (let i = 0; i < data.length; i++) {
      const el = followers.find((element) => element._id === data[i]._id);
      if (el) {
        data[i].followers = el.followers;
      } else {
        data[i].followers = 0;
      }
      data[i].name = weeks[i];
    }
    res.status(200).json({ data });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
};

