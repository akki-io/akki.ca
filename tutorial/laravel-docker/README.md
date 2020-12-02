# Laravel Docker 

## Introduction

> In this tutorial, we are going to dockerize our laravel application. We will keep things very simple, and we can use the final product as a drop-in solution for any laravel project.

>This tutorial does not cover everything PHP-specific that an application might need. It provides a foundation for running your laravel project on Docker.

## Why Docker?

In my opinion, it is ideal to have a  local development environment that is as close to the production environment. 

You can run the app to any other system where Docker is running without much overhead. It lets us efficiently run local services that are specific to the project and do not need to be installed globally. 

There are many other advantages like performance, isolation, scalability, agility, etc. Here are a few articles that might interest you.
- [Top 10 Benefits of Docker](https://dzone.com/articles/top-10-benefits-of-using-docker)
- [Docker: Top 7 Benefits of Containerization](https://hentsu.com/docker-containers-top-7-benefits/)
- [Benefits of Using Docker](https://www.microfocus.com/documentation/enterprise-developer/ed40/ES-WIN/GUID-F5BDACC7-6F0E-4EBB-9F62-E0046D8CCF1B.html)

## Prerequisites

You should have basic knowledge about docker. 

This tutorial requires [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your system.
