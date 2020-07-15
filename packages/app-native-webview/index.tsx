import { showDashboard } from "@anandrag/app-web/dashboardView"
import { showClicker } from "@anandrag/app-web/clickerView"

import { showApp, showAppDashboard, showAppClickers } from "@anandrag/app-shared/app"

declare global {
    interface Window { FluidApp: any; }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function showClickerThroughNativeCode(clickerName: string) {
    Android.showClicker(clickerName);
}

var mode = getParameterByName('mode', window.location.href);
if (mode === 'browser' || !mode) {
    let progressNode = document.createTextNode("Working ...");
    document.body.append(progressNode);
    showApp(showClicker, showDashboard);
    document.body.removeChild(progressNode);
} else if (mode == 'dashboard') {
    showAppDashboard(showDashboard);

    // This essentially enumerates the clickers and notifies native code .. which eventually can spawn new webviews to show clicker.
    showAppClickers(showClickerThroughNativeCode);
} else if (mode == 'clicker') {
    var clickerName = getParameterByName('clickerName', window.location.href);
    showClicker(clickerName)
}

// window.FluidApp.showClicker = showClicker;
// window.FluidApp.showDashboard = showDashboard;