/**
 * Created by kumanish on 6/7/17.
 */
browser.runtime.onMessage.addListener(function (message) {
    alert(JSON.stringify(message));
});