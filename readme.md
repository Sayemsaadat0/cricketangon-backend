This is Cow hut management backend Website :
The details about this website given into the bellow:

Live Link : https://digital-cow-server.vercel.app/

api's Link :

create a new admin :
{
"password":"amiadminbujheshunekothakoiyo",
"role": "admin",
"name":{
"firstName": "Mr. Admin"
"lastName": "Bhai"
},
"phoneNumber":"01711111111",
"address": "Uganda",
}

response data look like this :
{
"success": true,
"statusCode":200,
"message": "Admin created successfully",
"data": {
"\_id":"ObjectId(“6473c6a50c56d0d40b9bb6a3)",  
 "role": "admin",
"name":{
"firstName": "Mr. Admin"
"lastName": "Bhai"
},
"phoneNumber":"01711111111",
"address": "Uganda",
}
}

Route: https://digital-cow-server.vercel.app/api/v1/admins/create-admin (POST)

\*\*\* Here is a more detailed explanation of each step:
The admins enter their phone number and password into the login form.
The server validates the phone number and password.
If the login is successful, the server generates an access token and a refresh token.
The access token is sent in the response to the user.
The refresh token is set in the browser cookie.
The admin's \_id and role are included in both the access token and the refresh token.
The access token is used to authenticate the user for subsequent requests.
The refresh token can be used to generate a new access token if the old one expires.
The \_id and role are used to identify the admin and their permissions.

Login as a admin :
req.body
{
"phoneNumber":"012546465613445",
"password":"Rafin019844@"
}

Response Sample Pattern:

{
"success": true,
"statusCode":200,
"message": "User logged in successfully",
"data": {
"accessToken": "eyJhbGciOiJIUzI1NiICJ9.eyJ1c2V4NzIzMTcxNCwiZXhwIjoxNjg3MzE4MTE0fQ.Q7j8vtY9r1JeDK_zR6bYInlY",
}
}

Route:https://digital-cow-server.vercel.app/api/v1/admins/login (POST)

Login User
To log in, users must provide their phone number and password. The phone number must be unique in the database. If the login is successful, an access token will be sent in the response and a refresh token will be set in the browser cookie. The user's \_id and role will both be included in the tokens.

Here is a more detailed explanation of each step:
The user enters their phone number and password into the login form.
The server validates the phone number and password.
If the login is successful, the server generates an access token and a refresh token.
The access token is sent in the response to the user.
The refresh token is set in the browser cookie.
The user's \_id and role are included in both the access token and the refresh token.
The access token is used to authenticate the user for subsequent requests.
The refresh token can be used to generate a new access token if the old one expires.
The \_id and role are used to identify the user and their permissions.
Route: /api/v1/auth/login (POST) Request body:

{
"phoneNumber":"0123564813464616",
"password":"Rafin019844@",
}
Response: The created access token for the user.

Response Sample Pattern:

{
"success": true,
"statusCode":200,
"message": "User logged in successfully",
"data": {
"accessToken": "eyJhbGciOiJIUzI1NiICJ9.eyJ1c2V4NzIzMTcxNCwiZXhwIjoxNjg3MzE4MTE0fQ.Q7j8vtY9r1JeDK_zR6bYInlY",
}
}

https://digital-cow-server.vercel.app/api/v1/users (GET) → Can only be accessed by admin
https://digital-cow-server.vercel.app/api/v1/users/:id (Single GET) → Can only be accessed by admin
https://digital-cow-server.vercel.app/api/v1/users/:id (PATCH) → Can only be accessed by admin
https://digital-cow-server.vercel.app/api/v1/users/:id (DELETE) → Can only be accessed by admin
Cows
https://digital-cow-server.vercel.app/api/v1/cows (POST) → Can only be accessed by seller

https://digital-cow-server.vercel.app/api/v1/cows (GET) → Can only be accessed by buyer,seller & admin

https://digital-cow-server.vercel.app/api/v1/cows/:id (Single GET) → Can only be accessed by buyer,seller & admin

https://digital-cow-server.vercel.app/api/v1/cows/:id (PATCH) → Can only be accessed by the seller of the cow

https://digital-cow-server.vercel.app/api/v1/cows/:id (DELETE) → Can only be accessed by the seller of the cow

https://digital-cow-server.vercel.app/api/v1/orders (POST) → Can only be accessed by the buyer

https://digital-cow-server.vercel.app/api/v1/orders (GET)
