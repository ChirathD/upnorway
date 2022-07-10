num_cities_to_visit = 15
user_liked_activities = ["cycling","swimming","hiking", "fishing", "skiing"]

class City{

    constructor(x,y,activity){
        this.x = x;
        this.y = y;
        this.activity = activity;
    }

    distance = function(city){
        this.xDist = abs(this.x-city.x);
        this.yDist = abs(this.y-city.y);
        return Math.sqrt(this.xDist**2 + this.yDist**2)
    }
}


let city_array_all = []
let number_of_cities = 16

for(let i=0; i<number_of_cities;i++){
    city_array_all[i] = new City(200*Math.cos(i*Math.PI/8)+300, 250+200*Math.sin(i*Math.PI/8))
}

class Fitness{
    constructor(route){
        this.route = route;
        this.distance = 0;
        this.fitness = 0;
        this.reward = 0;    
    }
    routeDistance = function(){

        this.pathDistance = 0
        //console.log(this.route)
        for (let i =0; i<this.route.length; i++){
            this.fromCity = this.route[i];
            this.toCity = null;

            if (i+1< this.route.length){
                this.toCity = this.route[i+1]
            }

            else {
                this.toCity = this.route[0]
            }

            this.pathDistance += this.fromCity.distance(this.toCity)
        }

        for (let i =0; i<this.route.length; i++){

            if(user_liked_activities.includes(this.route[i].activity)){
                this.reward += 800
            }
            //  if(this.route[i].x == 500 && this.route[i].y == 250){
            //     this.reward += 200
            // }
            // if(this.route[i].x == 100 && Math.floor(this.route[i].y) == 250){
            //     this.reward += 200
            // }
            // if(this.route[i].x == 300 && Math.floor(this.route[i].y) == 450){
            //     this.reward += 200
            // }
            // if(Math.floor(this.route[i].x) == 299 && Math.floor(this.route[i].y) == 50){
            //     this.reward += 200
            // }
            // if(Math.floor(this.route[i].x) == 484 && Math.floor(this.route[i].y) == 326){
            //     this.reward += 200
            // }
            // if(Math.floor(this.route[i].x) == 115 && Math.floor(this.route[i].y) == 326){
            //     this.reward += 200
            // }
         } 

        this.distance = this.pathDistance 

        return this.distance - this.reward
    }

    routeFitness = function(){
        this.fitness = 1/this.routeDistance()
        //console.log(this.fitness)
    }
}


function createRoute(cityList){
    route = cityList.sort(() => Math.random() - Math.random()).slice(0, cityList.length)
    //route = cityList.sort(() => Math.random() - Math.random()).slice(0, cityList.length - 2)
    //route.splice(0, 3)
    //route.pop()
    //console.log('route length '+ route.length)
    //console.log('route length splice')
    //console.log(route)
    
    return route
}

function initialPopulation(popSize, cityList){

    let population = []

    for (let i=0; i<popSize; i++){
        population[i] = createRoute(cityList)
    }

    return population
}

function rankRoutes(population){
    let fitnessResults = {}
    //console.log(population.length)
    for(let i=0; i<population.length; i++){
        //console.log("rankRoutes Ended")
        fitnessResults[i] = new Fitness(population[i]).routeDistance()

    }
    
    keysSorted = Object.keys(fitnessResults).sort(function(a,b){return fitnessResults[a]-fitnessResults[b]})
    
    return keysSorted
}


function selection(popRanked, eliteSize){
    let selectionResults = []
    for (let i=0; i<eliteSize; i++){
        selectionResults.push(popRanked[i])
    }

    for (let i=0; i<popRanked.length-eliteSize; i++){
        let random_pop = Math.round(Math.random() *(popRanked.length-1))
        selectionResults.push(popRanked[random_pop])

    }

    return selectionResults
}


function matingPool(population, selectionResults){
    
    let matingpool = []
    for(let i=0; i<selectionResults.length; i++){
        matingpool[i] = population[selectionResults[i]]
    }

    return matingpool
}


function breedPopulation(matingpool, eliteSize){
 
    let children = []

    for(let i=0; i<eliteSize; i++){
        children[i] = matingpool[i]
    }

    for(let i=0; i<matingpool.length-eliteSize; i++){
        child = breed(matingpool[i], matingpool[matingpool.length-i-1])
        children.push(child)
    }
    
    return children
}


function breed2(parent1, parent2){

    let childP1 = []
    let childP2 = []
    let geneLength = 0

    if(parent1.length > parent2.length){
        geneLength = parent2.length
    }
    else{
        geneLength = parent1.length
    }

    geneA = randomInteger(0,geneLength)
    geneB = randomInteger(0,geneLength)

    startGene = Math.min(geneA, geneB)
    endGene = Math.max(geneA, geneB)
    //console.log("breed started")
    for(let i=startGene; i<endGene;i++){
        childP1.push(parent1[i]) 
    }

    for(let i=0; i<parent2.length; i++){
        if(!childP1.includes(parent2[i])){
            childP2.push(parent2[i])
        }
    }
    //console.log(childP1.concat(childP2).length)
    //console.log(childP1)
    //console.log(childP2)
    return childP1.concat(childP2)
}


function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mutatePopulation(population, mutationRate){
    mutatedPop = []

    for(let i=0; i<population.length; i++){
        mutated = mutate(population[i], mutationRate)
        mutatedPop.push(mutated)
    }
    
    return mutatedPop
}


function mutate(individual, mutationRate){
    // console.log(individual)
    // console.log(individual.length)

    let mutate_individual = []

    for(let swap=0; swap<individual.length; swap++){

        if(Math.random()< mutationRate){
           let swapWith = int(parseInt(Math.random() * individual.length))
           city1 = individual[swap]
           city2 = individual[swapWith]
           
           individual[swap] = city2
           individual[swapWith] = city1

        }
    }

    random_city_order = []
    for(let i=0; i<city_array_all.length;i++){
        random_city_order[i] = randomInteger(0,city_array_all.length-1)
    }
    let break_count = 0 
    if(Math.random()< 0.01){
        for(let k=0; k<city_array_all.length; k++){
            if(!individual.includes(city_array_all[random_city_order[k]])){
                individual.push(city_array_all[random_city_order[k]])
                //console.log(city_array_all[random_city_order[k]])
                break_count += 1
            }    
            if(break_count>3){
                break
            }
        }  
    }

    // if(Math.random()< 0.5){
    //     console.log("mutate")
    //     mutate_length_start = randomInteger(0,individual.length)
    //     mutate_length_end = randomInteger(0,individual.length)
    
    //     for(let j=mutate_length_start; j<mutate_length_end; j++){
    //         mutate_individual.push(individual[j])
    //     }
    
    //     for(let k=0; k<city_array_all.length; k++){
    //         if(!mutate_individual.includes(city_array_all[k])){
    //             mutate_individual.push(city_array_all[k])
    //         }
    //         if(mutate_individual.length <= individual.length){
    //             break
    //         }
    //     }

    // }

    // if(mutate_individual.length === 0){
    //     mutate_individual = individual
    // }

    return individual
}


function nextGeneration(currentGen, eliteSize, mutationRate){
    let popRanked = rankRoutes(currentGen)
    let selectionResults = selection(popRanked, eliteSize)
    let matingpool = matingPool(currentGen, selectionResults)
    let children = breedPopulation(matingpool, eliteSize)
    let nextGeneration = mutatePopulation(children, mutationRate)
    return nextGeneration
}


function geneticAlgorithm(population, popSize, eliteSize, mutationRate, generations){
    let pop = initialPopulation(popSize, population)
    let ranks = rankRoutes(pop)
    let best_route = new Fitness(pop[ranks[0]]).routeDistance()
    console.log('Initial distance: '+ best_route)

    for(let i=0; i<generations; i++){
        pop = nextGeneration(pop, eliteSize, mutationRate)
    }

    ranks = rankRoutes(pop)
    let last_gen_best_route = new Fitness(pop[ranks[0]]).routeDistance()
    console.log('Final distance: '+ last_gen_best_route)
    

    return pop[ranks[0]]
}




// def geneticAlgorithm(population, popSize, eliteSize, mutationRate, generations):
//     pop = initialPopulation(popSize, population)
//     print("Initial distance: " + str(1 / rankRoutes(pop)[0][1]))
    
//     for i in range(0, generations):
//         pop = nextGeneration(pop, eliteSize, mutationRate)
    
//     print("Final distance: " + str(1 / rankRoutes(pop)[0][1]))
//     bestRouteIndex = rankRoutes(pop)[0][0]
//     bestRoute = pop[bestRouteIndex]
//     return bestRoute

///////////

function breed(parent1, parent2){

    let childP1 = []
    let childP2 = []
    let geneLength = 0

    if(parent1.length > parent2.length){
        geneLength = parent2.length
    }
    else{
        geneLength = parent1.length
    }

    parent_intersection = parent1.filter(value => parent2.includes(value))
    parent_1_fitness = new Fitness(parent1)
    parent_1_fitness_score = parent_1_fitness.routeDistance()
    parent_2_fitness = new Fitness(parent2)
    parent_2_fitness_score = parent_2_fitness.routeDistance()

    let minimum_distance = Math.min(parent_1_fitness.distance, parent_2_fitness.distance);

    //console.log(parent_1_fitness_score)
    //console.log("parent fitness "+parent_1_fitness.distance)

    geneA = randomInteger(0,geneLength)
    geneB = randomInteger(0,geneLength)

    startGene = Math.min(geneA, geneB)
    endGene = Math.max(geneA, geneB)
    //console.log("breed started")
    for(let i=startGene; i<endGene;i++){
        childP1.push(parent1[i]) 
    }
    


    if(false){
        for(let i=0; i<parent_intersection.length; i++){
            if(!childP1.includes(parent_intersection[i])){
                childP2.push(parent_intersection[i])
            }
        }
    }
    else{
        for(let i=0; i<parent2.length; i++){
            if(!childP1.includes(parent2[i])){
                childP2.push(parent2[i])
            }
        }
    }

    final_breed = childP1.concat(childP2)
    if(final_breed.length>0){
        final_breed.pop()
        final_breed.shift()
    }


    //console.log(childP1.concat(childP2).length)
    //console.log(childP1)
    //console.log(childP2)
    return final_breed //childP1.concat(childP2)
}



//////////