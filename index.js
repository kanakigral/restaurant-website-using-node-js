// file system
// ------------------------------------------------------------------------
const fs = require("fs");

// server
// ------------------------------------------------------------------------
const http = require("http");

// routing
// ------------------------------------------------------------------------
const url = require("url");

// blocking, synchronous
// ------------------------------------------------------------------------

// string data
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

// json data
const dataObj = JSON.parse(data);

//
const replaceTemplate = (temp, product) => {
//using string regression
let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
output = output.replace(/{%IMAGE%}/g, product.image);
output = output.replace(/{%PRICE%}/g, product.price);
output = output.replace(/{%FROM%}/g, product.from);
output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
output = output.replace(/{%DESCRIPTION%}/g, product.description);
output = output.replace(/{%ID%}/g, product.id);
return output;
};

// template-overview page
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);

// template-card page
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

// template-product page
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

// creating server
// ------------------------------------------------------------------------
const server = http.createServer((req, res) => {
  //const pathname = req.url;
  const {query, pathname} = url.parse(req.url, true);
  console.log(query);

  // Serve static images
  if (pathname.startsWith("/images/")) {
    const imagePath = `${__dirname}/images/${pathname.split("/images/")[1]}`;
    try {
      const imageData = fs.readFileSync(imagePath);
      const ext = pathname.split(".").pop();
      let contentType = "image/png";
      if (ext === "heic") contentType = "image/heic";
      if (ext === "webp") contentType = "image/webp";
      res.writeHead(200, { "Content-type": contentType });
      res.end(imageData);
    } catch (err) {
      res.writeHead(404, { "Content-type": "text/html" });
      res.end("Image not found");
    }
  } else if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHTML = dataObj.map((eL) => replaceTemplate(tempCard, eL)).join();
    // console.log(cardsHTML);

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML)
    res.end(output);
  } else if (pathname === "/product") {
    res.writeHead(200,{ "Content-type": "text/html"});
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page Not Found!</h1>");
  }
});

// listening to server on port 8000
// ------------------------------------------------------------------------
server.listen(8000, "127.0.0.1", () => {
  console.log("listening to requests on port 8000!");
});