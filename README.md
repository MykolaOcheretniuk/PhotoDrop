# Photographers Actions

## Sign-in as photographer

    https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/sign-in

    Required JSON Body:
    {
        "login":"login",
        "password":"password"
    }'

    curl --request POST \
    --url https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/sign-in \
    --header 'Content-Type: application/json' \
    --data '{
    "login":"TestPhotographerOne",
    "password":"Passw0rd!!!"
    }'

## Create Album

    https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/albums

    Required JSON Body:
    {
        "title": "Test",
        "location": "SomeLocation",
        "dataPicker": "SomePhotographer"
    }

    curl --request POST \
    --url https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/albums \
    --header 'Authorization: JWT-AUTH-TOKEN' \
    --header 'Content-Type: application/json' \
    --data '{
     "title": "Test",
    "location": "SomeLocation",
    "dataPicker": "TestPhotographerOne"
    }'

## Get Album By Id

    https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/albums?id=UUID

    Required Query Param : id

    curl --request GET \
    --url 'https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/album?id=2' \
    --header 'Authorization: JWT-AUTH-TOKEN'

## Get All Albums

    https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/albums

    curl --request GET \
    --url https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/albums \
    --header 'Authorization: JWT-AUTH-Token'

## Upload Photos

    https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/photos

    -POST Request

    Required JSON Body:
    {
        "albumId":4,
        "photos": [
            {
                "name": "name.jpg",
                "type": "image/jpeg",
                "data": "<base64-encoded-image-data>"
            },
            {
                "name": "name2.jpg",
                "type": "image/jpeg",
                "data": "<base64-encoded-image-data>"
            }
        ]

## Get Confirmation Code

    https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/user/getConfirmationCode

     Required JSON Body:
    {
        "phoneNumber":"+380999999999"
    }

    curl --request POST \
    --url https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/user/getConfirmationCode \
    --header 'Content-Type: application/json' \
    --data '{
        "phoneNumber":"+380999999999"
    }'

## Resend Code

    https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/user/resendCode

    Required JSON Body:
    {
        "phoneNumber":"+380999999999"
    }

    curl --request POST \

    --url https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/user/resendCode \
    --header 'Content-Type: application/json' \
    --data '{
    "phoneNumber":"+380999999999"
    }'

## Login Registration

    https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/users

     Required JSON Body:
    {
        "confirmationCode":"000000",
        "phoneNumber":"+380999999999"
    }

    curl --request POST \

    --url https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/user/login \
    --header 'Content-Type: application/json' \
    --data '{
    "confirmationCode":"480479",
    "phoneNumber":"+380999999999"
    }'

## Upload Selfie

    https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/user/selfie

    Required JSON body:
    {
        "name": "selfie1.jpg",
        "type": "image/jpeg",
        "data": "<base64-encoded-image-data>"
    }

    curl --request POST \

    --url https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/user/{id}/selfie \
    --header 'Authorization: JWT_AUTH_TOKEN' \
    --header 'Content-Type: application/json' \
    --data '{
        "name": "selfie1.jpg",
        "type": "image/jpeg",
        "data": "base64 string"
    }'

## Get All User Photos

    https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/photos


    curl --request GET \

--url https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/photos \
 --header 'Authorization: JWT_AUTH_TOKEN'
