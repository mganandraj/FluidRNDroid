package com.example.fluidclickerwebview;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    private WebView m_webView = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        WebView.setWebContentsDebuggingEnabled(true);

        String store = this.getFilesDir().getAbsolutePath();

        Toast.makeText(this, this.getFilesDir().getAbsolutePath(), Toast.LENGTH_SHORT);

        LinearLayout host = (LinearLayout) findViewById(R.id.viewHost);

        // TextView textView = new TextView(this);
        // textView.setText("WebView Test App");
        // host.addView(textView);

        // Button button = new Button(this);
        // button.setText("Call JS");;
        // button.setOnClickListener(new View.OnClickListener() {
        //     @Override
        //     public void onClick(View view) {
        //         MainActivity.this.m_webView.evaluateJavascript("(function() { window.showAndroidToast('Hello from code !'); })()", new ValueCallback<String>() {
        //             @Override
        //             public void onReceiveValue(String s) {
        //                 Log.d("LogName", s); // Log is written, but s is always null
        //             }
        //         });
        //     }
        // });
        // host.addView(button);


        WebView webView = new WebView(this);
        host.addView(webView);
        m_webView = webView; // Raw hack ..

        webView.setWebViewClient(new WebViewClient());

        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);

        webView.addJavascriptInterface(new WebAppInterface(this), "Android");

        // webView.loadUrl("http://www.google.com");

        //String unencodedHtml =
        //        "<html><body><h1>'%23' is the percent code for ‘#‘ </h1></body></html>";
//
//        String unencodedHtml = "<input type=\"button\" value=\"Say hello\" onClick=\"showAndroidToast('Hello Android!')\" />"
//                + "<script type=\"text/javascript\">"
//                    + "function showAndroidToast(toast) {"
//                        + "Android.showToast(toast);"
//                    + "}"
//                + "</script>";

//         String encodedHtml = Base64.encodeToString(unencodedHtml.getBytes(), Base64.NO_PADDING);
        // webView.loadData(encodedHtml, "text/html", "base64");
       // webView.loadUrl("file:///index1.html");

        //webView.loadDataWithBaseURL("file:///android_asset/demo/",
        //        tmpDocumentText,"text/html", "UTF-8", null);

        webView.loadUrl("file:///android_asset/demo/index.html");

    }
}