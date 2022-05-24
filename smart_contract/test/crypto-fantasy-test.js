const chai = require("chai");
const { ethers, deployments, waffle } = require("hardhat");
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { DateTime } = require("luxon");
const { Duration } = require("luxon");
const { moveTime } = require("../utills/move_time");
const { moveBlocks } = require("../utills/move_block");

describe("CryptoFantasy ", async () => {
  let cryptoFantasy, deployer, addr1, addr2, addr3;
  beforeEach(async function () {
    [deployer, addr1, addr2, addr3] = await ethers.getSigners();
    await deployments.fixture(["all"]);
    cryptoFantasy = await ethers.getContract("CryptoFantasy");
  });

  describe("create contest", async () => {
    const entryFee = ethers.utils.parseEther("1.5");
    const apiMatchId = 1;
    let contest, numberOfContests;
    beforeEach(async () => {
      await cryptoFantasy.createContest(
        apiMatchId,
        entryFee,
        DateTime.now()
          .plus(Duration.fromObject({ minutes: 10 }))
          .toUnixInteger(),
        DateTime.now()
          .plus(Duration.fromObject({ hours: 2 }))
          .toUnixInteger(),
        DateTime.now()
          .plus(Duration.fromObject({ minutes: 20 }))
          .toUnixInteger()
      );
      contest = await cryptoFantasy.totalContest(1);
      numberOfContests = await cryptoFantasy.numberOfContests();
    });

    it("should set the entry fee to ", async () => {
      expect(contest.entryFee).to.equal(entryFee);
    });

    it("should set the apiMatchId to the provided matchId", async () => {
      expect(contest.apiMatchId).to.equal(apiMatchId);
    });

    it("should set the initial pool prize to 0", async () => {
      expect(contest.poolPrize.toNumber()).to.equal(0);
    });

    it("should increase the number of contests", async () => {
      expect(numberOfContests.toNumber()).to.equal(1);
    });
  });

  describe("Donot create contest", async () => {
    it("should not create a new contest contract is called by other user", async () => {
      await expect(
        cryptoFantasy.connect(addr1).createContest(
          1,
          ethers.utils.parseEther("0.1"),
          DateTime.now()
            .plus(Duration.fromObject({ minutes: 10 }))
            .toUnixInteger(),
          DateTime.now()
            .plus(Duration.fromObject({ hours: 2 }))
            .toUnixInteger(),
          DateTime.now()
            .plus(Duration.fromObject({ minutes: 50 }))
            .toUnixInteger()
        )
      ).to.be.revertedWith("Only callable by owner");
    });

    it("should not create a new contest as startTime is greater than joinDeadline", async () => {
      await expect(
        cryptoFantasy.createContest(
          1,
          ethers.utils.parseEther("0.1"),
          DateTime.now()
            .plus(Duration.fromObject({ minutes: 10 }))
            .toUnixInteger(),
          DateTime.now()
            .plus(Duration.fromObject({ hours: 2 }))
            .toUnixInteger(),
          DateTime.now()
            .plus(Duration.fromObject({ minutes: 5 }))
            .toUnixInteger()
        )
      ).to.be.revertedWith("CryptoFantasy__CheckTimingsOfContest()");
    });

    it("should not create a new contest as startTime is greater than endTime", async () => {
      await expect(
        cryptoFantasy.createContest(
          1,
          ethers.utils.parseEther("0.1"),
          DateTime.now()
            .plus(Duration.fromObject({ minutes: 10 }))
            .toUnixInteger(),
          DateTime.now()
            .plus(Duration.fromObject({ minutes: 2 }))
            .toUnixInteger(),
          DateTime.now()
            .plus(Duration.fromObject({ minutes: 50 }))
            .toUnixInteger()
        )
      ).to.be.revertedWith("CryptoFantasy__CheckTimingsOfContest()");
    });
  });

  describe("Join contest", async () => {
    const entryFee = ethers.utils.parseEther("1.2");
    const apiMatchId = 123;
    let contest;
    const playerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    beforeEach(async () => {
      await cryptoFantasy.createContest(
        apiMatchId,
        entryFee,
        DateTime.now().toUnixInteger(),
        DateTime.now()
          .plus(Duration.fromObject({ hours: 2 }))
          .toUnixInteger(),
        DateTime.now()
          .plus(Duration.fromObject({ minutes: 10 }))
          .toUnixInteger()
      );
      await moveTime(10);
      await cryptoFantasy
        .connect(addr1)
        .joinMatch(1, playerIds, { value: entryFee });
      await cryptoFantasy
        .connect(addr2)
        .joinMatch(1, playerIds, { value: entryFee });
      contest = await cryptoFantasy.totalContest(1);
    });

    it("should increase pool prize by entry fee ", async () => {
      expect(contest.poolPrize).to.equal(entryFee.mul(2));
    });

    it("should increase teams to 2", async () => {
      expect(contest.totalTeams.toNumber()).to.equal(2);
    });

    it("should add the contest to player's played contests", async () => {
      const teams = await cryptoFantasy.getContestPlayedByUser(addr1.address);
      expect(teams.length).to.equal(1);
    });

    it("should have team of joined user in the contest", async () => {
      const teamAdded = await cryptoFantasy.getContestTeamOfUser(
        0,
        addr1.address
      );
      expect(teamAdded.playerIds.length).to.equal(11);
    });

    it("should not have team of not joined user in the contest", async () => {
      const teamAdded = await cryptoFantasy.getContestTeamOfUser(
        1,
        addr3.address
      );
      expect(teamAdded.teamOwner).to.equal(BigNumber.from(0));
    });

    it("should provide whole list of teams in a contest", async () => {
      const allTeams = await cryptoFantasy.getContestTeams(1);
      expect(allTeams.length).to.equal(2);
    });
  });

  describe("Donot allow contest joining", async () => {
    const entryFee = ethers.utils.parseEther("1.2");
    const apiMatchId = 123;
    let contest;
    const playerIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    beforeEach(async () => {
      await cryptoFantasy.createContest(
        apiMatchId,
        entryFee,
        DateTime.now()
          .plus(Duration.fromObject({ minutes: 10 }))
          .toUnixInteger(),
        DateTime.now()
          .plus(Duration.fromObject({ hours: 2 }))
          .toUnixInteger(),
        DateTime.now()
          .plus(Duration.fromObject({ minutes: 20 }))
          .toUnixInteger()
      );
    });

    it("should not allow the user to join same contest more than once", async () => {
      await moveTime(
        Duration.fromObject({ minutes: 11 }).shiftTo("seconds").seconds
      );
      await cryptoFantasy
        .connect(addr1)
        .joinMatch(1, playerIds, { value: entryFee });
      await expect(
        cryptoFantasy
          .connect(addr1)
          .joinMatch(1, playerIds, { value: entryFee })
      ).to.revertedWith("CryptoFantasy__AlreadyJoinedThisContest()");
    });

    it("should not allow the user to join with less value than entry fee", async () => {
      await moveTime(
        Duration.fromObject({ minutes: 11 }).shiftTo("seconds").seconds
      );
      await expect(
        cryptoFantasy
          .connect(addr3)
          .joinMatch(1, playerIds, { value: ethers.utils.parseEther("0.1") })
      ).to.revertedWith("CryptoFantasy__ValueNotEqualToEntryFee()");
    });

    it("should not allow user to join match before start time", async () => {
      await expect(
        cryptoFantasy
          .connect(addr1)
          .joinMatch(1, playerIds, { value: entryFee })
      ).to.revertedWith("CryptoFantasy__ContestNotStartedYet()");
    });

    it("should not allow user to join match after end time", async () => {
      await moveTime(
        Duration.fromObject({ hours: 10 }).shiftTo("seconds").seconds
      );
      await expect(
        cryptoFantasy
          .connect(addr1)
          .joinMatch(1, playerIds, { value: entryFee })
      ).to.revertedWith("CryptoFantasy__ContestEnded()");
    });

    it("should not allow user to join match after team submission deadline", async () => {
      await moveTime(
        Duration.fromObject({ minutes: 50 }).shiftTo("seconds").seconds
      );
      await expect(
        cryptoFantasy
          .connect(addr1)
          .joinMatch(1, playerIds, { value: entryFee })
      ).to.revertedWith("CryptoFantasy__JoiningDeadlinePassed()");
    });
  });
  

  // describe("Find Winner", async () => {
  //   const entryFee = ethers.utils.parseEther("1.2");
  //   const apiMatchId = 46161;
  //   const team1 = [
  //     7736, 8095, 8796, 8846, 9204, 9311, 9428, 10276, 10896, 10917, 12226,
  //   ];
  //   const team2 = [
  //     9311, 9428, 10276, 10896, 10917, 12226, 12337, 12926, 13162, 13169, 14190,
  //   ];
  //   beforeEach(async () => {
  //     await cryptoFantasy.createContest(
  //       apiMatchId,
  //       entryFee,
  //       DateTime.now().toUnixInteger(),
  //       DateTime.now()
  //         .plus(Duration.fromObject({ hours: 2 }))
  //         .toUnixInteger(),
  //       DateTime.now()
  //         .plus(Duration.fromObject({ minutes: 20 }))
  //         .toUnixInteger()
  //     );
  //     await moveTime(10);
  //     await cryptoFantasy.joinMatch(0, team1, { value: entryFee });
  //     await cryptoFantasy
  //       .connect(addr2)
  //       .joinMatch(0, team2, { value: entryFee });
  //     await moveTime(121);
  //   });

  //   it("should find the winner of a contest", async () => {
  //     await cryptoFantasy.findWinnerOfContest(0);
  //     const contest = await cryptoFantasy.totalContest(1);
  //     expect(contest.winner).to.equal(deployer);
  //   });
  // });
});
