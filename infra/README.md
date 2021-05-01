# how to debug the app:

f5 Web in src

# how to deploy our app to prod:

## step 1:

run ./build.sh to publish the app to the out directory here.

## step 1.5:

set the environment variable

## step 2:

docker build --build-arg COSMOS_KEY=$COSMOS_KEY --build-arg STORAGE_KEY=$STORAGE_KEY -t wikiracer.azurecr.io/wikiracer:latest .

## step 2.5:

test container image

## step 3:

docker login wikiracer.azurecr.io

find credentials on acr resource in wikiracer resourcegroup
