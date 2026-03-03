const prisma = require("../configs/prisma");


//POST-insertProducts//web
const insertProducts = async (req, res) => {
    try {

        console.log(req.body);

        const products = await prisma.products.createMany({
            data: req.body
        });

        return res.status(200).json({
            Status: "Success",
            Result: products
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            Status: "Error",
            Error: err.message
        });
    }
};

//POST-makeOrder/web
const makeOrder = async (req, res) => {
    try {
        const { name, email, phno, item } = req.body;

        //$transaction-Inside this Either every thing succed okay if not then nothing gone updated everthing fails.
        // Now:
        //     Both succeed → commit
        //     One fails → rollback
        const order = await prisma.$transaction(async (tx) => {

            //CREATE customer
            const customer = await tx.customer.create({
                data: {
                    name,
                    email,
                    phno
                }
            });

            //Get the productId
            const productIds = item.map(i => i.productId);

            //Get products from db by using productIds
            const products = await tx.products.findMany({
                where: {
                    id: { in: productIds }
                }
            });

            //check the products count and the item count 
            if (products.length !== item.length) {
                throw new Error("Invalid Product id provided");
            }

            //Calculate the total price

            let toatlPrice = 0;
            //using the find method we getting the first matichig productID and calculating the salary.
            item.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                toatlPrice += Number(product.price) * item.qty;
            });

            //create Order
            const createOrder = await tx.orders.create({
                data: {
                    amount: toatlPrice,
                    status: "PENDING",
                    customerId: customer.id,
                    item: {
                        create: item
                            .filter(i => i.qty > 0)
                            .map(i => ({
                                qty: i.qty,
                                productId: i.productId
                            }))
                    }
                },
                include: {
                    item: true,
                    customer: true
                }
            });
            return createOrder;

        });

        return res.status(200).json({
            Message: "Order created successfully"
        });
    } catch (err) {
        console.log("Order Creation API error", err)

        return res.status(500).json({
            Status: "error",
            Error: err.message
        })
    }

}

//DELETE-productById
const deleteById = async (req, res) => {
    try{
        const product = await prisma.products.delete({
        where:{
            id:Number(req.params.id)
        }
    });
    return res.json({
        status:"Success",
        message:"Data deleted successfully"
    })
    }catch(err){
        console.log("DeleteById API error",err);

        return res.json({
            status:"Error",
            message:err.message
        });
    
}
}


module.exports = { insertProducts, makeOrder,deleteById};