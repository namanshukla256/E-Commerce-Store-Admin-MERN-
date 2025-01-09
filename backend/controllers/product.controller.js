import cloudinary from '../lib/cloudinary.js';
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

export const createProduct = async (req, res) => { 
    try {
        const{name, description, price, image} = req.body;

        let cloudinaryResponse = null 

        if(image) {
            await cloudinary.uploader.upload(image, {folder:"products"})
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        });

        res.status(201).json(product);

    } catch (error) {
        console.log("Error in createProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Image deleted from cloudinary");
                
            } catch (error) {
                console.log("error deleting image from cloudinary", error);
            }
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({ message: "Product deleted sucessfully" });
    } catch (error) {
        console.log("Error in deleteProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            { 
                $sample: { size: 3 } 
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1
                },
            },
        ]);
    } catch (error) {
        console.log("Error in getRecommendedProducts controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
        
    }
};

export const getProductsByCategory = async (req, res) => {
    const {category} = req.params;
    try {
        const products = await Product.find({category});
        res.json(products);
    } catch (error) {
        console.log("Error in getProductsByCategory controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeaturedProductsCache();
            res.json(updatedProduct);
            // update redis cache
        } else{
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log("Error in toggleFeaturedProduct controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({isFeatured: true}).lean();
        await redis.set("featured_Products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("Error updating featured products cache", error);
    }
}