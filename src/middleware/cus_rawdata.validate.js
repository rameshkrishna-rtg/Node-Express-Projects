const validateOrder = (req, res, next) =>{
    const { name, email, phno, item } = req.body;

    if (!name || !email || !phno || !item) {
        return res.status(400).json({
            status: "Error",
            message: "Name, email, phno, and item are required"
        });
    }

    if (typeof name !== "string") {
        return res.status(400).json({
            status: "Error",
            message: "Name must be a string"
        });
    }

    if (typeof email !== "string") {
        return res.status(400).json({
            status: "Error",
            message: "Email must be a string"
        });
    }

    if (typeof phno !== "string") {
        return res.status(400).json({
            status: "Error",
            message: "Phone number must be a string"
        });
    }

    if(phno.length !== 10){
        return res.status(400).json({
            Message:"Phone number must be 10 digit"
        });
    }
    else{
        console.log("Order Data are Perfect")
    }
    next();
}

module.exports={    
    validateOrder
}