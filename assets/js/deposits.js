let user_address = "";
let admin_address = "";
let avail_balance = 0.00;

function formatTimestamp(timestamp) {
    // Create a Date object from the timestamp
    const date = new Date(timestamp);

    // Format the date and time
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };

    const formattedDate = date.toLocaleDateString(undefined, options);

    return formattedDate;
}

$(document).ready(function () {
    $(".btnReinvest").on("click", function (e) {
        e.preventDefault();
        avail_balance > 100.0 ? window.location.href = "./includes/worker.php?action=reinvest&page=deposit" : $.notify('For reinvestment, available balance must be greater than 100', { position: "right bottom", className: 'error', });
    });

    $(".btnReveal").on("click", function (e) {
        $("input[name='amount']").val() != "" ?
            ($(".btnConfirm").removeClass("d-none"),
                $(".addressBar").removeClass("d-none"),
                $(".btnReveal").addClass("d-none")) : $.notify('Please Enter Some Amount First!', { position: "right bottom", className: 'error', });
    });
    $.ajax({
        type: "POST",
        url: "./includes/worker.php", // Replace with the URL of your PHP script
        data: {
            action: "get-address"
        },
        success: function (response) {
            // Assuming the response contains the "ref" value
            var refValue = JSON.parse(response);
            admin_address = refValue['raddress'];
            // $("input[name='address']").val(refValue['data']);
            $("input[name='raddress']").val(refValue['raddress']);
            // Example usage:
            if (refValue['coin'] == "usdt") {
                $(".minAmount").html("10.00 USDT (TRC-20)");
                $("input[name='amount']").attr("min", 10.00);
                $("input[name='amount']").attr("step", 0.01);
            } else if (refValue['coin'] == "btc") {
                getLivePrice(refValue['coin']).then((price) => {
                    let p = parseFloat(price);
                    let req = (1 / p) * 10;
                    console.log(req.toFixed(8));
                    $(".minAmount").html(req.toFixed(8) + " " + refValue['coin'].toUpperCase())
                    $("input[name='amount']").attr("min", req.toFixed(8));
                });
            } else if (refValue['coin'] == "trx") {
                $(".minAmount").html("150.00 TRX");
                $("input[name='amount']").attr("min", 150);
                $("input[name='amount']").attr("step", 0.01);
            } else if (refValue['coin'] == "doge") {
                $(".minAmount").html("100 DOGE");
                $("input[name='amount']").attr("min", 100);
                $("input[name='amount']").attr("step", 0.01);
            } else if (refValue['coin'] == "eth") {
                getLivePrice(refValue['coin']).then((price) => {
                    let p = parseFloat(price);
                    let req = (1 / p) * 10;
                    console.log(req.toFixed(8));
                    $(".minAmount").html(req.toFixed(8) + " " + refValue['coin'].toUpperCase())
                    $("input[name='amount']").attr("min", req.toFixed(8));
                });
            }



        },
        error: function (xhr, status, error) {
            // Handle errors here
            console.log("Error: " + error);
        }

    });

    $.ajax({
        type: "POST",
        url: "./includes/worker.php", // Replace with the URL of your PHP script
        data: {
            action: "total-payouts"
        },
        success: function (response) {
            var data = JSON.parse(response);
            console.log(data);
            let coin = data['coin'];
            user_address = data['caddress'];
            console.log(user_address);
            avail_balance = parseFloat(data['balance']);
            if (data['data'].length > 0) {
                let total_dep = 0.00000000;
                let total_pay = 0.00000000;
                let out = "";
                for (let i = 0; i < data['data'].length; i++) {
                    const element = data['data'][i];
                    if (element['type'] == "deposit" || element['type'] == "reinvest") {
                        let status = "";

                        element.status == "pending" ? status = "<span class='text-warning'>PENDING</span>" : status = "<span class='text-success'>COMPLETED</span>";
                        out += `<tr>
                        <td>${element['id']}</td>
                        <td>${element['amount']}</td>
                        <td>${formatDate(element['created_on'])}</td>
                        <td>${element['type'].toUpperCase()}</td>
                        <td>${status}</td>
                        </tr>`;
                        total_dep += element['is_bonus'] == "0" ? parseFloat(element['amount']) : 0;
                    }
                    else if (element['type'] == "payout") {
                        total_pay += parseFloat(element['amount']);
                    }
                }
                out.length == 0 ? out = `<tr>
                <td colspan="5"><center>No Deposit Record Found!</center></td>
                </tr>` : out;
                $(".depList").html(out);
                if (coin == "btc") {
                    $("input[name='total_dep']").val(total_dep.toFixed(8) + " BTC");
                    $("input[name='total_pay']").val(total_pay.toFixed(8) + " BTC");
                    $("input[name='total_bal']").val(data['balance'] + " BTC");
                } else if (coin == "doge") {
                    $("input[name='total_dep']").val(total_dep + " DOGE");
                    $("input[name='total_pay']").val(total_pay + " DOGE");
                    $("input[name='total_bal']").val(data['balance'] + " DOGE");
                } else if (coin == "trx") {
                    $("input[name='total_dep']").val(total_dep + " TRX");
                    $("input[name='total_pay']").val(total_pay + " TRX");
                    $("input[name='total_bal']").val(data['balance'] + " TRX");
                } else if (coin == "eth") {
                    $("input[name='total_dep']").val(total_dep + " ETH");
                    $("input[name='total_pay']").val(total_pay + " ETH");
                    $("input[name='total_bal']").val(data['balance'] + " ETH");
                } else if (coin == "usdt") {
                    $("input[name='total_dep']").val(total_dep + " USDT");
                    $("input[name='total_pay']").val(total_pay + " USDT");
                    $("input[name='total_bal']").val(data['balance'] + " USDT");
                }

            }
            else {
                let out = `<tr>
                        <td colspan="5"><center>No Deposit Record Found!</center></td>
                        </tr>`;
                $(".depList").html(out);
                if (coin == "btc") {
                    $("input[name='total_dep']").val("0.00000000 BTC");
                    $("input[name='total_pay']").val("0.00000000 BTC");
                    $("input[name='total_bal']").val(data['balance'] + " BTC");
                } else if (coin == "doge") {
                    $("input[name='total_dep']").val("0.00000000 DOGE");
                    $("input[name='total_pay']").val("0.00000000 DOGE");
                    $("input[name='total_bal']").val(data['balance'] + " DOGE");
                } else if (coin == "trx") {
                    $("input[name='total_dep']").val("0.00000000 TRX");
                    $("input[name='total_pay']").val("0.00000000 TRX");
                    $("input[name='total_bal']").val(data['balance'] + " TRX");
                } else if (coin == "eth") {
                    $("input[name='total_dep']").val("0.00000000 ETH");
                    $("input[name='total_pay']").val("0.00000000 ETH");
                    $("input[name='total_bal']").val(data['balance'] + " ETH");
                } else if (coin == "usdt") {
                    $("input[name='total_dep']").val("0.00000000 USDT");
                    $("input[name='total_pay']").val("0.00000000 USDT");
                    $("input[name='total_bal']").val(data['balance'] + " USDT");
                }

            }

        },
        error: function (xhr, status, error) {
            // Handle errors here
            console.log("Error: " + error);
        }

    });

    $(".btnConfirm").on("click", function (e) {
        if ($("input[name='hash']").val() == "") {
            $.notify('Please Enter Transaction Hash First!', { position: "right bottom", className: 'error', })

        } else if ($("input[name='daddress']").val() == "") {
            $.notify('Please Enter Deposit Address First!', { position: "right bottom", className: 'error', })
        } else {
            $(".btnConfirm").html(`Confirming Your Transaction...`);
            let amount = $("input[name='amount']").val();
            user_address = $("input[name='daddress']").val();
            // user_address = "THP9TR66uMZTRD8bHtYY8FyMtduSuATyBV";
            // admin_address = "TA2WtzsHhqvct1eLNW681YUA55DRXUVuxB";
            let confirmation = false;
            let hash = $("input[name='hash']").val();
            checkTransaction(user_address, admin_address, amount, hash);
        }

    });
});

function checkTransaction(user_address, admin_address, amount, txn) {
    $.ajax({
        type: "POST",
        url: "./includes/worker.php", // Replace with the URL of your PHP script
        data: {
            action: "check-hash",
            hash: txn
        },
        success: function (response) {
            var data = JSON.parse(response);
            if (data.data == "new") {
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
                                confirmation = true;
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
            } else {
                $.notify('Transaction Already Exists, Please deposit amount and provide correct details!', { position: "right bottom", className: 'error', })
            }
        }
    });

}



async function getLivePrice(coin) {
    let price = 0.00;
    let apiUrl = "";

    switch (coin) {
        case "btc":
            apiUrl = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
            break;

        case "trx":
            apiUrl = "https://api.coingecko.com/api/v3/simple/price?ids=tron&vs_currencies=usd";
            break;

        case "doge":
            apiUrl = "https://api.coingecko.com/api/v3/simple/price?ids=dogecoin&vs_currencies=usd";
            break;

        case "eth":
            apiUrl = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
            break;

        default:
            break;
    }

    if (apiUrl !== "") {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            switch (coin) {
                case "btc":
                    price = data.bitcoin.usd;
                    break;

                case "trx":
                    price = data.tron.usd;
                    break;

                case "doge":
                    price = data.dogecoin.usd;
                    break;

                case "eth":
                    price = data.ethereum.usd;
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    return price;
}

function formatDate(inputDate) {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    const date = new Date(inputDate);
    const formattedDate = date.toLocaleString('en-US', options);

    return formattedDate;
}
