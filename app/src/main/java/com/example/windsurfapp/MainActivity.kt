package com.example.windsurfapp

import android.os.Bundle
import android.util.Log
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import com.example.windsurfapp.ui.theme.WindsurfAppTheme
import androidx.compose.material3.Scaffold
import okhttp3.*
import org.json.JSONObject
import java.io.IOException

class MainActivity : ComponentActivity() {
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            WindsurfAppTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { _ ->
                    AndroidView(factory = { context ->
                        webView = WebView(context).apply {
                            settings.javaScriptEnabled = true
                            webViewClient = WebViewClient()
                            loadUrl("file:///android_asset/vent.html")
                        }
                        webView
                    })
                }
            }
        }

        fetchVentData()
    }

    private fun fetchVentData() {
        val url = "https://www.meteolarochelle.fr/wdlchatel/clientraw.txt"
        val client = OkHttpClient()
        val request = Request.Builder().url(url).build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                Log.e("VENT", "Erreur réseau : ${e.message}")
                runOnUiThread {
                    webView.evaluateJavascript(
                        "document.body.innerHTML = '<p style=\"color:red;text-align:center;\">Erreur réseau : ${e.message}</p>';",
                        null
                    )
                }
            }

            override fun onResponse(call: Call, response: Response) {
                val body = response.body?.string()
                Log.d("VENT", "Réponse : $body")
                if (body != null) {
                    val escapedData = JSONObject.quote(body)
                    runOnUiThread {
                        webView.evaluateJavascript("parseVentData($escapedData);", null)
                    }
                }
            }
        })
    }
}
