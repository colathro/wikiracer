#!/bin/bash
env | grep _ >> /etc/environment
service ssh start
dotnet WebServer/WebServer.dll