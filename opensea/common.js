const fetch = require("node-fetch");
module.exports = {

    async getWalletCollections(args) {

        const result = await (await fetch(`https://api.opensea.io/api/v1/collections?offset=0&limit=300&asset_owner=${args.address}`, {
                method: 'GET',
                headers: {'X-API-KEY': args.platformKeys.opensea}
            })
        ).json();

        const collections = [];

        for (const collection of result) {

            collections.push(
                {value: collection.slug, label: collection.name}
            );
        }

        return collections;
    }

};
