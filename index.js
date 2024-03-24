const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose");
const app = express();
const UserModel = require("./models/Users.js")
const productModel = require("./models/Products.js")
const bodyParser = require('body-parser')
const bcrypt = require("bcrypt");
const fs = require("fs");
const jwt  =require('jsonwebtoken');
const SECRET = "secret";
require('dotenv').config();
app.use(cors({origin:true}))
app.use(express.json())
app.use(bodyParser.text())
//mongoose.connect("mongodb+srv://adimkr:aditya201602@clustername.mongodb.net/urbanvoguedb");


mongoose.connect(process.env.DBURL).then(()=>
{
    console.log("MongoDB Connected successfully !");
}).catch(err=>
    {
        console.log("Connection err" ,err);
    })


 const verifyToken = (req,res,next)=>
{
    const token = req.headers.authorization;

     if(!token){
        return res.status(401).json({message:"No Token provided"});
     }

     jwt.verify(token,SECRET,(err,decoded)=>
     {
        if(err) return res.status(401).json({message:"Invalid Token"})
         req.user=decoded.username;
        console.log("Decoded token data:",decoded);
        next();
     })
}





app.post("/register",async (req,res)=>
{
    console.log("In register Page");
    const {username, password} = req.body;
    console.log(username,password);
    try {
      const checkuser = await UserModel.findOne({username});

     if(checkuser)  
     {
        return res.status(401).json({message:"User Already exists no need to register"})
     }
       const hashpassword =  await bcrypt.hash(password,10);

    const newUser = new UserModel({username:username,password:hashpassword,cartitems:[]});
     await newUser.save();
     res.status(200).json({message:"User registered success"});
     
    } catch (error) {
        console.log(error);

    }
     
});

app.post("/login", async(req,res) =>
{
    const {username, password} = req.body;
     console.log(req.user);
    console.log(username,password);

    try
    {
        
        const validUser = await UserModel.findOne({username});
         if(!validUser) {
            return res.status(404).json({message:"User not found need to register"});
         }
          const isPasswordValid = await bcrypt.compare(password,validUser.password);
            if(isPasswordValid)
            {
               const token =  jwt.sign({userid:validUser._id,username:validUser.username},SECRET);
               return res.json({message:"User Loggedin Success",token})
            }
            
            return res.json({message:"Incorrect Login Crediantials"})         
    }
    catch(error)
    {
        console.log(error);
    }
});

app.post("/addproduct",async (req ,res)=>
{
      const {name,category,price,image,description} = req.body;

      const newProduct = await new productModel({name,category,price,image,description});

      console.log(newProduct);
})

// const imagearray = [
//     {
//        name:"varidashi1",
//        path: "./images/varidashi1.png",
//        category:"Half Sleev T-shirt",
//        price:700,
      
//        description:"Elevate your everyday style with our premium T-shirt. Crafted with soft and breathable fabric, this T-shirt ensures comfort throughout the day. Whether you're lounging at home or heading out with friends, its versatile design makes it a wardrobe essential. Available in a variety of colors and sizes, it's perfect for any occasion. Upgrade your casual look with our stylish T-shirt today!",
//        tag:"shirt"
//     },
//     {
//         name:"varidashi2",
//         path: "./images/varidashi2.png",
//         category:"Half Sleev T-shirt",
//         price:800,
      
//         description:"Elevate your everyday style with our premium T-shirt. Crafted with soft and breathable fabric, this T-shirt ensures comfort throughout the day. Whether you're lounging at home or heading out with friends, its versatile design makes it a wardrobe essential. Available in a variety of colors and sizes, it's perfect for any occasion. Upgrade your casual look with our stylish T-shirt today!",
//         tag:"shirt"
        
//     },
//     {
//          name:"varidashi3",
//          path: "./images/varidashi3.png",
//          category:"Half Sleev T-shirt",
//          price:600,
        
//          description:"Elevate your everyday style with our premium T-shirt. Crafted with soft and breathable fabric, this T-shirt ensures comfort throughout the day. Whether you're lounging at home or heading out with friends, its versatile design makes it a wardrobe essential. Available in a variety of colors and sizes, it's perfect for any occasion. Upgrade your casual look with our stylish T-shirt today!",
//          tag:"shirt"
//     },
//     {
//         name:"varidashi4",
//         path: "./images/varidashi4.png",
//         category:"Half Sleev T-shirt",
//          price:690,
       
//          description:"Elevate your everyday style with our premium T-shirt. Crafted with soft and breathable fabric, this T-shirt ensures comfort throughout the day. Whether you're lounging at home or heading out with friends, its versatile design makes it a wardrobe essential. Available in a variety of colors and sizes, it's perfect for any occasion. Upgrade your casual look with our stylish T-shirt today!",
//          tag:"shirt"
//     },
//     {
//         name:"varidashi5",
//         path: "./images/varidashi5.png",
//         category:"Half Sleev T-shirt",
//         price:890,
      
//         description:"Elevate your everyday style with our premium T-shirt. Crafted with soft and breathable fabric, this T-shirt ensures comfort throughout the day. Whether you're lounging at home or heading out with friends, its versatile design makes it a wardrobe essential. Available in a variety of colors and sizes, it's perfect for any occasion. Upgrade your casual look with our stylish T-shirt today!",
//         tag:"shirt"

//     },
//     {
//         name:"swagrider1",
//         path:"./images/swagrider1.png",
//         category:"Trouser",
//         price:890,
       
//         description:"Step up your fashion game with our collection of comfortable and stylish pants, perfect for any occasion.",
//         tag:"pant"
//     },
//     {
//         name:"swagrider2",
//         path:"./images/swagrider2.png",
//         category:"Trouser",
//         price:760,
     
//         description:"Step up your fashion game with our collection of comfortable and stylish pants, perfect for any occasion.",
//         tag:"pant"

//     },
//     {
//         name:"swagrider3",
//         path:"./images/swagrider3.png",
//         category:"Jeans",
//         price:1020,
      
//         description:"Step up your fashion game with our collection of comfortable and stylish pants, perfect for any occasion.",
//         tag:"pant"

//     },
//     {
//         name:"swagrider4",
//         path:"./images/swagrider4.png",
//         category:"Trouser",
//         price:800,
      
//         description:"Step up your fashion game with our collection of comfortable and stylish pants, perfect for any occasion.",
//         tag:"pant"
//     },
//     {
//         name:"swagrider5",
//         path:"./images/swagrider5.png",
//         category:"Trouser",
//         price:790,
        
//         description:"Step up your fashion game with our collection of comfortable and stylish pants, perfect for any occasion.",
//         tag:"pant"
        
//     },
//      {
//         name:"Gandheri-Salwar",
//         path:"./images/gandherisalwar.png",
//         category:"Salwar",
//         price:1050,
       
//         description:"Indulge in the elegance of our women's clothing collection, curated to embrace your individuality with timeless designs and modern flair, ensuring sophistication in every ensemble",
//         tag:"women"
//      },
//      {
//         name:"jaipurikurti",
//         path:"./images/jaipurikurti.png",
//         category:"Kurti",
//         price:1200,
       
//         description:"Indulge in the elegance of our women's clothing collection, curated to embrace your individuality with timeless designs and modern flair, ensuring sophistication in every ensemble",
//         tag:"women"
        
//     }, 
//     {
//         name:"Patiala",
//         path:"./images/patiala.png",
//         category:"Patiala",
//         price:1400,
      
//         description:"Indulge in the elegance of our women's clothing collection, curated to embrace your individuality with timeless designs and modern flair, ensuring sophistication in every ensemble",
//         tag:"women"
//     }, 
//     {
//         name:"Anarkali",
//         path:"./images/anarkali.png",
//         category:"Salwar anarkali",
//         price:800,
        
//         description:"Indulge in the elegance of our women's clothing collection, curated to embrace your individuality with timeless designs and modern flair, ensuring sophistication in every ensemble",
//         tag:"women"
//     }, 
//     {
//         name:"Strawberry-red-Top",
//         path:"./images/strawberryred-top.png",
//         category:"Women's Top",
//         price:800,
      
//         description:"Indulge in the elegance of our women's clothing collection, curated to embrace your individuality with timeless designs and modern flair, ensuring sophistication in every ensemble",
//         tag:"women"
//     }, 
//     {
//         name:"Jargo",
//         path:"./images/baseballcap.png",
//         category:"Cap",
//         price:400,
      
//         description:"Indulge in the elegance of our Cap Collection, curated to embrace your individuality with timeless designs and modern flair, ensuring sophistication in every ensemble",
//         tag:"cap"
//     },
//     {
//         name:"Vectus",
//         path:"./images/baseballcap.png",
//         category:"Us-Army Cap",
//         price:1000,
      
//         description:"Indulge in the elegance of our Cap Collection, curated to embrace your individuality with timeless designs and modern flair, ensuring sophistication in every ensemble",
//         tag:"cap"
//     },
//     {
//         name:"Meritone",
//         path:"./images/bfade.png",
//         category:"Sunglasses",
//         price:500,
      
//         description:"Indulge in the elegance of our Hot Sunglasses Collection, curated to embrace your individuality with timeless designs and modern flair, ensuring sophistication in every ensemble",
//         tag:"sunglasses"
//     },
//     {
//         name:"Baskins",
//         path:"./images/black-nato.png",
//         category:"Sunglasses",
//         price:700,
      
//         description:"Indulge in the elegance of our Hot Sunglasses Collection, curated to embrace your individuality with timeless designs and modern flair, ensuring sophistication in every ensemble",
//         tag:"sunglasses"
//     },
//     {
//         name:"Pirado's",
//         path:"./images/gold-pirado.png",
//         category:"Sunglasses",
//         price:1020,
      
//         description:"Indulge in the elegance of our Hot Sunglasses Collection, curated to embrace your individuality with timeless designs and modern flair, ensuring sophistication in every ensemble",
//         tag:"sunglasses"
//     },
//     {
//         name:"Ajanta's",
//         path:"./images/M-cruze.png",
//         category:"Sunglasses",
//         price:1500,
       
//         description:"Indulge in the elegance of our Hot Sunglasses Collection, curated to embrace your individuality with timeless designs and modern flair, ensuring sophistication in every ensemble",
//         tag:"sunglasses"
//     },
//     {
//         name:"Robiston's",
//         path:"./images/formalshoes.png",
//         category:"Formal Shoes",
//         price:2200,
      
//         description:"Indulge in the elegance of our Hot Shoe's Collection, curated to embrace your individuality with timeless designs and modern flair, ensuring sophistication in every ensemble",
//         tag:"shoes"
//     },
//     {
//         name:"Adidas",
//         path:"./images/sneakers.png",
//         category:"Sneakers",
//         price:1800,
      
//         description:"Indulge in the elegance of our Hot Shoe's Collection, curated to embrace your individuality with timeless designs and modern flair, ensuring sophistication in every ensemble",
//         tag:"shoes"
//     },

//     {
//         name:"Fedora",
//         path:"./images/slicic-shoe.png",
//         category:"Sneakers",
//         price:1200,
     
//         description:"Indulge in the elegance of our Hot Shoe's Collection, curated to embrace your individuality with timeless designs and modern flair, ensuring sophistication in every ensemble",
//         tag:"shoes"
//     },
//     {
//         name:"Vistarus",
//         path:"./images/white-hot.png",
//         category:"Sneakers",
//         price:1600,
      
//         description:"Indulge in the elegance of our Hot Shoe's Collection, curated to embrace your individuality with timeless designs and modern flair, ensuring sophistication in every ensemble",
//         tag:"shoes"
//     },
//     {
//         name:"Roadster",
//         path:"./images/newcmen1.png",
//         category:"Men's Shirt",
//         price:1200,
       
//         description:
//         "Introducing our latest collection, meticulously curated with the latest trends and timeless classics, offering unparalleled style and sophistication for every occasion. Discover fashion-forward pieces designed to elevate your wardrobe and make a statement wherever you go.",
//         tag:"Men new-arrival"
//     },
//     {
//         name:"Wrogn",
//         path:"./images/newcmen2.png",
//         category:"Men's Shirt",
//         price:1300,
     
//         description:
//         "Introducing our latest collection, meticulously curated with the latest trends and timeless classics, offering unparalleled style and sophistication for every occasion. Discover fashion-forward pieces designed to elevate your wardrobe and make a statement wherever you go.",
//         tag:"Men new-arrival"
//     },

//     {
//         name:"Manly",
//         path:"./images/newcmen3.png",
//         category:"Men's Shirt",
//         price:1500,
    
//         description:"Introducing our latest collection, meticulously curated with the latest trends and timeless classics, offering unparalleled style and sophistication for every occasion. Discover fashion-forward pieces designed to elevate your wardrobe and make a statement wherever you go.",
//         tag:"Men new-arrival"
//     },
//         {
//              name:"Pepe",
//              path:"./images/newcmen6 (1).png",
//              category:"Men's Shirt",
//              price:1600,
           
//              description: 
//              "Introducing our latest collection, meticulously curated with the latest trends and timeless classics, offering unparalleled style and sophistication for every occasion. Discover fashion-forward pieces designed to elevate your wardrobe and make a statement wherever you go.",
//              tag:"Men new-arrival"
//         },
//         {
//             name:"Cotton Candy",
//             path:"./images/newcmen6 (2).png",
//             category:"Men's Shirt",
//             price:1400,
          
//             description: "Introducing our latest collection, meticulously curated with the latest trends and timeless classics, offering unparalleled style and sophistication for every occasion. Discover fashion-forward pieces designed to elevate your wardrobe and make a statement wherever you go.",
//             tag:"Men new-arrival"
//         },

//     {
//         name:"Indibelli",
//         path:"./images/newcw1.png",
//         category:"Women's Collection", 
//         price:1200,
      
//         description:"Introducing our latest collection, meticulously curated with the latest trends and timeless classics, offering unparalleled style and sophistication for every occasion. Discover fashion-forward pieces designed to elevate your wardrobe and make a statement wherever you go.",
//         tag:"Women new-arrival"
//     },
//     {
//         name:"Zebros",
//         path:"./images/newcw4.png",
//         category:"Women's Collection", 
//         price:1200,
      
//         description:"Introducing our latest collection, meticulously curated with the latest trends and timeless classics, offering unparalleled style and sophistication for every occasion. Discover fashion-forward pieces designed to elevate your wardrobe and make a statement wherever you go.",
//         tag:"Women new-arrival"
//     },
//     {
//         name:"RARE",
//         path:"./images/newcw2.png",
//         category:"Women's Collection", 
//         price:1600,
     
//         description:
//         "Introducing our latest collection, meticulously curated with the latest trends and timeless classics, offering unparalleled style and sophistication for every occasion. Discover fashion-forward pieces designed to elevate your wardrobe and make a statement wherever you go.",
//         tag:"Women new-arrival"
//     },
//     {
//         name:"PLUSS",
//         path:"./images/newcw3.png",
//         category:"Women's Collection", 
//         price:1800,
      
//         description:
//         "Introducing our latest collection, meticulously curated with the latest trends and timeless classics, offering unparalleled style and sophistication for every occasion. Discover fashion-forward pieces designed to elevate your wardrobe and make a statement wherever you go.",
//         tag:"Women new-arrival"
//     },
//     {
//         name:"MATRIX-1",
//         path:"./images/matrix1.png",
//         category:"watch", 
//         price:2100,
      
//         description:
//         "Introducing our latest Watch collection, meticulously curated with the latest trends and timeless classics, offering unparalleled style and sophistication for every occasion. Discover fashion-forward pieces designed to elevate your wardrobe and make a statement wherever you go.",
//         tag:"watch"
//     },
//     {
//         name:"MATRIX-2",
//         path:"./images/matrix2.png",
//         category:"watch", 
//         price:2100,
      
//         description:
//         "Introducing our latest Watch collection, meticulously curated with the latest trends and timeless classics, offering unparalleled style and sophistication for every occasion. Discover fashion-forward pieces designed to elevate your wardrobe and make a statement wherever you go.",
//         tag:"watch"
//     },
//     {
//         name:"MATRIX-3",
//         path:"./images/matrix3.png",
//         category:"watch", 
//         price:2100,
     
//         description:
//         "Introducing our latest Watch collection, meticulously curated with the latest trends and timeless classics, offering unparalleled style and sophistication for every occasion. Discover fashion-forward pieces designed to elevate your wardrobe and make a statement wherever you go.",
//         tag:"watch"
//     },
//     {
//         name:"MATRIX-4",
//         path:"./images/matrix4.png",
//         category:"watch", 
//         price:2100,
      
//         description:
//         "Introducing our latest Watch collection, meticulously curated with the latest trends and timeless classics, offering unparalleled style and sophistication for every occasion. Discover fashion-forward pieces designed to elevate your wardrobe and make a statement wherever you go.",
//         tag:"watch"
//     },
//        {
//             name:"Raymond",
//             path:"./images/blazer1.png",
//             category:"blazer", 
//             price:3200,
         
//             description:
//             "Introducing our latest Blazer collection, meticulously curated with the latest trends and timeless classics, offering unparalleled style and sophistication for every occasion. Discover fashion-forward pieces designed to elevate your wardrobe and make a statement wherever you go.",
//             tag:"blazer"
//         },
//    {
//                 name:"Raymond",
//                 path:"./images/blazer2.png",
//                 category:"blazer", 
//                 price:3100,
               
//                 description:
//                 "Introducing our latest Blazer collection, meticulously curated with the latest trends and timeless classics, offering unparalleled style and sophistication for every occasion. Discover fashion-forward pieces designed to elevate your wardrobe and make a statement wherever you go.",
//                 tag:"blazer"
//             },

//        {
//                     name:"Raymond",
//                     path:"./images/blazer3.png",
//                     category:"blazer", 
//                     price:3200,
                  
//                     description:
//                     "Introducing our latest Blazer collection, meticulously curated with the latest trends and timeless classics, offering unparalleled style and sophistication for every occasion. Discover fashion-forward pieces designed to elevate your wardrobe and make a statement wherever you go.",
//                     tag:"blazer"
//                 },

//                 {
//                     name:"Raymond",
//                     path:"./images/blazer4.png",
//                     category:"blazer", 
//                     price:3300,
                  
//                     description:
//                     "Introducing our latest Blazer collection, meticulously curated with the latest trends and timeless classics, offering unparalleled style and sophistication for every occasion. Discover fashion-forward pieces designed to elevate your wardrobe and make a statement wherever you go.",
//                     tag:"blazer"
//                 },

//                {
//                     name:"Raymond",
//                     path:"./images/blazer5.png",
//                     category:"blazer", 
//                     price:3400,
            
//                     description:
//                     "Introducing our latest Blazer collection, meticulously curated with the latest trends and timeless classics, offering unparalleled style and sophistication for every occasion. Discover fashion-forward pieces designed to elevate your wardrobe and make a statement wherever you go.",
//                     tag:"blazer"
//                 },

     
//   ]

// const saveImage = async (name,base64string,category,price,description,tag) =>
// {
   
//     const data = await new productModel({
//         name:name,
//         category:category,
//         price:price,
//         image:base64string,
//         description:description,
//         tag:tag 
//     });
// const savedata = await data.save();
// console.log("Data saved ",savedata);

// }


// imagearray.forEach(item =>
//     {
//         const imageData = fs.readFileSync(item.path);
//         const base64string = Buffer.from(imageData).toString('base64')
//         saveImage(item.name,base64string,item.category,item.price,item.description,item.tag,item.size,item.quantity);
//     })

app.get("/getshirts",async(req,res)=>
{
    
    try {
 
        const product = await productModel.find({
            $or: [
              { "tag": { $regex: /shirt/i } },
              { "tag": { $regex: /blazer/i } }
            ]
          });
    product.forEach(data => console.log(data.name));
    console.log(product.length);
    // const encodedImage = Buffer.from(product[0].image).toString('base64');
    // product[0].image = (String)`data:image/png;base64,${encodedImage}`
    // console.log(product);
   
   res.json([...product]);
   
    } catch (error) {
        console.log(error);
    }
     
}),



app.get("/getpants",async(req,res)=>
{
    try{
        const productlist = await productModel.find({
            $or: [
              { "tag": { $regex: /pant/i } },
              { "tag": { $regex: /women/i } }
            ]
          });
          productlist.forEach(data => console.log(data.name));
      //  console.log(pantlist);
      console.log(productlist.length);
        res.json([...productlist])
    }
    catch (err)
    {
        console.log(err);
    }
})


app.get("/featureproducts/:param1/:param2",async(req,res)=>
{
    const {param1 , param2} = req.params;
    console.log(param1,param2);
    try
    {
        
        const shirtlist = await productModel.find({"tag":{$in:[new RegExp(param1,'i')]}}).limit(2);
        console.log(shirtlist);
        const pantlist = await productModel.find({"tag":{$in:[new RegExp(param2,'i')]}}).limit(2);
        //console.log(shirtlist);
       // console.log(pantlist);
        const abc = [...shirtlist,...pantlist];
        // console.log(abc);
         res.json(abc);
    }
    catch(error)
    {
      console.log(error);
    }
})

app.get("/newarrivals",async(req,res)=>
{
    try
    {
        const newarrivalsmen = await productModel.find({"tag":{$in:[/Men new-arrival/,'i']}}).limit(2);
        const newarrivalswomen = await productModel.find({"tag":{$in:[/Women new-arrival/,'i']}}).limit(2);
        console.log(newarrivalsmen.length);
        console.log(newarrivalswomen.length);
        res.json([...newarrivalsmen,...newarrivalswomen]);
    }
    catch(error)
    {
        console.log(error);
    }
})


app.get("/fetchallproducts", async(req,res)=>
{
    try
    {
         const result = await productModel.find({});
    res.json(result);
    }
    catch(err)
    {
        console.log(err);
    }
})

app.post("/postproduct",async(req,res)=>
{
    const product = req.body;
    console.log(product);
    try
    {

    }
    catch(err)
    {
        console.log(err);
    }
})

app.post("/fetchlimitedproducts",async(req,res)=>
{
    console.log(req.body);
    const {_id,tag} = req.body;

     const finallist = await productModel.find({
        _id:{$ne:_id},
        tag:tag
     }).limit(3);
     
     const startpro = await productModel.find({_id:_id})
     // console.log('startpro',startpro);
     //console.log(finallist.length);
    const xx = [...startpro,...finallist];
     console.log(xx.length);
     res.json(xx)

})

app.get("/getspecificproduct/:productid",async(req,res)=>
{
        const {productid} = req.params;
        console.log(productid);
        
      const data = await productModel.find({_id:productid})

      return res.json(data)

})

app.post("/additemtocart",verifyToken,async(req,res)=>
{
     const productId = req.body;
     const loginUser  = req.user;
    if(loginUser)
    {
        const user  = await UserModel.findOne({username:loginUser});
     //   const detail = await productModel.findOne({_id:productId})
         //    console.log("This is detail to save",detail);
         //   console.log(user);
        user.cartitems.push({product:productId})
        await user.save();
        return res.json({message:"hey"});
    }
    return res.json({message:"User not found something is wrong"})
});


app.get("/fetchcart",async(req,res)=>
{
    const user= await UserModel.findOne({username:"aditya"}).populate('cartitems.product');
   const data  =  user.cartitems.map(item =>item);
    res.json(data)
})

app.post("/getcontacts",verifyToken,(req,res)=>
{
    console.log(req.user);
    res.json({message:"AUthenticated success"});
})

app.get("/getuser",(req,res)=>
{
    console.log(req.user);
    res.json({message:req.user})
})
app.get("/userstoredcart",async(req,res)=>
{

    console.log("hahahahah");
    const user= await UserModel.findOne({username:"aditya"}).populate("cartitems.product")
 const data  =  user.cartitems.map(item =>item.product);
    console.log(data.length);
     res.json(data);
})

app.post("/getcartcount",verifyToken,async(req,res)=>
{
  //  console.log("Logged in user",req.user);
    if(req.user)
    {
        const Loggedinuser = req.user
        const user= await UserModel.findOne({username:Loggedinuser}).populate("cartitems.product")

        const data  = user.cartitems.map(item => ({
            product:item.product,
            quantity:item.quantity,
            size:item.size
        }))

        // const data  =  user.cartitems.map(item =>item.product);
        console.log(data.length);
        console.log("Getcartcount");
       return  res.json(data);
    }
     return res.json([]);
})





//  app.post("/getcartcount",verifyToken,async(req,res)=>
// {
//     console.log("Logged in user",req.user);
//     if(req.user)
//     {
//         const Loggedinuser = req.user
//         const user= await UserModel.findOne({username:Loggedinuser}).populate("cartitems.product")
//         const data  =  user.cartitems.map(item =>item.product);
//         console.log("Getcartcount");
//        return  res.json(data);
//     }
//      return res.json([]);
// })



app.post("/deletecartitem",verifyToken, async(req,res)=>
{
     console.log(req.user);
     console.log("Product ID ",req.body);
    try
    {
        if(req.user)
        {
            const productid = req.body
        const deleteduser= await UserModel.findOneAndUpdate(
            {username:req.user},
            {$pull:{cartitems:{product:productid}}},
            {new:true}
        )

        if(!deleteduser){
            console.log("User Not Found");
            return  res.json([]);
        }
    
         console.log('Item removed from cart successfully');
         res.json(deleteduser)
        }
        
    }
    catch(err)
    {
        console.log(err);
        return res.status(401).json({message:"Something went wrong in delete"});
    }
   
 //   const cartitem =  user.cartitems.map((data)=> console.log(data));

    // const userdata  = await UserModel.findOne({username:user}).populate("cartitems.product");
})


app.post("/updateproduct",verifyToken,async(req,res)=>
{ 
      console.log('This is request user',req.user);
      const {proid,quantity,size} = req.body;
   //   console.log("here is .......",proid,quantity,size);
        try {
          //  console.log(req.user);
            const newquantity = quantity;
            const newsize = size;
            const productId = proid // Assuming this is the product ID you want to update
    
            // Find the user by username and populate the cartitems with product details
            const user = await UserModel.findOne({ username:req.user })
            if (!user) {
                console.log("User not found");
                return res.status(401).json([]);
            }
    
            // Find the cart item by product ID
            const cartItem = user.cartitems.find(item => item.product.toString() === productId );
            if (!cartItem) {
                console.log("Product not found in user's cart");
                return res.status(401).json([]);
            }
    
            // Update the quantity and size of the product
           // console.log("This is cartitem",cartItem);
            cartItem.quantity = newquantity;
            cartItem.size = newsize;
    
            // Save the updated user document
            await user.save();

            console.log('This is after saved cart');

            console.log("cartitem after saving");


    
            console.log("Cart items updated successfully");
           // console.log('Updated User', user);
            
            res.json(user);
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
})

app.get("/checkdata",async(req,res)=>
{
    const user= await UserModel.findOne({username:"aditya"}).populate("cartitems.product")
  user.cartitems.map(item =>console.log(item.product._id,item.product.name ,item.quantity, item.size));
    return res.json(user);
})



app.post("/saveincanddec",verifyToken,async(req ,res)=>
{

    const {newqty,productId} = req.body;

    console.log("This is inc or dec ",newqty,productId)

      try
      {
        const user = await UserModel.findOne({username:req.user});

       if(!user)
       {
         res.status(401).json([])
       }

          // Find the cart item by product ID
          const cartItem = user.cartitems.find(item => item.product.toString() === productId );
          if (!cartItem) {
              console.log("Product not found in user's cart");
              return res.status(401).json([]);
          }

          cartItem.quantity=newqty;

          await user.save();
          
          console.log("Qty Updated inc/dec success");

           res.json(user);
      }
      catch(err)
      {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
      }   
})








const PORT = process.env.PORT || 3001

app.listen(PORT, ()=>
{
    console.log("Server started at port"+ PORT);     
})

//mongodb+srv://adimkr:aditya201602@urbanvoguedb.xpucjht.mongodb.net/

