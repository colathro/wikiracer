# wikiracer

## prereqs testing sf:

- you need docker: https://dotnet.microsoft.com/download/dotnet/5.0
- docker run -itd -p 80:80 --name test web:latest

## prereqs for local dev:

- you need .net 5. [net5.0](https://dotnet.microsoft.com/download/dotnet/5.0)

## local dev:

- f5 in vscode (./.vscode defines how debugging is launched)

## test sf local dev:

- build and publish app to directory for uploading to sf ./sfapp/build.sh
- install app to local sf cluster ./sfapp/install.sh
- remove app from local sf cluster ./sfapp/uninstall.sh
