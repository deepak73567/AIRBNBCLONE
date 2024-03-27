const cloudinary=require('cloudinary').v2;
const {CloudinaryStorage}=require('multer-storage-cloudinary');

//cloudinary.config ke ander configaration detail pass kerte hai
//configar kerna mtlb jodna backed ko cloudinary ke account ke saat
cloudinary.config({
cloud_name:process.env.CLOUD_NAME,
api_key: process.env.CLOUD_API_KEY,
api_secret:process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({//means google drive ke ander ek folder bna liya jaha fie upload hoga
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedformat: ["png","jpg","jpeg"], // supports promises as well
    
    },
  });

  module.exports={
    cloudinary,storage,
  };