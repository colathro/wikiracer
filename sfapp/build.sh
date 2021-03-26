#!/bin/bash
DIR=`dirname $0`
source $DIR/dotnet-include.sh

dotnet restore $DIR/../src/Wikiracer/Web/Web.csproj -s https://api.nuget.org/v3/index.json
dotnet build $DIR/../src/Wikiracer/Web/Web.csproj -v normal

cd `dirname $DIR/../src/Wikiracer/Web/Web.csproj`
dotnet publish -o ../../../sfapp/Wikiracer/WebPkg/Code
cd -
