#!/bin/bash
DIR=`dirname $0`

dotnet restore $DIR/../src/WebServer/WebServer.csproj -s https://api.nuget.org/v3/index.json
dotnet build $DIR/../src/WebServer/WebServer.csproj -v normal

cd `dirname $DIR/../src/WebServer/WebServer.csproj`
dotnet publish -o ../../infra/out/WebServer
cd -