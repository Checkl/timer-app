HTTP_SERVER_PORT=$(jq -r '.http_server_port' config.json)
echo "Starting HTTP server on port $HTTP_SERVER_PORT"
python -m http.server $HTTP_SERVER_PORT