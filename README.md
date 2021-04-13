# Pathfinding

— By Amory Rouault —

### Introduction

---

Do something I thought was impossible.

For more information, visit my website https://amoryrouault.com/

Play now : https://pathfinding.amoryrouault.com/

### How to contribute

---

If you want to contribute and add a pathfinding algorithm, you must follow those rules.

- Go to 'src/app/services/pathfinding.service.ts'

    This is where you write all the logic.

    You must create a function following the template :

    ```tsx
    // ----------------------------------------------------------------------
    // @ PathfindingName methods
    // ----------------------------------------------------------------------

    private startPathfindingName(grid: Grid) : PathfindingResponse {
    	/* SETUP */
    	var visitedCells: Point[] = [];
    	var solutionCells: Point[] = [];
    	// Setup your algorithm here ...

    	/* ALGORITHM LOOP */
    	// Loop through your algorithm here

    	// IF FOUND SOLUTION
    	return new PathfindingResponse(visitedCells, solutionCells);
    	// ELSE
    	return new PathfindingResponse(visitedCells, []);
    }
    ```

    You can create all the functions you want. Make sur they are private.

    If you need models, create them here : 'src/app/models/algorithm-name/...'.

- Add your case for the start(grid: Grid) method in 'pathfinding.service.ts'.
- Go to 'src/app/models/algorithm.ts'
    1. Add your algorithm in AvailableAlgorithmType
    2. Create your algorithm in AvailableAlgorithm by giving a title, a description and a type. Make sur the description is not too long.

### Test configuration

---

Development 

- Angular 8

Tested browsers

- Firefox, Chrome and Safari
- Safari mobile (You can't use this app on mobile)

### Start the project

---

```bash
$ npm install
$ npm start | ng serve
```
