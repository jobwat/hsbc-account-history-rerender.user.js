// ==UserScript==
// @name           HSBC - Account History enhancer
// @namespace      https://www.hsbc.com.au/*
// @include        *
// ==/UserScript==

// this script is only for the "Account History" page
if(document.getElementsByTagName('title')[0].text.match("Account History")){
	// Yes, I'm French :)
		var DOW = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
		var Months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

	// Add jQuery (thx http://joanpiedra.com/jquery/greasemonkey/)
		var GM_JQ = document.createElement('script');
		//GM_JQ.src = 'http://jquery.com/src/jquery-latest.js';
		GM_JQ.src = 'http://localhost/js/jquery-latest.js';
		GM_JQ.type = 'text/javascript';
		document.getElementsByTagName('head')[0].appendChild(GM_JQ);
	  // Check if jQuery's loaded
		function GM_wait() {
				if(typeof unsafeWindow.jQuery == 'undefined') { window.setTimeout(GM_wait,100); }
		else { $ = unsafeWindow.jQuery; letsJQuery(); }
		}
		GM_wait();

	// All your GM code must be inside this function
		function letsJQuery() {
		
			// First have a centering function for final display
			// Thx Tony L. - http://stackoverflow.com/questions/210717/what-is-the-best-way-to-center-a-div-on-the-screen-using-jquery
			$.fn.center = function () {
				this.css("position","absolute");
				this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
				this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
				return this;
			}

			// set some style (no need to have wide spaces around lines)
			$('<style type="text/css">table.hsbcTableStyle07 tr td{ padding:0px 5px 0px 5px; line-height: 1em; }</style>').prependTo($('head'));
			
			// beautify each line content + stack values in an array
			var graphData = [];
      var allData = [];

      Line = function() {
        this.timestamp = undefined;
      }
      Line.prototype.setDate = function(dateString) {
        this.timestamp = new Date(dateString).getTime();
      }
      Line.prototype.hasDate = function() {
        return !(this.timestamp == undefined || isNaN(this.timestamp));
      }
      Line.prototype.getDate = function(){ // reformat the date column
        if(this.hasDate()){
          date = new Date(this.timestamp);
          return '<span style="float:right">'+DOW[date.getDay()]+', '+date.getDate()+' '+Months[date.getMonth()]+' '+date.getFullYear()+'</span>';
        }
        else{
          return undefined;
        }
      }
      Line.prototype.setDetails = function(detailsHTML) { // remove some non-useful data from details column and make it 1 line only
				tmp=detailsHTML.split('<br>');
        this.details = this.cleanStrings(tmp[0] + ' - ' + tmp[2] + ' - ' + tmp[3] + ' ' + tmp[4]);
      }
      Line.prototype.getDetails = function(){
        return this.details;
      }
      Line.prototype.setDebit = function(debit){
        this.debit = this.cleanAmounts(debit);
      }
      Line.prototype.getDebit = function(){
        return this.displayDigits(this.emptyIfZero(this.debit));
      }
      Line.prototype.setCredit = function(credit){
        this.credit = this.cleanAmounts(credit);
      }
      Line.prototype.getCredit = function(){
        return this.displayDigits(this.emptyIfZero(this.credit));
      }
      Line.prototype.setBalance = function(balance){
        this.balance = this.cleanAmounts(balance);
      }
      Line.prototype.getBalance = function(){
        return this.displayDigits(this.balance);
      }
      Line.prototype.cleanAmounts = function(value){
        tmp = parseFloat(this.cleanStrings(value).replace(/[^0-9\.]/g,''));
        if(isNaN(tmp)) return 0;
        else return tmp;
      }
      Line.prototype.cleanStrings = function(value){
        return value.replace(/[\t\n\r 	]+/g,' ');
      }
      Line.prototype.displayDigits = function(value){
       return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      }
      Line.prototype.emptyIfZero = function(value){
        if(value==0) return '&nbsp;';
        else return value+'&nbsp;';
      }

      History = function(){
        this.lines = [];
      }
      History.prototype.add = function(line){
        this.lines.push(line);
      }
      History.prototype.toJSON = function(){
       return JSON.stringify(this.lines);
      }

      var history = new History();

			$.each($("table.hsbcTableStyle07 tr"), function(TRind, TRval) { // each tr
        
        line = new Line()
				
        var mytd = $(this).children("td").each(function(index, td){ // each td

					if(td.headers=="header1"){ // the date
            line.setDate(td.innerHTML);
            if(line.hasDate()){ td.innerHTML=line.getDate(); }
            else { return false; }
					}
					else if(td.headers=="header2"){ // the details
            line.setDetails(td.innerHTML);
            td.innerHTML = line.getDetails();
					}
          else if(td.headers=="header3"){ // debit
            line.setDebit(td.innerHTML);
            td.innerHTML = line.getDebit();
          }
          else if(td.headers=="header4"){ // credit
            line.setCredit(td.innerHTML);
            td.innerHTML = line.getCredit();
          }
					else if(td.headers=="header5"){ // balance
            line.setBalance(td.innerHTML);
						td.innerHTML = line.getBalance();
					}
				});

				if(line.getDate()!=undefined && line.getBalance()!=undefined){
          history.add(line);
          graphData.push([line.timestamp, line.balance]);
        }

			});

      fourlast = $(history.lines).slice(-4); 
      fivelast = $(history.lines).slice(-5); 
      threeFromfivelast = $(fivelast).slice(0,3); 
      
      console.log('last 4');
      $.each(fourlast, function(index, line){
        console.log(line);
      });
      console.log('3 from last 5');
      $.each(threeFromfivelast, function(index, line){
        console.log(line);
      });

      finalHist = $.merge(fourlast, threeFromfivelast);
      finalHist.sort(function(a,b){
        if(a.timestamp < b.timestamp) return 1;
        else if(a.timestamp > b.timestamp) return -1;
        else{
          if(a.details < b.details) return 1;
          else if(a.details > b.details) return -1;
          else return 0;
        }
      });
      
      console.log('before trimming');
      $.each(finalHist, function(index, line){
        console.log(line);
      });

      var ind = 1;
      while(ind < finalHist.length){
        if(finalHist[ind-1].timestamp == finalHist[ind].timestamp && finalHist[ind-1].details == finalHist[ind].details){
          finalHist = $.merge($(finalHist).slice(0, ind), $(finalHist).slice(ind+1, finalHist.length))
        }
        else
          ind++;
      }

      console.log('final');
      $.each(finalHist, function(index, line){
        console.log(line);
      });

      //console.log(history.toJSON());
			
			
			// 2e part: load jquery.flot to draw a chart
			$.getScript('http://localhost/js/jquery.flot.js', function() {
			//$.getScript('http://flot.googlecode.com/svn-history/r139/trunk/jquery.flot.js', function() {
				
				// show/hide functions
				function show(){
					$("#chartwrap")
						.css('display', 'block')
						.center();
				}
				function hide(){
					$("#chartwrap").css('display', 'none');
				}
				
				// add a div somewhere in the DOM
				$('<div id="chartwrap" style="border: 1px solid #AAA; background-color:white; position: absolute;"></div>').appendTo("body");
				$('<div id="placeholder" style="width:650px; height:300px;"></div>').appendTo("#chartwrap");
				
				// draw the chart in its div
				// TODO: do way better ! watch here: http://people.iola.dk/olau/flot/examples/stacking.html
				$.plot($("#placeholder"), [graphData], { xaxis: { mode: "time" } });
				
				// display a button to toggle chart visibility
				$('<a class="hsbcLinkStyle06">Display chart</a>')
					.prependTo($('td.hsbcTableColumn03')[0])
					.css('cursor', 'pointer')
					.toggle(show, hide);
				$('#placeholder').click(hide);

				hide();
			});
		}
}