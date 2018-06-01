# AuthenticationMiddleware

To start your application server:

  * Install dependencies with `npm install`
  * Start your webservice `npm start`

Now you can send your requests to [`localhost:3002`](http://localhost:3002).

Available services:

  * Signup:
    - method: `POST`
    - url: `http://localhost:3002/signup`
    - params: `username`, `password`
    - return: `success`
    
  * Signin:
    - method: `POST`
    - url: `http://localhost:3002/signin`
    - params: `username`, `password`
    - return: `token` from the user

  * Aything else:
    - redirects the request to [`localhost:3003`](http://localhost:3003)
    - needs a `valid token` as `query parameter` or `body`
