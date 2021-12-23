/* eslint-disable func-call-spacing */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('NFTMarket', function () {
  it ('Should return the new market place', async function () {
    const Market = await ethers.getContractFactory('NFTMarket')
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    const NFT = await ethers.getContractFactory('NFT')
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('100', 'ether')

    await nft.createToken('https://www.mytokenlocatoin.com')
    await nft.createToken('https://www.mytokenlocatoin2.com')

    await market.createMarketItem(nftContractAddress, 1, auctionPrice, { value: listingPrice })
    await market.createMarketItem(nftContractAddress, 2, auctionPrice, { value: listingPrice })

    // _ is seller and buyer address is buyer, they not same person
    const [_, buyerAddress] = await ethers.getSigners()
    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionPrice })

    let items = await market.fetchMarketItems()
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId)
      const item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    console.log('items: ', items)
  })
})
