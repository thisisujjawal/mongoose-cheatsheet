const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const UserModel = require("./UserModel");
const app = express();

app.use(express.json({extended : true}));
app.use(express.urlencoded({extended : true}));
app.use(cors());

const url = "mongodb+srv://@cluster0.a38x7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(url,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useFindAndModify : false
}).then(()=>{console.log("mongodb connected successfully")})
.catch(error => {console.log(error)});

// -----------------------------------------
// CREATING OR INSERING
// -----------------------------------------

app.post('/' , async (req, res)=>{
    const input = req.body;
    const user = await UserModel.create(input);
    console.log(user);
    res.status(200).json(user);
    //return the created user
})
app.post('/' , async (req, res)=>{
    const input = req.body;
    const before = UserModel(input);
    const after = await before.save();
    console.log(before);
    console.log(after);
    res.status(200).json(after);
    //before and after is exactly same but after is after adding it to the database
})
app.post('/' , async (req, res)=>{
    const input = req.body;
    const before = UserModel(input);
    const after = await UserModel.collection.insertOne(before);
    console.log(after);
    res.status(200).json(after);
    //after dont only give us the user data but all other data like insertion time key data, cluster data and whole lot of other data.
    //here it is not necessary to first pass it to the usermodel.You can directly use insertOne function
})
app.post('/' , async (req, res)=>{
    const input = req.body;
    const after = await UserModel.collection.insertMany(input);
    console.log(after);
    res.status(200).json(after);
    //here you don't have to first send it to the model as it will give error.Directly give the array of input to the insertmany function.
    //does'nt give the user but give the other details.
})

// -----------------------------------------
// READING OR FINDING
// -----------------------------------------

app.get('/' , async(req, res)=>{
    const filter = {age : 21};
    const users = await UserModel.find(filter);
    console.log(users);
    res.status(200).json(users);
    //return all users for the given filter. You can give {} or nothing json to get all data from database
})
app.get('/' , async(req, res)=>{
    const filter = {age : 1000};
    const users = await UserModel.findOne(filter);
    console.log(users);
    res.status(200).json(users);
    //returns the first user which matches the filter.
    // returns null if no user matches the filter
})
app.get('/' , async(req, res)=>{
    //FINDMANY IS NOT A FUNCTION
    const filter = {age : 21};
    const users = await UserModel.findMany(filter);
    console.log(users);
    res.status(200).json(users);
})
app.get('/' , async(req, res)=>{
    const id = "60ba1c6052456e5510056c165";
    const users = await UserModel.findById(id);
    console.log(users);
    res.status(200).json(users);
    // If id is correct it will return the user and if the id is incorrect then it will return null but
    //if the id is invalid(maybe length is wrong or type is wrong) then it will throw an error.
    // To overcome this we use below methord
    if(mongoose.Types.ObjectId.isValid(id)){
        const users = await UserModel.findById(id);
        console.log(users);
        res.status(200).json(users);
    }else{
        console.log('Not a valid id');
    }
})

// -----------------------------------------
//UPDATE
// -----------------------------------------

app.post('/' , async(req, res)=>{
    const filter = {name : "ujjawal"};;
    const users = await UserModel.updateOne(filter , {$set :{name : "Ujjawal"}} , {new : true} );
    console.log(users);
    res.status(200).json(users);
    //DOESN'T RETURN THE USER(even you mention new : true). ONLY RETURN THAT HOW MANY ARE UPADATED AND OTHER DETAILS.
})
app.post('/' , async(req, res)=>{
    const filter = {age : 20};
    const users = await UserModel.updateMany(filter , {$set :{likes : ["sleeping"]}} , {multi : true , new : true} );
    console.log(users);
    res.status(200).json(users);
    //DOESN'T RETURN THE USER(even you mention new : true). ONLY RETURN THAT HOW MANY ARE UPADATED AND OTHER DETAILS.
    // no need to give multi:true
})
app.post('/' , async(req, res)=>{
    const filter = {age : 20};
    const users = await UserModel.update(filter , {$set :{likes : ["playing"]}} , {multi : true , new : true} );
    console.log(users);
    res.status(200).json(users);
    //DOESN'T RETURN THE USER(even you mention new : true). ONLY RETURN THAT HOW MANY ARE UPADATED AND OTHER DETAILS.
    // use multi:true to update all data that matches the filter
})

// -----------------------------------------
//FINDBYID AND ???
// -----------------------------------------

app.post('/' , async(req, res)=>{
    const id = "60ba1c6052456e5510056c16";
    const users = await UserModel.findByIdAndUpdate(id , {$set :{name : "Shreya"}} ,{new : true} );
    console.log(users);
    res.status(200).json(users);
    // here if we write new : true then it give the updated user otherwise return old user
})
app.post('/' , async(req, res)=>{
    const id = "60ba1db74371702d1437f772";
    const users = await UserModel.findByIdAndRemove(id ,{new : true});
    console.log(users);
    res.status(200).json(users);
    // here if you write new true or not does'nt matter. It will return the old user only.
    // useFindAndModify : false is must to write in connection
})
app.post('/' , async(req, res)=>{
    const id = "60ba1fde94bf35057c0e6ce5";
    const users = await UserModel.findByIdAndDelete(id);
    console.log(users);
    res.status(200).json(users);
    // here if you write new: true it will give error. 
    //It reterns the deleted user; 
})

// -----------------------------------------
//FINDONE AND ???
// -----------------------------------------

app.post('/' , async(req, res)=>{
    const filter = {name : "Tipendra"};
        const users = await UserModel.findOneAndUpdate(filter , {$set : {name : "Tapu"}} , {new : true}) ;
        console.log(users);
        res.status(200).json(users);
        // if you write new : true then it will return the updated user otherwise it will return old user
    })
app.post('/' , async(req, res)=>{
    const filter = {name : "Tipendra"};
    const users = await UserModel.findOneAndReplace(filter , {name : "Tapu"}, {new : true}) ;
    console.log(users);
    res.status(200).json(users);
    // It will replace whole user.. if a KV was present earlier but not given in the methord than it will be deleted
    // if you write new : true then it will return the updated user otherwise it will return old user
})
app.post('/' , async(req, res)=>{
    const filter = {name : "Goli"};
    const users = await UserModel.findOneAndRemove(filter,{new : true}) ;
    console.log(users);
    res.status(200).json(users);
    //It will delete the user... 
    //It doesn't matter if you write new true or not ... it will always return deleted user
})
app.post('/' , async(req, res)=>{
    const filter = {name : "Gogi"};
    const users = await UserModel.findOneAndDelete(filter) ;
    console.log(users);
    res.status(200).json(users);
    //It will delete the user... 
    //If you write new true it will give an error
    //It will always return deleted user
})

// -----------------------------------------
//DELETE
// -----------------------------------------

app.delete('/' , async(req, res)=>{
    const filter = {age : 45};
    const users = await UserModel.remove(filter);
    console.log(users);
    res.status(200).json(users);
    //It does not matter you write new true. It will not return the user but it will return all other details;
    // doesn't matter you give multi or not ... it will delete all the document that will match the filter
})
app.delete('/' , async(req, res)=>{
    const filter = {age : 21};
    const users = await UserModel.deleteOne(filter , {multi : true , new : true});
    console.log(users);
    res.status(200).json(users);
    //It does not matter you write new true. It will not return the user but return other detials
    // give multi or not it will not give error but always delete only first user that matches the filter(dont give recommended)
})
app.delete('/' , async(req, res)=>{
    const filter = {age : 21};
    const users = await UserModel.deleteMany(filter , { new : true});
    console.log(users);
    res.status(200).json(users);
    //It does not matter you write new true. It will not return the user but return other details 
    // give multi or not it will not give error but always delete only first user that matches the filter(dont give recommended)
})






app.listen(8000 , (err)=>{
    if(err) console.log(err);
    else console.log("server successfully runned at port 8000");
})
