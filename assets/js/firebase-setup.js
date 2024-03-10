// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { getFirestore, doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc, orderBy } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// const { getFirestore, doc, getDoc, collection, addDoc, query, where, getDocs }
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCBnhCMIqaFtLK8ZOdYckAd-MGuzkvbC0E",
    authDomain: "lambo-4e2ce.firebaseapp.com",
    projectId: "lambo-4e2ce",
    storageBucket: "lambo-4e2ce.appspot.com",
    messagingSenderId: "519378989192",
    appId: "1:519378989192:web:d236e2a4260b926bb9ef3d",
    measurementId: "G-C8368QX3R8"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);


function generateRandomString(length = 6) {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }
    return randomString;
}
function formatDate(timestamp) {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    let date = new Date(timestamp.seconds * 1000); // Convert to milliseconds
    let day = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let period = hours >= 12 ? "pm" : "am";

    // Convert to 12-hour time format
    hours = hours % 12 || 12;

    return `${day}th ${month}, ${year} at ${hours}:${String(minutes).padStart(2, '0')}${period}`;
}

function isTimeOlderThan24Hours(timestamp) {
    // Convert the timestamp to milliseconds
    let receivedTime = new Date(timestamp.seconds * 1000).getTime();

    // Get the current time in milliseconds
    let currentTime = new Date().getTime();

    // Calculate the difference in milliseconds
    let timeDifference = currentTime - receivedTime;
    // Check if the time is 24 hours or more old
    return timeDifference >= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
}


// const getReferralData = async (parentId) => {
//     if (parentId == "0") { return; }
//     let level = 0;
//     const usersRef = collection(db, "users");
//     const commRef = collection(db, "commission");
//     const refData = [];

//     while (parentId != "0" && level < 4) {

//         level = level + 1;
//         let userQuery = query(usersRef, where("parent_id", "==", parentId));
//         let querySnapshot = await getDocs(userQuery);
//         if (querySnapshot.size > 0) {
//             querySnapshot.forEach(async (userDoc) => {
//                 let userData = userDoc.data();
//                 // userData.level = `Level ${level}`;
//                 // userData.id = userDoc.id;
//                 let childObj = { id: userDoc.id, level: `Level ${level}`, address: userData.address };
//                 let comm = 0;
//                 let childQuery = query(commRef, where("affiliate_id", "==", userDoc.id));
//                 let querychildSnapshot = await getDocs(childQuery);
//                 if (querychildSnapshot.size > 0) {
//                     querychildSnapshot.forEach(async (childDoc) => {

//                         let childData = childDoc.data();
//                         console.log(childData);
//                         comm += childData['amount'];
//                         childObj['commission'] = comm;

//                     })
//                 }

//                 refData.push(childObj);
//                 parentId = userDoc.id;    
//             });

//         } else {
//             parentId = "0";
//         }
//     }
//     return refData;
// };

// const getReferralData = async (parentId) => {
//     if (parentId == "0") { return; }
//     let level = 0;
//     const usersRef = collection(db, "users");
//     const commRef = collection(db, "commission");
//     const refData = [];

//     level = level + 1;
//     let childQuery = query(usersRef, where("parent_id", "==", parentId));
//     let childSnapshot = await getDocs(childQuery);
//     if (childSnapshot.size > 0) {
//         childSnapshot.forEach(async (childDoc) => {
//             let childData = childDoc.data();
//             // userData.level = `Level ${level}`;
//             // userData.id = userDoc.id;
//             let childObj = { id: childDoc.id, level: `Level ${level}`, address: childData.address };
//             let comm = 0;
//             let childCommission = query(commRef, where("affiliate_id", "==", childDoc.id));
//             let queryCommissionSnapshot = await getDocs(childCommission);
//             if (queryCommissionSnapshot.size > 0) {
//                 queryCommissionSnapshot.forEach(async (childComm) => {

//                     let childCommData = childComm.data();
//                     console.log(childCommData);
//                     comm += childCommData['amount'];
//                     childObj['commission'] = comm;

//                 })
//             }
//             console.log(childObj)
//             refData.push(childObj);
//             parentId = childDoc.id;
//             level = 2;
//             let grandChildQuery = query(usersRef, where("parent_id", "==", parentId));
//             let grandChildSnapshot = await getDocs(grandChildQuery);
//             if (grandChildSnapshot.size > 0) {
//                 grandChildSnapshot.forEach(async (grandChildDoc) => {
//                     let grandChildData = grandChildDoc.data();
//                     let grandChildObj = { id: grandChildDoc.id, level: `Level ${level}`, address: grandChildData.address };
//                     let comm = 0;
//                     let grandChildCommission = query(commRef, where("affiliate_id", "==", grandChildDoc.id));
//                     let grandChildCommissionSnapshot = await getDocs(grandChildCommission);
//                     if (grandChildCommissionSnapshot.size > 0) {
//                         grandChildCommissionSnapshot.forEach((grandChildComm) => {

//                             let grandChildCommData = grandChildComm.data();
//                             console.log(grandChildCommData);
//                             comm += grandChildCommData['amount'];
//                             grandChildObj['commission'] = comm;

//                         })
//                     }
//                     console.log(grandChildObj)
//                     refData.push(grandChildObj);
//                     parentId = grandChildDoc.id;
//                 })
//             }



//         });
//     }
//     return refData;
// }

//Working Code for Level 2

// const getReferralData = async (parentId) => {
//     if (parentId == "0") { return []; }
//     const usersRef = collection(db, "users");
//     const commRef = collection(db, "commission");
//     const refData = [];

//     let childSnapshot = await getDocs(query(usersRef, where("parent_id", "==", parentId)));
//     if (childSnapshot.size > 0) {
//         await Promise.all(childSnapshot.docs.map(async (childDoc) => {
//             const childData = childDoc.data();
//             let childObj = { id: childDoc.id, level: "Level 1", address: childData.address };
//             let comm = 0;

//             let queryCommissionSnapshot = await getDocs(query(commRef, where("affiliate_id", "==", childDoc.id)));
//             if (queryCommissionSnapshot.size > 0) {
//                 queryCommissionSnapshot.docs.forEach((childComm) => {
//                     let childCommData = childComm.data();
//                     comm += childCommData.amount;
//                 });
//             }

//             childObj.commission = comm;
//             refData.push(childObj);
//             return childObj;
//         }));

//         // Now fetch data for grandchildren (Level 2)
//         const grandChildPromises = refData.map(async (childObj) => {
//             let grandChildSnapshot = await getDocs(query(usersRef, where("parent_id", "==", childObj.id)));
//             if (grandChildSnapshot.size > 0) {
//                 return Promise.all(grandChildSnapshot.docs.map(async (grandChildDoc) => {
//                     const grandChildData = grandChildDoc.data();
//                     let grandChildObj = { id: grandChildDoc.id, level: "Level 2", address: grandChildData.address };
//                     let comm = 0;

//                     let grandChildCommissionSnapshot = await getDocs(query(commRef, where("affiliate_id", "==", grandChildDoc.id)));
//                     if (grandChildCommissionSnapshot.size > 0) {
//                         grandChildCommissionSnapshot.docs.forEach((grandChildComm) => {
//                             let grandChildCommData = grandChildComm.data();
//                             comm += grandChildCommData.amount;
//                         });
//                     }

//                     grandChildObj.commission = comm;
//                     refData.push(grandChildObj);
//                     return grandChildObj;
//                 }));
//             }
//             return [];
//         });

//         await Promise.all(grandChildPromises);
//     }

//     return refData;
// };

async function confirmTransaction(transaction_id) {
    await updateDoc(doc(db, "transactions", transaction_id), {
        status: "completed"
    });
    console.log("transaction confirmed successfully");
    window.location.reload();
}

window.confirmTransaction = confirmTransaction;

function checkTransaction(user_address, admin_address, amount, txn) {

    $.ajax({
        type: "GET",
        url: `https://apilist.tronscanapi.com/api/transfer?sort=-timestamp&count=true&fromAddress=${user_address}&toAddress=${admin_address}`,
        success: function (response) {
            var data = response;
            console.log(JSON.stringify(data));

            if (data.data && data.data.length > 0) {
                let transaction = data.data[0];
                console.log(transaction);

                let confirmAmount = Number(transaction.amount) / 1000000 == Number(amount);
                let currentTime = new Date().getTime();
                let transactionTime = transaction.timestamp;
                let hash = transaction.transactionHash == txn ? true : false;
                // Check if the transaction amount is correct and the timestamp is within 30 minutes
                if (confirmAmount && hash) {
                    // confirmation = true;
                    $(".btnConfirm").html("Amount Received Successfully!");
                    $("#depositForm").submit();
                }
            } else {
                // Transaction data not received yet, continue checking
                setTimeout(checkTransaction, 5000); // Check again after 5 seconds (adjust as needed)
            }
        },
        error: function (xhr, status, error) {
            // Handle errors here
            console.log("Error: " + error);
        }
    });

}

const getReferralData = async (parentId) => {
    if (parentId == "0") { return []; }
    const usersRef = collection(db, "users");
    const commRef = collection(db, "commission");
    const refData = [];

    let childSnapshot = await getDocs(query(usersRef, where("parent_id", "==", parentId)));
    if (childSnapshot.size > 0) {
        await Promise.all(childSnapshot.docs.map(async (childDoc) => {
            const childData = childDoc.data();
            let childObj = { id: childDoc.id, level: "Level 1", address: childData.address, joined_on: childData.joined_on };
            let comm = 0;

            let queryCommissionSnapshot = await getDocs(query(commRef, where("affiliate_id", "==", childDoc.id)));
            if (queryCommissionSnapshot.size > 0) {
                queryCommissionSnapshot.docs.forEach((childComm) => {
                    let childCommData = childComm.data();
                    comm += childCommData.amount;
                });
            }

            childObj.commission = comm;
            refData.push(childObj);
            return childObj;
        }));

        // Now fetch data for grandchildren (Level 2)
        const grandChildPromises = refData.map(async (childObj) => {
            let grandChildSnapshot = await getDocs(query(usersRef, where("parent_id", "==", childObj.id)));
            if (grandChildSnapshot.size > 0) {
                await Promise.all(grandChildSnapshot.docs.map(async (grandChildDoc) => {
                    const grandChildData = grandChildDoc.data();
                    let grandChildObj = { id: grandChildDoc.id, level: "Level 2", address: grandChildData.address, joined_on: grandChildData.joined_on };
                    let comm = 0;

                    let grandChildCommissionSnapshot = await getDocs(query(commRef, where("affiliate_id", "==", grandChildDoc.id)));
                    if (grandChildCommissionSnapshot.size > 0) {
                        grandChildCommissionSnapshot.docs.forEach((grandChildComm) => {
                            let grandChildCommData = grandChildComm.data();
                            comm += grandChildCommData.amount;
                        });
                    }

                    grandChildObj.commission = comm;
                    refData.push(grandChildObj);
                    return grandChildObj;
                }));

                // Now fetch data for great-grandchildren (Level 3)
                const greatGrandChildPromises = grandChildSnapshot.docs.map(async (grandChildDoc) => {
                    let greatGrandChildSnapshot = await getDocs(query(usersRef, where("parent_id", "==", grandChildDoc.id)));
                    if (greatGrandChildSnapshot.size > 0) {
                        await Promise.all(greatGrandChildSnapshot.docs.map(async (greatGrandChildDoc) => {
                            const greatGrandChildData = greatGrandChildDoc.data();
                            let greatGrandChildObj = { id: greatGrandChildDoc.id, level: "Level 3", address: greatGrandChildData.address, joined_on: greatGrandChildData.joined_on };
                            let comm = 0;
                            console.log(greatGrandChildObj);
                            let greatGrandChildCommissionSnapshot = await getDocs(query(commRef, where("affiliate_id", "==", greatGrandChildDoc.id)));
                            if (greatGrandChildCommissionSnapshot.size > 0) {
                                greatGrandChildCommissionSnapshot.docs.forEach((greatGrandChildComm) => {
                                    let greatGrandChildCommData = greatGrandChildComm.data();
                                    console.log(greatGrandChildCommData)
                                    comm += greatGrandChildCommData.amount;
                                });
                            }

                            greatGrandChildObj.commission = comm;
                            refData.push(greatGrandChildObj);
                            return greatGrandChildObj;
                        }));
                    }
                    return [];
                });

                await Promise.all(greatGrandChildPromises);
            }
            return [];
        });

        await Promise.all(grandChildPromises);
    }

    return refData;
};

// Function to fetch referral list
function fetchReferralList(userAddress) {
    const usersRef = collection(db, "users");

    const uq = query(usersRef, where("address", "==", userAddress));
    let parentID = '';
    getDocs(uq)
        .then((querySnapshot) => {
            const refList = [];
            querySnapshot.forEach((doc) => {

                parentID = doc.id;
                console.log(parentID);
            });
            getReferralData(parentID).then((val) => {
                console.log(val, "refdAta printed")
                displayReferralList(val);
            });
            // const q = query(usersRef, where("parent_id", "==", parentID));

            // getDocs(q)
            //     .then((querySnapshot) => {

            //         const refList = [];
            //         querySnapshot.forEach((doc) => {
            //             const userData = doc.data();
            //             // console.log(JSON.stringify(userData['joined_on']));
            //             refList.push(userData);
            //         });


            //     })
            //     .catch((error) => {
            //         console.error("Error getting referral list: ", error);
            //     });

        })
        .catch((error) => {
            console.error("Error getting referral list: ", error);
        });

}

// Function to display referral list in your HTML
function displayReferralList(refList) {
    let out = "";
    if (refList.length > 0) {
        refList.forEach((element) => {
            const comm = element.commission === null ? 0 : element.commission;
            out += `<tr>`;
            out += `<td>${element['address']}</td>`;
            out += `<td>${formatDate((element['joined_on']))}</td>`;
            out += `<td>${comm} TRX</td>`;
            out += `<td>${element['level']}</td>`;
            out += `</tr>`;
        });
    } else {
        out = `<tr><td colspan="4"><center>No Referrals Available</center></td></tr>`;
    }
    $(".refList").html(out);
    $("input[name='total_ref']").val(refList.length);
}


const getUserIDByAddress = async (address) => {
    const usersRef = collection(db, "users");

    const userQuery = query(usersRef, where("address", "==", address));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.size > 0) {
        const userDoc = userSnapshot.docs[0];
        return userDoc.id;
    }

    return null; // User not found
};
const getAmountByAddress = async (address) => {
    const usersRef = collection(db, "users");

    const userQuery = query(usersRef, where("address", "==", address));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.size > 0) {
        const userDoc = userSnapshot.docs[0];
        return userDoc.data()['amount'];
    }

    return null; // User not found
};

const calculateTotals = async (address, amount) => {
    const userID = await getUserIDByAddress(address);

    if (!userID) {
        console.log("User not found.");
        return;
    }

    const transactionsRef = collection(db, "transactions");

    const transactionsQuery = query(transactionsRef, where("userid", "==", userID), orderBy("created_on", "desc"));
    const transactionsSnapshot = await getDocs(transactionsQuery);

    let totalDeposit = 0;
    let totalPayout = 0;
    let depOut = "";
    let payOut = "";
    let out = "";
    let count = 1;
    let payCount = 0;
    let depCount = 0;
    transactionsSnapshot.forEach((transactionDoc) => {
        const transactionData = transactionDoc.data();
        if ((transactionData.type === "deposit" || transactionData.type === "reinvest") && transactionData.is_bonus === 0) {
            totalDeposit += parseFloat(transactionData.amount);
        } else if (transactionData.type === "payout") {
            totalPayout += parseFloat(transactionData.amount);
        }

        if (page == "deposits" && (transactionData.type === "deposit" || transactionData.type === "reinvest")) {
            let status = "";

            transactionData.status == "pending" ? status = "<span class='text-warning'>PENDING</span>" : status = "<span class='text-success'>COMPLETED</span>";
            out += `<tr>
                    <td>${count}</td>
                    <td>${transactionData['amount']}</td>
                    <td>${formatDate(transactionData['created_on'])}</td>
                    <td>${transactionData['type'].toUpperCase()}</td>
                    <td>${status}</td>
                    </tr>`;
            depOut += `<tr>
            <td>${depCount}</td>
            <td>${transactionData['address']}</td>
            <td>${transactionData['amount']}</td>
            <td>${formatDate(transactionData['created_on'])}</td>
            <td>${status}</td>
            </tr>`;
            count++;
            payCount++;
        } else if (page == "payouts" && transactionData.type === "payout") {
            let status = "";

            transactionData.status == "pending" ? status = "<span class='text-warning'>PENDING</span>" : status = "<span class='text-success'>COMPLETED</span>";
            out += `<tr>
                    <td>${count}</td>
                    <td>${transactionData['address']}</td>
                    <td>${transactionData['amount']}</td>
                    <td>${formatDate(transactionData['created_on'])}</td>
                    <td>${status}</td>
                    </tr>`;
            payOut += `<tr>
                    <td>${payCount}</td>
                    <td>${transactionData['address']}</td>
                    <td>${transactionData['amount']}</td>
                    <td>${formatDate(transactionData['created_on'])}</td>
                    <td>${status}</td>
                    </tr>`;
            count++;
            depCount++;
        }
    });
    if (count == 0 && page == "deposits") { out = `<tr><td colspan="5"><center>No Deposit Record Found!</center></td></tr>`; }
    if (count == 0 && page == "payouts") { out = `<tr><td colspan="5"><center>No Payout Record Found!</center></td></tr>`; }
    if (payCount == 0 && page == "admin-dashboard") { payOut = `<tr><td colspan="5"><center>No Payout Record Found!</center></td></tr>` }
    if (depCount == 0 && page == "admin-dashboard") { depOut = `<tr><td colspan="5"><center>No Deposit Record Found!</center></td></tr>` }
    if (page == "deposits" || page == "payouts") { $(".depList").html(out); }
    if (page == "admin-dashboard") { $(".depList").html(depOut); $(".payList").html(depOut); }
    $("input[name='total_dep']").val((totalDeposit + " TRX"))
    $("input[name='total_pay']").val((totalPayout + " TRX"))
    let finalamount = await getAmountByAddress(address);
    $("input[name='total_bal']").val(finalamount + " TRX");
    console.log("Total Deposit:", totalDeposit);
    console.log("Total Payout:", totalPayout);
};

function adminLogout() {
    sessionStorage.removeItem('is_admin');

    // Redirect to index.html or another page
    window.location.href = './login.html'; // Change the URL as needed
}
window.adminLogout = adminLogout;

async function reinvestAmount() {
    const currentRef = collection(db, "users");
    const currentQuery = query(currentRef, where("address", "==", sessionStorage.getItem('address')));
    const cuurentSnapshot = await getDocs(currentQuery);
    if (cuurentSnapshot.size > 0) {
        cuurentSnapshot.forEach(async (currentDoc) => {
            const currentData = currentDoc.data();
            if (parseFloat(currentData['amount']) > 100) {
                const docRef = await addDoc(collection(db, "transactions"), {
                    address: currentData['address'],
                    amount: currentData['amount'],
                    is_bonus: 0,
                    created_on: new Date(),
                    status: "completed",
                    txn_hash: "-",
                    type: "reinvest",
                    userid: currentDoc.id
                });
                console.log("Document written with ID: ", docRef.id);
                await updateDoc(doc(db, "users", currentDoc.id), {
                    amount: 0
                });
                sessionStorage.setItem('amount', 0);
                console.log("amount reinvested successfully");
                window.location.reload();

            }

        })
    }
}

if (page == "user-index") {

    $(document).ready(function () {
        if (
            sessionStorage.getItem('address') != null &&
            sessionStorage.getItem('amount') != null &&
            sessionStorage.getItem('referral_id') != null
        ) {
            // Redirect to index.html
            $(".topnav").append(`<li>
                  <a href="./dashboard.html">Go To Dashboard</a>
                </li>`)

        }

        $("#form").submit(function (e) {
            e.preventDefault();
            // Get the wallet value from your HTML form
            const wallet = $('input[name="wallet"]').val();
            // Define a reference to your Firestore "users" collection
            const usersRef = collection(db, 'users');
            // Create a query to check if a user with the given wallet value exists
            const query1 = query(usersRef, where('address', '==', wallet));

            // Execute the query to check if the user exists
            getDocs(query1)
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        // User with the given wallet exists
                        querySnapshot.forEach((userDoc) => {
                            // Retrieve the user's data
                            const userData = userDoc.data();
                            console.log(userData, userDoc);
                            // Assign relevant data to session variables
                            sessionStorage.setItem('address', userData.address);
                            sessionStorage.setItem('amount', userData.amount);
                            sessionStorage.setItem('referral_id', userData.referral_id);

                            // Redirect to the dashboard (change the URL as needed)
                            window.location.href = './dashboard.html';
                        });
                    } else {
                        // Generate a unique referral ID
                        const uniqueRandomString = generateRandomString(6);

                        // Check if the generated referral ID is unique
                        const uniqueQuery = query(usersRef, where('referral_id', '==', uniqueRandomString));
                        getDocs(uniqueQuery)
                            .then(async (uniqueSnapshot) => {
                                if (uniqueSnapshot.empty) {
                                    // The referral ID is unique
                                    const parent = $('input[name="parent"]').val(); // Get parent from your HTML form
                                    let parentId = "fULlYx"; // Initialize parentId
                                    if (parent != "") {
                                        // Query the database to get the parent's ID using their referral ID
                                        const parentQuery = query(usersRef, where('referral_id', '==', parent));
                                        getDocs(parentQuery)
                                            .then(async (parentSnapshot) => {
                                                if (!parentSnapshot.empty) {
                                                    parentSnapshot.forEach((parentDoc) => {
                                                        const parentData = parentDoc.data();
                                                        console.log(parentData, parentDoc);
                                                        parentId = parentDoc.id;
                                                    });
                                                }

                                                // Insert the new user into the Firebase database with initial values
                                                const newUser = {
                                                    address: wallet,
                                                    amount: 0,
                                                    referral_id: uniqueRandomString,
                                                    parent_id: parentId,
                                                    joined_on: new Date()
                                                };

                                                await addDoc(usersRef, newUser);

                                                // Assign values to session variables
                                                sessionStorage.setItem('address', wallet);
                                                sessionStorage.setItem('amount', 0);
                                                sessionStorage.setItem('referral_id', uniqueRandomString);

                                                // Redirect to the dashboard (change the URL as needed)
                                                window.location.href = './dashboard.html';
                                            });
                                    } else {
                                        // Insert the new user into the Firebase database with initial values
                                        const newUser = {
                                            address: wallet,
                                            amount: 0,
                                            referral_id: uniqueRandomString,
                                            parent_id: parentId,
                                            joined_on: new Date()
                                        };

                                        await addDoc(usersRef, newUser);

                                        // Assign values to session variables
                                        sessionStorage.setItem('address', wallet);
                                        sessionStorage.setItem('amount', 0);
                                        sessionStorage.setItem('referral_id', uniqueRandomString);

                                        // Redirect to the dashboard (change the URL as needed)
                                        window.location.href = './dashboard.html';
                                    }
                                }
                            });
                    }
                });

        });
    });

} else {
    // Check if session storage items are set
    if (
        sessionStorage.getItem('address') === null ||
        sessionStorage.getItem('amount') === null ||
        sessionStorage.getItem('referral_id') === null
    ) {
        // Redirect to index.html
        if (page != "admin-login" && page != "admin-dashboard") {
            // window.location.href = './index.html';
        } else {
            if (page == "admin-dashboard") {
                if (sessionStorage.getItem('is_admin') === null) {
                    // window.location.href = './login.html';
                }
            }

        }

    } else {
        $(".btnReinvest").on("click", async function (e) {
            e.preventDefault();
            sessionStorage.getItem('amount') > 100.0 ? await reinvestAmount() : $.notify('For reinvestment, available balance must be greater than 100', { position: "right bottom", className: 'error', });
        });

        const userID = await getUserIDByAddress(sessionStorage.getItem('address'));
        const userAmount = await getAmountByAddress(sessionStorage.getItem('address'));
        if (!userID) {
            console.log("User not found.");
        }

        const transactionsRef = collection(db, "transactions");

        const transactionsQuery = query(transactionsRef, where("userid", "==", userID), orderBy("created_on", "desc"));
        const transactionsSnapshot = await getDocs(transactionsQuery);
        transactionsSnapshot.forEach(async (transactionDoc) => {
            const transactionData = transactionDoc.data();
            if ((transactionData.type === "deposit" || transactionData.type === "reinvest") && transactionData.is_bonus === 0) {
                if (isTimeOlderThan24Hours(transactionData.created_on)) {
                    await updateDoc(doc(db, "transactions", transactionDoc.id), {
                        is_bonus: 1
                    });
                    let amount = parseFloat(transactionData['amount']) + (parseFloat(transactionData['amount']) * 0.25);
                    await updateDoc(doc(db, "users", userID), {
                        amount: userAmount + amount
                    });
                    let finalamount = userAmount + amount
                    sessionStorage.setItem('amount', finalamount);
                }
            }
        })
    }

    try {
        // Add an event listener to the button with the ID btnLogout
        document.getElementById('btnLogout').addEventListener('click', function () {
            // Unset the sessionStorage items
            sessionStorage.removeItem('address');
            sessionStorage.removeItem('amount');
            sessionStorage.removeItem('referral_id');

            // Redirect to index.html or another page
            window.location.href = 'index.html'; // Change the URL as needed
        });



    } catch (error) {
        console.log(error)
    }




    if (page == "dashboard") {
        var baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
        var urlWithRef = baseUrl + "?ref=" + sessionStorage.getItem('referral_id');
        // Display the result
        $("input[name='ref']").val(urlWithRef);
        // Add a click event listener to the input element
        $("#refContainer").css("cursor", "pointer");
        $("#refContainer").on("click", function (e) {
            var inputElement = document.getElementById('refBox');

            inputElement.select();
            inputElement.setSelectionRange(0, 99999); // For mobile devices

            // Copy the text inside the text field
            navigator.clipboard.writeText(inputElement.value);
            // Copy the selected text to the clipboard

            // Deselect the text (optional)
            inputElement.setSelectionRange(0, 0);
            console.log(inputElement.value);
            // Optionally, provide user feedback
            $.notify('Referral URL Copied Successfully', { position: "right bottom", className: 'success', });
        });

        // Retrieve the user's address from sessionStorage
        const userAddress = sessionStorage.getItem('address');
        fetchReferralList(userAddress);
        calculateTotals(userAddress, sessionStorage.getItem('amount'));
    } else if (page == "deposits") {
        let admin_address = "";
        const userAddress = sessionStorage.getItem('address');
        calculateTotals(userAddress, sessionStorage.getItem('amount'));
        $(".minAmount").html("500.00 TRX");
        $("input[name='amount']").attr("min", 500);
        $("input[name='amount']").attr("step", 0.01);
        $(".btnReveal").on("click", function (e) {



        });

        $(".btnConfirm").on("click", async function (e) {
            if ($("input[name='hash']").val() == "") {
                $.notify('Please Enter Transaction Hash First!', { position: "right bottom", className: 'error', })

            } else if ($("input[name='daddress']").val() == "") {
                $.notify('Please Enter Deposit Address First!', { position: "right bottom", className: 'error', })
            } else {
                $(".btnConfirm").html(`Confirming Your Transaction...`);
                let amount = $("input[name='amount']").val();
                let user_address = $("input[name='daddress']").val();
                // user_address = "THP9TR66uMZTRD8bHtYY8FyMtduSuATyBV";
                // admin_address = "TA2WtzsHhqvct1eLNW681YUA55DRXUVuxB";
                let confirmation = false;
                let hash = $("input[name='hash']").val();
                const hashRef = collection(db, "transactions");
                const hashQuery = query(hashRef, where("txn_hash", "==", hash));
                const hashSnapshot = await getDocs(hashQuery);
                if (hashSnapshot.size > 0) {
                    $.notify('Transaction Already Exists, Please deposit amount and provide correct details!', { position: "right bottom", className: 'error', })
                } else {
                    // $("#depositForm").submit();
                    checkTransaction(user_address, admin_address, amount, hash);
                }

            }

        });

        $("#depositForm").submit(async function (e) {
            e.preventDefault();
            let formData = new FormData(this);
            var formDataObject = {};
            $(".btnGenerate").html("Generating....");
            $(".btnGenerate").attr("disabled", "disabled");
            formData.forEach(function (value, key) {
                formDataObject[key] = value;
            });

            console.log(formDataObject);
            const currentRef = collection(db, "users");
            const currentQuery = query(currentRef, where("address", "==", sessionStorage.getItem('address')));
            const cuurentSnapshot = await getDocs(currentQuery);
            if (cuurentSnapshot.size > 0) {
                const currentDoc = cuurentSnapshot.docs[0];

                const currentData = currentDoc.data();
                if ($("input[name='amount']").val() != "") {
                    let amount = $("input[name='amount']").val();
                    $.ajax({
                        "url": "https://api.nowpayments.io/v1/payment",
                        "method": "POST",
                        "headers": {
                            "x-api-key": "248VG41-C78MZPH-MFHXDTC-V7J2GW6",
                            "Content-Type": "application/json"
                        },
                        "data": JSON.stringify({
                            "price_amount": amount,
                            "price_currency": "trx",
                            "pay_currency": "trx",
                            "ipn_callback_url": "https://da9c-39-39-117-200.ngrok-free.app/webhook",
                            "order_id": "RGDBP",
                            "order_description": "LamboDoubler Payment By " + userAddress
                        }),
                        success: async function (response) {
                            // console.log(response);

                            const docRef = await addDoc(collection(db, "transactions"), {
                                amount: formDataObject['amount'],
                                is_bonus: 0,
                                created_on: new Date(),
                                status: "pending",
                                type: "deposit",
                                userid: currentDoc.id
                            });
                            console.log("Document written with ID: ", docRef.id);
                            $(".btnGenerate").html("Generated Successfully!");
                            $("input[name='pay_amount']").val(response.pay_amount + " " + response.pay_currency);
                            $("input[name='pay_address']").val(response.pay_address);
                            $("#pay_address1").find("h5").html(response.pay_address)
                            // $("#pay_qr").attr("src", response.QRCode);
                            new QRCode(document.getElementById("qrCode"), {
                                text: response.pay_address,
                                width: 128,
                                height: 128,
                                colorDark: "#000",
                                colorLight: "#ffffff",
                                correctLevel: QRCode.CorrectLevel.H
                            });
                            $("#expiryText").html("QR Code will expire at: " + formatDateTime(response.expiration_estimate_date))
                            $(".paymentDetails").removeClass("d-none");
                            $(".btnGenerate").html("Regenerate QR Code");
                            $(".btnGenerate").removeAttr("disabled");
                        },
                        error: function (error) {
                            // console.log(error);
                        }
                    });
                    $(".btnConfirm").removeClass("d-none");
                    $(".addressBar").removeClass("d-none");
                    $(".btnReveal").addClass("d-none");
                } else {
                    $.notify('Please Enter Some Amount First!', { position: "right bottom", className: 'error', });
                }

                // sessionStorage.setItem('amount', formDataObject['amount']);


            }
        });


    } else if (page == "payouts") {
        const userAddress = sessionStorage.getItem('address');
        calculateTotals(userAddress, sessionStorage.getItem('amount'));
        $("#payoutform").submit(async function (e) {
            e.preventDefault();
            let address = $("input[name='address']").val();
            const currentRef = collection(db, "users");
            const currentQuery = query(currentRef, where("address", "==", sessionStorage.getItem('address')));
            const cuurentSnapshot = await getDocs(currentQuery);
            if (cuurentSnapshot.size > 0) {
                cuurentSnapshot.forEach(async (currentDoc) => {
                    const currentData = currentDoc.data();
                    if (parseFloat(currentData['amount']) > 100) {
                        const docRef = await addDoc(collection(db, "transactions"), {
                            address: address,
                            amount: currentData['amount'],
                            is_bonus: 1,
                            created_on: new Date(),
                            status: "pending",
                            txn_hash: "0",
                            type: "payout",
                            userid: currentDoc.id
                        });
                        console.log("Document written with ID: ", docRef.id);
                        await updateDoc(doc(db, "users", currentDoc.id), {
                            amount: 0
                        });
                        sessionStorage.setItem('amount', 0);
                        console.log("amount payout successfully");
                        window.location.reload();

                    } else {
                        $.notify('For payout request, available balance must be greater than 100', { position: "right bottom", className: 'error', });
                    }

                })
            }
        });
    } else if (page == "admin-login") {
        $("#adminform").submit(async function (e) {
            e.preventDefault();
            let email = $("input[name='email']").val()
            let pass = $("input[name='pass']").val()
            const currentRef = collection(db, "admin");
            const currentQuery = query(currentRef, where("email", "==", email), where("pass", "==", pass));
            const cuurentSnapshot = await getDocs(currentQuery);
            if (cuurentSnapshot.size > 0) {
                sessionStorage.setItem("is_admin", cuurentSnapshot.docs[0].data()['name']);
                window.location.href = "./index.html";
            }
        });
    } else if (page == "admin-dashboard") {
        const transactionsRef = collection(db, "transactions");

        const transactionsQuery = query(transactionsRef, orderBy("created_on", "desc"));
        const transactionsSnapshot = await getDocs(transactionsRef);

        let totalDeposit = 0;
        let totalPayout = 0;
        let depOut = "";
        let payOut = "";
        let payCount = 1;
        let depCount = 1;
        const processTransactions = async (transactionsSnapshot, page) => {
            let totalDeposit = 0;
            let totalPayout = 0;
            let depOut = '';
            let payOut = '';
            let depCount = 1;
            let payCount = 1;

            for (const transactionDoc of transactionsSnapshot.docs) {
                const transactionData = transactionDoc.data();
                console.log(transactionData);

                if ((transactionData.type === "deposit" || transactionData.type === "reinvest") && transactionData.is_bonus === 0) {
                    totalDeposit += parseFloat(transactionData.amount);
                } else if (transactionData.type === "payout") {
                    totalPayout += parseFloat(transactionData.amount);
                }

                if (page == "admin-dashboard" && (transactionData.type === "deposit" || transactionData.type === "reinvest")) {
                    let status = "";

                    try {
                        const greatGrandParentRef = doc(db, "users", transactionData['userid']);
                        const greatGrandParentSnap = await getDoc(greatGrandParentRef);
                        const greatGrandParentData = greatGrandParentSnap.data();
                        console.log(greatGrandParentData);

                        transactionData.status == "pending" ? status = `<button onclick="confirmTransaction('${transactionDoc.id}')" class='btn btn-success'>Confirm</button>` : status = "<span class='text-success'>COMPLETED</span>";
                        depOut += `<tr>
                            <td>${depCount}</td>
                            <td>${greatGrandParentData['address']}</td>
                            <td>${transactionData['amount']}</td>
                            <td>${formatDate(transactionData['created_on'])}</td>
                            <td>${status}</td>
                        </tr>`;
                        depCount++;
                    } catch (error) {
                        console.error("Error fetching user data:", error);
                    }
                } else if (page == "admin-dashboard" && transactionData.type === "payout") {
                    let status = "";

                    transactionData.status == "pending" ? status = `<button onclick="confirmTransaction('${transactionDoc.id}')" class='btn btn-success'>Confirm</button>` : status = "<span class='text-success'>COMPLETED</span>";
                    try {
                        const greatGrandParentRef = doc(db, "users", transactionData['userid']);
                        const greatGrandParentSnap = await getDoc(greatGrandParentRef);
                        const greatGrandParentData = greatGrandParentSnap.data();
                        console.log(greatGrandParentData);

                        payOut += `<tr>
                            <td>${payCount}</td>
                            <td>${greatGrandParentData['address']}</td>
                            <td>${transactionData['amount']}</td>
                            <td>${formatDate(transactionData['created_on'])}</td>
                            <td>${status}</td>
                        </tr>`;
                        payCount++;
                    } catch (error) {
                        console.error("Error fetching user data:", error);
                    }
                }
            }

            return { totalDeposit, totalPayout, depOut, payOut, depCount, payCount };
        };


        await processTransactions(transactionsSnapshot, page)
            .then((result) => {
                // Process the result here
                console.log("result", result);
                depCount = result.depCount;
                payCount = result.payCount;
                depOut = result.depOut
                payOut = result.payOut
                totalDeposit = result.totalDeposit;
                totalPayout = result.totalPayout;
                console.log(depCount, payCount)
                if (payCount == 0 && page == "admin-dashboard") { payOut = `<tr><td colspan="5"><center>No Payout Record Found!</center></td></tr>` }
                if (depCount == 0 && page == "admin-dashboard") { depOut = `<tr><td colspan="5"><center>No Deposit Record Found!</center></td></tr>` }
                if (page == "admin-dashboard") { $(".depList").html(depOut); $(".payList").html(payOut); }
                $("input[name='total_dep']").val((totalDeposit + " TRX"))
                $("input[name='total_pay']").val((totalPayout + " TRX"))

                console.log("Total Deposit:", totalDeposit);
                console.log("Total Payout:", totalPayout);
            })
            .catch((error) => {
                // Handle errors here
                console.error("Error processing transactions:", error);
            });

    }

}

function formatDateTime(inputDate) {
    const date = new Date(inputDate);

    // Extract date components
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    // Extract time components
    const hours = date.getHours() % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = date.getHours() < 12 ? 'AM' : 'PM';

    // Format and print the date
    const formattedDate = `${month}/${day}/${year} at ${hours}:${minutes} ${ampm}`;
    // console.log(formattedDate);
    return formattedDate;
}

