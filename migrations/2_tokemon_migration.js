const Tokemon = artifacts.require("Tokemon");

module.exports = function (deployer) {
   deployer.deploy(Tokemon);
};
