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
    stage('Storybook') {
      steps {
        sh 'npm run build-storybook'
      }
    }
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
  }
}
