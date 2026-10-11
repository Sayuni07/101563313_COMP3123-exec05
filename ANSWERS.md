# COMP3123 Exercise 05 - Answers

## Section B

### 6. Purpose of `express.Router()`

`express.Router()` creates a modular, mountable "mini-application" that can hold its own routes and middleware. Instead of registering every endpoint directly on `app`, related routes are grouped on a router (`router.get('/home', ...)`, `router.post('/login', ...)`) and then attached with `app.use('/', router)`.

Benefits:
- **Organization:** routes can be grouped by feature (users, products, auth) and even moved into separate files.
- **Reusability / prefixing:** a router can be mounted under any base path, e.g. `app.use('/api/v1', router)`, without changing the route definitions.
- **Scoped middleware:** middleware (auth, logging) can be applied to one router only via `router.use(...)`.
- **Maintainability:** the main `app.js` stays small and easy to read as the project grows.

### 7. Error handling in Express.js

Handle errors at two levels:
1. In each route, catch failures (file not found, invalid JSON) and pass them on with `next(err)`.
2. Register one centralized error-handling middleware **after all routes**. It has four parameters `(err, req, res, next)`, which is how Express recognizes it.

```js
router.get('/profile', (req, res, next) => {
  fs.readFile(path.join(__dirname, 'user.json'), 'utf8', (err, data) => {
    if (err) return next(err);               
    try {
      res.json(JSON.parse(data));
    } catch (parseErr) {
      next(parseErr);                        
    }
  });
});


app.use((req, res) => res.status(404).send('Not Found'));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});
```

For async/await routes, wrap the body in `try/catch` and call `next(err)` in the `catch` block.

## Section C

### 7. Dynamic port binding: `app.listen(process.env.port || 8081)`

`process.env.port` reads the `port` environment variable set outside the code. The `||` operator falls back to `8081` if that variable is not defined. So locally, with no variable set, the server runs on 8081; when deployed, the environment's value is used.

This matters in production because hosting platforms (Heroku, Render, Azure, AWS, etc.) assign the port dynamically, and the app must listen on that port or it will not be reachable. It also lets you change ports without editing code, and avoids conflicts when something else is already using a port. (Note: on Linux, environment variable names are case-sensitive, and the common convention is uppercase `PORT`; using `process.env.PORT || 8081` is the more portable choice.)
