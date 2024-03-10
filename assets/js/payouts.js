let avail_balance = 0.0;
$(document).ready(function(){
    $(".btnReinvest").on("click", function(e){
        e.preventDefault();
        avail_balance > 100.0 ? window.location.href = "./includes/worker.php?action=reinvest&page=payout" : $.notify('For reinvestment, available balance must be greater than 100', { position: "right bottom", className: 'error', });
    });
    $.ajax({
        type: "POST",
        url: "./includes/worker.php", // Replace with the URL of your PHP script
        data: {
            action: "total-payouts"
        },
        success: function (response) {
            var data = JSON.parse(response);
            let coin = data['coin'];
            avail_balance = parseFloat(data['balance']);
            if(data['data'].length > 0)
            {
                let total_dep = 0.00000000;
                let total_pay = 0.00000000;
                let out = "";
                for (let i = 0; i < data['data'].length; i++) {
                    const element = data['data'][i];
                    if((element['type'] == "deposit" || element['type'] == "reinvest") && element['is_bonus'] == "0")
                    {
                        total_dep += parseFloat(element['amount']);
                    }
                    else if(element['type'] == "payout")
                    {
                        let status = "";
                        element.status == "pending" ? status = "<span class='text-warning'>PENDING</span>" : status = "<span class='text-success'>COMPLETED</span>";
                        out += `<tr>
                        <td>${element['id']}</td>
                        <td>${element['address']}</td>
                        <td>${element['amount']}</td>
                        <td>${formatDate(element['created_on'])}</td>
                        <td>${status}</td>
                        </tr>`;
                        total_pay += parseFloat(element['amount']);
                    }
                }
                out.length == 0 ? out = `<tr>
                <td colspan="5"><center>No Payout Record Found!</center></td>
                </tr>` : out;
            $(".depList").html(out);
                $(".depList").html(out);
                if(coin == "btc")
                {
                    $("input[name='total_dep']").val(total_dep.toFixed(8) + " BTC");
                    $("input[name='total_pay']").val(total_pay.toFixed(8) + " BTC");
                    $("input[name='total_bal']").val(data['balance'] + " BTC");
                    $(".total_bal").html("Available Balance: " + data['balance'] + " BTC");
                } else if(coin == "doge") {
                    $("input[name='total_dep']").val(total_dep + " DOGE");
                    $("input[name='total_pay']").val(total_pay + " DOGE");
                    $("input[name='total_bal']").val(data['balance'] + " DOGE");
                    $(".total_bal").html("Available Balance: " + data['balance'] + " DOGE");
                } else if(coin == "trx") {
                    $("input[name='total_dep']").val(total_dep + " TRX");
                    $("input[name='total_pay']").val(total_pay + " TRX");
                    $("input[name='total_bal']").val(data['balance'] + " TRX");
                    $(".total_bal").html("Available Balance: " + data['balance'] + " TRX");
                } else if(coin == "eth") {
                    $("input[name='total_dep']").val(total_dep + " ETH");
                    $("input[name='total_pay']").val(total_pay + " ETH");
                    $("input[name='total_bal']").val(data['balance'] + " ETH");
                    $(".total_bal").html("Available Balance: " + data['balance'] + " ETH");
                } 
                
            }
            else 
            {
                let out = `<tr>
                        <td colspan="5"><center>No Payout Record Found!</center></td>
                        </tr>`;
                    $(".depList").html(out);
                if(coin == "btc")
                {
                    $("input[name='total_dep']").val("0.00000000 BTC");
                    $("input[name='total_pay']").val("0.00000000 BTC");
                    $("input[name='total_bal']").val(data['balance'] + " BTC");
                    $(".total_bal").html("Available Balance: " + data['balance'] + " BTC");
                } else if(coin == "doge") {
                    $("input[name='total_dep']").val("0.00000000 DOGE");
                    $("input[name='total_pay']").val("0.00000000 DOGE");
                    $("input[name='total_bal']").val(data['balance'] + " DOGE");
                    $(".total_bal").html("Available Balance: " + data['balance'] + " DOGE");
                } else if(coin == "trx") {
                    $("input[name='total_dep']").val("0.00000000 TRX");
                    $("input[name='total_pay']").val("0.00000000 TRX");
                    $("input[name='total_bal']").val(data['balance'] + " TRX");
                    $(".total_bal").html("Available Balance: " + data['balance'] + " TRX");
                } else if(coin == "eth") {
                    $("input[name='total_dep']").val("0.00000000 ETH");
                    $("input[name='total_pay']").val("0.00000000 ETH");
                    $("input[name='total_bal']").val(data['balance'] + " ETH");
                    $(".total_bal").html("Available Balance: " + data['balance'] + " ETH");
                }
                
            }

        },
        error: function (xhr, status, error) {
            // Handle errors here
            console.log("Error: " + error);
        }

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