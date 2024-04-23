//1.require express framework
const express = require("express");
//2.inv;e express
const app =express();

const axios= require("axios");
require("dotenv").config();
const port = process.env.PORT;
const ABI_KEY = process.env.ABI_KEY;
const {Client} = require("pg")
const url =`postgres://abdelradwan:123456@localhost:5432/test`;
const client = new Client(url);
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const recipesData=require('./movieData/data.json');


                 /// from json file ///
app.get('/', recipesHandeler);
app.get("/trending",trendingHandelar);
app.get("/search", searchHandelar);
app.get("/Popular",popularHandelar);
app.get("/Countries",countriesHandeler);
app.post("/addMovie",addMovieHandeler);
app.get("/getMovie",getMovieHandelr);

function recipesHandeler(req,res){
    const result=[];
    recipesData.data.forEach(e => {
        let singelRecipes =new MovieLab11(e.title,e.poster_path,e.overview);
        result.push(singelRecipes);
    });
res.json(result)
}

function trendingHandelar(req,res){
let url =`https://api.themoviedb.org/3/trending/all/week?api_key=${ABI_KEY}&language=en-US`
axios.get(url)
.then(result=>{
    let response = result.data.results.map(x =>{
       return new MovieLab12(x.id,x.title,x.release_date,x.poster_path,x.overview) 
    })
    res.json(response)
})
.catch(error=>{
    console.log(error);
})

}
function searchHandelar(req,res){
let title=req.query.title;
let url =`https://api.themoviedb.org/3/search/movie?query=${title}&api_key=${ABI_KEY}&language=en-US`
axios.get(url)
.then(result=>{
    let responsee=result.data.results
    res.json(responsee);
})
.catch(error=>{
    console.log(error);
})
}
function popularHandelar(req,res){
    let url =`https://api.themoviedb.org/3/person/popular?&api_key=${ABI_KEY}&language=en-US`
axios.get(url)
.then(result=>{
    console.log(result.data.results);
    let response = result.data.results
    res.json(response)
})
.catch(error=>{
    console.log(error);
    res.status(500).send("internal server error2");
})
}
function countriesHandeler(req,res){
    let url =`https://api.themoviedb.org/3/configuration/countries?&api_key=${ABI_KEY}&language=en-US`
axios.get(url)
.then(result=>{
    console.log(result.data.results);
    let response = result.data.results
    res.json(response)
})
.catch(error=>{
    console.log(error);
    res.status(500).send("internal server error");
})
}
function addMovieHandeler(req, res) {
    console.log(req.body)
    const {original_title, release_date, poster_path, overview, comment }= req.body 
    const  sql = `INSERT INTO moviedata(original_title, release_date, poster_path, overview, comment )
    VALUES ($1, $2, $3, $4, $5) RETURNING *;`
    const values = [original_title, release_date, poster_path, overview, comment] 
    client.query(sql, values).then((reuslt)=>{
        console.log(reuslt.rows)
        res.status(201).json(reuslt.rows)
    }).catch(((error) =>{
        errorHandler(error, req, res);
    }))
}
function getMovieHandelr(req,res){
    const sql =`SELECT * FROM moviedata;`
    client.query(sql).then((result)=>{
            const data = result.rows
            res.json(data)
    })
    .catch()
}

function MovieLab11(title,poster_path,overview){
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview;
    }
    

    function MovieLab12(id,title,release_date,poster_path,overview){
        this.id=id;
        this.title=title;
        this.release_date=release_date;
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
client.connect().then(()=>{

    app.listen(3000, () => {
        console.log("listing to port 3000")
    });

}
).catch()




