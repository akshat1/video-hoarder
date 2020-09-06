# Video Hoarder

Video hoarder is a simple web-application front-end to youtube-dl, set up to download videos straight to your server instead of whatever machine you are currently using. Built _by_ a data-hoarder, _for_ data-hoarders.

Video Hoarder is meant to run on your home (or cloud) server, and be accessible from your phone as well as your computer. The design reflects this focus on mobile first usability.

# Installation

Note: This is a work in progress. Currently, **the stable version is not recommended for use**. The release candidate is available on dockerhub as 0.1.0-rc1.

## For users - Docker (recommended)

Follow the instructions provided at https://github.com/akshat1/video-hoarder-example.

## For developers - From source

If you want to change the source code, you will want to follow the following steps. Also note, the currently active branch is [task--rewrite](https://github.com/akshat1/video-hoarder/tree/task--rewrite). The main branch will be updated with these changes once the release candidate reaches an acceptable level of feature completion.

- clone this repo.
- `npm install`
- [install youtube-dl](https://ytdl-org.github.io/youtube-dl/download.html) and ffmpeg.
- `npm run dev`
- visit http://localhost:4000

# Bugs, questions, and feature requests

Please log an issue at https://github.com/akshat1/video-hoarder/issues and label it as either "bug", "feature request", or "question".

# Updates and announcements

Visit us at https://www.reddit.com/r/VideoHoarderApp for updates and announcements.
