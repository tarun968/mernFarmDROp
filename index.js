const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema
const cookieParser = require('cookie-parser')
const app = express()
// var formidable = require("formidable");
app.use(cookieParser());
const ProductModel = require('./PRODUCTS/productsDB')
const formidable = require('formidable')
const _ = require('lodash')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
// 
app.use(express.static("public"));
app.use(express.json());
const corsOptions = {
    origin: '*',
    // credentials:true,            
    // optionSuccessStatus:200,
}
app.use(cors(corsOptions))
const fs = require('fs')
// const bodyParser = require('body-parser')
const { resolveSrv } = require('dns')
const conn = 'mongodb+srv://' + process.env.USNAME + ':' + process.env.PASSWORD + '@farmdropcluster.fy5lrgc.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(conn,
    { useNewUrlParser: true, useUnifiedTopology: true })
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json({extended:false}))
// app.use(bodyParser.json({extended:true}))

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
const Auths = require('./USER/fileroutes')

const { isAuthenticated, isAdmin, isSignedIn } = require('./CONTROLLERS/AUTH')
const { getUserByEmail, getAllUsers, updateUser, getUserEmail, getUserDetails } = require('./USER/FUNC')
const { Feedback, RatingCalc, getPhoto, productDelete } = require('./PRODUCTS/FUNC')
const { AddingNews, NewsComment, getNewsbyId,
    SubmitFormNews, getAllnews, getPhotoNews, getNewstoFront } = require('./NEWS/FUNC')
const { SubmitForm, UpdateForm } = require('./PRODUCTS/FORM')
const { FindbyName, FindbyAdder, FindbyID, FindbyRating, FindAll } = require('./PRODUCTS/AGG')
const { createOrder, pushOrderInPurchaseList, updateStock, orderinit, orderverify, getOrderById } = require('./ORDERS/FUNC')
const { getProductbyId } = require('./PRODUCTS/FUNC')
const { getShopbyID, getAllshopBycountry,
    getAllImages, SubmitLocation, SubmitLocationsImage,
    getImageOne, getPhotoofImage, getShopOwnerById } = require('./LOCATIONS/FUNC')
const { userPurchaseList } = require('./ORDERS/FUNC')
const { getAllOrderstoAdmin, getAorder,getStatus,updateStatus } = require('./ORDERS/Agg_Orders')
const { googlesignin } = require('./USER/FUNC')









app.param("adder", getUserByEmail)
app.param("news", getNewsbyId)
app.param("image", getImageOne)
app.param("shopowner", getShopOwnerById)
app.param("product", getProductbyId)
app.param("location", getShopbyID)
app.param("ordersp", getOrderById)

app.post('/googlesignin', googlesignin)
app.get('/users/:adder', isSignedIn, isAuthenticated, isAdmin, getAllUsers)
app.put('/users/update/:adder', isSignedIn, isAuthenticated, updateUser)
app.get('/Order/users/:adder', isSignedIn, isAuthenticated, userPurchaseList)
app.get('/Order/:adder/one/:ordersp', isSignedIn, isAuthenticated, getAorder)
app.post('/feedback/:product/:adder', isSignedIn, isAuthenticated, Feedback, RatingCalc)

app.get("/order/status/admin/:adder", isSignedIn,isAuthenticated,getStatus)
app.put("/update/status/admin/:adder", isSignedIn,isAuthenticated,updateStatus)


app.post("/update-product/:product/item/:adder", isSignedIn, isAuthenticated, isAdmin, UpdateForm)
app.get("/All-Products/:adder", isSignedIn, isAuthenticated, isAdmin, FindAll)
app.get("/Products/", FindAll)
app.get("/Photo/:product", getPhoto)
app.get("/Orders/admin/:adder", isSignedIn, isAuthenticated, isAdmin, getAllOrderstoAdmin)
app.get("/News/:news", getNewstoFront)
app.post("/comment/:adder/:news",
    isSignedIn,
    isAuthenticated,
    NewsComment)
app.post("/add-news/:adder", isSignedIn, isAuthenticated, isAdmin, SubmitFormNews)
app.get("/all-news", getAllnews)
app.get("/user/:adder", isSignedIn, isAuthenticated, getUserDetails)
app.get("/PhotoNews/:news", getPhotoNews)
app.get("/productsbyName", FindbyName)
app.get("/productsbyID", FindbyID)

app.delete("/product/:product/:adder", isSignedIn, isAuthenticated, isAdmin, productDelete)
app.get("/Image/:shopowner/photo/:image", getPhotoofImage)
app.get("/productsbyAdder", FindbyAdder)
app.get("/user/profile", getUserEmail)
app.get("/productsbyRating", FindbyRating)
app.get("/shopsbycountry", getAllshopBycountry)
app.get("/all-images/:adder", isSignedIn, isAuthenticated, getAllImages)
app.post("/add-product/:adder", isSignedIn, isAuthenticated, isAdmin, SubmitForm)


app.post("/payment/:adder/product", isSignedIn, isAuthenticated, orderinit)
app.post("/verify/:adder", isSignedIn, isAuthenticated, orderverify)
app.post("/order-purchase/:adder", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder)


app.post("/add-shop/:adder", isSignedIn, isAuthenticated, isAdmin, SubmitLocation)
app.post("/update-shop/:location/by/:adder", isSignedIn, isAuthenticated, isAdmin, SubmitLocationsImage)
app.use("/", Auths)
app.listen(5000, () => {
    console.log("On the port 5000")
})