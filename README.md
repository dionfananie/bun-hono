# Spec API

### User API Spec

Endpoint: POST /api/users

#### Request Body:

```json
{
    "username":string,
    "password": string,
    "name": string
}

```

#### Response Body Success:

```json
{
    "data":{
        "username": string,
        "name": string
    }
}
```

#### Response Body Failed:

```json
{
    "errors": string
}
```

### Login User Spec

Endpoint: POST /api/users/Login

#### Request Body:

```json
{
    "username":string,
    "password": string,
}
```

#### Response Body (success):

```json
{
    "data":{
        "username":string,
        "name":string,
        "token":string
    }
}
```

### Get User

Endpoint: GET /api/users/current

#### Request Header:

- Authorization: token

#### Response Body (success):

```json
{
    "data":{
        "username":string,
        "name":string,
    }
}
```

### Update user

Endpoint: PATCH /api/users/current

#### Request Header:

- Authorization: token

#### Request Body:

```json
{
    "name":string,
    "password": string,
}
```

#### Response Body (success):

```json
{
    "data":{
      "success": boolean
    }
}
```

### Logout user

Endpoint: DELETE /api/users/current

#### Request Header:

- Authorization: token

#### Response Body (success):

```json
{
    "data":{
      "success": boolean
    }
}
```

# Contact API Spec

### Create Contact

Endpoint : POST /api/contacts

Request Header:

- Authorization: token

Request Body

```json
{
    "first_name":string,
    "last_name": string,
    "email": string,
    "phone":string
}
```

Response Body Success

```json
{
    "data":{
        "id": number,
        "first_name":string,
        "last_name": string,
        "email": string,
        "phone":string
    }
}
```

Response Body Failed
`json `

### Get Contact

Endpoint : GET /api/contacts/{id}

Request Header:

- Authorization: token

Response Body Success

```json
{
    "data":{
        "id": number,
        "first_name":string,
        "last_name": string,
        "email": string,
        "phone":string
    }
}
```

### Update Contact

Endpoint : PUT /api/contacts/{id}

Request Header:

- Authorization: token

Request Body

```json
{
    "first_name":string,
    "last_name": string,
    "email": string,
    "phone":string
}
```

Response Body Success

```json
{
    "data":{
        "id": number,
        "first_name":string,
        "last_name": string,
        "email": string,
        "phone":string
    }
}

```

### Remove Contact

Endpoint : DELETE /api/contacts/{id}

Request Header:

- Authorization: token

Response Body Success

```json
{
    "data"{
        "success": boolean
    }
}
```

### Search Contact

Endpoint : GET /api/contacts

Request Header:

- Authorization: token
  Query Parameter:
- name: string (first or last name)
- email: string
- phone: string
- page: number, default 1
- size: number, default 10

Response Body Success

```json
{
    "data":[
        {
            "id": number,
            "first_name":string,
            "last_name": string,
            "email": string,
            "phone":string
        }
    ],
    "paging":{
        "current_page": number,
        "total_page": number,
        "size": number
    }
}

```

# Address API Spec

## Create Address

Endpoint : POST /api/contacts/{idContact}/addresses

Request Header :

- Authorization : token

Request Body :

```json
{
  "street": string,
  "city": string,
  "province": string,
  "country": string,
  "postal_code": string
}
```

Response Body :

```json
{
  "data": {
    "id": number,
    "street": string,
    "city": string,
    "province": string,
    "country": string,
    "postal_code": string
  }
}
```

## Get Address

Endpoint : GET /api/contacts/{idContact}/addresses/{idAddress}

Request Header :

- Authorization : token

Response Body :

```json
{
  "data": {
    "id": number,
    "street": string,
    "city": string,
    "province": string,
    "country": string,
    "postal_code": string
  }
}
```

## Update Address

Endpoint : PUT /api/contacts/{idContact}/addresses/{idAddress}

Request Header :

- Authorization : token

Request Body :

```json
{
  "street": string,
  "city": string,
  "province": string,
  "country": string,
  "postal_code": string
}
```

Response Body :

```json
{
  "data": {
    "id": number,
    "street": string,
    "city": string,
    "province": string,
    "country": string,
    "postal_code": string
  }
}
```

## Remove Address

Endpoint : DELETE /api/contacts/{idContact}/addresses/{idAddress}

Request Header :

- Authorization : token

Response Body :

```json
{
  "data": true
}
```

## List Address

Endpoint : GET /api/contacts/{idContact}/addresses

Request Header :

- Authorization : token

Response Body :

```json
{
  "data": [
    {
      "id": number,
      "street": string,
      "city": string,
      "province": string,
      "country": string,
      "postal_code": string
    },
    {
      "id": 2,
      "street": string,
      "city": string,
      "province": string,
      "country": string,
      "postal_code": string
    }
  ]
}
```
