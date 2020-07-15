package com.example.fluidclickerwebview;

import android.content.Context;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

public class WebAppInterface {
    Context mContext;

    WebAppInterface(Context c) {
        mContext = c;
    }

    @JavascriptInterface
    public void showClicker(final String clickerName) {
        MainActivity.s_instance.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                MainActivity.s_instance.showClicker(clickerName);
            }
        });
    }
}