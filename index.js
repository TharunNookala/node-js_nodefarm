const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate.js');

const overviewTemp = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8')
const productTemp = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8')
const cardTemp = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);


const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true)

    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        })
        const cardsHtml = dataObj.map(el => replaceTemplate(cardTemp, el)).join('');
        const output = overviewTemp.replace('{%PRODUCT_CARDS%', cardsHtml)
        res.end(output)

    } else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        })
        const product = dataObj[query.id];
        const output = replaceTemplate(productTemp, product)
        res.end(output)

    } else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-Type': 'application/json',
        })
        res.end(data)

    } else if (pathname === `/product?id=${query.id}`) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
        })
        res.end(`<h1>PRODUCT DETAILS of ${query.id}  </h1>`)

    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
        })
        res.end('<h1>Page Not Found</h1>')
    }

})


const host = '127.0.0.1';
const port = 8000;
server.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}/`);
});
