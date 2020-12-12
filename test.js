// var fs = require('fs'),
//     request = require('request');

// var download = function(uri, filename, callback){
//   request.head(uri, function(err, res, body){
//     console.log('content-type:', res.headers['content-type']);
//     console.log('content-length:', res.headers['content-length']);

//     request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
//   });
// };

// download('https://media.rawg.io/media/games/34b/34b1f1850a1c06fd971bc6ab3ac0ce0e.jpg', 'public/imgs/34b1f1850a1c06fd971bc6ab3ac0ce0e.jpg', function(){
//   console.log('done');
// });


var s = 'https://media.rawg.io/media/games/34b/34b1f1850a1c06fd971bc6ab3ac0ce0e.jpg';
s = s.split('/').slice(-1)

console.log(s)
