# Getting Started with Auth0

you need to sign up with auth0 first to use it in your project

1.  click on create application button

2.  give the name for your application

3.  domain and client ID will be provided from Auth0 you can copy them and use in you project

4.  Add your local host or domain in Allow Callback URL's, Allow Logout URL's and Allow Web Origins. If you have multiple add , in between the localhost or domains]

5.  save it and you ready to use them in your project

## For social login

Authentication -> social -> Create Connection button -> select which social media you like to use in Application tab allow in your created application and you can login

## Auth0 Default login

Once Auth0 setup is done, you can find defaultAuth0 folder inside src as a reference there you can find files and you can go through documentation of auth for more details - https://auth0.com/docs/quickstart/spa/react/interactive

Please make sure you have added your domain and client id

## Auth0 Universal login or custom login within your project

You need to do all the steps of getting started with auth0

You need to install "npm install auth0-js" to use custom login in your application. for reference documentation please go through https://auth0.com/docs/libraries/auth0js

Using material UI for forms please feel free to use your own liblaries.

### SingUp

for sign up along with username follow these steps.

Authentication -> Database -> select database -> enable Username so that user can sign up along with username

goto password policy tab and select the Strength and make changes on the validation condition available in signUpSubmit function

## Forgot password

it will send password to your registered email

Please go through my Code for your reference, please add your domain and client id to work

In the project directory, you can run:

**Note: Tried custom login for social media was not possible to do if you find the solution please fork me Thanks**
