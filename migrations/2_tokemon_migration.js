const Tokemon = artifacts.require("TestTokemon");

module.exports = function (deployer) {
   deployer.deploy(Tokemon);
};
