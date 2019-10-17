# Video Hoarder

Video hoarder is a simple web-application front-end to youtube-dl, set up to download videos straight to your server instead of whatever machine you are currently using. Built _by_ a data-hoarder, _for_ data-hoarders.

# Disclaimer

This project grew out of a weekend project, so at the moment things are not super polished. That being said, I will clean it up if we see any adoption.

# Screenshot (as of 12th October, 2019)
![screenshots taken on 12th October 2019](https://github.com/akshat1/video-hoarder/raw/master/screenshots/10_12_2019.png)

# Installation

## Docker (recommended)

Unless you are tinkering with the source code, you will want to use the docker image. Create a container by running 

```
docker run -p 80:4000 -v ~/Downloads:/app/download --name video-hoarder simiacode/video-hoarder
```

The app listens on port 4000, and downloads to `/app/download` (inside the container). The example command given here binds it to port 80 and ~/Downloads on the host. You can bind these to a port and directory location of your choice.

## From source

If you want to change the source code, you will want to follow the following steps.

- clone this repo.
- npm install.
- [install youtube-dl](https://ytdl-org.github.io/youtube-dl/download.html)
- npm run start.
- visit http://localhost:4000

# Bugs and questions

Please log an issue at https://github.com/akshat1/video-hoarder/issues and label it as either "bug", "feature request", or "question".
