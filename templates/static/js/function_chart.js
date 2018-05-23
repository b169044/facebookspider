/**
 * Created by LEGO on 2018/1/4.
 */
$(document).ready(function () {
    $('#datepick3').datetimepicker();
    $('#datepick4').datetimepicker();
    selectCountry();
    document.getElementById("btn_select").addEventListener('click', function () {
        console.log("from" + $('#datepick3').val() + "  to  " + $('#datepick4').val()+ $(".country")[0].value);
        sendAjax4();
    });

    function selectCountry() {
        $.cxSelect.defaults.url = 'static/js/cityData.min.json';

        $('#global_location2').cxSelect({

            url: 'static/js/globalData.min.json',

            selects: ['country', 'state', 'city'],

            nodata: 'none'

        });

        $("#select_def").click(function () {
            $("#select_def  option[value='新加坡']").attr("selected", true);

        });
    }

    function sendAjax4() {
        var ajaxGet = $.get("/drawChart", {
            country: $(".country")[0].value, state: $(".state")[0].value, city: $(".city")[0].value
            , tstart: $('#datepick3').val(), tend: $('#datepick4').val()
        }, function (data) {
            //console.log(data);
            var result = JSON.parse(data);
            console.log(result);
        });
    }
});