package com.awesometsproject;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactRootView;
import com.facebook.react.devsupport.DoubleTapReloadRecognizer;

public class FluidCanvasActivity extends AppCompatActivity {

    private DoubleTapReloadRecognizer mDoubleTapReloadRecognizer;

    protected ReactNativeHost getReactNativeHost() {
        return ((ReactApplication) this.getApplication()).getReactNativeHost();
    }

    public static FluidCanvasActivity s_instance = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_fluid_canvas);

        // Super duper hacky .. This is a prototype anyways !!
        s_instance = this;

        mDoubleTapReloadRecognizer = new DoubleTapReloadRecognizer();

        // THis is needed to get the Dev dialog working.
        getReactNativeHost().getReactInstanceManager().onHostResume(FluidCanvasActivity.this);

        ReactRootView rootView = new ReactRootView(this);
        rootView.startReactApplication(
                getReactNativeHost().getReactInstanceManager(), "Dashboard", null);

        LinearLayout clickerHost = findViewById(R.id.clickerHost);
        clickerHost.addView(rootView);

        rootView.setLayoutParams(new LinearLayout.LayoutParams(1000, 1000));

        Button addClickerButton =  (Button)findViewById(R.id.addClicker);
        addClickerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                ReactRootView rootView = new ReactRootView(FluidCanvasActivity.this);
                rootView.startReactApplication(
                        getReactNativeHost().getReactInstanceManager(), "AwesomeTSProject", null);

                // Need to find a better way.. Currently just making the view big enough to contain clicker and the yello boxes.
                rootView.setLayoutParams(new LinearLayout.LayoutParams(1000, 1000));

                LinearLayout clickerHost = findViewById(R.id.clickerHost);
                clickerHost.addView(rootView);
            }
        });
    }

    public void showClicker(String clickerName) {
        ReactRootView rootView = new ReactRootView(FluidCanvasActivity.this);

        Bundle options = new Bundle();
        options.putString("clickerName", clickerName);
        rootView.startReactApplication(
                getReactNativeHost().getReactInstanceManager(), "AwesomeTSProject", options);

        // Need to find a better way.. Currently just making the view big enough to contain clicker and the yello boxes.
        rootView.setLayoutParams(new LinearLayout.LayoutParams(1000, 1000));

        LinearLayout clickerHost = findViewById(R.id.clickerHost);
        clickerHost.addView(rootView);
    }

    public boolean shouldShowDevMenuOrReload(int keyCode, KeyEvent event) {
        if (getReactNativeHost().hasInstance() && getReactNativeHost().getUseDeveloperSupport()) {
            if (keyCode == KeyEvent.KEYCODE_MENU) {
                getReactNativeHost().getReactInstanceManager().showDevOptionsDialog();
                return true;
            }
            boolean didDoubleTapR =
                    Assertions.assertNotNull(mDoubleTapReloadRecognizer)
                            .didDoubleTapR(keyCode, FluidCanvasActivity.this.getCurrentFocus());
            if (didDoubleTapR) {
                getReactNativeHost().getReactInstanceManager().getDevSupportManager().handleReloadJS();
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        return shouldShowDevMenuOrReload(keyCode, event);
    }
}