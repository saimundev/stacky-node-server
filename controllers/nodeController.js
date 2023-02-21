import NodeModel from "../models/nodeModel.js";

export const addNode = async (req, res) => {
    const { title, text, color,id } = req.body;
    if (title && text && color) {
        try {
            const node = new NodeModel({
                title,
                text,
                color,
                userId:id
            });
           await node.save();
            res.status(200).json({ message: "Node added Successfull" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
       
    } else {
        res.status(400).json({ message: "All Field are Required" });
   }
};

export const getNode = async (req, res) => {
    const { id } = req.params;
    try {
        const node = await NodeModel.find({userId:id});
        res.status(200).json(node);
    } catch (error) {
        res.status(400).json({ message: "something went wrong" });
    }
}

export const updateNode = async (req, res) => {
    const { title, text, color } = req.body;
    console.log("body-->",req.body)
    console.log(req.params)
    const { id } = req.params;
   

    const node = {
        title: title,
        text: text,
        color:color
    }
    try {
        const editNode = await NodeModel.findOneAndUpdate({ _id: id }, node);
        res.status(200).json({ message: "Node updete successfull" });
    } catch (error) {
        res.status(400).json({ message: "something went wrong" });
    }
}

export const removeNode = async (req, res) => {
    const { id } = req.params;
    try {
        await NodeModel.findOneAndDelete({ _id: id },{new:true});
        res.status(200).json({ message: "Delete successfull" });
    } catch (error) {
        res.status(400).json({ message: "something went wrong" }); 
    }
}