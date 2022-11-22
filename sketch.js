let nextGen = []
let pop = null
let ranks = null
let best_route = null
best_route_fitness = 100000
best_route = []
let button
let genetic 
let start = false
let icon
//let bool_activities = [false, false, false, false, false] //[cycling swimming hiking fishing skiing]
let bool_activities = {'cycling':false, 'swimming':false, 'hiking':false, 'fishing':false, 'skiing':false}
let image_array = {}
let img
const bool_activities_keys = Object.keys(bool_activities)

function preload() {
	for(let i =0; i<bool_activities_keys.length; i++){
		img = loadImage('images/'+ bool_activities_keys[i]+'.png');
		image_array[bool_activities_keys[i]] = img
		//image_array_2[i] = img
		//console.log(image_array[bool_activities_keys[i]].width,image_array[bool_activities_keys[i]].height)
	}
	
  }

function setup() {
	let init_city_activity = {}
	createCanvas(650, 500);

	image(img, 100, 100);
	//icon.resize(0,25)
	city_array = []
	let number_of_cities = 32

	// for(let i=0; i<number_of_cities;i++){
	// 	city_array[i] = new City(Math.random()*600, Math.random()*450)
	// }

	// button = createButton('click me');
	// button.position(0, 0);
	// button.mousePressed(restart);
	for(let i=0; i<bool_activities_keys.length; i++){
		init_city_activity[Math.floor(Math.random()*16)] = bool_activities_keys[i]
	}
	
	let random_keys = Object.keys(init_city_activity)
	for(let i=0; i<number_of_cities;i++){
		//random_int = randomInteger(0,50)
		if(Object.keys(init_city_activity).includes(i.toString())){
			city_array[i] = new City(200*Math.cos(i*Math.PI/8)+300, 250+200*Math.sin(i*Math.PI/8),init_city_activity[i])
		}
		else{
			city_array[i] = new City(200*Math.cos(i*Math.PI/8)+300, 250+200*Math.sin(i*Math.PI/8),"")
		}

		
	}
	//nextGen = geneticAlgorithm(city_array, 100, 75, 0.01, 1000)
	// genetic = new Genetic(city_array, 500, 100, 0.001, 1)
	// genetic.init_population()

}

function start_evolve(){
	genetic = new Genetic(city_array, 500, 200, 0.001, 1)
	genetic.init_population()
	start = true
}


function draw() {

	background(200)
	noFill()
	frameRate(10);
	stroke(0,0,255)
	strokeWeight(3);
	//console.log(image_array['cycling'].width,image_array['cycling'].height)
	//image(image_array['cycling'], 300, 300);	
	add_image(city_array)

	if(start){
		
		beginShape();
		for(let i=0; i<city_array.length; i++){
			point(city_array[i].x,city_array[i].y)
		}
		stroke(0,255,0)
		point(500+5,250+5)
		point(100+5,250+5)
		point(300+5,450+5)
		point(300+5,50+5)
		point(484+5,326+5)
		point(115+5,326+5)
		genetic.breed_next_gen()
		nextGen = pop[0]

		dist = new Fitness(nextGen).routeDistance()
		// textSize(10);
		// text(dist.toString(), 400, 400);

		if(new Fitness(nextGen).routeDistance()<best_route_fitness){
			best_route = nextGen.slice()
			best_route_fitness = new Fitness(nextGen).routeDistance()


		}
		for (var i=0; i<best_route.length; i++){
			stroke('#d96174');
			vertex(best_route[i].x,best_route[i].y)
		}
		vertex(best_route[0].x, best_route[0].y)

		endShape();
		beginShape();
		strokeWeight(1);
		for (var i=0; i<nextGen.length; i++){
			stroke('#e9e3f3');
			vertex(nextGen[i].x,nextGen[i].y)
		}
		vertex(nextGen[0].x, nextGen[0].y)

		// textSize(16);
		// text(best_route_fitness.toString(), 100, 400);

		endShape();
	}
}


class Genetic{
	constructor(population, popSize, eliteSize, mutationRate, generations){
		this.population = population
		this.popSize = popSize
		this.eliteSize = eliteSize
		this.mutationRate = mutationRate
		this.generations = generations
	}

	init_population = function(){
		pop = initialPopulation(this.popSize, this.population)
		ranks = rankRoutes(pop)
		best_route = new Fitness(pop[ranks[0]]).routeDistance()
		console.log('Initial distance: '+ best_route)
	}

	breed_next_gen = function(){
		pop = nextGeneration(pop, this.eliteSize, this.mutationRate)
		let last_gen_best_route = new Fitness(pop[ranks[0]]).routeDistance()
		//console.log('Final distance: '+ last_gen_best_route)
	}
}

// function geneticAlgorithm(population, popSize, eliteSize, mutationRate, generations){
//     let pop = initialPopulation(popSize, population)
//     let ranks = rankRoutes(pop)
//     let best_route = new Fitness(pop[ranks[0]]).routeDistance()
//     console.log('Initial distance: '+ best_route)

//     for(let i=0; i<generations; i++){
//         pop = nextGeneration(pop, eliteSize, mutationRate)
//     }

//     ranks = rankRoutes(pop)
//     let last_gen_best_route = new Fitness(pop[ranks[0]]).routeDistance()
//     console.log('Final distance: '+ last_gen_best_route)
    

//     return pop[ranks[0]]
// }



function userInputs(btn_id){

    var property = document.getElementById(btn_id);

    if (bool_activities[btn_id]){
        property.style.backgroundColor =  "#6c757d"
        bool_activities[btn_id] = false      
    }
    else{
        property.style.backgroundColor = "#007bff"
        bool_activities[btn_id] = true
    }

}

function add_image(city_array){
	for(let i =0; i<city_array.length; i++){
		if(!city_array[i].activity==""){
			if(city_array[i].x<300){
				image(image_array[city_array[i].activity], city_array[i].x-30, city_array[i].y);
			}
			else{
				image(image_array[city_array[i].activity], city_array[i].x+30, city_array[i].y);
			}

		}
	}
}
