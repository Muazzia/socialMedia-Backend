const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
// 
// is ko abhi upload kr k chk kro error jata k ni or main catch walay ko return err kr k daikho

const uploadToCloudinary = async (req, res, next) => {
    /////////////////////////
    // Uploads an image file
    /////////////////////////
    const uploadImage = async (imagePath) => {


        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
        };

        try {
            const result = await cloudinary.uploader.upload(imagePath, options);
            req.imgSecureUrl = result.secure_url

            return result.public_id;
        } catch (error) {
            console.error(error);
        }
    };
    if (!req.file) return res.status(400).send('No Image Found. Image is required')
    if (req.file.path)
        await uploadImage(req.file.path)

    next();
}



module.exports = uploadToCloudinary;