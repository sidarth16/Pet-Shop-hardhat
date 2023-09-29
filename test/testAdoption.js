const {time, loadFixture,} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Adoption", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployAdoptionFixture() {
    
    // Contracts are deployed using the first signer/account by default
    const [owner, testUser] = await ethers.getSigners();
    const Adoption = await ethers.getContractFactory("Adoption");
    const adoption = await Adoption.deploy();

    // TestUser adopt a pet
    testPetId = 7;
    await adoption.connect(testUser).adopt(testPetId);

    return { adoption, testUser, testPetId };
  }

  describe("Adopting a pet and retrieving account addresses", function () {
    
    it("can fetch the address of an owner by pet id", async function () {
      const { adoption, testUser, testPetId  } = await loadFixture(deployAdoptionFixture);
      const adopter = await adoption.adopters(testPetId);
      expect(adopter).to.equal(testUser.address);
    });

    it("can fetch the collection of all pet owners' addresses", async function () {
      const { adoption, testUser, testPetId  } = await loadFixture(deployAdoptionFixture);
      const adopters = await adoption.getAdopters();
      expect(adopters[testPetId]).to.equal(testUser.address);
    });
  });

 });
