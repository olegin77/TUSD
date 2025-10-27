import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaContracts } from "../target/types/solana_contracts";
import { expect } from "chai";

describe("Solana Contracts - Basic Tests", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaContracts as Program<SolanaContracts>;
  const provider = anchor.getProvider();

  it("Should initialize program", async () => {
    const tx = await program.methods.initialize().rpc();
    console.log("Initialize transaction signature:", tx);
    expect(tx).to.be.a("string");
  });

  it("Should have correct program ID", () => {
    expect(program.programId.toString()).to.equal("3D7d2dRwysPv1ov5BzT934W2NYS9o7gfjBP2EphgVNXX");
  });

  it("Should have all required instructions", () => {
    const methods = program.methods;
    expect(methods).to.have.property("initialize");
    expect(methods).to.have.property("deposit");
    expect(methods).to.have.property("applyBoost");
    expect(methods).to.have.property("mintWexelFinalize");
    expect(methods).to.have.property("accrue");
    expect(methods).to.have.property("claim");
    expect(methods).to.have.property("collateralize");
    expect(methods).to.have.property("repayLoan");
    expect(methods).to.have.property("redeem");
  });
});
