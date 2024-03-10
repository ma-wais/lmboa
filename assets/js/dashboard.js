let avail_balance = 0.0;
$(document).ready(function () {
    $(".btnReinvest").on("click", function(e){
        e.preventDefault();
        avail_balance > 100.0 ? window.location.href = "./includes/worker.php?action=reinvest&page=deposit" : $.notify('For reinvestment, available balance must be greater than 100', { position: "right bottom", className: 'error', });
    });
    $.ajax({
        type: "POST",
        url: "./includes/worker.php", // Replace with the URL of your PHP script
        data: {
            action: "get-referral"
        },
        success: function (response) {
            // Assuming the response contains the "ref" value
            var refValue = JSON.parse(response);

            // Print the base URL with the "ref" parameter added
            var baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/');
            var urlWithRef = baseUrl + "?ref=" + refValue['data'];


            // Display the result
            $("input[name='ref']").val(urlWithRef);
        },
        error: function (xhr, status, error) {
            // Handle errors here
            console.log("Error: " + error);
        }

    });
    
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

    $.ajax({
        type: "POST",
        url: "./includes/worker.php", // Replace with the URL of your PHP script
        data: {
            action: "referral-list"
        },
        success: function (response) {
            // Assuming the response contains the "ref" value
            console.log(response);
            var data = JSON.parse(response);
            console.log(data);
            let refCount = Number(data['data'].length);
            
            let out = ""
            if(refCount > 0)
            {
                for (let i = 0; i < data['data'].length; i++) {
                    const element = data['data'][i];
                    let comm = element.commission == null ? 0 : element.commission;
                    out += `<tr>`;
                    out += `<td>${element['address']}</td>`;
                    out += `<td>${formatDate(element['joined_on'])}</td>`;
                    out += `<td>${comm} TRX</td>`;
                    out += `<td>${element['level']}</td>`;
                    out += `</tr>`;     
                }
            }
            else 
            {
                out = `<tr><td colspan="3"><center>No Referrals Available</center></td></tr>`;
            }
            $(".refList").html(out);    
            $("input[name='total_ref']").val(refCount);
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
            // Assuming the response contains the "ref" value
            var data = JSON.parse(response);
            let coin = data['coin'];
            avail_balance = parseFloat(data['balance']);
            if(data['data'].length > 0)
            {
                let total_dep = 0.00000000;
                let total_pay = 0.00000000;
                for (let i = 0; i < data['data'].length; i++) {
                    const element = data['data'][i];
                    if((element['type'] == "deposit" || element['type'] == 'reinvest') && element['is_bonus'] == "0")
                    {
                        total_dep += parseFloat(element['amount']);
                    }
                    else if(element['type'] == "payout")
                    {
                        total_pay += parseFloat(element['amount']);
                    }
                }
                if(coin == "btc")
                {
                    $("input[name='total_dep']").val(total_dep.toFixed(8) + " BTC");
                    $("input[name='total_pay']").val(total_pay.toFixed(8) + " BTC");
                    $("input[name='total_bal']").val(data['balance'] + " BTC");
                } else if(coin == "doge") {
                    $("input[name='total_dep']").val(total_dep + " DOGE");
                    $("input[name='total_pay']").val(total_pay + " DOGE");
                    $("input[name='total_bal']").val(data['balance'] + " DOGE");
                } else if(coin == "trx") {
                    $("input[name='total_dep']").val(total_dep + " TRX");
                    $("input[name='total_pay']").val(total_pay + " TRX");
                    $("input[name='total_bal']").val(data['balance'] + " TRX");
                } else if(coin == "eth") {
                    $("input[name='total_dep']").val(total_dep + " ETH");
                    $("input[name='total_pay']").val(total_pay + " ETH");
                    $("input[name='total_bal']").val(data['balance'] + " ETH");
                } else if(coin == "usdt") {
                    $("input[name='total_dep']").val(total_dep + " USDT");
                    $("input[name='total_pay']").val(total_pay + " USDT");
                    $("input[name='total_bal']").val(data['balance'] + " USDT");
                } 
                
            }
            else 
            {
                if(coin == "btc")
                {
                    $("input[name='total_dep']").val("0.00000000 BTC");
                    $("input[name='total_pay']").val("0.00000000 BTC");
                    $("input[name='total_bal']").val(data['balance'] + " BTC");
                } else if(coin == "doge") {
                    $("input[name='total_dep']").val("0.00000000 DOGE");
                    $("input[name='total_pay']").val("0.00000000 DOGE");
                    $("input[name='total_bal']").val(data['balance'] + " DOGE");
                } else if(coin == "trx") {
                    $("input[name='total_dep']").val("0.00000000 TRX");
                    $("input[name='total_pay']").val("0.00000000 TRX");
                    $("input[name='total_bal']").val(data['balance'] + " TRX");
                } else if(coin == "eth") {
                    $("input[name='total_dep']").val("0.00000000 ETH");
                    $("input[name='total_pay']").val("0.00000000 ETH");
                    $("input[name='total_bal']").val(data['balance'] + " ETH");
                } else if(coin == "usdt") {
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
});
function formatDate(inputDate) {
    // Create a Date object from the input string
    const date = new Date(inputDate);

    // Define month names
    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    // Get the day, month, and year
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    // Add "st," "nd," "rd," or "th" to the day
    let daySuffix;
    if (day === 1 || day === 21 || day === 31) {
        daySuffix = "st";
    } else if (day === 2 || day === 22) {
        daySuffix = "nd";
    } else if (day === 3 || day === 23) {
        daySuffix = "rd";
    } else {
        daySuffix = "th";
    }

    // Construct the formatted date string
    const formattedDate = `${day}${daySuffix} ${monthNames[monthIndex]} ${year}`;

    return formattedDate;
}
