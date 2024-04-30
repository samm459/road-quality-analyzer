# Road Quality Analyzer

This application can accept images of roads, and return a score according to the Asphalt PASER Manual.

## Get started

To try out the application locally, do the following:

#### 1. Add a .env file

Copy the .env.example into a .env file and replace the example variables with your environment configuration.

#### 2. Run the test suite

Run `yarn test` to validate your setup.

#### 2. Start the server

Run `yarn start` to spin up the server on localhost:3000.

#### 3. Create a request

Send a POST request to http://localhost:3000/api/analysis. Your request body should follow this schema:

```json
{
  "imageUrl": "https://www.ayresassociates.com/wp-content/uploads/2021/01/STH-47-Oneida-Co-ground_8562-Blog.jpg"
}
```

You may add any valid image url into your request for analysis so long as it is publicly available.

#### 4. Check out the response

The response will follow this schema:

```json
{
  "rating": 10
}
```
