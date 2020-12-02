# Base Image

The base image serves as the parent image. All our other PHP related images will be created. Refer to Architecture for more details.

To view the latest version of this image, refer to [https://github.com/akki-io/laravel-docker/tree/master/laravel-base](https://github.com/akki-io/laravel-docker/tree/master/laravel-base)

## Dockerfile

I am using php 7.4 for this example, but feel free to use a different PHP version. Minor changes to the Dockerfile might be required.

```yaml
FROM php:7.4-fpm-alpine

# update & install basic packages
RUN apk update \
    && apk add --no-cache \
        tini \
        libxml2-dev \
        openssl \
        procps \
        zlib-dev \
        libzip-dev \
        git \
        nodejs \
        npm

# install other php extension
RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    pcntl \
    posix \
    opcache \
    bcmath \
    zip \
    exif \
    sockets

# configure & install intl extension
RUN apk add icu \
        icu-dev \
        libintl \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl

# install composer
RUN mkdir -p /root/.composer \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && export COMPOSER_MEMORY_LIMIT=-1

# install redis
RUN apk add --no-cache --update --virtual .phpize-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .phpize-deps

# configure & install gd
RUN apk add --no-cache \
        openssl \
        libpng \
        libpng-dev \
        libjpeg-turbo \
        libwebp-dev \
        libjpeg-turbo-dev \
        freetype \
        freetype-dev \
        libxpm \
        libxpm-dev \
    &&  docker-php-ext-configure gd \
        --with-webp=/usr/include/ \
        --with-jpeg=/usr/include/ \
        --with-xpm=/usr/include/ \
        --with-freetype=/usr/include/ \
    && NPROC=$(grep -c ^processor /proc/cpuinfo 2>/dev/null || 1) \
    && docker-php-ext-install -j${NPROC} \
        gd

# install imagick
RUN apk add --no-cache --virtual \
        .phpize-deps $PHPIZE_DEPS \
        autoconf \
        g++ \
        libtool \
        make \
        pcre-dev \
        imagemagick-dev \
    && apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/community/ --allow-untrusted gnu-libiconv \
    && export CFLAGS="$PHP_CFLAGS" CPPFLAGS="$PHP_CPPFLAGS" LDFLAGS="$PHP_LDFLAGS" \
    && apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/community/ --allow-untrusted gnu-libiconv \
    && export CFLAGS="$PHP_CFLAGS" CPPFLAGS="$PHP_CPPFLAGS" LDFLAGS="$PHP_LDFLAGS" \
    && pecl install imagick-3.4.3 redis \
    && apk del \
        .phpize-deps \
        autoconf \
        g++ \
        libtool \
        make \
        pcre-dev \
    && rm -rf /var/cache/apk/* \
    && rm -rf /tmp/pear

# copy php.ini file
COPY ./php.ini "$PHP_INI_DIR/php.ini"
```

## PHP Configuration File

This is the `php.ini` file that consists the PHP configuration for your app. You can find the file at GitHub - [https://raw.githubusercontent.com/akki-io/laravel-docker/master/laravel-base/php.ini](https://raw.githubusercontent.com/akki-io/laravel-docker/master/laravel-base/php.ini)

You can customize the PHP configuration file as per your requirements.

## Building the Image

To build the image, we will use the docker build command and tag it accordingly.

```bash
docker build -t akkica/laravel-base:7.4 -t akkica/laravel-base:latest .
```

## Pushing to Docker hub

Once the build is successful, we will push our image to docker hub.

```bash
docker push akkica/laravel-base:7.4 && docker push akkica/laravel-base:latest
```
