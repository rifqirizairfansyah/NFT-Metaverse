<template>
  <div class="home">
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
    async loadNFTs () {
      const web3modal = new Web3Modal()
      const connection = await web3modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()

      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer)
      const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
      const data = await marketContract.fetchMyNFTs()

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
