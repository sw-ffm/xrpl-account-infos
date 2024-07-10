require('dotenv').config();

const xrpl = require("xrpl");

const fs = require('node:fs/promises');

const xrpl_client = {

    client: new xrpl.Client( process.env.PUBLIC_SERVER ),
    accounts: process.env.XRPL_ACCOUNTS.split(','),

    async accountInfo(){

        for( const element of this.accounts ){
        
            const response = await this.client.request({
        
                "command": "account_info",
                "account": element,
                "ledger_index": "validated"
            
            });
        
            await fs.writeFile(`./json/${element}.json`, JSON.stringify(response));

            console.log(`${element}.json file written`);

        }
    
    },

    async closeConnection(){

        await this.client.disconnect();
    
    },

    async openConnection(){

        await this.client.connect();
    
    },

};

xrpl_client.openConnection().then(()=>{

    xrpl_client.accountInfo().then(()=>{

        xrpl_client.closeConnection().then(()=>{

            console.log("Connection closed");

        });

    });

});