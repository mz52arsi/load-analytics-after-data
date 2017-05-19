var analyticsController = {
    initialization_status: "NOT_LOADED",
    pending_method_call_queue: [],
    ga_config_key: "UA-99594582-1", // TODO GA CONFIG
    fb_config_key: "290088598043673", // TODO FB CONFIG
}

analyticsController.addMethodProcessQueue = function(method, params){
    console.log("adding to queue");
    analyticsController.pending_method_call_queue.push(analyticsController.__proceesLaterWrapper(method, this, params))
}

analyticsController.__proceesLaterWrapper = function(fn, context, params) {
    return function() {
        fn.apply(context, params);
    };
}

analyticsController.processPendingQueueCalls = function(){
    
    // TODO add all your analytics global objects
    if (window.ga && window.fbq){

        while (analyticsController.pending_method_call_queue.length > 0) {
            console.log("executing methods in queue");
            (analyticsController.pending_method_call_queue.shift())();
        }

        clearInterval(analyticsController.processPendingQueueCalls);
    }
    else{
        console.debug("NOT LOADED ANALYTICS YET");
    }
}

analyticsController.load = function(){
    console.debug(analyticsController.initialization_status);
    // Validate if analytics is already loaded to avoid double calling
    if (analyticsController.initialization_status === "LOADING" || analyticsController.initialization_status === "LOADED"){
        console.log("ALREADY LOADED INTO THE WINDOW");
        return;
    }

    analyticsController.initialization_status = "LOADING";
    
    // ANALYTICS LIBRARY INIT CODE 
    
    // Google Analytics
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    // Facebook Analytics
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', analyticsController.fb_config_key);
    fbq('track', "PageView");

    //Analytics
    window.ga('create', analyticsController.ga_config_ua, {'siteSpeedSampleRate': 100});
    window.ga('send', 'pageview');

    // PROCESS PENDING QUEUE CALLS
    analyticsController.initialization_status = "LOADED";
    setInterval(analyticsController.processPendingQueueCalls, 1000);
}

/* Google Analytics */

var ga_analytics = {};

ga_analytics.ga_demo_event = function(data){
    if (window.ga === undefined || window.ga === null || !window.ga){
        document.querySelector("#ga_event_queued").removeAttribute("hidden");
        analyticsController.addMethodProcessQueue(ga_analytics.ga_demo_event, [data]);
        return;
    }
    
    document.querySelector("#ga_event_executed").removeAttribute("hidden");
    window.ga('send', {
        hitType: 'event',
        eventCategory: 'Click',
        eventAction: 'ga_demo_event',
        eventLabel: JSON.stringify({
            time: new Date(),
            data: data
        })
    });
}


/* FACEBOOK */
var facebook_analytics = {};

facebook_analytics.send_demo_event = function(data){

    if (window.fbq === undefined || window.fbq === null || !window.fbq){
        document.querySelector("#fb_event_queued").removeAttribute("hidden");
        analyticsController.addMethodProcessQueue(facebook_analytics.send_demo_event, [data]);
        return;
    }

    document.querySelector("#fb_event_executed").removeAttribute("hidden");
    window.fbq('trackCustom', 'fb_demo_event', {value: data});
}



