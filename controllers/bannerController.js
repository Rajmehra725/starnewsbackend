import Banner from "../models/BannerAd.js";
import cloudinary from "../config/cloudinary.js";


// CREATE
export const createBanner = async (req, res) => {
  const files = [
    ...(req.files.image || []),
    ...(req.files.images || []),
  ];

  const banners = [];

  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.path);

    const banner = await Banner.create({
      image: result.secure_url,
      publicId: result.public_id,
    });

    banners.push(banner);
  }

  res.json(banners);
};

// READ
export const getBanners = async (req, res) => {
  const banners = await Banner.find().sort({createdAt:-1});
  res.json(banners);
};


// UPDATE
export const updateBanner = async (req, res) => {

  const banner = await Banner.findById(req.params.id);

  if(req.file){
    await cloudinary.uploader.destroy(banner.publicId);

    const result = await cloudinary.uploader.upload(req.file.path);

    banner.image = result.secure_url;
    banner.publicId = result.public_id;
  }

  await banner.save();
  res.json(banner);
};


// DELETE
export const deleteBanner = async (req, res) => {

  const banner = await Banner.findById(req.params.id);

  await cloudinary.uploader.destroy(banner.publicId);

  await Banner.findByIdAndDelete(req.params.id);

  res.json({success:true});
};
export const likeBanner = async (req,res)=>{
 await Banner.findByIdAndUpdate(
  req.params.id,
  {$inc:{likes:1}}
 )
 res.json({success:true})
}
export const deleteMultipleBanners = async (req, res) => {
  try {
    const ids = req.body.ids;

    const banners = await Banner.find({
      _id: { $in: ids },
    });

    for (const banner of banners) {
      await cloudinary.uploader.destroy(banner.publicId);
    }

    await Banner.deleteMany({
      _id: { $in: ids },
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json(err);
  }
};
export const shareBanner = async (req,res)=>{
 await Banner.findByIdAndUpdate(
  req.params.id,
  {$inc:{shares:1}}
 )
 res.json({success:true})
}

export const viewBanner = async (req,res)=>{
 await Banner.findByIdAndUpdate(
  req.params.id,
  {$inc:{views:1}}
 )
 res.json({success:true})
}
export const addComment = async (req,res)=>{

 const banner = await Banner.findByIdAndUpdate(
  req.params.id,
  {
    $push:{
      comments:{
        text:req.body.text,
        user:"User"
      }
    }
  },
  {new:true}
 )

 res.json(banner)
}
export const updateComment = async (req,res)=>{

 const banner = await Banner.findOneAndUpdate(
  {
    _id:req.params.bannerId,
    "comments._id":req.params.commentId
  },
  {
    $set:{
      "comments.$.text":req.body.text
    }
  },
  {new:true}
 )

 res.json(banner)
}
export const deleteComment = async (req,res)=>{

 const banner = await Banner.findByIdAndUpdate(
  req.params.bannerId,
  {
    $pull:{
      comments:{_id:req.params.commentId}
    }
  },
  {new:true}
 )

 res.json(banner)
}
export default Banner;