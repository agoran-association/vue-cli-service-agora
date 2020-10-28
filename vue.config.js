module.exports = {
  publicPath: './',
  configureWebpack: {
    externals: {
      'agora-electron-sdk': 'commonjs2 agora-electron-sdk'
    },
    target: "electron-renderer",
  },
  pluginOptions: {
    electronBuilder: {
      externals: ['agora-electron-sdk'],
      builderOptions: {
        productName: 'Your ProduceName',
        appId: 'your.appId.forCodesign',
        copyright: 'Copyright ',
        directories: {
          output: 'dist_electron'
        },
        nsis: {
          oneClick: false,
          allowElevation: true,
          allowToChangeInstallationDirectory: true,
          // installerIcon: './public/app.ico',
          // uninstallerIcon: './public/app.ico',
          // installerHeaderIcon: './public/app.ico',
          // installerSidebar: './public/meeting.bmp',
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: 'Starry'
        },
        // publish: [
        //   {
        //     provider: 'generic',
        //     url: 'https://osscdn.czur.com/starryUpdate'
        //   }
        // ],
        dmg: {
          // title: 'Your demo dmg title',
          // icon: 'Your demo dmg icon',
          // background: 'Your demo dmg background',
          // contents: [
          //   { x: 533, y: 228, type: 'link', path: '/Applications' },
          //   { x: 200, y: 228, type: 'file'}
          // ]
        },
        mac: {
          "target": [
            "dmg",
            "zip"
          ],
          "icon": "icons/favicon.png",
          "entitlements": "entitlements.mac.plist",
          "category": "your.category",
          "hardenedRuntime": true,
          "extendInfo": {
            "NSMicrophoneUsageDescription": "AgoraEdu Classroom acquire your microphone permission",
            "NSCameraUsageDescription": "AgoraEdu Classroom acquire your camera permission"
          }
          // icon: './public/app.icns'
        },
        win: {
          // icon: './public/app.ico',
          // eslint-disable-next-line no-template-curly-in-string
          artifactName: '${productName}_setup_${version}.${ext}',
          target: [
            {
              target: 'nsis',
              arch: [
                'ia32'
              ]
            }
          ]
        }
      }
    }
  }
}