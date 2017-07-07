// swarmops.js

// netdata variables
var netdataTheme = 'slate';
var netdataPort = 19999;
var netdataNoDygraphs = true;
var netdataNoSparklines = true;
var netdataNoPeitys = true;
var netdataNoGoogleCharts = true;
var netdataNoMorris = true;
var netdataNoD3 = true;
var netdataNoC3 = true;
var netdataRegistry = false;

// load script
jQuery.loadScript = function (url, callback) {
  jQuery.ajax({
    url: url,
    dataType: 'script',
    success: callback,
    async: true
  });
}

function soRenderNode(ip, dh) {
  html = '';
  html += '<div data-host="'+dh+'" style="font-size:18px; font-weight:bold;">'+ip+'</div>';
  html += '<div data-host="'+dh+'" data-width="32%" data-title="UPTIME" data-netdata="system.uptime" data-units="seconds" data-chart-library="easypiechart" data-before="0" data-after="-540" data-points="540"></div>';
  html += '<div data-host="'+dh+'" data-width="32%" data-title="SWAP" data-netdata="system.swap" data-units="% used" data-chart-library="easypiechart" data-dimensions="used" data-append-options="percentage" data-easypiechart-max-value="100" data-before="0" data-after="-540" data-points="540" data-colors="#FE3912"></div>';
  html += '<div data-host="'+dh+'" data-width="32%" data-title="LOAD 1" data-netdata="system.load" data-chart-library="easypiechart" data-dimensions="load1" data-easypiechart-max-value="8" data-before="0" data-after="-540" data-points="540" data-colors="#22AA99"></div><br/>';
  html += '<div data-host="'+dh+'" data-width="49%" data-title="CPU" data-netdata="system.cpu" data-units="% used" data-chart-library="gauge" data-gauge-max-value="100" data-before="0" data-after="-540" data-points="540" data-colors="#22AA99"></div>';
  html += '<div data-host="'+dh+'" data-width="49%" data-title="RAM" data-netdata="system.ram" data-units="% used" data-chart-library="gauge" data-dimensions="used|buffers|active|wired" data-append-options="percentage" data-gauge-max-value="100" data-before="0" data-after="-540" data-points="540" data-colors="#FE3912"></div>';
  html += '<div data-host="'+dh+'" data-width="49%" data-title="NET IN" data-netdata="netdata.net" data-units="kb/s" data-chart-library="gauge" data-dimensions="in" data-common-max="netdata-net-in" data-height="100%" data-before="0" data-after="-540" data-points="540"></div>';
  html += '<div data-host="'+dh+'" data-width="49%" data-title="NET OUT" data-netdata="netdata.net" data-units="kb/s" data-chart-library="gauge" data-dimensions="out" data-common-max="netdata-net-out" data-height="100%" data-before="0" data-after="-540" data-points="540"></div><br/>';
  html += '<div data-host="'+dh+'" data-width="49%" data-title="DISK READ" data-netdata="system.io" data-units="kB/s" data-chart-library="gauge" data-dimensions="in" data-common-max="system-io-in" data-height="100%" data-before="0" data-after="-540" data-points="540" role="application"></div>';
  html += '<div data-host="'+dh+'" data-width="49%" data-title="DISK WRITE" data-netdata="system.io" data-units="kB/s" data-chart-library="gauge" data-dimensions="out" data-common-max="system-io-out" data-height="100%" data-before="0" data-after="-540" data-points="540" role="application"></div><br/>';	
  return html;
}

function soRenderCluster() {
  var html = '';
  var n = swarmopsCluster.length;
  var w = 99;
  if (n > 1) {
    w = (Math.round(100 / n) - 1).toString();
  }
  swarmopsCluster.forEach(function(ip) {
    var dh = 'http://'+ip+':'+netdataPort;
    html += '<div data-host="'+dh+'" style="width: '+w+'%; height: 100%; align: center; display: inline-block; border:2px solid black;">';
    html += soRenderNode(ip, dh);
    html += '</div>';
  });
  document.getElementById("cluster").innerHTML = html;
}

function soInit() {
  var ds = 'http://'+swarmopsCluster[0]+':'+netdataPort+'/dashboard.js';
  $.loadScript(ds, function(){
    // - destroy charts not shown (lowers memory on the browser)
    NETDATA.options.current.destroy_on_hide = true;
    // - set this to false, to always show all dimensions
    NETDATA.options.current.eliminate_zero_dimensions = true;
    // - lower the pressure on this browser
    NETDATA.options.current.concurrent_refreshes = false;
    // - if browser is too slow set this to false
    NETDATA.options.current.parallel_refresher = false;
    // - set this to true, to stop updates when focus is lost
    NETDATA.options.current.stop_updates_when_focus_is_lost = false;
  });
}

// ready
window.onload = function() {
  soRenderCluster();
  soInit();
  $("div").click(function() {
    var url = $(this).attr('data-host');
    var type = $(this).attr('data-netdata');
    if (typeof url !== typeof undefined && url !== false) {
      if (typeof type !== typeof undefined && type !== false) {
        var metric = type.split('.')[1];
        var suffix = metric;
        switch (metric) {
          case 'io':
            suffix = 'disk';
            break
          case 'net':
            suffix = 'network';
            break
        }
        url += '/#menu_system_submenu_'+suffix;
        $("#frame").attr('src', url);
        $("#frame").focus();
        //window.open(url, '_blank');
      }
    }
    return true;
  });
};
