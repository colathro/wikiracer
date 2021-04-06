FROM mcr.microsoft.com/dotnet/aspnet:5.0

WORKDIR app/

COPY --chown=myuser:myuser ../out/ .

EXPOSE 80 443

ENTRYPOINT dotnet Web.dll