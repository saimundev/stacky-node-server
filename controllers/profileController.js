import Usermodel from "../models/userModel.js"
import cloudinaryModule from "../utils/cloudaniry.js";

export const getProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const profile = await Usermodel.findById({ _id: id });
        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({ message: "something went wrong" });
    }
}

export const editProfile = async (req, res) => {
    const { name, profacation, address } = req.body
    const { id } = req.params;


    try {
        if (name && profacation && address) {
          
            let updateUser;
            if (req.file !== undefined) {
                const uploadRes = await cloudinaryModule.uploader.upload(req.file.path,{
                    upload_preset:"node"
                })
                if (uploadRes) {
                    updateUser = {
                        name: name,
                        profacation: profacation,
                        address: address,
                        image: uploadRes.secure_url
                    }
                }
            } else {
                updateUser = {
                    name: name,
                    profacation: profacation,
                    address: address,
                }
            }

            await Usermodel.findOneAndUpdate({ _id: id }, { $set: updateUser });
            res.status(200).json({ message: "Update Profile Successfull" });

        } else {
            res.status(400).json({ message: "All Field are require" });
        }
    } catch (error) {
        res.status(400).json({ message: "something went wrong" });
    }
}