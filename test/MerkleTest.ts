import { ethers } from 'hardhat';
import { expect } from 'chai';
import { generateTree } from '../scripts/merkletree';

describe('MerkleTree', () => {
    it('Should verify a valid proof', async function () {
        const tree = await generateTree();
        const root = tree.getHexRoot();
        const [signer] = await ethers.getSigners();
        const hashedAddress = ethers.keccak256(signer.address);

        console.log('Looking For: ' + signer.address + ' -> ' + hashedAddress);

        const proof = tree.getHexProof(hashedAddress);
        const Merkle = await ethers.getContractFactory('Merkle');
        const merkle = await Merkle.deploy(root);
        merkle.deploymentTransaction();

        expect(await merkle.verify(proof)).to.equal(true);
    });
    it('Should not verify an invalid proof', async function () {
        const tree = await generateTree();
        const root = tree.getHexRoot();
        const [, signer2] = await ethers.getSigners();
        const hashedAddress = ethers.keccak256(signer2.address);

        console.log('Looking For: ' + signer2.address + ' -> ' + hashedAddress);

        const proof = tree.getHexProof(hashedAddress);
        const Merkle = await ethers.getContractFactory('Merkle');
        const merkle = await Merkle.deploy(root);
        merkle.deploymentTransaction();

        expect(await merkle.verify(proof)).to.equal(false);
    });
});
