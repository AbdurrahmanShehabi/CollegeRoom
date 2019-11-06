# Anonymous Social Media College Room

Example of token based authentication with Node.js, Express.js, MongoDB and Mongoose.

## RESTful API endpoints

### POST `/api/users`

Create a new user.

+ Method: `POST`
+ URL: `/api/users`
+ Body:

```js
{
  "username": "art",
  "password": "secret"
}
```

### POST `/api/users/authenticate`

Authenticate user.

+ Method: `POST`
+ URL: `/api/users/authenticate`
+ Body:

```js
{
  "username": "art",
  "password": "secret"
}
```

### Make authenticated request

Get items as an authenticated user.

+ Method: `GET`
+ URL: `/api/user`
+ Header: `x-access-token: jwtToken`

Example of a token string: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlbWEiLCJpYXQiOjE0NTEzMTMxOTgsImV4cCI6MTQ1MTMxNjc5OH0.TOi73nhmqGYU_Ajo-ufKcPk5TMmycyNSW3jDghPAHLc`

## Install

`npm install`

## DB Setup

Install docker on host machine, then run the following commands:
```
mkdir ~/data
docker run -d -p 27019:27017 -v ~/data:/data/db mongo
```

Runs mongodb on port 27019, using Robo3t of some other mongodb explorer connect to mongodb and create a database named yikyak.

## Run

`npm start`
