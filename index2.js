let helpers = require("./helpers.js" )
const { Cluster } = require('puppeteer-cluster');
let justReviews = helpers.justReviews;
const csv = require('csv').parse;
const fs = require('fs');
let readCSV = helpers.readCSV;
const puppeteer = require('puppeteer');
const url = 'https://axsmap.com/sign-in';
 
// js prototype object method style
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions




(async() => {

// set up


    let starbucks_list = readCSV("starbucks_list.csv")
    let list = starbucks_list.slice(26,50);
    const browser = await puppeteer.launch({userDataDir: "./data", headless: false}); // cache is data
    totalList = []
    var jobs = 0
    const pages = await browser.pages();
    const page = pages[0]
    const username = "<EMAIL>"
    const password = "<PASSWORD>"
    const cluster = await Cluster.launch({
        puppeteerOptions: {
          headless: false,
          defaultViewport: null, 
      },
    
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 2,
      skipDuplicateUrls : true,
      timeout : 100000,
      })


   

// functions

    async function search(word){
        // enter input   
        if(await page.waitForFunction('document.querySelector("input#keywords.sc-ksYbfQ.ciOlbE")')=== true){
            await page.waitForFunction('document.querySelector("#root > div > div.sc-iwsKbI.jzoFXS > div").className == "fade sc-gZMcBi laOxfE"')   

        }
        await page.type("input#keywords.sc-ksYbfQ.ciOlbE", word)
        await page.keyboard.press('Enter')        
    }


    async function clear() {
        try{
            // waits until top loading bar finished rendering 
            await page.waitForFunction('document.querySelector("#root > div > div.sc-iwsKbI.jzoFXS > div").className == "fade sc-gZMcBi laOxfE"')
            await page.$eval("input#keywords.sc-ksYbfQ.ciOlbE", el =>el.value = "")
          }
        catch (err){
            console.log("sorry, caught error in clear");
        }
    }

    async function get_review (){
        // returns array of hrefs for reviews rendered on page
        console.log("waiting for panel render...")
        await page.waitForFunction('document.querySelector("#root > div > div.sc-cqCuEk.fZEodo.sc-uJMKN.dgFTbm > div.sc-daURTG.ipCzav > div.sc-bXGyLb.ceVxrZ")')
        console.log("getting review hrefs...")
        const elementHandles = await page.$$('a');
        const propertyJsHandles = await Promise.all(
        elementHandles.map(handle => handle.getProperty('href')));
        const hrefs = await Promise.all(
        propertyJsHandles.map(handle => handle.jsonValue()));
        return justReviews(hrefs); 
    }


    // reviewing function
    await cluster.task(async ({ page, data: url }) => {
        try{
        await page.setViewport({ width: 1500, height: 2400 })
        await page.goto(url, { waitUntil: "networkidle2"});
        console.log("check0")
        

    if (await page.evaluate(() => document.querySelector('#email')) !== null) {  
        try{ 
                await page.type("#email", username),
                await page.type("#password", password),
                // // submit and wait to navigate to home page
                console.log("check2")    
                await Promise.all([
                page.click('button[type="submit"]'),
                page.waitForNavigation({ waitUntil: "networkidle0"}),
                ]).catch(e => console.log(e))
                console.log("successful login to review page")
            }
                        
             catch{
                console.log("oof at email and password")
             }
        }
        else{
            console.log("no need for email")
         }


        // REVIEW --> default: YES to portable ramp and wide entrance

        await page.waitForFunction('document.querySelector("#root > div > div.sc-iwsKbI.jzoFXS > div").className == "fade sc-gZMcBi laOxfE"')
        // portable ramp
        for (i=0; i< 2; i++) {
            await page.click('button[aria-label="next"]')
            await page.waitForSelector('button[aria-label="next"]')
            await page.waitFor(100)
            console.log("check "+i)
        }
        await page.waitFor(100)
        await page.click('#root > div > div.sc-eTuwsz.fkObQb.sc-cHGsZl.jHpOIv > div.is-full.sc-jzJRlG.eKLUhM > div.bg-gray-300.sc-fjdhpX.gDdLtD > div > div > div.sc-cIShpX.dOgYkc > div > div > div > div.carousel.carousel--lg > div > div > ul > div > div > li > div > div.sc-btzYZH.etdARI > div.is-full.sc-jzJRlG.eKLUhM > div:nth-child(1) > button')  
        await page.waitFor(100)
        // to wide entrance
        for (i=2; i< 5; i++) {
            await page.click('button[aria-label="next"]')
            await page.waitForSelector('button[aria-label="next"]')
            await page.waitFor(100)
        }
        await page.waitFor(100)
        await page.click('#root > div > div.sc-eTuwsz.fkObQb.sc-cHGsZl.jHpOIv > div.is-full.sc-jzJRlG.eKLUhM > div.bg-gray-300.sc-fjdhpX.gDdLtD > div > div > div.sc-cIShpX.dOgYkc > div > div > div > div.carousel.carousel--lg > div > div > ul > li:nth-child(5) > div > div.sc-btzYZH.etdARI > div.is-full.sc-jzJRlG.eKLUhM > div:nth-child(1) > button')  
        
        console.log("REVIEW SUBMITTED")
        jobs -=1
        await page.waitFor(1000) 
        // submit review
                // await Promise.all([
                // page.click('#root > div > div.sc-eTuwsz.fkObQb.sc-cHGsZl.jHpOIv > div.is-full.sc-jzJRlG.eKLUhM > div.bg-gray-300.sc-fjdhpX.gDdLtD > div > div > div.sc-cIShpX.dOgYkc > div > div > div > div.sc-fYxtnH.eBFzux > button')
                // ,
                //     page.waitForNavigation({ waitUntil: "networkidle0"}),
                    
                // ]).catch(e => console.log(e))
        }
        catch(err){
            console.log("WOOOP WOOOOP: ", err)
        }
    });






    // main
    // go to sign in page 
    await page.setViewport({ width: 1500, height: 2400 });
    await page.goto('https://axsmap.com/sign-in', { waitUntil: "networkidle2"})

    console.log("1")
    
    try{
        // if not logged in
        if (await page.evaluate(() => document.querySelector('#email')) !== null){
            await page.type("#email", username)
            console.log("2")
            await page.type("#password", password)
                // // submit and wait to navigate to home page
            await Promise.all([
                page.click('button[type="submit"]'),
               page.waitForNavigation({ waitUntil: "networkidle0"}),
                console.log("successful login")
            ]).catch(e => console.log(e))
                // // wait for load before getting rid of intro page
            await page.keyboard.press('Enter')
            console.log("intro panel gone...")
            } 

        else {
            console.log("already logged in...")
            
        }
   } catch (error) {
        console.log(error);
        
    }
  
    for (i = 0; i< list.length-1; i++){
            console.log("jobs recognized: ", jobs)
            console.log("looking for reviews on: " + list[i])
            await search(list[i])
            let reviews = await get_review()
            console.log("got_reviews")
            await clear()
            console.log(reviews)
            console.log(i)
            reviews.forEach(element => {
                if (element != null ){
                    totalList.push(element)
                    }
                })
                console.log(totalList)
            if (totalList.length != 0) {
                try {
                    // Execute the tasks one after another via execute
                    totalList.forEach(rev => {
                        if (rev != null) {
                            jobs += 1
                            cluster.queue(totalList.pop());
                        }

                    })
                    
                   
                    
                } catch (err) {
                    // Handle crawling error
                }
            }
            
            
    }
    await cluster.idle();
    await cluster.close();
    await browser.close()
    process.exit()
   
    
})();    
 