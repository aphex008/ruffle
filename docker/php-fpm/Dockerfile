FROM php:fpm-alpine

COPY wait-for-it.sh /usr/bin/wait-for-it

RUN chmod +x /usr/bin/wait-for-it

RUN apk --update --no-cache add git

RUN docker-php-ext-install pdo_mysql
RUN docker-php-ext-install pcntl
RUN docker-php-ext-install opcache
ADD opcache.ini "$PHP_INI_DIR/conf.d/opcache.ini"

COPY --from=composer /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

CMD mkdir -p var/cache var/log; \
    chmod 777 -R var; \
    composer install ; \
    wait-for-it database:3066 -- bin/console doctrine:migrations:migrate ; \
    composer dump-env prod ; \
    php-fpm

EXPOSE 9000
