$(document).ready(function () {
    let btc_rate = 0;
    let doge_rate = 0;
    let trx_rate = 0;
    let eth_rate = 0;

    getLivePrice("btc").then((price) => {
        btc_rate = parseFloat(price);
        getLivePrice("doge").then((price) => {
            doge_rate = parseFloat(price);
            getLivePrice("trx").then((price) => {
                trx_rate = parseFloat(price);
                getLivePrice("eth").then((price) => {
                    eth_rate = parseFloat(price);
                    $.ajax({
                        type: "POST",
                        url: "../includes/worker.php", // Replace with the URL of your PHP script
                        data: {
                            action: "total-payouts-all"
                        },
                        success: function (response) {
                            var data = JSON.parse(response);
                            console.log(data);
                            if (data['data'].length > 0) {
                                let total_dep = 0.00000000;
                                let total_pay = 0.00000000;
                                let pay_out = "";
                                let dep_out = "";
                                for (let i = 0; i < data['data'].length; i++) {
                                    const element = data['data'][i];
                                    if (element['type'] == "deposit") {
                                        let status = "";
                                        element.status == "pending" ? status = "<button onclick='confirmTransaction(" + element.id + ")' class='btn btn-success'>Confirm</button>" : status = "<span class='text-success'>COMPLETED</span>";
                                        dep_out += `<tr>
                                        <td>${element['id']}</td>
                                        <td>${element['address']}</td>
                                        <td>${element['amount']} ${element.coin.toUpperCase()}</td>
                                        <td>${formatDate(element['created_on'])}</td>
                                        <td>${status}</td>
                                        </tr>`;
                                        if (element.coin == "btc") { total_dep += parseFloat(element['amount']) * btc_rate }
                                        if (element.coin == "doge") { total_dep += parseFloat(element['amount']) * doge_rate }
                                        if (element.coin == "trx") { total_dep += parseFloat(element['amount']) * trx_rate }
                                        if (element.coin == "eth") { total_dep += parseFloat(element['amount']) * eth_rate }
                                        console.log("Deposit", total_dep);
                                    }
                                    else if (element['type'] == "payout") {
                                        let status = "";
                                        element.status == "pending" ? status = "<button onclick='confirmTransaction(" + element.id + ")' class='btn btn-success'>Confirm</button>" : status = "<span class='text-success'>COMPLETED</span>";
                                        
                                        pay_out += `<tr>
                                        <td>${element['id']}</td>
                                        <td>${element['address']}</td>
                                        <td>${element['amount']} ${element.coin.toUpperCase()}</td>
                                        <td>${formatDate(element['created_on'])}</td>
                                        <td>${status}</td>
                                        </tr>`;
                                        if (element.coin == "btc") { total_pay += parseFloat(element['amount']) * btc_rate }
                                        if (element.coin == "doge") { total_pay += parseFloat(element['amount']) * doge_rate }
                                        if (element.coin == "trx") { total_pay += parseFloat(element['amount']) * trx_rate }
                                        if (element.coin == "eth") { total_pay += parseFloat(element['amount']) * eth_rate }
                                        
                                    }
                                }
                                dep_out.length == 0 ? out = `<tr>
                                <td colspan="5"><center>No Deposit Record Found!</center></td>
                                </tr>` : dep_out;
                                $(".depList").html(dep_out);
                                pay_out.length == 0 ? out = `<tr>
                                <td colspan="5"><center>No Payout Record Found!</center></td>
                                </tr>` : pay_out;
                                $(".payList").html(pay_out);

                                $("input[name='total_dep']").val("$" + total_dep.toFixed(8));
                                $("input[name='total_pay']").val("$" + total_pay.toFixed(8));
                                $("input[name='total_users']").val(data['data'][0]['users']);

                            }
                            else {
                                dep_out.length == 0 ? out = `<tr>
                                <td colspan="5"><center>No Deposit Record Found!</center></td>
                                </tr>` : dep_out;
                                $(".depList").html(dep_out);
                                pay_out.length == 0 ? out = `<tr>
                                <td colspan="5"><center>No Payout Record Found!</center></td>
                                </tr>` : pay_out;
                                $(".payList").html(pay_out);

                                $("input[name='total_dep']").val("$" + total_dep.toFixed(8));
                                $("input[name='total_pay']").val("$" + total_pay.toFixed(8));
                                $("input[name='total_users']").val(data['data'][0]['users']);

                            }

                        },
                        error: function (xhr, status, error) {
                            // Handle errors here
                            console.log("Error: " + error);
                        }

                    });
                });
            });
        });
    });




});
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

function confirmTransaction(id)
{
    let btc_rate = 0;
    let trx_rate = 0;
    let eth_rate = 0;
    let doge_rate = 0;
    let usdt_rate = 1;
    getLivePrice("btc").then((price) => {
        btc_rate = parseFloat(price);
        getLivePrice("doge").then((price) => {
            doge_rate = parseFloat(price);
            getLivePrice("trx").then((price) => {
                trx_rate = parseFloat(price);
                getLivePrice("eth").then((price) => {
                    eth_rate = parseFloat(price);
                    $.ajax({
                        type: "POST",
                        url: "../includes/worker.php", // Replace with the URL of your PHP script
                        data: {
                            action: "confirm-transaction",
                            id : id,
                            btc_rate : btc_rate,
                            trx_rate : trx_rate,
                            doge_rate : doge_rate,
                            eth_rate : eth_rate,
                            usdt_rate : usdt_rate
                        },
                        success: function (response) {
                            console.log(response);
                            var data = JSON.parse(response);
                            if(data.status == "success")
                            {
                                window.location.href = "./index.php";
                            }
                        }
                    });
                });
            });
        });
    });
    
}