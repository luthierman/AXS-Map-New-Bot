const { Cluster } = require('puppeteer-cluster');
const am = require("./axsMap");
let helpers = require("./helpers.js" );
const csv = require('csv').parse;
const fs = require('fs');
let readCSV = helpers.readCSV;

(async () => {
  const cluster = await Cluster.launch({
    puppeteerOptions: {
      headless: false,
      defaultViewport: null, 
  },

  concurrency: Cluster.CONCURRENCY_BROWSER,
  maxConcurrency: 2,
  skipDuplicateUrls : true,
  timeout : 10000,
  });

  try{
    const email = "<EMAIL>"
    const pw = "<PASSWORD>"
    totalList = []
    console.log("initializing axsMap page")
    await am.initialize(username = email, password = pw);
    await am.login()
    let starbucks_list = readCSV("starbucks_list.csv")
    let list = starbucks_list.slice(26,28);
    loop1:
    for (i = 0; i< list.length-1; i++){
        //list.map(async venue => {
            console.log("looking for reviews on: " + list[i])
            await am.search(list[i])
            
            let reviews = await am.get_review()
            console.log("got_reviews")
            await am.clear()
            console.log(reviews)
            console.log(i)
            //var j = 0;

            // add all empty reviews in a search to totalList
            
            // for (j = 0; j<= reviews.length; j++){
            reviews.forEach(element => {
                if (element != null ){
                    totalList.push(element)
                    }
                })
            //console.log(totalList)
            
            
              // spawn and queue child puppeter processes

            // await cluster.task (async ({page, data : url}) => {
            //   await page.setViewport({width: 5000, height: 5000})
            //   await page.goto(url);
            //   await page.waitFor(1000)
            // })

            
            if (totalList.length >= 1) {
              // spawn and queue child puppeter processes
              //for (k = 0; k< totalList.length; k++) {
                console.log("creating review processes...")
                cluster.queue(async ({}) => {
                  await am.review(totalList.pop(), i%5)
                  
                  //console.log("current totalList: " + totalList.length)
                })
              }
                
             // console.log(totalList)
              
              // await cluster.task( async({page2,  data: url}) => {
              //   await page2.review(url)
              // })

            
              
            

      
            //console.log("end of search through " + list[i])
            
            
            
            
        //})
    }
    //reviews.forEach,(elem => totalList.push(elem))
    //console.log(totalList)
    } catch(err) {console.log("HELLO : "+err)}

    // am.browser.on('targetdestroyed', async () => console.log('Target destroyed. Pages count: ' + (await am.browser.pages()).length));
    // console.log('closing page...');
    // await am.page.close();
    // console.log('page closed.');

    var output = await am.page.evaluate(() => {return;})
    console.log('Closing page...');
    await am.page.close().catch(error => console.log(`Error closing page: ${error}.`))
    console.log('Closing browser window.');
    await am.browser.close();
 

  // await cluster.idle();
  // await cluster.close();
})();




