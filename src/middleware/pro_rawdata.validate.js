const { products } = require("../configs/prisma");

const validateProduct = (req, res, next) => {
    const product = req.body;
    if (req.method === "DELETE"){
        next();             
    }
    else if (!Array.isArray(product)) {
        return res.status(400).json({
            status: "Error",
            Error: "Body must be in array os JSON"
        });
    }
    for (let i = 0; i < product.length; i++) {
        const { product_name, price } = product[i];
        if (!product_name || price === undefined) {
            return res.status(400).json({
                status: "Error",
                message: `Product at index ${i} is missing required fields`
            });
        }

        if (typeof product_name !== "string") {
            return res.status(400).json({
                status: "Error",
                message: `Product Name at index ${i} must be string`
            });
        }

        if (typeof price !== "number" || isNaN(price) || price <= 0) {
            return res.status(400).json({
                status: "Error",
                message: `Price at index ${i} not be empty and must be positive integer`
            });
        }
    }
    next();
}

module.exports = {
    validateProduct
}   