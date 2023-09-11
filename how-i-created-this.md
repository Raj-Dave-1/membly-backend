<!-- Dada Ki Jay Ho -->

# SitaRam

1. thought about modules that will be needed like dotenv, express, mongoose, jsonwebtoken and also added nodemon as a dev dependency
2. added typescript modules and configured tsconfig.json file
3. set up initial boiler plate code with sitaram commit
4. create interfaces & models using that interface
5. create is-auth middlewares
6. create sign up and login for all roles and make sure if user is blocked then it must not allowed to login. add token entry to redis if everything is fine.
   -- 6.1 added redis module and container in docker
   -- 6.2 setup redis client
   -- 6.3 added auth / password for redis
7. created script for generating dummy database using chat gpt
   -- 7.1 add admin routes to get user info and list
8. added token invalidation
   [] 9. added monitoring tools like prometheus, grafana and loki: piyush garg video https://www.youtube.com/watch?v=ddZjhv66o_o
   [] 10. spin up to servers and connect them to same database and use nginx to route trafic in round robin fassion and also collect log of both the servers on same dashboard
   [] 8. created find currently available peers functionality
   -- 8.1 used pencil and paper to draw things and work flow
   -- 8.2 used chat gpt to understand how to achieve this
   -- 8.3 try to create different stage for currently avaialble users
   -- 8.4 understand how to work with geospecial queries using chatgpt
   [] 9. created react project for login and sign up and setup docker compose for the same
   [] 10. think of to use kafka in your project
   [] 11. do not store original long-lat / location of user because it could be dengeours problem
