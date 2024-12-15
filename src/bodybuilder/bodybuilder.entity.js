class BodyBuilder {

    constructor(nome, cpf, peso, altura, idade, style, gym){
        this.nome = nome
        this.cpf = cpf
        this.peso = peso
        this.altura = altura
        this.idade = idade
        this.style = style // associacao com a classe Style
        this.gym = gym // associacao com a classe Gym
    }
}

module.exports = { BodyBuilder }
