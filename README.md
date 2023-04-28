# Dockerr Headful Chrome
To build image:
```bash
git clone git@github.com:mihneamanolache/docker-headful-chrome.git
cd docker-headful-chrome 
docker build -t headful-chrome .
docker run -p 3000:3000 --restart always -d --name browserless headful-chrome
```

The project exposes 2 endpoints:

- `/chrome` which opens up a chrome and returns the socket address to connect to
- `/screeenshot?ulr=<URL>` to take a screenshot

Initial tests show that container is unstable, resetting quite often.

ToDo:
- [] Further test performance
- [] Expose socket for remote connectivity