module.exports = {

    /**
     * this will init a cache service mock for web3 static params.
     * use this if you use web3cache in your project integration
     *
     */
    initWeb3Cache: function () {

        return {

            get: async function (contract, paramName) {

                return contract.methods[paramName]().call()

            }

        }

    }

}
