pipeline{
    agent any

    stages{
        stage('Checkout') {
            steps {
                // 檢查源碼庫到 workspace
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], userRemoteConfigs: [[url: 'https://github.com/les269/my-anime-service.git']]])
            }
        }

        stage('init') {
            steps {
                sh  'npm install'
            }
        }

        stage('Build') {
            steps {
                sh  'npm run build:docker'
            }
        }

        stage('Test') {
            steps {
                sh  'npm run test'
            }
        }

        stage('Deploy') {
            steps {
                script{
                    def rmContainer = sh script: 'docker rm my-anime-list-container', returnStatus: true
                    def rmImage = sh script: 'docker image rm my-anime-list', returnStatus: true
                    sh 'docker build -t my-anime-list .'
                    sh 'docker run -d -p 8092:8080 --name my-anime-list-container my-anime-list'
                }
            }
        }
    }
}