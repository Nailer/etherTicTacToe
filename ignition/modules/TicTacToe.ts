// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

// 0x0df274aa3d0214acde2bbff6b5127b17f0e0b660f634fdb88548d0fe24215e36


import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MarketpulseModule = buildModule("MarketpulseModule", (m) => {
  const MarketpulseContract = m.contract("TicTacToe", []);

  m.call(MarketpulseContract, "ping", []);

  return { MarketpulseContract };
});

export default MarketpulseModule;