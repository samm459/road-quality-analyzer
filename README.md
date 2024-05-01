# Road Quality Analyzer

This application can accept images of roads, and return a rating according to the Asphalt PASER Manual.

## Get started

To try out the application locally, do the following:

#### 1. Add a .env file

Copy the .env.example into a .env file and replace the example variables with your environment configuration.

#### 2. Run the test suite

Run `yarn test` to validate your setup.

#### 2. Start the server

Run `yarn start` to spin up the server on localhost:3000.

#### 3. Create a request

Send a POST request to http://localhost:3000/api/analysis. Your request body should contain JSON following this schema:

```typescript
export interface POSTAnalysisRequestBody {
  imageUrl: string;
}
```

You may add any valid image url into your request for analysis so long as it is publicly available.

#### 4. Review the result

The response body will contain JSON following this schema:

```typescript
export interface Analysis {
  valid_image: boolean;
  rating: number;
  ravelling: "none" | "mild" | "moderate" | "severe";
  flushing: "none" | "mild" | "moderate" | "severe";
  polishing: "none" | "mild" | "moderate" | "severe";
  rutting: "none" | "mild" | "moderate" | "severe";
  distortion: "none" | "mild" | "moderate" | "severe";
  rippling: "none" | "mild" | "moderate" | "severe";
  shoving: "none" | "mild" | "moderate" | "severe";
  settling: "none" | "mild" | "moderate" | "severe";
  frost_heave: "none" | "mild" | "moderate" | "severe";
  transverse_cracks: "none" | "mild" | "moderate" | "severe";
  reflection_cracks: "none" | "mild" | "moderate" | "severe";
  slippage_cracks: "none" | "mild" | "moderate" | "severe";
  longitudinal_cracks: "none" | "mild" | "moderate" | "severe";
  block_cracking: "none" | "mild" | "moderate" | "severe";
  alligator_cracking: "none" | "mild" | "moderate" | "severe";
  patches: "none" | "mild" | "moderate" | "severe";
  potholes: "none" | "mild" | "moderate" | "severe";
  reasoning: string;
}
```
