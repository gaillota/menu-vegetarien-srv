# Quick start
```
# Create .env file
cp .env.example .env

# Fill in your Algolia keys

# Create containers
docker-compose up -d

# Install dependencies
yarn

# Build and watch
yarn build:watch

# Start server
yarn start:dev
```

## Connect to Rabbit
 - http://localhost:15673
 - guest:guest

## Connect to Redis (using TablePlus)
 - redis://admin:adminadmin@127.0.0.1:6380
 
# To-do list
 - Improve ingredient parsing (quantity, unit and label)