import Controller from "./controller.js";
import Galaxy from "./galaxy.js";
import {buildShip} from "./ship/buildShip.js"

export default class Game {
    constructor(width, height, images, contexts){
		this.width = width;
        this.height = height;
        this.images = images;
		this.contexts = contexts;
        this.inputs; // Controller values
		this.drawnObjects = []; //stores objects that always need to be drawn and updated
		this.hiddenObjects = []; //stores objects that need to be update only
		this.delObjects = []; //Stores objects that need to be drawn and updated until deleted
		this.numShips; //Stores the number of ships that are rendered
		this.ships = []; //Array of ship objects
		this.galaxy; //Stores Galaxy Object
		this.solarSystem; //Stores Solar System Info
		this.watchShip; //Ship being watched
		this.watchShipName;

        // Animation Elements (UI uses these too)
        this.view = 0;
        this.frame = 0; // Increments
        this.paused = false; // If the whole game is paused
        this.unit; // Global Unit
        this.fpsInterval = 1000 / 60;
    }
    start(galaxyName, numShips, watchShipName) {
		this.numShips = numShips;
		this.watchShipName = watchShipName;
        this.inputs = new Controller(this); //controller created
		this.galaxy = new Galaxy(galaxyName); //Create galaxy
		this.solarSystem = this.galaxy.startingSolarSystem; //Starting solatsystem from galaxy
		this.newSolarSystem(this.solarSystem, numShips); //another version of start function basically
		this.delObjects.forEach((object) => object = null); //Clears deletable objects
		this.objects.forEach((object) => object = null)
    }
	newSolarSystem(solarSystemName, numShips){
		let startPosition = new Vector2(0,0); //start at centre for now
		if (numShips > 1){
			this.ships.push(...buildShip("all", startPosition, this)); //Build all ships for now
			//get watchship by name in this.ships list
		} else {
			this.ships.push(buildShip(this.watchShipName, startPosition, this)) //build a single ship
			this.watchShip = this.ships[0];
		}
		this.solarSystem = this.galaxy.getSolarSystem(solarSystemName); 
		this.delObjects = [...this.solarSystem.asteroids] //Asteroids get deleted
		this.drawnObjects = [...this.solarSystem.warpGates, ...this.solarSystem.planets] //Warpgates and planets get drawn
		this.hiddenObjects = [...this.asteroidLaunchers]; //Launchers are hidden
	}
    update () {
        let g = this;
        this.delObjects = this.delObjects.filter(this.deleter); //Removes objects no longer needed

        this.frame++;

        ["missiles", "objects", "thrusters", "ships", "items"].forEach((object) => {g.contexts[object].clearRect(0, 0, g.contexts[object].canvas.width, g.contexts[object].canvas.height);});

        /*testShip.simplePhysicsUpdate();
        testShip2.simplePhysicsUpdate();
        testShip3.simplePhysicsUpdate();
        drawOnScreen(testShip);
        drawOnScreen(testShip2);
        drawOnScreen(testShip3);*/

		[...this.drawnObjects, ...this.delObjects, ...this.hiddenObjects].forEach((object) => object.update());//Updates all objects
		


    }
    draw(){
        [...this.drawnObjects, ...this.delObjects].forEach(object => object.draw()); //Draws all drawn objects
    }
	deleter(sprite){ //Deletes objects from deletable array that aren't needed
		if(sprite.delete) return false;
		return true;
	}
	collide(obj1, obj2){
		/* Physics and collision detection function for 
		detemining the collision between every relevant set
		of objects
		*/
	}
}