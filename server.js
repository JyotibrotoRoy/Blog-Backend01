import dotenv from "dotenv";
import connectionDB from "./config/db.js";
import {app} from "./app.js";

dotenv.config({
    path: './.env'
})

connectionDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log("MongoDB connection failed", error);  
})
