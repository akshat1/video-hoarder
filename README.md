# Video Hoarder

Video hoarder is a simple web-application front-end to youtube-dl, set up to download videos straight to your server instead of whatever machine you are currently using. Built _by_ a data-hoarder, _for_ data-hoarders.

Video Hoarder is meant to run on your home (or cloud) server, and be accessible from your phone as well as your computer. The design reflects this focus on mobile first usability.

![Screenshot on mobile device](./blob/master/screenshots/latest.png)

# Installation

## Docker (recommended)

Unless you are tinkering with the source code, you will want to use the docker image. Create a container by running 

```
docker run -p 4000:4000 -v ~/Downloads:/app/download --name video-hoarder simiacode/video-hoarder
```

The app listens on port 4000, and downloads to `/app/download` (inside the container). The example command given here binds it to port 80 and ~/Downloads on the host. You can bind these to a port and directory location of your choice.

Once the container is up, you can visit [localhost](http://localhost) to see video-hoarder in action.

### YouTube-dl Configuration

We configure youtube-dl by utilising the configuration file (/app/youtube-dl.conf inside the container). The default configuration is [here](https://github.com/akshat1/video-hoarder/blob/release/youtube-dl.conf). You can override this by mounting your own configuration file using the docker -v switch. For example, the previous example command will become

```
docker run -p 80:4000 -v ~/Downloads:/app/download -v ~/your-config-file.conf:/app/youtube-dl.conf --name video-hoarder video-hoarder
```

You can see all the configuration options over on the [youtube-dl website](https://github.com/ytdl-org/youtube-dl/blob/master/README.md#configuration).

## From source

If you want to change the source code, you will want to follow the following steps.

- clone this repo.
- `npm install`
- [install youtube-dl](https://ytdl-org.github.io/youtube-dl/download.html) and ffmpeg.
- `npm run dev`
- visit http://localhost:4000

# Bugs, questions, and feature requests.

Please log an issue at https://github.com/akshat1/video-hoarder/issues and label it as either "bug", "feature request", or "question".
