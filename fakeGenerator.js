const faker = require("faker");
const request = require("request");
const getDatabase = require("./db/db").getDatabase;
const connectToDatabase = require("./db/db").connectToDatabase;
const mysql = require("mysql2");
const { fake, database } = require("faker");

var fs = require("fs");
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const getGames = async (page, cat_id, cat) => {
  var result;

  const db = getDatabase();

  request(
    `https://api.rawg.io/api/games?page=${page}`,
    function (error, response, body) {
      // console.error("error:", error); // Print the error if one occurred
      // console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
      console.log("Added from page: ", page);
      if (body != undefined && !error) {
        const { results } = JSON.parse(body);
        const pc = results;

        results.forEach(async (element) => {
          await sleep(200);
          var name = element.name;
          var platform = "PC";
          var description = faker.commerce.productDescription();
          var tags = element.slug;
          var sale = Math.floor(Math.random() * 10000) + 1000;
          var rent = Math.floor(Math.random() * 5000) + 1000;
          name = name.replace(/[^\x20-\x7E]+/g, '');
          //console.log(name, description, tags, sale, rent, platform);

          name = mysql.escape(name);
          description = mysql.escape(description);
          tags = mysql.escape(tags);
          sale = mysql.escape(sale.toString());
          rent = mysql.escape(rent.toString());
          platform = mysql.escape(platform);
          var image = mysql.escape(element.background_image);
          var stock = Math.floor(Math.random() * 50) + 1;
          const add_query = `INSERT INTO game
              (title, description, tags, sale_price, rent_price, platform, image_url, stock)
               VALUES (${name},${description},${tags},${sale},${rent},${platform}, ${image},${stock} );\n`;
          fs.appendFile("games.txt", add_query, function (err) {
            if (err) throw err;
          });

          db.query(add_query, (err, result) => {
            if (err) throw err;
            const cat = `INSERT INTO game_category VALUES(${result.insertId},${
              cat_id[Math.floor(Math.random() * 4)]
            });\n`;
            fs.appendFile("gamecategory.txt", cat, function (err) {
              if (err) throw err;
            });
            db.query(cat, (err, result) => {
              if (err) throw err;
            });
          });

          //console.log(element);
        });
      }
    }
  );
};
//getGames();

const getUsers =  () => {
  
  const bcrypt = require("bcryptjs");
  for (var i = 0; i < 1000; i++) {
    var f_name = mysql.escape(faker.name.firstName());
    var l_name = mysql.escape(faker.name.lastName());
    var email = mysql.escape(
      faker.internet.email(f_name, l_name, "example.com")
    );
    var pass = mysql.escape(faker.internet.password());
    var phone = mysql.escape(
      Math.floor(Math.random() * 999999999999999) + 10000000
    );
    var address = mysql.escape(faker.address.streetAddress());

    var userW = "username: " + email + "\t\t\t\t\tpass: " + pass + "\n";

    fs.appendFileSync("usernames.txt", userW, function (err) {
      if (err) throw err;
    });


    var salt = bcrypt.genSaltSync(10);
    var password = bcrypt.hashSync(pass, salt);
    

    var q = `INSERT INTO user (first_name, last_name, email, password, phone_number, address) VALUES(${f_name},${l_name},${email},'${password}',${phone},${address});\n`;
    
    
    fs.appendFileSync("users.txt", q, function (err) {
      if (err) throw err;
    });
    
  }

  console.log("doneee");
};

const clearTables = () => {
  const db = getDatabase();
  // db.query("DELETE FROM console");
  // db.query("DELETE FROM manufacturer");
  db.query("DELETE FROM user");

  
};

function getConsoles() {
  const fetch = require("node-fetch");

  (async () => {
    const response = await fetch(
      "https://parseapi.back4app.com/classes/GameTemple_Consoles?limit=5000&keys=Manufacturer,Name,Image,FullSpecs",
      {
        headers: {
          "X-Parse-Application-Id": "RBZZjAIpzgFdMladKRZAgpBoBTQTsmvnZ8NC2Zp6", // This is your app's application id
          "X-Parse-REST-API-Key": "9wAmX25Cticp197VQgQ8fq2l8AkkV1hhg39HVXCy", // This is your app's REST API key
        },
      }
    );
    const data = await response.json(); // Here you have the data that you need
    var mans = [];
    connectToDatabase();
    const db = getDatabase();
    db.query("use vgs");

    db.query("delete from manufacturer");
    db.query("delete from console");

    var manufacturers = {};
    data.results.forEach(async (e) => {
             var m = e.Manufacturer == null ? 'Temp' : e.Manufacturer;

       var m = e.Manufacturer == undefined ? 'Temp' : e.Manufacturer;
      m = m.replace(/[^\x20-\x7E]+/g, '')
      if (!mans.includes(m)) {
          mans.push(m);
          console.log(mans)
      fs.appendFile("mans.txt", `INSERT INTO manufacturer (name) VALUES(${mysql.escape(
            m
          )});\n`,function (err) {
      if (err) throw err;
    })
       var [result, f]  = await db.promise().query(
          `INSERT INTO manufacturer (name) VALUES(${mysql.escape(
            m
          )})`)
                  manufacturers[m] = result.insertId;



      }
    });
    const callback = () => {
      var consoles = data.results;
      //console.log(manufacturers)
      consoles.forEach((e) => {
        var name = e.Name;
        name = name.replace(/[^\x20-\x7E]+/g, '')
        var m = e.Manufacturer == undefined ? 'Temp' : e.Manufacturer;
        m = m.replace(/[^\x20-\x7E]+/g, '')  
        var man_id = manufacturers[m];
        console.log(man_id);
        var description = faker.commerce.productDescription();
        var tags = e.Name;
        tags = tags.replace(/[^\x20-\x7E]+/g, '')
        var sale = Math.floor(Math.random() * 10000) + 1000;
        var image = e.Image == undefined ? "google.com" : e.Image.url;
        name = mysql.escape(name);
        description = mysql.escape(description);
        tags = mysql.escape(tags);
        sale = mysql.escape(sale.toString());
        var stock = Math.floor(Math.random() * 50) + 1;
        const add_query = `INSERT INTO console
                (name, description, tags, sale_price, manufacturer_id, image_url, stock)
                 VALUES (${name},${description},${tags},${sale},${mysql.escape(
          man_id
        )}, ${mysql.escape(image)},${stock} )`;

        db.query(add_query, (err, result) => {
          if (err) throw err;
        });
      });
    };
    setTimeout(callback, 5000);
  })();
}

const generateData = async () => {
  var cat = ["Action", "Adventure", "Thriller", "FPS", "Role Playing"];
  var cat_id = [];

  connectToDatabase();
  const db = getDatabase();
  db.query("use vgs");
  clearTables();

  // for (var i = 0; i < 5; i++) {
  //   var q = `INSERT INTO category (name) VALUES('${cat[i]}')`;
  //   console.log(q);
  //   const [r, f] = await db.promise().query(q);
  //   console.log(r);
  //   cat_id.push(r.insertId);
  // }
  // // console.log(cat_id)

  // for (var i = 1; i <= 500; i++) {
  //   getGames(i, cat_id, cat);
  //   await sleep(500);
  // }
  getUsers();
  //getConsoles() 
};

getUsers();
//console.log('finish')
