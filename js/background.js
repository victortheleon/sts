/**
 * Created by kumanish on 6/5/17.
 */

// Current Ip address
var ip_address = null;

var records = {};

var holdSearchTerm = null;

/**
 * Simple method to determine ip address and assign it to
 * global variable
 */
function assignIp() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            try {
                var obj = JSON.parse(this.responseText.substr(this.responseText.indexOf("{"), this.responseText.lastIndexOf("}") - 1));
                ip_address = obj.ip;
            } catch (err) {
                console.error(err);
            }
        }
    };
    xhttp.open("GET", "http://freegeoip.net/json/?callback=?", true);
    xhttp.send();
}

if (!ip_address) {
    assignIp();
}

// refresh the ip address every 60 seconds
setInterval(assignIp, 60000);

function getActiveTab() {
    return browser.tabs.query({active: true, currentWindow: true});
}



setInterval(function () {
    var activeTab = getActiveTab();

    if(holdSearchTerm) {
        if (!records[ip_address]) {
            records[ip_address] = [];
        }
        records[ip_address].push({
            time: holdSearchTerm.time.toISOString(),
            query: holdSearchTerm.query,
            engine: holdSearchTerm.engine
        });
        holdSearchTerm = null;
    }
    if(Object.keys(records).length > 0) {
        getActiveTab().then((tabs) => {
            var tempRecords = Object.assign({}, records);
            records = {};
            browser.tabs.sendMessage(tabs[0].id, tempRecords);
        });
    }
}, 30000);

function appendRecord(newRecord, engine) {
    if (!newRecord) return;
    if (!ip_address) {
        ip_address = "non-deterministic";
    }
    if (!records[ip_address]) {
        records[ip_address] = [];
    }
    var isoDate = new Date();
    if (holdSearchTerm) {
        if ((isoDate - holdSearchTerm.time >= 1000)) {
            records[ip_address].push({
                time: holdSearchTerm.time.toISOString(),
                query: holdSearchTerm.query,
                engine: holdSearchTerm.engine
            });
        }
    }
    holdSearchTerm = {time: isoDate, query: newRecord, engine: engine};
    console.log(records);
    console.log(holdSearchTerm);
}

function getEngine(url) {
    if (url.origin.toLowerCase().indexOf("google") != -1) {
        return "google";
    } else if (url.origin.toLowerCase().indexOf("yahoo") != -1) {
        return "yahoo";
    } else if (url.origin.toLowerCase().indexOf("bing") != -1) {
        return "bing";
    } else if (url.origin.toLowerCase().indexOf("duckduckgo") != -1) {
        return "duckduckgo";
    }
}

function handleRequest(e) {
    var url = new URL(e.url);
    var engine = getEngine(url);
    if (url.hash) {
        appendRecord(url.hash.split("=")[1].split("+").join(" "), engine);
    } else {
        appendRecord(url.searchParams.get("q"), engine);
    }
}


var engineURLS = ["*://*.google.co.zw/*",
    "*://*.google.co.zm/*",
    "*://*.google.com/*",
    "*://*.google.com.vn/*",
    "*://*.google.co.ve/*",
    "*://*.google.vu/*",
    "*://*.google.co.uz/*",
    "*://*.google.com.uy/*",
    "*://*.google.co.vi/*",
    "*://*.google.us/*",
    "*://*.google.co.uk/*",
    "*://*.google.ae/*",
    "*://*.google.com.ua/*",
    "*://*.google.co.ug/*",
    "*://*.google.tm/*",
    "*://*.google.com.tr/*",
    "*://*.google.tn/*",
    "*://*.google.tt/*",
    "*://*.google.to/*",
    "*://*.google.tk/*",
    "*://*.google.tg/*",
    "*://*.google.tl/*",
    "*://*.google.co.th/*",
    "*://*.google.co.tz/*",
    "*://*.google.com.tj/*",
    "*://*.google.com.tw/*",
    "*://*.google.st/*",
    "*://*.google.ch/*",
    "*://*.google.se/*",
    "*://*.google.sr/*",
    "*://*.google.lk/*",
    "*://*.google.es/*",
    "*://*.google.co.kr/*",
    "*://*.google.co.za/*",
    "*://*.google.so/*",
    "*://*.google.com.sb/*",
    "*://*.google.si/*",
    "*://*.google.sk/*",
    "*://*.google.com.sg/*",
    "*://*.google.com.sl/*",
    "*://*.google.sc/*",
    "*://*.google.rs/*",
    "*://*.google.sn/*",
    "*://*.google.com.sa/*",
    "*://*.google.sm/*",
    "*://*.google.ws/*",
    "*://*.google.com.vc/*",
    "*://*.google.com.lc/*",
    "*://*.google.sh/*",
    "*://*.google.rw/*",
    "*://*.google.ru/*",
    "*://*.google.ro/*",
    "*://*.google.cg/*",
    "*://*.google.com.qa/*",
    "*://*.google.com.pr/*",
    "*://*.google.pt/*",
    "*://*.google.pl/*",
    "*://*.google.pn/*",
    "*://*.google.com.ph/*",
    "*://*.google.com.pe/*",
    "*://*.google.com.py/*",
    "*://*.google.com.pg/*",
    "*://*.google.com.pa/*",
    "*://*.google.ps/*",
    "*://*.google.com.pk/*",
    "*://*.google.com.om/*",
    "*://*.google.no/*",
    "*://*.google.nf/*",
    "*://*.google.nu/*",
    "*://*.google.com.ng/*",
    "*://*.google.ne/*",
    "*://*.google.com.ni/*",
    "*://*.google.co.nz/*",
    "*://*.google.nl/*",
    "*://*.google.com.np/*",
    "*://*.google.nr/*",
    "*://*.google.com.na/*",
    "*://*.google.com.mm/*",
    "*://*.google.co.mz/*",
    "*://*.google.co.ma/*",
    "*://*.google.ms/*",
    "*://*.google.me/*",
    "*://*.google.mn/*",
    "*://*.google.md/*",
    "*://*.google.com.mx/*",
    "*://*.google.mu/*",
    "*://*.google.com.mt/*",
    "*://*.google.ml/*",
    "*://*.google.mv/*",
    "*://*.google.com.my/*",
    "*://*.google.mw/*",
    "*://*.google.mg/*",
    "*://*.google.mk/*",
    "*://*.google.lu/*",
    "*://*.google.lt/*",
    "*://*.google.li/*",
    "*://*.google.com.ly/*",
    "*://*.google.co.ls/*",
    "*://*.google.com.lb/*",
    "*://*.google.lv/*",
    "*://*.google.la/*",
    "*://*.google.kg/*",
    "*://*.google.com.kw/*",
    "*://*.google.ki/*",
    "*://*.google.co.ke/*",
    "*://*.google.kz/*",
    "*://*.google.jo/*",
    "*://*.google.je/*",
    "*://*.google.co.jp/*",
    "*://*.google.com.jm/*",
    "*://*.google.ci/*",
    "*://*.google.it/*",
    "*://*.google.co.il/*",
    "*://*.google.im/*",
    "*://*.google.ie/*",
    "*://*.google.iq/*",
    "*://*.google.co.id/*",
    "*://*.google.co.in/*",
    "*://*.google.is/*",
    "*://*.google.hu/*",
    "*://*.google.com.hk/*",
    "*://*.google.hn/*",
    "*://*.google.ht/*",
    "*://*.google.gy/*",
    "*://*.google.gg/*",
    "*://*.google.com.gt/*",
    "*://*.google.gp/*",
    "*://*.google.gl/*",
    "*://*.google.gr/*",
    "*://*.google.com.gi/*",
    "*://*.google.com.gh/*",
    "*://*.google.de/*",
    "*://*.google.ge/*",
    "*://*.google.gm/*",
    "*://*.google.ga/*",
    "*://*.google.gf/*",
    "*://*.google.fr/*",
    "*://*.google.fi/*",
    "*://*.google.com.fj/*",
    "*://*.google.fm/*",
    "*://*.google.eu/*",
    "*://*.google.com.et/*",
    "*://*.google.ee/*",
    "*://*.google.com.sv/*",
    "*://*.google.com.eg/*",
    "*://*.google.com.ec/*",
    "*://*.google.com.do/*",
    "*://*.google.dm/*",
    "*://*.google.dj/*",
    "*://*.google.dk/*",
    "*://*.google.cd/*",
    "*://*.google.cz/*",
    "*://*.google.com.cy/*",
    "*://*.google.com.cu/*",
    "*://*.google.hr/*",
    "*://*.google.co.cr/*",
    "*://*.google.co.ck/*",
    "*://*.google.com.co/*",
    "*://*.google.co/*",
    "*://*.google.cc/*",
    "*://*.google.cx/*",
    "*://*.google.cn/*",
    "*://*.google.cl/*",
    "*://*.google.td/*",
    "*://*.google.cf/*",
    "*://*.google.cat/*",
    "*://*.google.cv/*",
    "*://*.google.ca/*",
    "*://*.google.cm/*",
    "*://*.google.com.kh/*",
    "*://*.google.bi/*",
    "*://*.google.bf/*",
    "*://*.google.bg/*",
    "*://*.google.com.bn/*",
    "*://*.google.vg/*",
    "*://*.google.io/*",
    "*://*.google.com.br/*",
    "*://*.google.co.bw/*",
    "*://*.google.ba/*",
    "*://*.google.com.bo/*",
    "*://*.google.bt/*",
    "*://*.google.bj/*",
    "*://*.google.com.bz/*",
    "*://*.google.be/*",
    "*://*.google.by/*",
    "*://*.google.com.bd/*",
    "*://*.google.com.bh/*",
    "*://*.google.bs/*",
    "*://*.google.az/*",
    "*://*.google.at/*",
    "*://*.google.com.au/*",
    "*://*.google.ac/*",
    "*://*.google.am/*",
    "*://*.google.com.ar/*",
    "*://*.google.com.ag/*",
    "*://*.google.com.ai/*",
    "*://*.google.co.ao/*",
    "*://*.google.ad/*",
    "*://*.google.as/*",
    "*://*.google.dz/*",
    "*://*.google.al/*",
    "*://*.google.com.af/*",
    "*://*.duckduckgo.com/*",
    "*://*.bing.com/*"];

browser.webRequest.onBeforeSendHeaders.addListener(handleRequest,
    {urls: engineURLS});