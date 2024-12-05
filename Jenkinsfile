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
                    sh 'npm install'
                }
            }
        }

        stage('Run frontend tests') {
            steps {
                dir('frontend') {
                    sh 'npm run test:ci'
                }
            }
        }

        stage('Install backend dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Run backend tests') {
            steps {
                dir('backend') {
                    sh 'npm run test:ci'
                }
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
