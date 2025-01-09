import redis from '../libs/redis.js';
import Product from '../models/product.model.js';

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({products});
    } catch (error) {
        console.log("Error in getAllProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }  
    };

export const getFeaturedProducts = async (req, res) => {
    try {
       let featuredProducts =  await redis.get("featured_Products");
       if (featuredProducts) {
        return res.json(JSON.parse(featuredProducts));
       }

       // if not in redis, fetch from mongodb
       // .lean() is used to convert the mongoose object to plain js object
       featuredProducts = await Product.find({isFeatured: true}).lean();

       if(!featuredProducts) {
           return res.status(404).json({ message: "Featured products not found" });
       }

       // store in redis for future quick access
       await redis.set("featured_Products", JSON.stringify(featuredProducts));

       res.json(featuredProducts);
    } catch (error) {
        console.log("Error in getFeaturedProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}