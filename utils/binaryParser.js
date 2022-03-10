const fs = require("fs");
var http = require('http');
function binaryParser() {
    return[
        async (req, res, next) => {
            console.log('---------------sasa', req.body);
            console.log('---------------sasa', req.params);
            var data = '';
            req.on('data', function(chunk) {
                data += chunk;
              });
          
              req.on('end', function() {
              });
          
              req.parsedData = data;
              next();
    //         var data = [];

//     // req.on('data', function(chunk) {
//     //     data.push(chunk);
//     // }).on('end', function() {
//         //at this point data is an array of Buffers
//         //so Buffer.concat() can make us a new Buffer
//         //of all of them together
//         // buffer.toString('base64')
        var buffer = Buffer.concat(data);
        let binary = Buffer.from(data, "base64"); //or Buffer.from(data, 'binary')
        
        fs.writeFileSync("../uploads/image", binary);
// // // let imgData = Uint8Array.from(buffer).buffer;
// //         console.log('-------------------buffered-------------------');
// //     });


// var options = {
//     method: 'POST',
//     host: 'localhost',
//     port: 3306,
//     path: '/file'
//   };

//   var request = http.request(options, function(response) {
//     var data = [];

//     response.on('data', function(chunk) {
//       data.push(chunk);
//     });

//     response.on('end', function() {
//       data = Buffer.concat(data);
//       console.log('requested content length: ', response.headers['content-length']);
//       console.log('parsed content length: ', data.length);
//       res.writeHead(200, {
//         'Content-Type': 'image/png',
//         'Content-Disposition': 'attachment; filename=working-test.png',
//         'Content-Length': data.length
//       });
//       res.end(data);
//     });
//   });

//   request.end();
        }
    ]
}
module.exports=binaryParser;