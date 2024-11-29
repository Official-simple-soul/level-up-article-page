
# Start from an image somebody prepared as being good for testing PHP
FROM ike-docker-local.artifactory.internetbrands.com/ib/php-testing:8.3

# Also install Postgres driver because this is what we use on pipeline
RUN /build/php --version=8.3 php-pgsql

# Work in a common PHP directory
WORKDIR /var/www/html

# Install backend dependencies only
COPY composer.json composer.lock artisan ./
RUN composer install --prefer-dist --no-scripts

# Copy the rest of the files
COPY . ./

# Give user a chance to execute commands when container runs
CMD ["/bin/bash"]
