# Anonymous Social Media College Room

College room backend api application with Node.js, Express.js, MongoDB and Mongoose.

## Install

`npm install`

## DB Setup

Install docker on host machine, then run the following commands:
```
mkdir ~/data
docker run -d -p 27019:27017 -v ~/data:/data/db mongo
```

The commands above run mongodb on port 27019.
Download Robo3t or some other mongodb explorer and connect to mongodb on port 27019n and create a database named `collegeroom`.

## Run

`npm start`


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
