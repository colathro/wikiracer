FROM mcr.microsoft.com/service-fabric/onebox:u18

RUN apt-get update
RUN apt-get install -y apt-transport-https
RUN apt-get install -y aspnetcore-runtime-5.0

EXPOSE 19080 19000 80 443
WORKDIR /home/ClusterDeployer
CMD ["./ClusterDeployer.sh"]