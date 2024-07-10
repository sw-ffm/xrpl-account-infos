require('dotenv').config();

const xrpl = require("xrpl");
const fs = require('node:fs/promises');
const client = new xrpl.Client( process.env.PUBLIC_SERVER );


var accounts = process.env.XRPL_ACCOUNTS.split(',');
var i=0;


async function accountInfo( client, account ){

    const response = await client.request({

        "command": "account_info",
        "account": account,
        "ledger_index": "validated"
    
    });

    fs.writeFile(`./json/${account}.json`, JSON.stringify(response))
    .then(()=>{

        console.log(`${account}.json file written`);

    });    

};

async function closeConnection(){

    await client.disconnect();

};

client
.connect()
.then(()=>{

    accounts.forEach(element => {
        
        accountInfo( client, element )
        .then(() => {

            i++;
            
            if(i >= accounts.length){

                closeConnection()
                .then(() => {

                    console.log("Job done");

                });

            }

        })

    });

});
