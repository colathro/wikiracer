#!/bin/bash
DIR=`dirname $0`

dotnet restore $DIR/../src/Web/Web.csproj -s https://api.nuget.org/v3/index.json
dotnet build $DIR/../src/Web/Web.csproj -v normal

cd `dirname $DIR/../src/Web/Web.csproj`
dotnet publish -o ../../infra/out
cd -