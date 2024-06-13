import { JsonRpcProvider, Wallet, ContractFactory } from "ethers";
import * as fs from "fs-extra";
import "dotenv/config";

async function main() {
    const provider = new JsonRpcProvider(process.env.RPC_URL!);
    const wallet = new Wallet(process.env.PRIVATE_KEY!, provider);
    const abi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "utf8"
    );
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf-8"
    );
    const contractFactory = new ContractFactory(abi, binary, wallet);
    console.log("Deploying, please wait...");
    const contract: any = await contractFactory.deploy();
    await contract.deploymentTransaction()?.wait(1);
    console.log(contract);

    const currentFavoriteNumber = await contract.retrieve();
    console.log(`Current Favorite Number: ${currentFavoriteNumber.toString()}`);
    const transactionResponse = await contract.store("7");
    const transactionReceipt = await transactionResponse.wait(1);
    const updatedFavoriteNumber = await contract.retrieve();
    console.log(`Updated Favorite Number is: ${updatedFavoriteNumber}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
