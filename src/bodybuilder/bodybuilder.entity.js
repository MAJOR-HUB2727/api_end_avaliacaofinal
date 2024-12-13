class BodyBuilder {

    constructor(nome, cpf, peso, altura, idade, estilo, gym){
        this.nome = nome
        this.cpf = cpf
        this.peso = peso
        this.altura = altura
        this.idade = idade
        this.estilo = estilo
        this.gym = gym // associacao com a classe Gym
    }
}

module.exports = { BodyBuilder }
