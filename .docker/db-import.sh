
source ../.env

echo "Starting Docker Compose..."
docker-compose down -v
docker-compose up -d

echo "Waiting for MongoDB to start..."
sleep 5

container_status=$(docker inspect -f '{{.State.Running}}' mongo_db)

mongo_user="${MONGODB_USER:-root}"
mongo_password="${MONGODB_PASSWORD:-P@ssw0rd}"
mongo_database="${MONGODB_DATABASE:-bookstore}"
mongo_collection_books="${MONGODB_COLLECTION_BOOKS:-books}"

if [ "$container_status" == "true" ]; then
  echo "MongoDB container is running. Proceeding with mongoimport..."

  docker exec -i mongo_db mongoimport \
  --username "$mongo_user" \
  --password "$mongo_password" \
  --authenticationDatabase admin \
  --db "$mongo_database" \
  --collection "$mongo_collection_books" \
  --file /docker-entrypoint-initdb.d/books.json \
  --jsonArray


  echo "Data import completed."
else
  echo "MongoDB container is not running. Exiting."
fi
