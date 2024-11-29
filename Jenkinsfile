@Library('jenkins-build-helpers') _
setupEnvironment(['business_unit': 'corp'])

def createTestingEnvironment() {
    return setupContainers([
        [
            'name': 'main',
            // WARNING: rename this to follow $username-testing-image
            'image': 'ike-docker-local.artifactory.internetbrands.com/corp/levelup-academy:main-repo-testing-image',
            'imagePullPolicy': 'Always',
            'env': [
                ['name': 'DB_HOST',       'value': 'localhost'],
                ['name': 'DB_CONNECTION', 'value': 'pgsql'],
                ['name': 'DB_DATABASE',   'value': 'testing'],
                ['name': 'DB_USERNAME',   'value': 'test'],
                ['name': 'DB_PASSWORD',   'value': 'password'],
                ['name': 'LOG_CHANNEL',   'value': 'single'],
                ['name': 'LOG_LEVEL',     'value': 'debug'],
            ],
            'resources': [
                'limits': [
                    'memory': '512Mi'
                ],
                'requests': [
                    'memory': '32Mi'
                ]
            ],
        ],
        [
           'name': 'pgsql',
           'image': 'postgres:16',
           'env': [
                ['name': 'PGPASSWORD',        'value': 'password'],
                ['name': 'POSTGRES_DB',       'value': 'testing'],
                ['name': 'POSTGRES_USER',     'value': 'test'],
                ['name': 'POSTGRES_PASSWORD', 'value': 'password'],
            ],
            'resources': [
                'limits': [
                    'memory': '512Mi'
                ],
                'requests': [
                    'memory': '32Mi'
                ]
            ],
        ]
   ])
}

pipeline {
    agent { kubernetes { yaml dockerContainerImageBuildAndPushPodManifest() } }

    options {
        gitLabConnection('IB Gitlab')
    }

    stages {
        stage('Build pipeline testing image') {
            agent {
                kubernetes {
                    yaml dockerContainerImageBuildAndPushPodManifest()
                }
            }
            steps {
                container('builder') {
                    dockerContainerImageBuildAndPush([
                        'docker_repo_host': 'ike-docker-local.artifactory.internetbrands.com',
                        'docker_repo_credential_id': 'artifactory-ike',
                        'dockerfile': './ci/Dockerfile',
                        'docker_image_name': 'levelup-academy',
                        'docker_image_tag': 'main-repo-testing-image' // WARNING: rename this to follow $username-testing-image
                    ])
                }
            }
        }

        stage('Run backend tests') {
            agent {
                kubernetes {
                    yaml createTestingEnvironment()
                }
            }
            post {
                success {
                    updateGitlabCommitStatus name: 'backend-tests', state: 'success'
                }
                failure {
                    updateGitlabCommitStatus name: 'backend-tests', state: 'failed'
                }
            }
            steps {
                container('main') {
                    sh 'cd /var/www/html && php artisan test --env=testing'
                }
            }
        }
    }
}
