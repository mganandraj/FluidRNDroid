package com.example.fluidclickerwebview;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;

public class MainActivity extends AppCompatActivity {

    private WebView m_webView = null;

    public static MainActivity s_instance = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Super duper hacky .. This is a prototype anyways !!
        s_instance = this;

        WebView.setWebContentsDebuggingEnabled(true);
        LinearLayout host = (LinearLayout) findViewById(R.id.viewHost);

        WebView webView = new WebView(this);
        host.addView(webView);
        m_webView = webView; // Raw hack ..

        webView.setWebViewClient(new WebViewClient());

        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);

        webView.addJavascriptInterface(new WebAppInterface(this), "Android");
        webView.loadUrl("file:///android_asset/fluid/index.html?mode=dashboard");
     }

     public void showClicker(String clickerName) {
         LinearLayout host = (LinearLayout) findViewById(R.id.viewHost);

         WebView webView = new WebView(this);
         host.addView(webView);

         webView.setWebViewClient(new WebViewClient());

         WebSettings webSettings = webView.getSettings();
         webSettings.setJavaScriptEnabled(true);

         webView.addJavascriptInterface(new WebAppInterface(this), "Android");
         webView.loadUrl("file:///android_asset/fluid/index.html?mode=clicker&clickerName=" + clickerName);
     }
}