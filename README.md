# W3ChallengeAPI
A Rest API made with Adonis.js for the W3 backend challenge, in wich a banking automation system will be implemented.

## 💻 Requirements

Before starting, make sure you've attended these requirements:
* You've installed the newest version of Docker.
* You've installed the newest version of Docker Compose.
* You've installed the newest version of Node.js (Minimum version required for Adonis 5: Node.js 14).

## 🚀 Installing
Firstly, you need to create an .env file using the .env.example located in the project's root, to update project configurations like database environment variables.

```
cp .env.example .env
```

Then, use this to install project dependencies:
```
npm install
```

To run the project, you need Adonis.js CLI in your system

```
npm i --global @adonisjs/cli
```

To use database services, Lucid is necessary
```
npm i @adonisjs/lucid
```

Finally, to create the docker images, you can use this command in the project's root
```
docker compose up
```
By the end of the images creation, hit CTRL+C to finalize the containers, you can also use:
```
docker compose stop
```


## ☕ Using the API

Have in mind that if you run the API through docker, there'll be no hot-reload (Application will not update in real time as the code in modified).So, while developing, it is more attractive to run the application outside the Docker container, with the command:
```
node ace serve --watch
```
And then, you can run only the database and pgadmin through Docker, the connection betweeen the application and the database is already configured in the ".env.example" file.

```
docker compose up postgres pgadmin -d
```

Now, about migrations:
- To create migrations:
```
node ace make:migration <table name>
```
- To populate the database with tables defined in the migrations:
```
node ace migration:run
```

## 🐘 Using PGAdmin to visualize data
Firstly, run the project and access the address:
```
localhost:5052
```
After that, you can follow those steps:
- Authenticate in pgadmin using the credentials contained in the "docke compose.yml" file.
- Right click in "servers", and select the "register" --> "server" option.
- In the "General" tab, just name the server as you like.
- In the "Connection" tab, you've to fill the "Host name/address", "Username" and "Password" fields with the informations contained in the "docker compose.yml" file. 
- Click in "Save".

By the end of this proccess, you should be able to visualize the database. Its tables can be found in "Schemas", if they exist. Also, it is possible to make PostgreSQL queries using the QuerieTool functionality.

[⬆ Back to top](#Adonis.js-API)