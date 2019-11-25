const UI = function() {

    const zoomY = 200;
    const duration = 500;

    let video = null;
    let config = null;

    function init(_config) {

        config = _config;

        // Remove annoying draggable feature of browsers
        $("*").attr("draggable", "false");

        // Events
        addVideoEvents();
        addWebSocketEvents();
        initSubmit();
        addClickEvents();

    }

    function addWebSocketEvents() {

        const critical = () => {
            console.log("Critical error (unauthorized?)");
            // location.reload();
        }
        musicPlayer.addEventListener("critical", critical);
        broadcastMic.addEventListener("critical", critical);

        musicPlayer.addEventListener("closed", () => {
            $("#music").hide(duration);
        });
        broadcastMic.addEventListener("closed", () => {
            $("#toggleRecordBtn").hide(duration);
        });

        musicPlayer.addEventListener("listsongs", (msg) => {

            console.log(msg.songs);

            msg.songs.forEach(song => {
                $("#songs").append("<option id='" + msg.clientId +
                    "' value='" + song.id + "'>" + song.name + "</option>");
            });
        });

        musicPlayer.addEventListener("receivers", (receivers) => {
            if (receivers.length === 0)
                $("#music").hide(duration);
            else {
                $("#music").show(duration);
                $("#songs > option").each(function() {
                    if (receivers.filter(r => r.clientId === $(this).attr("id")).length === 0) {
                        $(this).remove();
                    }
                });
            }
        });

        broadcastMic.addEventListener("receivers", (receivers) => {
            if (receivers.length === 0)
                $("#toggleRecordBtn").hide(duration);
            else
                $("#toggleRecordBtn").show(duration);
        });

        musicPlayer.addEventListener("playing", () => {
            $("#togglePlaySongBtn").attr("src", "img/song-stop-icon.png");
        });

        musicPlayer.addEventListener("stopped", () => {
            $("#togglePlaySongBtn").attr("src", "img/song-play-icon.png");
        });

    }

    function addVideoEvents() {

        video = document.getElementById("video");
        video.volume = 1; // Max vol

        // Center horizontal scrollbar
        video.addEventListener('loadeddata', () => {

            // Center scroll
            $("html").scrollLeft($("#video").width() / 2 - $(window).width() / 2);

            // Mobile browsers might disallow autoplay, so show menu instead
            if (video.paused)
                $("#controls").css("display", "block");
        });

        // Toggle icons based on video events
        video.addEventListener("play", () => {
            $("#togglePlayBtn").attr("src", "img/video-pause-icon.svg");
        });

        video.addEventListener("pause", () => {
            $("#togglePlayBtn").attr("src", "img/video-play-icon.svg");
        });

        video.addEventListener("volumechange", () => {
            $("#toggleMuteBtn").attr("src", (video.muted) ?
                "img/mute-on-icon.svg" : "img/mute-off-icon.svg");
        });
    }

    function initSubmit() {
        // login form
        $("#login").submit(event => {
            event.preventDefault();
            login();
        });
        $("#token").keypress(function(e) {
            if (e.which == 13)
                $("#login").submit();
        });
    }

    function addClickEvents() {
        $("#toggleMenuBtn").click(toggleMenu);
        $("#toggleMuteBtn").click(toggleMute);
        $("#togglePlayBtn").click(togglePlay);
        $("#togglePlaySongBtn").click(togglePlaySong);
        $("#toggleRecordBtn").click(toggleRecord);
        $("#zoomInBtn").click(zoomIn);
        $("#zoomOutBtn").click(zoomOut);
    }

    function login() {

        $("#login").hide(duration);
        $("#content").show(duration);

        const token = $("#token").val();

        // Init JS libs
        janusPlayer.init({
            url: config.urls.janus,
            pin: token,
            elVideo: config.dom.video,
            elStreams: config.dom.streams
        });

        musicPlayer.init({
            url: config.urls.music,
            token: token
        });

        broadcastMic.init({
            url: config.urls.speaker,
            token: token,
            buffer: 4096
        });
    }

    function toggleMenu() {
        if ($("#controls").is(":hidden")) {
            $("#controls").show(duration);
        } else {
            $("#controls").hide(duration);
        }
    }

    function togglePlaySong() {
        if (!musicPlayer.isPlaying())
            musicPlayer.play($("#songs").find(":selected").val());
        else
            musicPlayer.stop();
    }

    function toggleRecord() {
        if (!broadcastMic.isRecording()) {
            broadcastMic.start();
            $("#toggleRecordBtn").attr("src", "img/record-stop-icon.png");
        } else {
            broadcastMic.stop();
            $("#toggleRecordBtn").attr("src", "img/record-icon.png");
        }
    }

    function toggleMute() {
        video.muted = (video.muted) ? false : true;
    }

    function togglePlay() {
        if (video.paused)
            video.play();
        else
            video.pause();
    }

    function zoomIn() {
        zoom(zoomY);
    }

    function zoomOut() {
        zoom(-zoomY);
    }

    function zoom(y) {
        let height = $("#video").height() + y;
        let top = 0;
        if (height < $(window).height())
            top = ($(window).height() / 2) - (height / 2);
        $("#video").css({ "top": top, "height": height });
    }

    return {
        init: init
    }
}();