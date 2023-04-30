import followSchema from "../models/followSchema.mjs";

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

