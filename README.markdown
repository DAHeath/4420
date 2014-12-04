# Steps to Using Clustering Tool
1. Install [Node Package Manager](https://www.npmjs.org/)
2. Install [Node JS](http://www.nodejs.org/)
3. Install [Mongo](http://www.mongodb.org/)
4. Run command: npm install
5. Fill in config file:
    1. Specify database location
    2. Specify name of table
    3. Specify property to show as name of entity
    4. Specify properties to cluster by, and their weight
6. Run server: node src/main.js
7. Navigate to running server: localhost:3000
8. Specify different numbers of clusters: e.g. localhost:3000/5
