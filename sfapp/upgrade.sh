#!/bin/bash
cd `dirname $0`
sfctl application upload --path Wikiracer --show-progress
sfctl application provision --application-type-build-path Wikiracer
sfctl application upgrade --app-id fabric:/Wikiracer --app-version $1 --parameters "{}" --mode Monitored
cd -