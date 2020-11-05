const csv = require('csv').parse;
const fs = require('fs');

module.exports = {
    justReviews: function (exp){
        const regex = RegExp("https://axsmap.com/venues\/(.*?)\/review")
        let reviews = [];
        let len = exp.length;
        let curr = null;
        //console.log("len : " + len)
        let x = 0;
        for (;x <len; x++){
            //console.log("empty?")
            if (regex.test(exp[x]) && curr != exp[x]) { 
                // no duplicates!
                curr = exp[x] 
                console.log("found an empty review")
                reviews.push(exp[x])
            }
        }
        console.log("reviews: " +reviews.length)
        return reviews
     },
     readCSV : function (file) {
        let list = []
        var data = fs.readFileSync(file)
            .toString() // convert Buffer to string
            .split('\n') // split string to lines
            .map(e => e.trim()) // remove white spaces for each line
        for (i =0; i < data.length; i++) {
            list.push(data[i].slice(1,data[i].length-1))
        }
            
        
        return list
        
        
     }

}

    
