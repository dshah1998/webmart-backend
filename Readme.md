For the Docker:

first, make sure you have docker installed in your system.

then run following commands

1) docker build -t webmart-api .

2) docker run -d -p 3333:3333 --name webmart-api webmart-api:latest