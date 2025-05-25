const routesHandler = (req, res) => {
    const url = req.url;

    if(url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Username</title></head>');
        res.write('<body><form action="/create-user" method="POST""><input type="text" name="username"><button type="submit">Create User</button></form></body>');
        res.write('<html>');
        return res.end();
    }

    if(url === '/users') {
        res.write("<html>")
        res.write("<body>")
        res.write("<u1><li>Sanjay Mehta</li></ul>")
        res.write("</body>")
        res.write("</html>");
        return res.end();
    }

    if(url === '/create-user') {
        const body = [];
        req.on('data', chunk => {
            body.push(chunk);
        });
    
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const username = parsedBody.split("=")[1];
            console.log("username =", username);
            res.statusCode = 302;
            res.setHeader('Location', '/');
            return res.end();
        });
    }
}

exports.handler = routesHandler;