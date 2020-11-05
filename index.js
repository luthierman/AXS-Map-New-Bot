const am = require("./axsMap");
let helpers = require("./helpers.js" );
const csv = require('csv').parse;
const fs = require('fs');
let readCSV = helpers.readCSV;
// stable non
( async () => {
    try{
    const email = "<EMAIL>"
    const pw = "<PASSWORD>"
    totalList = []
    console.log("initializing axsMap page")
    await am.initialize(username = email, password = pw)
    await am.login()
    
    //console.log(am.waitForSelector("#email")!= null)
    let starbucks_list = readCSV("starbucks_list.csv")
    //console.log(starbucks_list)
    let list = starbucks_list.slice(23,50);
    loop1:
    for (i = 0; i< list.length; i++){
        //list.map(async venue => {
            console.log("looking for reviews on: " + list[i])
            await am.search(list[i])
            //
            let reviews = await am.get_review()
            console.log("got_reviews")
            await am.clear()
            console.log(reviews)
            console.log(i)


            //
            loop2:
            for (j =0; j<= reviews.length; j++){
            //await reviews.forEach(element => {
                if (reviews[j] != null ){
                    await totalList.push(reviews[j])
                    }
                    else{
                        break loop2
                    }
            //});
                }
            //
            if (totalList.length >= 1) {
                await am.review(totalList.pop()/*, email, password*/)
            }
            console.log("end of search through " + list[i])
            console.log("current totalList: " + totalList.length)
            continue;
            
            
        //})
    }

 
    //reviews.forEach,(elem => totalList.push(elem))

    console.log(totalList)

    await am.browser.close()
    //console.log(totalList)
    } catch(err) {console.log(err)}

    
})();


