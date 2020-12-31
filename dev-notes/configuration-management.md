# Configuration management

## Problem statement

We want to
1. maintain multiple configurations for external tools (like youtube-dl).
2. have one of the configurations designated as default.
3. let the user optionally pick one of the configurations ad-hoc at the time of initiating a download.
4. let the user CRUD configurations from within the video-hoarder UI.
5. keep the configurations in a human readable format.
6. have some metadata (just name and target-tool for now) associated with each configuration.

## Solution

Because of requirement #5 (human readability), we are left only with the option of keeping text files (.conf, .yaml etc). We can create series of directories and keep the configuration files within them. For instance

```
- /app
  - /config
    - /common
      - /youtube-dl
        - default.conf
        - audio-only.conf
      - /some-other-tool
        - /default.conf
    - /user1
      - /youtube-dl
        - default.conf
        - flac.conf
      - /some-other-tool
        - /fancy.conf
    - /user2
      - /youtube-dl
        - custom-conf.conf

```

In this example we have
- two tools (youtube-dl and some-other-tool).
- two users (user1 and user2).
- two shared youtube-dl configs (default.conf and audio-only.conf) and one shared some-other-tool config (default.conf).
- user1 is overriding the default youtube-dl config, has one custom youtube-dl config (flac.conf), and one custom some-other-tool config (fancy.conf).
- user2 is not overriding any defaults, but does one have one custom config for youtube-dl.conf.

## Caveats
- We won't be able to store any metadata about the configs. We will use the name of the config as the file name, the target tool is in the directory path, but that's it.

## Notes
- Not every tool will have their configurations in `.conf` files.
- By default the UI only renders a textarea to edit configurations, but at some point in the future we might implement custom editors that simplify the config (so you don't have to learn the config syntax of the tool being used).
- At this moment, video-hoarder only supports youtube-dl. But in the wake of the recent youtube-dl DMCA incident, I have started building in avenues for migrating to (or simultaneously supporting) tools other than youtube-dl.
