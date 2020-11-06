---
title: Travis CI - Running Tests on MySQL 8.0.X on Ubuntu Xenial
path: /blog/travis-ci-running-tests-on-mysql-8-0-x-on-ubuntu-xenial
date: 2019-03-25
tags: ['TESTING', 'TRAVIS CI']
featureImage: ./images/shutterstock_1126861181-min.jpg
---

## Who is this article for?

Anyone looking for how to install MySQL 8.0.X on Travis CI with Ubuntu Xenial.

This article would be very brief and should not take more than 1 min to upgrade MySQL 5.7.X to MySQL 8.0.X.

## Before You Begin

If you are using Docker this particular article is not for you, I will be doing another post which will show how you use different containers inside Docker with Travis CI.

I am going to assume we are directly upgrading the MySQL and running the tests.

## Step 1 - Upgrade to MySQL 8.0.X

```bash
wget https://repo.mysql.com//mysql-apt-config_0.8.10-1_all.deb
sudo dpkg -i mysql-apt-config_0.8.10-1_all.deb
sudo apt-get update -q
sudo apt-get install -q -y --allow-unauthenticated -o Dpkg::Options::=--force-confnew mysql-server
```

## Step 2 - Restart the SQL Server

```bash
sudo systemctl restart mysql
```

## Step 3 - Complete the upgrade

```bash
sudo mysql_upgrade
```

## Step 4 - Verify the installed version

```bash
mysql --version
```

## Sample Travis yml file

```yaml
dist: xenial

sudo: true

language: php

services:
  - mysql

php:
  - "7.2"

before_script:
  - wget https://repo.mysql.com//mysql-apt-config_0.8.10-1_all.deb
  - sudo dpkg -i mysql-apt-config_0.8.10-1_all.deb
  - sudo apt-get update -q
  - sudo apt-get install -q -y --allow-unauthenticated -o Dpkg::Options::=--force-confnew mysql-server
  - sudo systemctl restart mysql
  - sudo mysql_upgrade
  - mysql --version  

script:
  - ./vendor/bin/phpunit
```

## Conclusion

Upgrading MySQL using this technique works as expected if you are not using Docker.

It is a good practice to test your code before upgrading the SQL version on your production instance.

I did posted the same question in the travis community - [https://travis-ci.community/t/how-can-i-use-mysql-8-0-on-xenial-distribution-currently-it-says-5-7/2728?u=akki-io](https://travis-ci.community/t/how-can-i-use-mysql-8-0-on-xenial-distribution-currently-it-says-5-7/2728?u=akki-io)
