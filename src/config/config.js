const config = {
  production: {
    secret: process.env.secret,
    MONGO_URI: process.env.MONGO_URI,
    port: process.env.PORT,
    "cos": {
      "credentials": {
        "endpoints": "https://cos-service.bluemix.net/endpoints",
        "iam_apikey_description": "Auto generated apikey during resource-key operation for Instance - crn:v1:bluemix:public:cloud-object-storage:global:a/dccc8b1a86894e0935e13e15e1301b29:344046a2-e604-476c-8ca5-ae92258f1dc1::",
        "iam_apikey_name": "auto-generated-apikey-f038e3d4-6767-4873-8d5a-7c2e23f603ea",
        "iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Writer",
        "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/dccc8b1a86894e0935e13e15e1301b29::serviceid:ServiceId-1f3b1a99-6f56-408b-874b-c19489275bc4",
        "serviceInstanceId": "crn:v1:bluemix:public:cloud-object-storage:global:a/dccc8b1a86894e0935e13e15e1301b29:344046a2-e604-476c-8ca5-ae92258f1dc1::",

        "endpoint": "https://s3.ap-geo.objectstorage.softlayer.net",
        "apiKeyId": "FwhHQl47NIdSQ_GdlCLDMKqEC6Rh7LacMgIjt4eQDckG",
        "ibmAuthEndpoint": "https://iam.ng.bluemix.net/oidc/token",
        "region": "ap-geo",
        "maxRetries": 3000,
        "correctClockSkew": true
      },
      "bucketName": "311-storage"
    },
    "mail": {
      "host": "smtp.gmail.com",
      "port": 587,
      "secure": false,
      "auth": {
        "user": "manager.tradar@gmail.com",
        "pass": "thinklabs@36"
      }
    },
    host_admin: 'https://311-admin.mybluemix.net',
    host_citizen: 'https://311-web.mybluemix.net',
    mail_mailgun: {
      "auth": {
        "api_key": "e1d4c20fa30e05a4cbc5c9435dc598f6-b892f62e-5d7832d3",
        "domain": "sandboxd48b21c0aea74e508097ca22c1ac3ad7.mailgun.org"
      }
    }
  },
  development: {
    secret: 'I_AME_GERER',
    MONGO_URI: 'mongodb://admin:CMOMOVHGGLFYIBJU@portal-ssl1647-5.bmix-dal-yp-8cc09354-2455-4562-94f2-811d131cceee.765003968.composedb.com:61848,portal-ssl1069-37.bmix-dal-yp-8cc09354-2455-4562-94f2-811d131cceee.765003968.composedb.com:61848/compose?authSource=admin&ssl=true',
    port: 37922,
    "cos": {
      "credentials": {
        "endpoints": "https://cos-service.bluemix.net/endpoints",
        "iam_apikey_description": "Auto generated apikey during resource-key operation for Instance - crn:v1:bluemix:public:cloud-object-storage:global:a/dccc8b1a86894e0935e13e15e1301b29:344046a2-e604-476c-8ca5-ae92258f1dc1::",
        "iam_apikey_name": "auto-generated-apikey-f038e3d4-6767-4873-8d5a-7c2e23f603ea",
        "iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Writer",
        "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/dccc8b1a86894e0935e13e15e1301b29::serviceid:ServiceId-1f3b1a99-6f56-408b-874b-c19489275bc4",
        "serviceInstanceId": "crn:v1:bluemix:public:cloud-object-storage:global:a/dccc8b1a86894e0935e13e15e1301b29:344046a2-e604-476c-8ca5-ae92258f1dc1::",
        "endpoint": "https://s3.ap-geo.objectstorage.softlayer.net",
        "apiKeyId": "FwhHQl47NIdSQ_GdlCLDMKqEC6Rh7LacMgIjt4eQDckG",
        "ibmAuthEndpoint": "https://iam.ng.bluemix.net/oidc/token",
        "region": "ap-geo",
        "maxRetries": 3000,
        "correctClockSkew": true
      },
      "bucketName": "311-storage"
    },
    "mail": {
      "host": "smtp.gmail.com",
      "port": 587,
      "secure": false,
      "auth": {
        "user": "manager.tradar@gmail.com",
        "pass": "thinklabs@36"
      }
    },
    host_admin: 'http://localhost:8080',
    host_citizen: 'http://localhost:8081',
    mail_mailgun: {
      "auth": {
        "api_key": "22c6ee1fde1b7cbc0b360ef9a8c7d6da-4836d8f5-76b43d5c",
        "domain": "thinklabs.vn"
      }
    }
  },
};

export const getConfig = env => config[env] || config.development;
