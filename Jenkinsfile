pipeline{
    agent any
    // agent {
    //     node {
    //         label 'master'
    //         customWorkspace '/var/jenkins_home/workspace/myAnimeList'
    //     }
    // }

    options {
        // This is required if you want to clean before build
        skipDefaultCheckout(true)
        //customWorkspace '/home/workspace/myAnimeList'
    }

    stages{

        stage('Checkout') {
            steps {
                // 檢查源碼庫到 workspace
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], userRemoteConfigs: [[url: 'https://github.com/les269/my-anime-list.git']]])
            }
        }

        stage('init') {
            agent {
                docker {
                    image 'node:current-alpine3.17'
                    args '-v $HOME/.m2:/root/.m2'
                    // Run the container on the node specified at the
                    // top-level of the Pipeline, in the same workspace,
                    // rather than on a new node entirely:
                    reuseNode true
                }
            }
            steps {
                sh  'yarn install '
            }
        }

        stage('Build') {
            agent {
                docker {
                    image 'node:current-alpine3.17'
                    args '-v $HOME/.m2:/root/.m2'
                    // Run the container on the node specified at the
                    // top-level of the Pipeline, in the same workspace,
                    // rather than on a new node entirely:
                    reuseNode true
                }
            }
            steps {
                sh  'npm run build:docker'
            }
        }

        stage('Test') {
            agent {
                docker {
                    image 'node:current-alpine3.17'
                    args '-v $HOME/.m2:/root/.m2'
                    // Run the container on the node specified at the
                    // top-level of the Pipeline, in the same workspace,
                    // rather than on a new node entirely:
                    reuseNode true
                }
            }
            steps {
                sh  'npm run test'
            }
        }

        stage('Deploy') {
            steps {
                script{
                    def rmStopContainer = sh script: 'docker container stop my-anime-list-container', returnStatus: true
                    def rmContainer = sh script: 'docker container rm my-anime-list-container', returnStatus: true
                    def rmImage = sh script: 'docker image rm my-anime-list', returnStatus: true
                    sh 'docker build -t my-anime-list .'
                    sh 'docker run -d -p 8092:80 --name my-anime-list-container my-anime-list'
                }
            }
        }
        // stage('Clean Workspace') {
        //     steps {
        //         cleanWs()
        //     }
        // }
    }
}