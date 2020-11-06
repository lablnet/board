app="board"
docker build -t ${app} .
docker run --name ${app} -d -p 9090:9090 ${app}:latest
