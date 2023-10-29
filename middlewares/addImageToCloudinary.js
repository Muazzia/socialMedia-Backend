const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: 'dbmxzpfxd',
    api_key: '515198196931793',
    api_secret: '048qB39WCTjOtVIwTewND-sGuD8'
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
    if (!req.file) return res.status(400).send('No Image Found. Image is required')
    if (req.file.path)
        await uploadImage(req.file.path)

    next();
}



module.exports = uploadToCloudinary;