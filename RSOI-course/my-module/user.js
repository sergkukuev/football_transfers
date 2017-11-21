function User(name, age) {
    this.name = name;
    this.age = age;
    this.displayInfo = function () {
        console.log('Name: ${this.name}, Age: ${this.age}');
    }
}

User.prototype.saySalute = function () {
     return "Salute, my name is ${this.name}";
};

module.exports = User;