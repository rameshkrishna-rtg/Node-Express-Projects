const express=require("express")
const router=express.Router();
var {insertProducts,makeOrder,deleteById}=require("../controllers/orders.controller")

router.post("/insert",insertProducts);
router.post("/order",makeOrder)
router.delete("/deleteById/:id",deleteById)

module.exports=router;