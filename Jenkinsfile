pipeline {
    agent any

    parameters {
        choice(name: 'ENV', choices: ['dev', 'prod'], description: 'choose env to deploy to')
    }

    enviroment {
        DOCKER_REGISTRY = 'oogiya'
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/vim-flights-frontend:${params.ENV}"
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/vim-flights-backend:${params.ENV}"
        COMPOSE_FILE = "docker-compose.${params.ENV}.yml"
    }

    stages {
        stage('Checkout code') {
            steps {
                git branch: 'main', url: 'https://github.com/Oogiya/flights.git'
            }
        }

        stage('Build docker images') {
            steps {
                dir('frontend') {
                    sh 'docker build -f Dockerfile.${params.ENV} -t $FRONTEND_IMAGE .'
                }

                dir('backend') {
                    sh 'docker build -f Dockerfile.${params.ENV} -t $BACKEND_IMAGE .'
                }
            }
        }

        stage('Push docker images') {
            steps {
                sh 'docker push $FRONTEND_IMAGE'
                sh 'docker push $BACKEND_IMAGE'
            }
        }

        stage('deploy') {
            steps {
                sh "docker-compose -f $COMPOSE_FILE pull"
                sh "docker-compose -f $COMPOSE_FILE up -d"
            }
        }
    }
}
