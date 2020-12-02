# TL;DR

## Docker compose file 

Once we are done with this tutorial, we will have something similar `docker-compose.yml` file we can use in most laravel projects. 

```yaml
version: '3'

services:

  web:
    image: akkica/laravel-web
    volumes:
      - .:/var/www/html
    ports:
      - 80:80

  worker:
    image: akkica/laravel-horizon
    volumes:
      - .:/var/www/html
    depends_on:
      - redis

  cron:
    image: akkica/laravel-cron
    volumes:
      - .:/var/www/html

  db:
    image: mysql:8
    volumes:
      - db:/var/lib/mysql
    environment:
      MYSQL_DATABASE: laravel
      MYSQL_ROOT_PASSWORD: root

  redis:
    image: redis
    volumes:
      - redis:/data

volumes:
  db:
  redis:
```

**web Container**

**worker Container**

**cron Container**

**db Container**

**redis Container**


## GitHub repository

You can find the GitHub repository with all the laravel docker images created in this tutorial.

[http://github.com/akki-io/laravel-docker](http://github.com/akki-io/laravel-docker)

## Demo Laravel repository

You can find the default Laravel app with our `docker-compose.yml` that we can tinker around with.

[http://github.com/akki-io/demo-laravel-docker](http://github.com/akki-io/demo-laravel-docker) 
