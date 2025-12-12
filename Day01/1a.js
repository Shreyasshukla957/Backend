// Node js 
// node js ek run time enviornmnet provide krta h javascript ko run krne k liye , uske andar ek v8 engine hota h jo javascript ke code ko samajh sakta h aur run krata h , v8 engine jo h woh  c++ code se bna hua h aur iss tarah se likha hua ki woh js ko samajh sake aur code run krasake js ka
// js ke code ko v8 engine input mein lega aur output mein machine language deta h
// Server woh h ko Serve krta h kuch nahi bas ek js ki file h jo kisi computer mein host ho rakhi h ,Server jo h woh frontend ki request ko fullfil krta h , jab bhi frontend koi req krta h server database se connected rehta h aur database se data utha kar frontend ko serve krdeta h server
// Server ke andar Business Logic aur database credential code rehte h , kyunki woh hidden rehta h aur uska access kisi aur ke pass nahi rehta h .
// Node JS ke andar extra feature hoti h jo usse powerful bnadeti h jaise :- Global Object , setTimeout , setInterval , fetch() , console.log() , DOM , DB connection etc.
// V8 engine ECMAA script ko follow krta h
// v8 engine ke pass Global Object ka access hota h jisse woh baaki sab cheezon ka access krleta h
// pahale backend ko hum log C++ Mein likhte the lekin abhi hum us JS Mein isliye likhate Hain QKi V8 engine Jo Hai woh khud C++ me hi likha hua h toh hame Kuch Extra Function Daalne Ki Zaroorat Nahi Padi V8 engine Apni Aap C++ mein Likha Hua Hai TOH WOH Javascript language ko Samajh sakta Hai
// V8 can be embedded in to any c++ application kyunki v8 bhi c++ mein likha hua h aur woh js language ko samajh sakta h , kyunki v8 ko likha iss tareeke se gya h taki woh JS language ko samajh saken 

// 1b ke code ko import krake le aaya h
// CJS :- common js module
// const {sum,sub} = require("./1b");// I need 1b.js code in my lec1.js file

// sum(3,4);// ab yeh private nahi rha h kyunki isse btadiya gya ki yeh export kra rhe h bahar dusre file ko yeh sum function use krna h
// sub(3,4);
// function sum (a,b){
//     console.log(a+b);
// }
// sum(3,4); isse 1b ka function code nahi chlega kyunki woh private hota h toh usse ke andar manipulation nahi ho sakta naa hi woh kuch command samjhega bas wrap hokar aata h
// "iffe" (Immediately Invoked Function Expression) use krne par chal gya h yeh jo ki function ko wrap krdeta h aur immediately run krdeta h ussi wrapped function ko
// (function sum (a,b){
//     console.log(a+b);
// })(3,4);
console.log("Hello Dear");

import now from "./1b.js"
// node js CJS common js module ko follow krta h 
// (MJS) import and export wale hote h aur node js isko smjh nahi paate h woh by default CJS ko samajhta h  ex:- 1a.mjs , 1b.mjs
// agar hum chahte h ki woh MJS ko samjhe toh apne file ka name mein .mjs extension lagadene ka instead of .js 
// agar aap file ka extension change nahi krna chahte h toh ek package.json file bnao aur type:module krdo ab apne aap import export krne mein koi dikkat nahi hogi
now(10,20);
console.log("Hello Dear");

