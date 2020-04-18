pipeline {
  agent {
    docker {
      image 'node:alpine' 
      args '-p 3000:3000' 
    }
  }
  stages {
    stage('Install') { 
      steps {
        sh 'npm install' 
      }
    }
    stage('Test') {
      steps {
        sh 'npm run lint'
        sh 'npm run test'
      }
      post {
        always {
          step([$class: 'CoberturaPublisher', coberturaReportFile: 'coverage/cobertura-coverage.xml'])
        }
      }
    }
    stage('Docs') {
      steps {
        sh 'npm run docs'
      }
      steps {
        sshPublisher(
          publishers: [
            sshPublisherDesc(
              configName: 'www',
              transfers: [
                sshTransfer(
                  cleanRemote: true,
                  excludes: '',
                  execCommand: '',
                  execTimeout: 120000,
                  flatten: false,
                  makeEmptyDirs: false,
                  noDefaultExcludes: false,
                  patternSeparator: '[, ]+',
                  remoteDirectory: '${JOB_NAME}',
                  remoteDirectorySDF: false,
                  removePrefix: 'docs/',
                  sourceFiles: 'docs/'
                )
              ],
              usePromotionTimestamp: false,
              useWorkspaceInPromotion: false,
              verbose: false
            )
          ]
        )
      }
    }
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
  }
}
