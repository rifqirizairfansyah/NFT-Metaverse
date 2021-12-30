<template>
  <div class="home">
    <div class="card" v-for="item in setNfts" v-bind:key="item.tokenId">
      <img :src="item.image" alt="Avatar" style="width:100%">
      <div class="container">
        <h4><b>{{item.name}}</b></h4>
        <p>{{item.description}}</p>
        <input type="submit" @click="buyNFTs(item)">
      </div>
    </div>
    {{setNfts}}
  </div>
</template>

<script>
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/NTFMarket.sol/NFTMarket.json'
import { nftaddress, nftmarketaddress } from '../../config.js'
import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Vue from 'vue'

export default Vue.extend({
  name: 'Home',
  components: {
  },
  data () {
    return {
      nfts: [],
      setNfts: []
    }
  },
  mounted () {
    this.loadNFTs()
  },
  methods: {
    async buyNFTs (nft) {
      const web3modal = new Web3Modal()
      const connection = await web3modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)

      const signer = provider.getSigner()
      const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
      const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
        value: price
      })

      await transaction.wait()
      this.loadNFTs()
    },
    async loadNFTs () {
      const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
      const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
      const data = await marketContract.fetchMarketItems()

      const items = await Promise.all(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        const item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description
        }
        return item
      }))
      this.setNfts = items
      console.log(this.setNfts)
    }
  }
})
</script>
<style scoped>
.card {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  width: 40%;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

.container {
  padding: 2px 16px;
}
</style>
