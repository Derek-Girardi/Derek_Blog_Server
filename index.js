//imports and constants
const express = require("express")
const mongoose = require("mongoose");
const app = express()

// sets port 8080 to default
app.set(`port`, process.env.PORT || 8080);

//db connection
mongoose.connect(`mongodb://localhost:27017/LocalFlutterBlogDB`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
},
    { useFindAndModify: false }); //from mongoose docs

const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "Connection error:"));
connection.once("open", () => {  //once opened, show message confirming success
    console.log("MongoDB connected");
})

//middleware
app.use(express.json()); //So our server understands the json
const userRoute = require("./routes/user");
app.use("/user", userRoute);

app.route("/").get((req, res) => res.json("peepee poopoo")); //get json response which for now is what I provided
app.listen(app.get('port'), () => console.log(`running on port ${app.get('port')}`)); 