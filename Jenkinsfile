pipeline {
  agent {
    docker {
      image 'node:alpine' 
      args '-p 3000:3000' 
    }
  }
  stages {
    stage('Build') { 
      steps {
        sh 'npm install' 
      }
    }
    stage('Test') {
      steps {
        sh 'npm run lint'
        sh 'npm run test'
      }
    }
    stage('Storybook') {
      steps {
        sh 'npm run build-storybook'
      }
    }
  }
}
