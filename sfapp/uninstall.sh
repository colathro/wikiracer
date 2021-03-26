#!/bin/bash


sfctl application delete --application-id Wikiracer
sfctl application unprovision --application-type-name WikiracerType --application-type-version 1.0.0
sfctl store delete --content-path Wikiracer