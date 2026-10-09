package com.fracspace


import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost

import com.stallion.Stallion

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {

        // OTA bundles from Stallion (same as iOS); falls back to the bundled JS.
        override fun getJSBundleFile(): String? {
            return Stallion.getJSBundleFile(applicationContext, "assets://index.android.bundle")
        }

        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
               //  new UpiPaymentPackage()
              // OTP autofill on the login/signup screens (SMS User Consent API).
              add(SmsConsentPackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }


  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    createNotificationChannel()
    loadReactNative(this)
  }

  // Pushes use this channel (firebase.json messaging_android_notification_channel_id).
  // HIGH importance is what makes Android show them as a heads-up pop-up at the top
  // of the screen; FCM's own fallback channel only drops them into the shade.
  // A channel's importance can't be raised later, so a change needs a new id.
  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
    val channel = NotificationChannel(
        "fracspace_alerts",
        "Fracspace notifications",
        NotificationManager.IMPORTANCE_HIGH,
    ).apply {
      description = "Offers, bookings and account updates"
      enableVibration(true)
    }
    getSystemService(NotificationManager::class.java)?.createNotificationChannel(channel)
  }
}
