FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    nodejs \
    npm

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Enable Apache rewrite module
RUN a2enmod rewrite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application code FIRST (needed for artisan/composer scripts)
COPY . .

# 👉 COPY ENV FILE (IMPORTANT FIX)
COPY .env .env

# Ensure Laravel directories exist
RUN mkdir -p storage/framework/views \
    storage/framework/cache \
    storage/framework/sessions \
    storage/logs \
    bootstrap/cache

# Fix permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# Install PHP dependencies (avoid crashing artisan during install)
RUN composer install \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts

# Now safely run Laravel bootstrap tasks
RUN composer dump-autoload
RUN php artisan package:discover || true
RUN php artisan config:clear || true
RUN php artisan route:clear || true

# Install Node dependencies
RUN npm install

# Build frontend assets (Vite)
RUN npm run build

# Apache config
COPY apache-config.conf /etc/apache2/sites-available/000-default.conf

# Expose port
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]