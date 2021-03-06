import { create } from 'ipfs-http-client'

/**
 * creates & exports new instance for
 * IPFS using infura as host, for use.
 */
const ipfs = create(new URL('https://ipfs.infura.io:5001/api/v0'))

export default ipfs
