package com.fracspace

import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.android.gms.auth.api.phone.SmsRetriever
import com.google.android.gms.common.api.CommonStatusCodes
import com.google.android.gms.common.api.Status

/**
 * Reads the OTP SMS with Google's SMS User Consent API: when the SMS arrives
 * Android shows a one-tap "Allow" sheet, and only that one message reaches the
 * app. No SMS permission is needed and the SMS text needs no app hash.
 *
 * JS: NativeModules.SmsConsent.start() / stop(); events on DeviceEventEmitter:
 *   "SmsConsentMessage" (string: the full SMS text), "SmsConsentEnded" (reason).
 */
class SmsConsentModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

  private var receiver: BroadcastReceiver? = null

  init {
    reactContext.addActivityEventListener(this)
  }

  override fun getName() = "SmsConsent"

  @ReactMethod
  fun start() {
    stop()
    val smsReceiver = object : BroadcastReceiver() {
      override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != SmsRetriever.SMS_RETRIEVED_ACTION) return
        val extras = intent.extras ?: return
        @Suppress("DEPRECATION")
        val status = extras.get(SmsRetriever.EXTRA_STATUS) as? Status ?: return
        when (status.statusCode) {
          CommonStatusCodes.SUCCESS -> {
            @Suppress("DEPRECATION")
            val consentIntent = extras.getParcelable<Intent>(SmsRetriever.EXTRA_CONSENT_INTENT)
            val activity = reactContext.currentActivity
            if (consentIntent == null || activity == null) {
              emit(EVENT_ENDED, "unavailable")
              return
            }
            try {
              activity.startActivityForResult(consentIntent, REQUEST_CODE)
            } catch (e: Exception) {
              emit(EVENT_ENDED, "unavailable")
            }
          }
          CommonStatusCodes.TIMEOUT -> emit(EVENT_ENDED, "timeout") // 5 minutes, no SMS
        }
      }
    }
    val filter = IntentFilter(SmsRetriever.SMS_RETRIEVED_ACTION)
    // Play services sends this broadcast, so it must be exported.
    ContextCompat.registerReceiver(
        reactContext, smsReceiver, filter, SmsRetriever.SEND_PERMISSION, null,
        ContextCompat.RECEIVER_EXPORTED)
    receiver = smsReceiver
    // null sender: accept the OTP from any sender (our SMS gateway can change).
    SmsRetriever.getClient(reactContext).startSmsUserConsent(null)
  }

  @ReactMethod
  fun stop() {
    receiver?.let {
      try {
        reactContext.unregisterReceiver(it)
      } catch (_: IllegalArgumentException) {
        // already unregistered
      }
    }
    receiver = null
  }

  override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
    if (requestCode != REQUEST_CODE) return
    val message = data?.getStringExtra(SmsRetriever.EXTRA_SMS_MESSAGE)
    if (resultCode == Activity.RESULT_OK && message != null) {
      emit(EVENT_MESSAGE, message)
    } else {
      emit(EVENT_ENDED, "denied") // user tapped "Deny"
    }
    stop()
  }

  override fun onNewIntent(intent: Intent) {}

  override fun invalidate() {
    stop()
    reactContext.removeActivityEventListener(this)
    super.invalidate()
  }

  // Required by NativeEventEmitter on the JS side.
  @ReactMethod fun addListener(eventName: String) {}
  @ReactMethod fun removeListeners(count: Double) {}

  private fun emit(event: String, payload: String) {
    if (!reactContext.hasActiveReactInstance()) return
    reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(event, payload)
  }

  companion object {
    private const val REQUEST_CODE = 4317
    private const val EVENT_MESSAGE = "SmsConsentMessage"
    private const val EVENT_ENDED = "SmsConsentEnded"
  }
}
