let drawBoard = function (elementId, pop) {
    let population = pop.dna
    const width = 250;
    const height = 250;

    const dark_color = (pop.score == 0 ? "#8a8" : "#66f");
    const light_color = "#eee"



    // init
    var element = document.getElementById(elementId)
    var ctx = element.getContext("2d")
    const queenImage = document.getElementById("queen-img")

    // draw function
    let draw = function () {
        let pos_w = width / 8;
        let pos_h = height / 8;


        let drawPos = function (i, j) {
            ctx.beginPath();

            if (i % 2 == 0 && j % 2 == 0) {
                //ambos pares
                ctx.fillStyle = dark_color;
            } else if (i % 2 != 0 && j % 2 != 0) {
                //ambos impares
                ctx.fillStyle = dark_color;
            } else {
                //não concomitantes
                ctx.fillStyle = light_color;
            }

            ctx.fillRect((pos_w * (i - 1)), (pos_h * (j - 1)), pos_w, pos_h);

            ctx.stroke();
        }

        let drawQueen = function ({
            x,
            y
        }) {
            //console.log("drawing", x, y)
            let pos_w = width / 8;
            let pos_h = height / 8;
            ctx.drawImage(queenImage, (pos_w * (x - 1)), (pos_h * (y - 1)), pos_w, pos_h)
        }


        // desenha tabuleiro
        for (i = 1; i <= 8; i++) {
            for (j = 1; j <= 8; j++) {
                drawPos(i, j);
            }
        }

        // desenha rainhas
        for (let x = 0; x < 8; x++) {
            drawQueen({
                x: x,
                y: population[x]
            });
        }


    }

    draw();


}


var GeneticFactory = function () {
    // gera uma nova sequencia
    let _create = function () {
        let g = [1, 2, 3, 4, 5, 6, 7, 8]
        let _dna = []
        for (let i = 0; i < 8; i++) {
            let index = Math.floor(g.length * Math.random())
            _dna.push(g[index])
            g.splice(index, 1)
        }
        return _dna
    }

    // muta aleatóriamente uma sequencia
    let _mutate = function (_dna) {


        let positions = [1, 2, 3, 4, 5, 6, 7, 8]

        let index_a = Math.floor(positions.length * Math.random());
        positions.splice(index_a, 1);

        let index_b = Math.floor(positions.length * Math.random())
        positions.splice(index_b, 1)



        let a = _dna[index_a]
        let b = _dna[index_b]

        let child = _dna.slice();

        child[index_a] = b
        child[index_b] = a

        return {
            child: child,
            seed: [index_a, index_b]
        }
    }

    // cruza sequencias genéticas
    let _crossover = function (_dna, sample) {
        if (sample == undefined) {
            return _dna
        }
        let child = [1, 2, 3, 4, 5, 6, 7, 8]

        let sobra = []
        let sobra_index = []

        for (let i = 0; i < 8; i++) {
            if (_dna[i] == sample[i]) {
                child[i] = _dna[i];
                // console.log(`${_dna[i]} in ${i}`)
            } else {
                sobra.push(_dna[i])
                sobra_index.push(i)
            }
        }

        // console.log("sobra", sobra, "index", sobra_index)

        for (let j = 0; j < sobra_index.length; j++) {
            let index = sobra_index[j]
            let n = Math.floor(sobra.length * Math.random())
            let value = sobra[n]
            sobra.splice(n, 1)


            // console.log(`replacing in ${index} with value ${value}`)

            child[index] = value
        }
        return child;
    }

    let _score = function (_dna) {

        let inPos = function (_dna, x, y) {
            for (i = 0; i < _dna.length; i++) {
                if (_dna[x] == y) {
                    return true;
                }
            }
            return false;
        }

        //percorro todas as diagonais e conto quantas rainhas aparecem nessas diagonais
        let findDownDiagonal = function (pop, x, y) {
            let count = 0
            //console.log(`findDownDiagonal, x ${x}, y ${y}`);
            while (x <= 8 && y <= 8) {
                if (inPos(pop, x, y)) {
                    count++
                    //console.log(`achou ${x} ${y}, count ${count}`)
                }

                x++;
                y++;
            }
            return count
        }

        let findUptDiagonal = function (pop, x, y) {
            let count = 0
            //console.log(`findUptDiagonal, x ${x}, y ${y}`);
            while (x <= 8 && y >= 1) {
                if (inPos(pop, x, y)) {
                    count++
                    //console.log(`achou ${x} ${y}, count ${count}`)
                }
                x++;
                y--;
            }
            return count
        }

        //diagonais descendo da esquerda para direita
        let x = 1
        let score = 0
        for (let y = 1; y <= 8; y++) {
            let nInD = findDownDiagonal(_dna, x, y)
            if (nInD > 1) {
                score += nInD
            }
        }

        let y = 1;
        for (let x = 2; x <= 8; x++) {
            let nInD = findDownDiagonal(_dna, x, y)
            if (nInD > 1) {
                score += nInD
            }
        }

        //diagonais subindo da esquerda para direita
        x = 1
        for (let y = 8; y >= 1; y--) {
            let nInD = findUptDiagonal(_dna, x, y)
            if (nInD > 1) {
                score += nInD
            }
        }

        y = 8;
        for (let x = 2; x <= 8; x++) {
            let nInD = findUptDiagonal(_dna, x, y)
            if (nInD > 1) {
                score += nInD
            }
        }

        return score;
    }


    return {
        create: _create,
        mutate: _mutate,
        crossover: _crossover,
        score: _score,
    }

}


function test() {
    let gen = GeneticFactory()

    console.log("creating...");

    let geracao = []
    for (let i = 0; i < 8; i++) {
        let queen = gen.create()
        geracao.push(queen);
        console.log(`${i}\t`, queen);
    }

    console.log("mutating...");
    for (let i = 0; i < 8; i++) {
        let queen = geracao[i]
        let res = gen.mutate(queen)
        console.log(`Mutating [${queen}] with seed ${res.seed} -> [${res.child}]`);
    }

    console.log("crossover...");
    for (let i = 0; i < 8; i++) {
        let queenA = geracao[i]
        let queenB = geracao[i - 1]
        let child = gen.crossover(queenA, queenB);

        console.log(`Cross over of [${queenA}] with [${queenB}] -> [${child}]`);
    }

}

//test()

let population = []



function run() {
    const sortByScore = function (a, b) {
        if (a.score < b.score) {
            return -1
        }

        if (a.score > b.score) {
            return 1
        }

        return 0;
    }

    const printGeneration = function (gen) {
        for (let i = 0; i < gen.length; i++) {
            console.log(`dna ${gen[i].dna} (${gen[i].score})`)
        }
    }

    const createGeneration = function (gen) {
        let generation = []

        for (let i = 0; i < 8; i++) {
            let dna = gen.create()
            let score = gen.score(dna)
            generation.push({
                dna: dna,
                score: score
            })
            // console.log(`dna ${dna} (${score})`)
        }

        //TODO: sort
        generation.sort(sortByScore);
        // console.log("sorted by score");
        // printGeneration(generation)
        return generation
    }
    //geração inicial
    let genesis = GeneticFactory()

    population.push(createGeneration(genesis));





    // [CONSTANTES]
    const N_MAX = 10000; //numero maximo de gerações
    const TARGET_SCORE = 0; //score ótimo

    // enquanto o número maximo de iterações não for atingido ou o objetivo alcançado, repetir.
    let n = 0;
    let score = TARGET_SCORE + 1;
    while (n < N_MAX && score > TARGET_SCORE) {


        let newGeneration = []
        // 1 - o primeiro sobrevive
        newGeneration.push(population[n][0].dna)
        //2
        newGeneration.push(genesis.mutate(population[n][0].dna).child)
        //3
        newGeneration.push(genesis.mutate(population[n][1].dna).child)
        //4
        newGeneration.push(genesis.crossover(population[n][0].dna, population[n][7].dna))
        //5
        newGeneration.push(genesis.crossover(population[n][0].dna, population[n][1].dna))
        //6
        newGeneration.push(genesis.crossover(population[n][1].dna, population[n][2].dna))
        //7
        newGeneration.push(genesis.crossover(population[n][1].dna, population[n][3].dna))
        //8
        newGeneration.push(genesis.crossover(population[n][2].dna, population[n][3].dna))


        const scoreGen = function (geneticFactory, generation) {
            let _generation = []
            for (let i = 0; i < 8; i++) {
                let dna = generation[i]
                let score = geneticFactory.score(dna)
                _generation.push({
                    dna: dna,
                    score: score
                })
                // console.log(`dna ${dna} (${score})`)
            }

            //TODO: sort
            _generation.sort(sortByScore);
            // console.log("sorted by score");
            // printGeneration(generation)
            return _generation
        }
        population.push(scoreGen(genesis, newGeneration))

        const drawGeneration = function (generation) {
            for (let i = 0; i < 8; i++) {
                drawBoard(`tabuleiro${i+1}`, generation[i])
            }
        }


        console.log(`genetation ${n}`)
        printGeneration(population[n])
        drawGeneration(population[n])

        //armazena o melhor score para saber se chegou o ponto de parada.
        score = population[n][0].score
        console.log("score ", score);
        n++;
    }

}

//
//run();
