# Genetic Algorithm

Trabalho para a disciplina Inteligência Artificial com o professor Sergio Palmas, 2019/2. 

https://rafaelfigueiredo.github.io/ga/



Para visualizar a interação do algoritmo abra o console apertando **F12**

## Objetivo
Posicionar 8 rainhas em um tabuleiro de 8x8(64 posições) em que elas não consigam capturar umas as outras.
O "DNA" de jogo seria uma sequencia de 8 números distintos que representa para cada coluna em qual linha esta a rainha.
Ex: `"12345678"`


## Mutação
Permuta aleatoriamente dois genes do DNA de um jogo
12345678 -> 82345671 (a permutação foi entre 1 e 8)



## Crossover
Dada duas amostras ele mantem o que for igual entre os dois, e nas lacunas ele preenche aleatoriamente
12345678,12348765 -> 12348576 (toda a parte semelhante permaneceu no mesmo lugar, 1234)



## Critério de seleção

É feito a contagem de quantas colisões possíveis verificando quantas rainhas estão em uma mesma diagonal do tabuleiro, 
então as rainhas são ordenadas da melhor para a pior e a próxima geração é gerada da seguinte forma:

1. O melhor sobrevive sem alteração
2. Mutação do primeiro
3. Mutação do segundo
4. Crossover do primeiro com o ultimo
5. Crossover do primeiro com o segundo
6. Crossover do segundo com o terceiro
7. Crossover do segundo com o quarto
8. Crossover do terceiro com o quarto
