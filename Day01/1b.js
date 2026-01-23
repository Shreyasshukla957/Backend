// console.log("Hello Brother");

// function sum (a,b){
//     console.log(a+b);
// }

// // module.exports = sum ;//isse hoga yeh ki ab yeh private nahi rha aur humne bta diya ki isko ab dusre file mein bhi use krna h aur isiliye isko export kr diya h

// function sub (a,b){
//     console.log(a-b);
// }
// console.log(module.exports);//yeh ek empty obj h
// module.exports = {sum,sub};//ek se jyada agar export krana h

// // module.exports.sum = sum;
// // module.exports.sub = sub; aise bhi export kra sakte h kyunki module.exports ek empty object h toh .sum aur .sub ek key hain aur uske andar sum aur sub value daal rhe h aur woh usse export kra rha h



function now (a,b){
    console.log(a*b);
}

export default now; 

