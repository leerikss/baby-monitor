A Web based UI for the baby monitoring system built in React JS.

## Installation manually

1) Create a new file ".env" under [github repo]/server/webroot-react:
~~~terminal
REACT_APP_JANUS_SERVER_URL='https://[your.domain]:8089/janus'
REACT_APP_MUSIC_PLAYER_URL='wss://[your.domain]/music'
REACT_APP_SPEAKER_URL='wss://[your.domain]/speaker'
REACT_APP_TURN_SERVER_URL='turn:[your.domain]:3478?transport=udp'
~~~

2) Build
~~~terminal
cd [github repo]/server/webroot-react]
npm i
npm run build
~~~

3) Configure your WebServer root to point to:
~~~[git repo root]/server/webroot-react/build~~~

