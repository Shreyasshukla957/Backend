// CJS VS ESMODULE (MJS)
// CJS: Older way of import and export but followed currently in industry
// require,module.exports
// synchronous hota h , ex:- agar multiple import kr rhe h multiple file se toh old way mein import iss tareeeke se hota h ki agar forst file import ho rha h toh jab tak pehla  nahi ho jaata dusra file load nahi hoga main file mein jismein saare file import ho rhe h
// require("./file1.js") pehle yeh file puri tarah se load hoga 
// require("./file2.js")   second yeh file 
// require("./file3.js")   3rd yeh file
// require("./file4.js")   4th yeh file

  


// ESmodule (MJS)
// Latest way of import and export 
// import , export 
// asynchronous way , ex:- agar multiple import kr rhe h multiple file se toh latest way mein import iss tareeeke se hota h ki agar first file import ho rha h toh dusra bhi uske saath ho sakta h 

// import sum1 from "./file1.js" |  YEH SAARI FILE SAATH MEIN LOAD HO SAKTI
// import sum2 from "./file2.js" |   AGAR BEFORE FILES KO TIME LAG RHA H
// import sum3 from "./file3.js" |  TO UNHE ROK KE NEXT PAR JUMP KR JAATA 
// import sum4 from "./file4.js" |  HAIN BECAUSE OF ASYNCHRONOUS FEATURE





// Jab aap kisi folder se export/import karte ho, toh JavaScript ka rule hota hai ki woh sabse pehle us folder ke andar index.js naam ki file ko check karta hai. Agar us folder ke andar index.js file present hoti hai aur aap apni main file mein import karte waqt file ka naam mention nahi karte (sirf folder ka path dete ho, jaise ./exportfolder), toh JavaScript automatically samajh leta hai ki use exportfolder/index.js se data fetch karna hai. Is case mein aapko alag se index.js likhne ki koi zarurat nahi hoti, bas folder ka naam likhna kaafi hota hai.
// Lekin agar us folder(exportfolder) ke andar export karne wali file ka naam index.js ke alawa kuch aur ho, jaise third.js, toh JavaScript automatic selection nahi kar pata. Aise case mein aapko apni main file mein poora path likhna padta hai, jaise ./exportfolder/third.js (ya ./exportfolder/third). Matlab simple rule yeh hai ki index.js ek default entry file hoti hai, aur jab tak aap uska use kar rahe ho, folder ka naam hi kaam kar jata hai; warna aapko exact file ka naam specify karna hi padta hai.

// const sum = require("./sum");
// const sub = require("./sub");
// const mul = require("./mul");
// directly , bhi "main" file mein hum import kr sakte h lekin dikkat yeh h ki multiple file se agar import kra rhe h toh readability kharab kr dega isse accha ek file bnao jimein saare imports rakho iss case mein (index.js) aur phir uss file ko import kralo "main" file iss case mein (l2.js)  jisse readability acchi rhegi "main" file ki aur saare imported files (sum,sub,mul) ek file mein collected aur structured form mein pade rhenge

const {sum,sub,mul} = require("./exportfolder");

sum(5,10);
sub(5,10);
mul(5,10);



// JS : It is a single thread synchronous language

// Single-Core Processor: sirf ek process matlab ek kaam ek baar mein kr sakta h toh woh multiple task kaise kr leta h ek baar mein 
// ex:- Youtube , Game , Instagram | teeno task ek baar mein kaise chala rha h single processor 
// Reason: woh "context switching" krke feature use krta h jisse hota yeh thoda thoda time k liye woh 3no function run krta h aur itan fast switch krta h woh inn 3no kaamo ke beech mein ki humein lagta h woh 3no kaam ek saath krta h jabki woh phele "youtube" chlayega phir switch krke "game" aur phir switch krke "Instagram" aur yeh switching bohot fast hoti h isiliye humein lagta h 3no kaam ek saath ho rhe h , isse hi hum (Cocurrently) saare task chl rhe  h. 

// Dual-Core Processor : yeh do kaam ek saath kr sakte h .
// ex:- Youtube , Game : yha par yeh dono task 2no processor chala deti h isse hum (parallelism) kehte h jaha multiple (yha par 2 task) parallely chl rhe h. 
// agar yha par 2 task hi rheneg toh parallelism follow krega aur agar yha bhi 2 se jyada task aagye ex:- (youtube , game , instagram , Coding) toh phir yha bhi "context switching" use krna padega jiske wajah se 
//  1st processor ex:-(youtube\instagram )ke beech mein "context switching" krega aur 2nd (game/Coding) ke beech mein  phir isse bhi (concurrently) kahenge. 

// Octa-core bhi same krta h 8 task ek saath kr sakta h jisse (Parallelism)
// aur agar woh ex:- 20 task ek saath dede toh waha bhi woh
//  "context switching" krke sab task krega jisse (concurently) kahenge 


// Process , Thread , Processor

// Process:
// Process ek running program hota hai jisko Operating System alag memory aur resources deta hai ex:- Chrome , Vs Code open kiya woh ek process h.

// Thread:
// Thread process ke andar execution ka smallest unit hota hai jo actual kaam karta hai aur process ki memory share karta hai (ex:- Chrome mein multiple tabs open liye har tab ek kaam kr rha h woh kaam process ke andar ke  multiple threads krte h) .

// OPERATING SYSTEM
// │
// ├── Process A (Chrome)
// │     ├── Thread 1 → Tab load
// │     ├── Thread 2 → Video play
// │     └── Thread 3 → Scrolling
// │
// ├── Process B (VS Code)
// │     ├── Thread 1 → UI
// │     └── Thread 2 → Extensions
// │
// └── Process C (Music Player)
//          └── Thread 1 → Audio play
// 

// Relationship between processor-process-thread 
// PROCESSOR (CPU / Cores)
//         ▲
//         │ executes
//      THREAD
//         ▲
//         │ belongs to
//      PROCESS
// 


// Context switching:
// CPU ek thread ki state save karke dusre thread ki state load karta hai.


// Time-slicing:
// CPU time ko chhote-chhote time slots mein tod kar multiple threads ko diya jata hai.
 
// ➡️ Time-slicing ke end par context switching hota hai
// (Time slice khatam → CPU next thread pe switch → context switch)

// Processor (CPU)
// Actual instructions execute karta hai
// Sirf threads ko chalata hai (directly process ko nahi)

// Process
// Ek running program
// Memory, files, network jaise resources ka owner
// Direct CPU par nahi chalta, threads ke through chalta hai

// Thread
// Execution ka smallest unit
// OS thread ko CPU core par schedule karta hai
// Same process ke threads memory share karte hain
// 1 thread ko ek time par sirf 1 core milta hai
// Thread time ke saath core change (migrate) kar sakta hai
// 1 thread kabhi bhi multiple cores par same time run nahi karta

// One-liner
// CPU runs threads,
// Threads run the process,
// Process runs the program.

// CPU Thread ko chalata hai
// OS threads ko CPU cores par schedule karta hai
// Ek core ek time par ek thread execute karta hai


// V8 engine 
// JavaScript execution single-threaded
// Call Stack + Heap handle karta hai
// Ek time par ek JS task
// JavaScript execution V8 mein single-threaded hota hai
// lekin V8 engine khud strictly single-threaded nahi hota.

// 🔹 V8 ka single-threaded part
// JS execution (Call Stack)
// Ek time par ek hi JS task
// Race conditions avoid karne ke liye

// 🔹 V8 ke multi-threaded parts
// Garbage Collector
// JIT compiler (Ignition + TurboFan)
// Background optimizations
// ➡️ Yeh sab background threads par chal sakte hain


// Diagram

// V8 Engine
// │
// ├── Main JS Thread (Single)
// │     └── Executes JavaScript
// │
// └── Background Threads (Multiple)
//       ├── Garbage Collection
//       ├── JIT Compilation
//       └── Optimizations

// Web APIs (Browser)

// Timers, Fetch, DOM events, etc.
// Background threads use karti hain
// Heavy / async kaam JS thread se bahar hota hai

// Event Loop
// Web APIs se complete hua kaam
// Callback / Promise ke through
// Wapas V8 main thread ko deta hai


// NodeJS
// Node.js V8 engine ka use karta hai,aur V8 engine JavaScript execution ke liye single-threaded hota hai
// Async kaam libuv / background threads handle karte hain
// Node.js JavaScript ko ek main thread par execute karta hai,
// lekin background mein multiple threads ka use karta hai.
// Final callback/phir se V8 ke single JS thread par aata hai

// 🔹 Single-threaded part
// V8 main JS thread
// Call Stack + Event Loop
// Ek time par ek JS task

// 🔹 Multi-threaded part
// libuv thread pool
// File system (fs)
// Crypto
// DNS
// Some compression tasks
// ➡️ Yeh sab background threads mein chalte hain



// Fragmentation:
// Memory management problem jisme available memory hone ke baad bhi
// uska proper use nahi ho paata, kyunki memory chhote-chhote parts
// (fragments) mein divide ho jaati hai.

// =====================
// Internal Fragmentation:
// =====================
// Jab OS process ko uski requirement se zyada memory allocate kar deta hai
// Extra memory allocated block ke ANDAR hi waste ho jaati hai
// Ye fixed-size memory blocks (jaise paging) ki wajah se hoti hai
// Example: process ko 18KB chahiye, block 20KB ka mil gaya → 2KB waste

// =====================
// External Fragmentation:
// =====================
// Jab free memory alag-alag jagah chhote blocks mein bikhri hoti hai
// Total free memory kaafi hoti hai, par ek continuous block nahi milta
// Is wajah se process memory mein load nahi ho pata
// Ye variable-size allocation (jaise segmentation) ki wajah se hoti hai

// =====================
// Solutions:
// =====================
// Paging → external fragmentation ko avoid karta hai
// Compaction → scattered free memory ko jod kar external fragmentation kam karta hai
