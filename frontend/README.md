# Voting Dapp

## Présentation Général

Le projet Voting Dapp est une preuve de concepte d'un processus de vote utilisant les technologies du web3. Le project repond aux besoins suivants:

- Mettre en place un processus de vote gouverner pour un unique administrateur et utilisable par des utilisateurs enregistrés sur une liste blanche.
- Appliquer une methologie de développement efficace.
- Utiliser les contrats Openzeppling et stack technologique recente.

## Video Présentation

![Short presentatino of the Dapp](../VotingDapp.gif)

## Installation du projet

```
cd backend
anvil --chain-id 1337

# Open a new terminal

forge script script/Voting.s.sol:VotingScript --fork-url http://localhost:8545 --broadcast

# Open a new terminal
cd frontend
npm run dev
```

## Documentation

La documentation est générée automatiquement en reprenant les commentaires `natspec` associés aux fonctions des contrats intelligents.

Une fois le projet cloné en local il est possible d'accéder à cette dernière via un serveur local en executant les commandes suivantes:

```
cd backend/
forge doc --serve --port 4000
```

## Technologies utilisées

### Backend

- [Solidity](https://docs.soliditylang.org/en/v0.8.25/)
- [Foundry](https://getfoundry.sh/)
- [Ether.js](https://docs.ethers.org/v5/)
- [Chai](https://www.chaijs.com/)
- [Mocha](https://mochajs.org/)

### Frontend

- [NextJS](https://nextjs.org/)
- [Chakra-ui](https://v2.chakra-ui.com/)
- [RainbowKit](https://www.rainbowkit.com/fr)
- [Wagmi](https://wagmi.sh/)
- [Viem](https://viem.sh/)
- [WalletConnect](https://walletconnect.com/)
