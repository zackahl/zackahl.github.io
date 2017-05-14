/*jslint browser: true*/
/*global
$, moment
*/

$(document).ready(function(){
	
	// Global variables	
	var tableData = [];
    var time;
	var total = moment.duration('0.00:00:00');
    
    //// FUNCTION: Update exercise period ////
    var updateExercisePeriod = function() {
        var periodMin, periodMax = tableData[0].date;
        if (tableData.length > 1) {
            periodMin = tableData[0].date;
            periodMax = tableData[0].date;
            for (var i = 1; i < tableData.length; i++) {
                // If date is < min then update min
                if (moment(tableData[i].date)<(periodMin)) {
                    periodMin = tableData[i].date;
                }
                // If date is > max then update max
                if (moment(tableData[i].date)>(periodMax)) {
                    periodMax = tableData[i].date;
                }
            }
        }
        // If there is only one row
        if(tableData.length === 1) {
            periodMin = tableData[0].date;
            periodMax = tableData[0].date;
        }
        // Update startDate and endDate
        $("#stat-start").text(moment(periodMin).format("DD/MM/YYYY"));
        $("#stat-end").text(moment(periodMax).format("DD/MM/YYYY")); 
    };
    
    //// FUNCTION: Update average ////
    var updateMinMax = function() {
        // Min and Max times
		var timeMin, timeMax;
		if (tableData.length > 1) {
			timeMin = moment.duration(tableData[0].time).asSeconds();
            timeMax = moment.duration(tableData[0].time).asSeconds();
			for (var j = 1; j < tableData.length; j++) {
				if(j !== tableData.length) {
					// If time is < min then update min
					if (moment.duration(tableData[j].time).asSeconds() < timeMin) {
						timeMin = moment.duration(tableData[j].time).asSeconds();
					}
					// If time is > max then update max
					if (moment.duration(tableData[j].time).asSeconds() > timeMax) {
						timeMax = moment.duration(tableData[j].time).asSeconds();
					}
				}
			}
		}
		// If there is only one row
		if(tableData.length === 1) {
			timeMin = moment.duration(tableData[0].time).asSeconds();
			timeMax = moment.duration(tableData[0].time).asSeconds();
		}
		// Update min and max
        var min = moment().startOf('day').seconds(timeMin).format('HH:mm:ss');
        var max = moment().startOf('day').seconds(timeMax).format('HH:mm:ss');
		$(".stat-min").text(min);
		$(".stat-max").text(max);
    };
    
    //// FUNCTION: Update average ////
    var updateAverage = function() {
        var avg = moment.duration(total).asSeconds() / tableData.length;
        avg = moment().startOf('day').seconds(avg).format('HH:mm:ss');
		$(".stat-avg").text(avg);
    };
    
    //// FUNCTION: Update total ////
    var updateTotal = function() {
        // Reduce total time        
        var newTotal = moment.duration('0.00:00:00');
        for(var i = 0; i < tableData.length; i++) {
            newTotal += (tableData[i].time).asSeconds();
        }
        total = moment.duration('0.00:00:00');
        total.add(newTotal, 'seconds');
		var tot = total.days() + "." + ("0" + total.hours()).slice(-2) + ":" +
        ("0" + total.minutes()).slice(-2) + ":" + ("0" + total.seconds()).slice(-2);
		$(".stat-total").text(tot);  
    };
    	
	//// FUNCTION: Update the stats in the sidebar ////
	var updateStats = function() {
		// Exercise period 
        updateExercisePeriod();
        // Min and Max
        updateMinMax();
		// Average time
        updateAverage();
		// Total time
		updateTotal();
	};
    
    //// FUNCTION: validate the entered data ////
	var dataValidation = function() {
        // Empty / Invalid date
        if($("#table-medium-up").css("display") == "block") {
            if(time.date.toString() === "Invalid date" || time.date.isValid() === false) {
                $("#date").addClass("alert alert-danger"); return 1;
            } else {
                $("#date").removeClass("alert alert-danger");
            }
        }
        // Not numbers || empty hours, minutes or seconds || invalid range
        if(time.hours === "" || isNaN(time.hours) || time.hours > 99 || time.hours < 0) {
            $(".hours").addClass("alert alert-danger"); return 1;
        } else {
            $(".hours").removeClass("alert alert-danger");
        }
        if(time.minutes === "" || isNaN(time.minutes) || time.minutes > 59 || time.minutes < 0) {
            $(".minutes").addClass("alert alert-danger"); return 1;
        } else {
            $(".minutes").removeClass("alert alert-danger");
        }
        if(time.seconds === "" || isNaN(time.seconds) || time.seconds > 59 || time.seconds < 0) {
            $(".seconds").addClass("alert alert-danger"); return 1;
        } else {
            $(".seconds").removeClass("alert alert-danger");
        }
	};
    
    //// FUNCTION: Format the time hour, minutes and seconds ////
	var formatTimeFields = function() {
       // Ensure all time fields have two integers
        if(time.hours.length !== 2) {
            if(time.hours.length === 0) {
                time.hours = "00";
            } else if (time.hours.length === 1) {
                time.hours = "0" + time.hours;
            }
        }
        if(time.minutes.length !== 2) {
            if(time.minutes.length === 0) {
                time.minutes = "00";
            } else if (time.minutes.length === 1) {
                time.minutes = "0" + time.minutes;
            }
        }
        if(time.seconds.length !== 2) {
            if(time.seconds.length === 0) {
                time.seconds = "00";
            } else if (time.seconds.length === 1) {
                time.seconds = "0" + time.seconds;
            }
        }
    };
    
    //// FUNCTION: Update changes to table data ////
    var updateChanges = function() {
        // Update tableData values on change
        $("td input").unbind('change').change(function(event) {
            // Get the row index
            var row = $(this).parents("tr:first")[0].rowIndex;
            // Get event target
            var target = $(event.target);
            // Variables for the new field values
            var newDate, newHour, newSecond, newMinute, newComment, newTime;

            // Update date
            if($("#table-medium-up").css("display") == "block") {
                if(target.is(".tbl-date")) {
                    // Get new date value
                    newDate = moment($(this).val(), "DD/MM/YYYY");
                    // Validate data 
                    if($("#table-medium-up").css("display") == "block") {
                    if(newDate.toString() === "Invalid date" || newDate.isValid() === false) {
                    $(".tbl-date").addClass("alert alert-danger"); return 1;
                    } else {$(".tbl-date").removeClass("alert alert-danger");}}
                    // Update date
                    tableData[row-1].date = newDate;
                }
            }
            // Update hour
            if (target.is(".tbl-hour")) {
                newHour = $(this).val();
                if(newHour === "" || isNaN(newHour) || newHour > 99 || newHour < 0) {
                $(".tbl-hour").addClass("alert alert-danger"); return 1;
                } else { $(".tbl-hour").removeClass("alert alert-danger"); }
                tableData[row-1].hours = newHour;
            }
            // Update minute
            else if(target.is(".tbl-minute")) {
                newMinute = $(this).val();
                if(newMinute === "" || isNaN(newMinute) || newMinute > 59 || newMinute < 0) {
                $(".tbl-minute").addClass("alert alert-danger"); return 1;
                } else { $(".tbl-minute").removeClass("alert alert-danger"); }
                tableData[row-1].minutes = newMinute;
            } 
            // Update seconds
            else if(target.is(".tbl-second")) {
                newSecond = $(this).val();
                if(newSecond === "" || isNaN(newSecond) || newSecond > 59 || newSecond < 0) {
                $(".tbl-second").addClass("alert alert-danger"); return 1;
                } else { $(".tbl-second").removeClass("alert alert-danger"); }
                tableData[row-1].seconds = newSecond;
            } 
            // Update comments
            if (target.is(".tbl-comment")) {
                newComment = $(this).val();
                tableData[row-1].comments = newComment;
            }

            // Update min and max time
            newTime = moment.duration(tableData[row-1].hours + ":" + tableData[row-1].minutes + ":" + tableData[row-1].seconds);
            tableData[row-1].time = newTime;

            // Update the stats
            updateStats();
            updateAverage();
        });
    };
	
	//// FUNCTION: Add new row to table ////
	var addTime = function() {
        // Desktop and tablets (Medium-Large)
        if($("#table-medium-up").css("display") == "block") {
            // Get time object values
            time = {
                date: moment($("#date").val(), "DD/MM/YYYY"),
                time: moment.duration('0.00:00:00'),
                hours: $(".hours").val(),
                minutes: $(".minutes").val(),
                seconds: $(".seconds").val(),
                comments: $("#comments").val(),
                calcTotal:  function() {
                    var hours = parseInt(time.hours);
                    var minutes = parseInt(time.minutes);
                    var seconds = parseInt(time.seconds);
                    var hoursToSec = hours * 3600;
                    var minutesToSec = minutes * 60;
                    var totalSeconds = hoursToSec + minutesToSec + seconds;
                    hours = Math.floor(totalSeconds / 3600);
                    minutes = Math.floor((totalSeconds % 3600) / 60);
                    total.add(hours, 'hours');
                    total.add(minutes, 'minutes');
                    total.add(seconds, 'seconds');
                }
            };

            // Validate data
            if(dataValidation() == 1) {
                return 1;   
            }

            // Ensure all time fields have two integers
            formatTimeFields();

            // Get actual time
            time.time = moment.duration(time.hours + ":" + time.minutes + ":" + time.seconds);

            // Calculate the total time
            time.calcTotal();

            // Push time object to table array
            tableData.push(time);

            // Update the stats for initial values
            updateStats();

            // Add to the table that is displayed
            var tableMediumUp = "<tr>"+
            "<td><input type='text' class='form-control tbl-date' placeholder='Date' value='" + time.date.format("DD/MM/YYYY") + "'/></td>"+
            "<td><input type='text' class='form-control time tbl-hour col-xs-4' maxlength='2' placeholder='HH' value='" + time.hours + "'/>"+
            "<input type='text' class='form-control time tbl-minute col-xs-4' maxlength='2' placeholder='MM' value='" + time.minutes + "'/>"+
            "<input type='text' class='form-control time tbl-second col-xs-4' maxlength='2' placeholder='SS' value='" + time.seconds + "'/></td>"+
            "<td><input type='text' class='form-control tbl-comment' placeholder='Comments' value='" + time.comments + "'/></td>"+
            "<td class='remove'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></td></tr>";
            $("#table-medium-up table tbody").append(tableMediumUp);

            // Add datepicker to rows
            $('.tbl-date').datepicker({
                dateFormat: "dd/mm/yy"
            });

            // Update tableData values on change
            updateChanges();

            // Clear the input options input fields
            $("#date").val(null);
            $("#comments").val(null);
            $(".hours").val(null);
            $(".minutes").val(null);
            $(".seconds").val(null);
        }
        // Mobile (Small)
        if($("#table-small-down").css("display") == "block") {
            // Get time object values
            time = {
                time: moment.duration('0.00:00:00'),
                hours: $("#options-small-down .hours").val(),
                minutes: $("#options-small-down .minutes").val(),
                seconds: $("#options-small-down .seconds").val(),
                calcTotal:  function() {
                    var hours = parseInt(time.hours);
                    var minutes = parseInt(time.minutes);
                    var seconds = parseInt(time.seconds);
                    var hoursToSec = hours * 3600;
                    var minutesToSec = minutes * 60;
                    var totalSeconds = hoursToSec + minutesToSec + seconds;
                    hours = Math.floor(totalSeconds / 3600);
                    minutes = Math.floor((totalSeconds % 3600) / 60);
                    total.add(hours, 'hours');
                    total.add(minutes, 'minutes');
                    total.add(seconds, 'seconds');
                }
            };             
                                    
            //Validate data
            if(dataValidation() == 1) {
                return 1;   
            }

            // Ensure all time fields have two integers
            formatTimeFields();

            // Get actual time
            var newTime = moment.duration(time.hours + ":" + time.minutes + ":" + time.seconds);
            time.time = newTime;

            // Calculate the total time
            time.calcTotal();

            // Push time object to table array
            tableData.push(time);

            // Update the stats for initial values
            updateStats();
            
            // Add to the table that is displayed
            var tableSmallDown = "<tr>"+
            "<td><input type='text' class='form-control time tbl-hour col-xs-4' maxlength='2' placeholder='HH' value='" + time.hours + "'/>"+
            "<input type='text' class='form-control time tbl-minute col-xs-4' maxlength='2' placeholder='MM' value='" + time.minutes + "'/>"+
            "<input type='text' class='form-control time tbl-second col-xs-4' maxlength='2' placeholder='SS' value='" + time.seconds + "'/></td>"+
            "<td class='remove'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></td></tr>";
            $("#table-small-down table tbody").append(tableSmallDown);

            // Update tableData values on change
            updateChanges();

            // Clear the input options input fields
            $("#options-small-down .hours").val(null);
            $("#options-small-down .minutes").val(null);
            $("#options-small-down .seconds").val(null);
        }
	};
	$("#btn-add").bind('click', function() {
        addTime(); 
    });
    $('.hours,.minutes,.seconds,#comments').on('keyup', function (e) {
        if (e.keyCode == 13) {
            addTime();
        }
    });
    
    //// FUNCTION: Export / Save table data as CSV ////
    var saveData = function(content, fileName, mimeType) {
        var a = document.createElement('a');
        mimeType = mimeType || 'application/octet-stream';
        if (navigator.msSaveBlob) { // IE10
            return navigator.msSaveBlob(new Blob([content], { type: mimeType }),     fileName);
        } else if ('download' in a) { //html5 A[download]
            a.href = 'data:' + mimeType + ',' + encodeURIComponent(content);
            a.setAttribute('download', fileName);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            return true;
        } else { //do iframe dataURL download (old ch+FF):
            var f = document.createElement('iframe');
            document.body.appendChild(f);
            f.src = 'data:' + mimeType + ',' + encodeURIComponent(content);
            return true;
        }
    };
    $("#btn-save").bind('click', function() {
        // Push table data and stats to array
        var data = [];
        if($("#table-medium-up").css("display") == "block") {
            data.push("Date");data.push("Time");data.push("Comments");
            for(var i = 0; i < tableData.length; i++) {
                data.push("\n" + moment(tableData[i].date).format("DD/MM/YYYY"));
                data.push(tableData[i].hours + ":" + tableData[i].minutes + ":" + tableData[i].seconds);
                data.push(tableData[i].comments);
            }
        } else {
            data.push("Time");
            for(var j = 0; j < tableData.length; j++) {
                data.push("\n" + tableData[j].hours + ":" + tableData[j].minutes + ":" + tableData[j].seconds);
            } 
        }
        data.push("\n\nMinimum");data.push($(".stat-min").text().slice(0,8));
        data.push("\nMaximum");data.push($(".stat-max").text().slice(0,8));
        data.push("\nAverage");data.push($(".stat-avg").text().slice(0,8));
        data.push("\nTotal");data.push($(".stat-total").text().slice(0,10));
        // Create file name
        var filename =  "Exercise-Log" + JSON.stringify(moment(tableData[tableData.length-1].date).format("DD/MM/YYYY"));
        // Save the data as a csv file
        saveData(data, filename + '.csv', 'text/csv');
    });
	
	// Remove row from table 
	$("tbody").on("click",".remove",function() {
        // Remove row from html and tableData
		var row = $(this).parents("tr:first")[0].rowIndex;
		tableData.splice(row-1,1);
		$(this).closest("tr").remove();
        // Reduce total time        
        updateTotal();
        // Update the stats
		updateStats();
	});
	
	// Clear all tables
	$("#btn-clear").click(function(){
		// Remove all rows
		$("tbody tr").each(function(){
			$(this).closest("tr").remove();	
		});
		// Erase table array
		tableData.length = 0;
        // Erase stats
        $("#stat-start").text("Start Date");
        $("#stat-end").text("End Date");
		$(".stat-min").text("Minimum Time");
		$(".stat-max").text("Maximum Time");
        $(".stat-avg").text("Average Time");
        $(".stat-total").text("Total Time");
		total = moment.duration('0.00:00:00');
	});
	
	// Toggle instructions
	$("#btn-instructions").click(function() {
		$("#toggle-instructions").toggleClass("glyphicon-circle-arrow-up glyphicon-circle-arrow-down");
		$("#info").slideToggle();
	});

	// Hide sidebar
	$("#hide-sidebar").click(function() {
		$("#btn-hide").toggleClass("glyphicon-chevron-left glyphicon-chevron-right");
		$("#sidebar").toggleClass("slideInLeft slideOutLeft");
		$("#main").toggleClass("left-margin");
	});

	// Highlight table row and column
	$('td').hover(function() {
		$(this).parents('table').find('col:eq('+$(this).index()+')').toggleClass('hover');
	});
	
	// Initialize datepicker
	$('.date').datepicker({
		dateFormat: "dd/mm/yy"
	});
    
    // Mobile view stats toggle
    $('.stat-label').click(function() {
        $(this).fadeOut("300");
        $(this).siblings('.stat-value').fadeIn("300");
        $(this).parent().css({"background-color":"#ffffff"});
    });
    $('.stat-value').click(function() {
        $(this).fadeOut("300");
        $(this).siblings('.stat-label').fadeIn("300");
        $(this).parent().css({"background-color":"#ffad3d"});
    });
	
});