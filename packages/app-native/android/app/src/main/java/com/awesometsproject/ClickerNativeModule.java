package com.awesometsproject;

import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

public class ClickerNativeModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";

    ClickerNativeModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    protected ReactNativeHost getReactNativeHost() {
        return ((ReactApplication) reactContext.getApplicationContext()).getReactNativeHost();
    }

    @NonNull
    @Override
    public String getName() {
        return "ClickerNativeModule";
    }

    @ReactMethod
    public void showClicker(String clickerName) {
        reactContext.runOnUiQueueThread(new Runnable() {
            @Override
            public void run() {
                FluidCanvasActivity.s_instance.showClicker(clickerName);
            }
        });
    }
}