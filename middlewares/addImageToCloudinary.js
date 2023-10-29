const cloudinary = require('cloudinary').v2;

cloudinary.config({
    secure: true,
});


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
    if (req.file.path)
        await uploadImage(req.file.path)

    next();
}



module.exports = uploadToCloudinary;