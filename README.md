# Library app backend
This project was made by [Dmitriy Belyaikin](https://github.com/belyaikin) and [Danial Myrzatayev](https://github.com/DanialMyrzatayevMuratovich)
## Setting up
1. Download the repository
2. Run npm i
3. Set up environment variables:

PORT - Port to run the app in, default is 3000\
ENVIRONMENT - Development environment (dev/prod), default is dev\
MONGODB_URI - MongoDB connection uri\
FRONTEND_URL - URL of frontend\

BUCKET_STORAGE_URL - Bucket endpoint Url\
BUCKET_STORAGE_ACCESS_KEY - Bucket access key\
BUCKET_STORAGE_SECRET_KEY - Bucket secret key\
BUCKET_NAME - Bucket name

ACCESS_TOKEN_SECRET - Secret token for generating and verifying access tokens

1. Run with npm run dev
2. Build with npm run build and start with npm run start