pipeline {
    agent any

    parameters {
        choice(name: 'ENV', choices: ['dev', 'prod'], description: 'choose env to deploy to')
    }

    environment {
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

        stage('Install frontend dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Run frontend tests') {
            steps {
                dir('frontend') {
                    bat 'npm run test:ci'
                }
            }
        }

        stage('Install backend dependencies') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Build docker images') {
            steps {
                dir('frontend') {
                    bat 'docker build -f Dockerfile.${params.ENV} -t $FRONTEND_IMAGE .'
                }

                dir('backend') {
                    bat 'docker build -f Dockerfile.${params.ENV} -t $BACKEND_IMAGE .'
                }
            }
        }

        stage('Push docker images') {
            steps {
                bat 'docker push $FRONTEND_IMAGE'
                bat 'docker push $BACKEND_IMAGE'
            }
        }

        stage('deploy') {
            steps {
                bat "docker-compose -f $COMPOSE_FILE pull"
                bat "docker-compose -f $COMPOSE_FILE up -d"
            }
        }
    }

    post {
        always {
            echo 'pipeline completed'
        }
        success {
            echo 'pipeline succeeded'
        }
        failure {
            echo 'pipeline failed'
        }
    }
}
