# load-analytics-after-data
This repository contains a demo of how to delay loading analytics on DOM load and queue all the analytics events until analytics is completely loaded.

## Why did we create this project?

1. At workindia we had multiple analytics sdk attached to our website.
2. We faced issue with DOM load taking longer since analytics library was chocking the data download requests.
Unfortunately till late we were dealing with 2G network target group and had to be stingy about speed.
Still there are many things which can be optimized. 
3. So team was asked to do a trade off with first time loading data without analytics.
4. This meant we loose data points which were getting captured previously.
5. So we came up with this hack to not loose as much as possible the analytics events and ensure mission critical data being loaded at speed.

Finally, our MOTO has been "What ever does not benefit customer directly is meaningless to him :)"

## Code Workflow

1. Wrap your analytics events under a wrapper as below
	
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

If you see the code it does nothing extra ordinary just pushes the event and data to a processQueue and returns

        if (window.fbq === undefined || window.fbq === null || !window.fbq){
        analyticsController.addMethodProcessQueue(facebook_analytics.send_demo_event, [data]);
            return;
        }
        .....

You can call your events from the page anywhere you want.

2. Once you are done with the loading of the your mission critical data, Load analytics data
we have simulated this with a timer of 3 secs which completes data load and calls the load method.

        setTimeout(function(){
            .....
            analyticsController.load();
            .....
        }, 3000);

3. When analytics load method is called, it loads the analytics libs and then processes the processQueue which contains the events.
	
        // PROCESS PENDING QUEUE CALLS
        analyticsController.initialization_status = "LOADED";
        setInterval(analyticsController.processPendingQueueCalls, 1000);

This method keeps on calling processPendingQueueCalls untill all the analytics lib are loaded completely.
	
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

## Queries or Issues

Feel free to reach out to me at moiz.arsiwala@workindia.in