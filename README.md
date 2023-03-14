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

## Refresh Token for for photographers

    https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/refresh

    Required JSON Body:
    {
        "refreshToken":"JWT-REFRESH-TOKEN"
    }

    curl --request POST \
    --url https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/refresh \
    --header 'Authorization: JWT-AUTH-TOKEN' \
    --header 'Content-Type: application/json' \
    --data '{
    "refreshToken":"JWT-REFRESH-TOKEN"
    }'

## Create Album

    https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/album

    Required JSON Body:
    {
        "title": "Test",
        "location": "SomeLocation",
        "dataPicker": "SomePhotographer"
    }

    curl --request POST \
    --url https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/album \
    --header 'Authorization: JWT-AUTH-TOKEN' \
    --header 'Content-Type: application/json' \
    --data '{
     "title": "Test",
    "location": "SomeLocation",
    "dataPicker": "TestPhotographerOne"
    }'

## Get Album By Id

    https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/album?id=2

    Required Query Param : id

    curl --request GET \
    --url 'https://1fhuccr2jh.execute-api.us-east-1.amazonaws.com/dev/album?id=2' \
    --header 'Authorization: JWT-AUTH-TOKEN'

## Get All Photographer Albums

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
