
#!/bin/bash

# Stop all Docker containers
docker stop $(docker ps -aq)

# Remove all Docker containers
docker rm -f $(docker ps -aq)

# Remove all Docker volumes
docker volume rm $(docker volume ls -q)

# Remove all Docker images
docker rmi -f $(docker images -q)