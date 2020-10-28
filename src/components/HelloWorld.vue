<template>
  <div class="hello">
    <div class="video" id="local"></div>
    <div class="video" id="remote"></div>
    <div class="video" id="console"></div>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-router" target="_blank" rel="noopener">router</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-vuex" target="_blank" rel="noopener">vuex</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
import AgoraRtcEngine from 'agora-electron-sdk'
import path from 'path'
import os from 'os'
// With shell.openExternal(url) is how
// external urls must be handled, not href
const shell = require('electron').shell
const APPID = "YOUR_AGORA_APP_ID"

export default {
    methods: {
        link: (url) => {
            shell.openExternal(url)
        }
    },
    mounted: function() {
        this.$nextTick(function () {
            // Code that will run only after the
            // entire view has been rendered
            if(global.rtcEngine) {
                global.rtcEngine.release()
                global.rtcEngine = null
            }
            if(!APPID) {
                alert('Please provide APPID in App.vue')
                return
            }
            const consoleContainer = document.querySelector('#console')
            let rtcEngine = new AgoraRtcEngine()
            rtcEngine.initialize(APPID)
            
            // listen to events
            rtcEngine.on('joinedChannel', (channel, uid, elapsed) => {
                consoleContainer.innerHTML = `join channel success ${channel} ${uid} ${elapsed}`
                let localVideoContainer = document.querySelector('#local')
                //setup render area for local user
                rtcEngine.setupLocalVideo(localVideoContainer)
            })
            rtcEngine.on('error', (err, msg) => {
            consoleContainer.innerHTML = `error: code ${err} - ${msg}`
            })
            rtcEngine.on('userJoined', (uid) => {
            //setup render area for joined user
            let remoteVideoContainer = document.querySelector('#remote')
            rtcEngine.setupViewContentMode(uid, 1);
            rtcEngine.subscribe(uid, remoteVideoContainer)
            })
            
            // set channel profile, 0: video call, 1: live broadcasting
            rtcEngine.setChannelProfile(1)
            rtcEngine.setClientRole(1)
            
            // enable video, call disableVideo() is you don't need video at all
            rtcEngine.enableVideo()
            
            const logpath = path.join(os.homedir(), 'agorasdk.log')
            // set where log file should be put for problem diagnostic
            rtcEngine.setLogFile(logpath)
            
            // join channel to rock!
            rtcEngine.joinChannel(null, "demoChannel", null, Math.floor(new Date().getTime() / 1000))
            global.rtcEngine = rtcEngine
        })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
