# Project Routes

### /
### /index
- GET: renders main page
#### */artist* deprecated
- GET: get artist listing
### /items
- GET: get full list of items
#### /items/:id
- GET: gets a single item by id
### /admin
- GET: gets admin view
#### /admin/add
- POST: adds a new artwork to the database
### /auth
#### /auth/signup
- GET: renders validation results for signup
- POST: creates user account
#### /auth/signin
- GET: renders validation results for signin
- POST: tries to login an user
### /cart
- GET: gets the full list of items in the cart
#### /cart/:id
- GET: gets a single element from the cart
- PUT: updates an item in the cart
- DELETE: deletes an item from the cart
### /checkout
- POST: process checkout request for user