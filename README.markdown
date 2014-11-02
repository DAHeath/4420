# Steps to Clustering Employees

1. Choose a characteristic that all employees they have (say, the projects that
they have worked on)
2. Make a query to the mongo database on this characteristic
3. Perform an affinity analysis on each employee against every other employee
based on the number of these characteristics that they share  
(i.e. if I have 10 projects and share 2 with you, my affinity to you is .2)
4. Calculate the distance between the affinities of each employee and employees
1 and 2  
(chosen arbitrarily)
5. Plot the employees against the distances (distance to employee 1 is x,
distance to employee 2 is y)
6. Cluster the employees by their lists of affinities  
(using k-means)
7. Color the points based on the clustering
8. Somehow output this as an html file with the drawings added
