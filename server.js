//1.require express framework
const express = require("express");
//2.inv;e express
const app =express();
const port = 3000;

const recipesData=require('./movieData/data.json');


                 /// from json file ///
app.get('/', recipesHandeler);
function recipesHandeler(req,res){
    const result=[];
    recipesData.data.forEach(e => {
        let singelRecipes =new Recipe(e.title,e.poster_path,e.overview);
        result.push(singelRecipes);
    });
res.json(result)
}

function Recipe(title,poster_path,overview){
this.title=title;
this.poster_path=poster_path;
this.overview=overview;
}

app.get("/favorite",(req,res) =>{
    res.send("Welcome to Favorite Page")
});

// Error handling middleware for 404 - Page Not Found
app.use((req, res, next) => {
    res.status(404).json({ status: 404, responseText: 'Page not found' });
  });
  
  // Error handling middleware for 500 - Internal Server Error
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 500, responseText: 'Sorry, something went wrong' });
  });

//3.run server make it listen
app.listen(3000, () => {
    console.log("listing to port 3000")
});


