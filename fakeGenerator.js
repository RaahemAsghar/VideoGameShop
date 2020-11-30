const faker = require("faker");
const request = require("request");
const getDatabase = require("./db/db").getDatabase;
const connectToDatabase = require("./db/db").connectToDatabase;
const mysql = require("mysql2");
const { fake } = require("faker");


const getGames = async () => {
    var result;
    request('https://api.rawg.io/api/games?page=4', function (error, response, body) {
        console.error('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        result = body
        const { results } = JSON.parse(body)
        console.log(results)
        const pc = results
        connectToDatabase()
        results.forEach(game => {
          console.log(game)
        })
        
        const db = getDatabase()

        db.query('use vgs')
        results.forEach(element => {

            var name = element.name
            var platform = 'PC'
            var description = faker.commerce.productDescription()
            var tags = element.slug
            var sale = Math.floor(Math.random() * 10000) + 1000;
            var rent = Math.floor(Math.random() * 5000) + 1000;

            console.log(name,description,tags,sale,rent,platform)

            name = mysql.escape(name);
            description = mysql.escape(description);
            tags = mysql.escape(tags);
            sale = mysql.escape(sale.toString());
            rent = mysql.escape(rent.toString());
            platform = mysql.escape(platform);
            var image = mysql.escape(element.background_image);
            console.log(name,description,tags,sale,rent,platform,image)

            const add_query = `INSERT INTO game
              (title, description, tags, sale_price, rent_price, platform, image_url)
               VALUES (${name},${description},${tags},${sale},${rent},${platform}, ${image})`;

            db.query(add_query, (err, result) => {
              if (err) throw err;
              console.log("Item added!");
            });

            console.log(element)
        });

    });

}
getGames()



