const { Cluster } = require('puppeteer-cluster');
const am = require("./axsMap");
let helpers = require("./helpers.js" );
const csv = require('csv').parse;
const fs = require('fs');
let readCSV = helpers.readCSV;

(async () => {
  const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 4,
  });

  try{
    const email = "<EMAIL>"
    const pw = "<PASSWORD>"
    totalList = []
    console.log("initializing axsMap page")
    await am.initialize(username = email, password = pw);
    await am.login()
    let starbucks_list = readCSV("starbucks_list.csv")
    let list = starbucks_list.slice(26,50);
    loop1:
    for (i = 0; i< list.length-1; i++){
        //list.map(async venue => {
            console.log("looking for reviews on: " + list[i])
            await am.search(list[i])
            //
            let reviews = await am.get_review()
            console.log("got_reviews")
            await am.clear()
            console.log(reviews)
            console.log(i)
            //var j = 0;

            // add all empty reviews in a search to totalList
            loop2:
            for (j = 0; j<= reviews.length; j++){
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
              // spawn and queue child puppeter processes
              //for (k = 0; k< totalList.length; k++) {
                console.log("creating review processes...")
                cluster.queue(async ({}) => {
                  await am.review(totalList.pop(), i%5)
                  
                  //console.log("current totalList: " + totalList.length)
                }
                )
              //}
              
              continue;

            
              
            }

            // else if (totalList.length > 1) {
            //   cluster.queue(async ({}) =>{
            //     await am.review(totalList.pop())
            //     console.log("end of search through " + list[i])
            //     console.log("current totalList: " + totalList.length)
            //   });
            //   cluster.queue(async ({}) =>{
            //     await am.review(totalList.pop())
            //     console.log("end of search through " + list[i])
            //     console.log("current totalList: " + totalList.length)
            //   });
            // }
            console.log("end of search through " + list[i])
            continue;
            
            
            
        //})
    }

 
    //reviews.forEach,(elem => totalList.push(elem))

    console.log(totalList)

    await am.browser.close()
    
    } catch(err) {console.log(err)}

 

  await cluster.idle();
  await cluster.close();
})();




