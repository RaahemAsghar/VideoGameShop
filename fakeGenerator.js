const faker = require("faker");
const request = require("request");
const getDatabase = require("./db/db").getDatabase;
const connectToDatabase = require("./db/db").connectToDatabase;
const mysql = require("mysql2");
const { fake, database } = require("faker");

var fs = require('fs')

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};






const getGames = async (page,cat_id, cat) => {
  var result;
  connectToDatabase();

  const db = getDatabase();

  db.query("use vgs");


  request(
    `https://api.rawg.io/api/games?page=${page}`,
    function (error, response, body) {
      console.error("error:", error); // Print the error if one occurred
      console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
      result = body;
      const { results } = JSON.parse(body);
      const pc = results;
   

      results.forEach((element) => {
        var name = element.name;
        var platform = "PC";
        var description = faker.commerce.productDescription();
        var tags = element.slug;
        var sale = Math.floor(Math.random() * 10000) + 1000;
        var rent = Math.floor(Math.random() * 5000) + 1000;

        //console.log(name, description, tags, sale, rent, platform);

        name = mysql.escape(name);
        description = mysql.escape(description);
        tags = mysql.escape(tags);
        sale = mysql.escape(sale.toString());
        rent = mysql.escape(rent.toString());
        platform = mysql.escape(platform);
        var image = mysql.escape(element.background_image);
        // download(element.background_image, `public/imgs/${element.background_image.split('/').slice(-1)}`, function(){
        //         console.log('done');
        // });

        //console.log(name, description, tags, sale, rent, platform, image);

        const add_query = `INSERT INTO game
              (title, description, tags, sale_price, rent_price, platform, image_url)
               VALUES (${name},${description},${tags},${sale},${rent},${platform}, ${image})`;
        
        db.query(add_query, (err, result) => {
          if (err) throw err;
          db.query(`INSERT INTO game_category VALUES(${result.insertId},${cat_id[Math.floor(Math.random() * 4)]})`)
         
          
        });

        //console.log(element);
      });
    }
  );
};
//getGames();

const getUsers = async () => {
  connectToDatabase()
  const db = getDatabase();
  db.query("use vgs");

  const fs = require('fs')
  const bcrypt = require('bcryptjs')
  for(var i = 0;i < 500;i++){
    var f_name = mysql.escape(faker.name.firstName())
    var l_name =  mysql.escape(faker.name.lastName())
    var email =  mysql.escape(faker.internet.email(f_name, l_name,"example.com"))
    var pass =  mysql.escape(faker.internet.password())
    var phone =  mysql.escape(Math.floor(Math.random() * 999999999999999) + 10000000)
    var address =  mysql.escape(faker.address.streetAddress())

    var userW = 'username: ' + email + '\t\t\t\t\tpass: ' + pass + '\n';

    fs.appendFile('usernames.txt', userW, function (err) {
      if (err) throw err;
    });
    var salt = bcrypt.genSaltSync(10);
    var password = bcrypt.hashSync(pass, salt);
    var q = `INSERT INTO user (first_name, last_name, email, password, phone_number, address) VALUES(${f_name},${l_name},${email},'${password}',${phone},${address})` 
    await db.promise().query(q)


    console.log(f_name, l_name, email, password, phone, address)


  }

  console.log("doneee")


};

//getUsers()
const generateData = async ()=>{
  // connectToDatabase();

  // const db = getDatabase();

  // db.query("use vgs");
  var cat = ['Action', 'Adventure', 'Thriller', 'FPS', 'Role Playing']
  var cat_id = [1155,1156,1157,1158,1159]



  // for(var i = 0;i<5;i++){
  //   var q = `INSERT INTO category (name) VALUES('${cat[i]}')`
  //   console.log(q)
  //   const [r,f] = await db.promise().query(q)
  //   console.log(r)
  //   cat_id.push(r.insertId)
  // }
  // console.log(cat_id)


  for(var i = 1;i <= 2;i++){
    getGames(i, cat_id, cat)
  }
}

generateData()
console.log('finish')