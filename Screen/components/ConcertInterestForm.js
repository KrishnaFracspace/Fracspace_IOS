import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { CONCERT_THEME as T } from '../utils/concertData';
import ConcertSuccessSheet from './ConcertSuccessSheet';
import { AppContext } from '../Context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { markConcertRegistered } from '../utils/concertInterestStore';
import {
  RegisterConcertInterest,
  classifyInterestResponse,
  classifyInterestError,
} from '../Services/UserApi';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9]{10}$/;

/** Minimal **bold** support, same subset the about section uses. */
function renderBannerText(text = '') {
  return String(text)
    .split(/(\*\*[^*]+\*\*)/g)
    .map((chunk, i) =>
      chunk.startsWith('**') && chunk.endsWith('**') ? (
        <Text key={i} style={styles.bannerStrong}>
          {chunk.slice(2, -2)}
        </Text>
      ) : (
        chunk
      ),
    );
}

/** +919876543210 -> "+91 98765 43210" */
function formatPhone(countryCode, phone) {
  const digits = String(phone || '').replace(/[^0-9]/g, '');
  if (digits.length !== 10) return `${countryCode} ${digits}`.trim();
  return `${countryCode} ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

const MIN_TICKETS = 1;
const MAX_TICKETS = 10;
const DEFAULT_TICKETS = 2;

/**
 * "Register your Interest" bottom sheet.
 * City is pre-filled from the schedule selection (falls back to the default city).
 * TODO: wire submit to the register-interest API.
 */
export default function ConcertInterestForm({
  visible,
  onClose,
  concert,
  cities = [],
  selectedCityId,
  onGoHome,
}) {
  const insets = useSafeAreaInsets();
  const {globalState} = React.useContext(AppContext);

  // NOTE: these have to be declared before the useMemo below reads them.
  const formCfg = concert?.interestForm || {};
  const ticketCfg = formCfg.tickets || {};
  const bannerCfg = formCfg.banner || {};
  const fieldsByKey = formCfg.fieldsByKey || {};
  const prefill = formCfg.prefill || {};
  const minTickets = ticketCfg.min ?? MIN_TICKETS;
  const maxTickets = ticketCfg.max ?? MAX_TICKETS;
  const fld = key => fieldsByKey[key] || {};
  const countryCode = fld('phone').defaultCountryCode || '+91';
  const appVersion = (() => {
    try {
      return DeviceInfo.getVersion();
    } catch (e) {
      return undefined;
    }
  })();

  const fallbackCityId = useMemo(
    () => prefill?.cityId || concert?.defaultCityId || cities?.[0]?.id,
    [prefill, concert, cities],
  );

  const [name, setName] = useState(
    prefill.name || globalState?.userDetails?.userName || '',
  );
  const [email, setEmail] = useState(
    prefill.email || globalState?.userDetails?.email || '',
  );
  const [phone, setPhone] = useState(
    prefill.phoneNumber || globalState?.userDetails?.phoneNumber || '',
  );
  const [cityId, setCityId] = useState(selectedCityId || fallbackCityId);
  const [tickets, setTickets] = useState(
    ticketCfg.default ?? DEFAULT_TICKETS,
  );
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);
  // non-null when the API answered 409: the submission was already on the
  // list, so the confirmation card says so instead of claiming a new signup.
  const [alreadyMessage, setAlreadyMessage] = useState(null);
  

  useEffect(() => {
    if (visible) {
      setCityId(selectedCityId || fallbackCityId);
      setErrors({});
      setSubmission(null);
      setAlreadyMessage(null);
    }
  }, [visible, selectedCityId, fallbackCityId]);

  const clearError = key =>
    setErrors(e => (e[key] ? { ...e, [key]: null } : e));

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = 'Please enter your name';
    if (!email.trim()) next.email = 'Please enter your email';
    else if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email';
    if (!phone.trim()) next.phone = 'Please enter your phone number';
    else if (!PHONE_RE.test(phone.trim()))
      next.phone = 'Enter a valid 10 digit number';
    if (!cityId) next.cityId = 'Please select a city';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      name: name.trim(),
      email: email.trim(),
      countryCode: countryCode,
      phoneNumber: phone.trim(),
      cityId,
      ticketsNeeded: tickets,
      source: 'app_concert_details',
      platform: Platform.OS,
      appVersion: appVersion,
    };

    // Local fallback for the confirmation card, used when the server does not
    // echo a summary back.
    const localSummary = {
      ...payload,
      eventLabel: [concert?.title, concert?.artist]
        .filter(Boolean)
        .join(' \u2022 '),
      registeredPhone: formatPhone(countryCode, payload.phoneNumber),
    };

    const showSuccess = data => {
      const summary = data?.summary || {};
      // Remember it before the sheet is dismissed: "Go to Home" pops this
      // screen, so component state cannot carry the fact forward.
      markConcertRegistered(concert?.id);
      setSubmission({
        ...localSummary,
        ...summary,
        // prefer the server's values, keep ours where it sent nothing
        city: summary.city || localSummary.city,
        ticketsNeeded: summary.ticketsNeeded ?? localSummary.ticketsNeeded,
        registeredPhone:
          summary.registeredPhone || localSummary.registeredPhone,
        eventLabel: summary.eventLabel || localSummary.eventLabel,
        referenceCode: data?.referenceCode || null,
      });
    };

    const errorToast = message =>
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2:
          message ||
          formCfg?.errorToast?.message ||
          'Please try again in a moment.',
      });

    const paintFieldErrors = (fieldErrors, fallbackMessage) => {
      const mapped = {};
      Object.entries(fieldErrors || {}).forEach(([k, v]) => {
        const key = k === 'phoneNumber' ? 'phone' : k;
        mapped[key] = v;
      });
      setErrors(mapped);
      if (!Object.keys(mapped).length) errorToast(fallbackMessage);
    };

    // 409 with matchedOn: these details are already on the list. There is no
    // edit endpoint, so we confirm what already exists and leave it at that.
    const showAlreadyRegistered = result => {
      setAlreadyMessage(
        result.message || 'An interest is already registered for this concert.',
      );
      showSuccess(result.data);
    };

    if (!concert?.id) {
      errorToast('This concert is no longer available.');
      return;
    }

    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('mytoken');
      const res = await RegisterConcertInterest(concert?.id, payload, token);
      const result = classifyInterestResponse(res);

      switch (result.kind) {
        case 'success':
          showSuccess(result.data);
          break;
        case 'duplicate':
          showAlreadyRegistered(result);
          break;
        case 'closed':
          // paintFieldErrors already toasts when there is nothing to paint,
          // so only add a toast when a field error took the visual slot.
          paintFieldErrors(
            result.errors,
            result.message || 'Registrations are closed.',
          );
          if (Object.keys(result.errors || {}).length) {
            errorToast(result.message || 'Registrations are closed.');
          }
          break;
        default:
          errorToast(result.message);
      }
    } catch (err) {
      const result = classifyInterestError(err);

      switch (result.kind) {
        case 'success':
          showSuccess(result.data);
          break;
        case 'duplicate':
          showAlreadyRegistered(result);
          break;
        case 'fieldErrors':
          paintFieldErrors(result.errors, result.message);
          break;
        case 'closed':
          // paintFieldErrors already toasts when there is nothing to paint,
          // so only add a toast when a field error took the visual slot.
          paintFieldErrors(
            result.errors,
            result.message || 'Registrations are closed.',
          );
          if (Object.keys(result.errors || {}).length) {
            errorToast(result.message || 'Registrations are closed.');
          }
          break;
        case 'auth':
          errorToast('Please log in again to register.');
          break;
        default:
          errorToast(result.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Once the registration has gone through, any dismissal still reports
  // success upward so the CTA keeps its registered (disabled) state. A 409
  // also sets `submission`, so an already-registered user counts too.
  const dismiss = () => onClose?.(!!submission);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={dismiss}>
      <View style={styles.root}>
        <TouchableWithoutFeedback onPress={dismiss}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          style={styles.kav}
          pointerEvents="box-none"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            {submission ? (
              <ConcertSuccessSheet
                concert={concert}
                submission={submission}
                copy={
                  alreadyMessage
                    ? {
                        ...(concert?.interestForm?.successSheet || {}),
                        title: 'Interest already registered',
                        message: alreadyMessage,
                      }
                    : concert?.interestForm?.successSheet
                }
                onClose={dismiss}
                onGoHome={() => {
                  onClose?.(true);
                  onGoHome?.();
                }}
              />
            ) : (
              <>
            {/* ---------- header ---------- */}
            <View style={styles.headerRow}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.heading}>
                  {formCfg.title || 'Register your Interest'}
                </Text>
                <Text style={styles.subHeading}>
                  {concert?.title} • {concert?.artist}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => onClose?.(false)}
                activeOpacity={0.8}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.closeBtn}>
                <Icon name="close" size={19} color={T.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}>
              {/* ---------- name + email ---------- */}
              <View style={styles.twoCol}>
                <View style={styles.col}>
                  <Text style={styles.label}>
                    {fld('name').label || 'FULL NAME'}
                  </Text>
                  <TextInput
                    value={name}
                    onChangeText={t => {
                      setName(t);
                      clearError('name');
                    }}
                    placeholder={fld('name').placeholder || 'Ashish G'}
                    placeholderTextColor={T.textDim}
                    style={[styles.input, !!errors.name && styles.inputError]}
                  />
                  {!!errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
                </View>

                <View style={styles.col}>
                  <Text style={styles.label}>
                    {fld('email').label || 'EMAIL ID'}
                  </Text>
                  <TextInput
                    value={email}
                    onChangeText={t => {
                      setEmail(t);
                      clearError('email');
                    }}
                    placeholder={
                      fld('email').placeholder || 'ashishg@gmail.com'
                    }
                    placeholderTextColor={T.textDim}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={[styles.input, !!errors.email && styles.inputError]}
                  />
                  {!!errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>
              </View>

              {/* ---------- mobile ---------- */}
              <Text style={[styles.label, { marginTop: 18 }]}>
                {fld('phone').label || 'MOBILE NUMBER'}
              </Text>
              <View
                style={[
                  styles.phoneWrap,
                  !!errors.phone && styles.inputError,
                ]}>
                <View style={styles.codeBox}>
                  <Text style={styles.codeText}>
                    {fld('phone').defaultCountryCode || '+91'}
                  </Text>
                </View>
                <TextInput
                  value={phone}
                  onChangeText={t => {
                    setPhone(t.replace(/[^0-9]/g, '').slice(0, 10));
                    clearError('phone');
                  }}
                  placeholder={fld('phone').placeholder || '9876543210'}
                  placeholderTextColor={T.textDim}
                  keyboardType="number-pad"
                  maxLength={10}
                  style={styles.phoneInput}
                />
              </View>
              {!!errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}

              {/* ---------- city (existing chip selector) ---------- */}
              <Text style={[styles.label, { marginTop: 18 }]}>
                {fld('cityId').label || 'SELECT CITY'}
              </Text>
              <View style={styles.chipRow}>
                {cities.map(city => {
                  const active = city.id === cityId;
                  return (
                    <TouchableOpacity
                      key={city.id}
                      activeOpacity={0.85}
                      onPress={() => {
                        setCityId(city.id);
                        clearError('cityId');
                      }}
                      style={[styles.chip, active && styles.chipActive]}>
                      <Text
                        style={[
                          styles.chipText,
                          active && styles.chipTextActive,
                        ]}>
                        {city.city}
                      </Text>
                      <Text
                        style={[
                          styles.chipDate,
                          active && styles.chipDateActive,
                        ]}>
                        {city.day} {city.month}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {!!errors.cityId && (
                <Text style={styles.errorText}>{errors.cityId}</Text>
              )}

              {/* ---------- tickets stepper ---------- */}
              {ticketCfg.enabled !== false && (
              <View style={styles.ticketCard}>
                <View style={{ flex: 1, paddingRight: 14 }}>
                  <Text style={styles.ticketTitle}>
                    {ticketCfg.title || 'Estimated Tickets Needed'}
                  </Text>
                  <Text style={styles.ticketNote}>
                    {ticketCfg.note ||
                      "You'll get priority window booking link for these tickets."}
                  </Text>
                </View>

                <View style={styles.stepper}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    disabled={tickets <= minTickets}
                    onPress={() => setTickets(v => Math.max(minTickets, v - 1))}
                    style={styles.stepBtn}>
                    <Icon
                      name="remove"
                      size={18}
                      color={tickets <= minTickets ? T.textDim : T.text}
                    />
                  </TouchableOpacity>

                  <View style={styles.stepValueBox}>
                    <Text style={styles.stepValue}>{tickets}</Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    disabled={tickets >= maxTickets}
                    onPress={() => setTickets(v => Math.min(maxTickets, v + 1))}
                    style={styles.stepBtn}>
                    <Icon
                      name="add"
                      size={18}
                      color={tickets >= maxTickets ? T.textDim : T.text}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              )}

              {/* ---------- alerts banner ---------- */}
              {bannerCfg.enabled !== false && (
              <View style={styles.banner}>
                <Icon
                  name={bannerCfg.icon || 'flash'}
                  size={16}
                  color={T.gold}
                  style={{ marginTop: 2 }}
                />
                <Text style={styles.bannerText}>
                  {renderBannerText(
                    bannerCfg.text ||
                      'You will receive instant **WhatsApp & SMS** alerts the minute ticket booking opens.',
                  )}
                </Text>
              </View>

              )}

              {/* ---------- submit ---------- */}
              <TouchableOpacity
                activeOpacity={0.9}
                disabled={submitting}
                onPress={handleSubmit}
                style={{ marginTop: 20 }}>
                <LinearGradient
                  colors={[T.goldLight, T.gold, T.goldDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitBtn}>
                  {submitting ? (
                    <ActivityIndicator color="#1A1206" />
                  ) : (
                    <>
                      <Text style={styles.submitText}>
                        {formCfg.submitLabel || 'Submit'}
                      </Text>
                      <Icon
                        name="arrow-forward"
                        size={18}
                        color="#1A1206"
                        style={{ marginLeft: 8 }}
                      />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  kav: { flex: 1, justifyContent: 'flex-end' },

  sheet: {
    backgroundColor: T.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 22,
    maxHeight: '90%',
  },

  headerRow: { flexDirection: 'row', alignItems: 'flex-start' },
  heading: {
    color: T.text,
    fontFamily: 'WorkSans-Bold',
    fontSize: 20,
  },
  subHeading: {
    color: T.gold,
    fontFamily: 'WorkSans-Medium',
    fontSize: 12.5,
    marginTop: 5,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: T.border,
    marginTop: 16,
    marginBottom: 4,
  },

  label: {
    color: '#E3DCD5',
    fontFamily: 'WorkSans-Regular',
    fontSize: 12,
    letterSpacing: 0.9,
    marginBottom: 8,
    marginTop: 16,
  },

  twoCol: { flexDirection: 'row', justifyContent: 'space-between' },
  col: { width: '48%' },

  input: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    color: T.text,
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
  },
  inputError: { borderColor: '#B3453B' },

  phoneWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  codeBox: {
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    borderRightWidth: 1,
    borderRightColor: T.border,
  },
  codeText: {
    color: T.text,
    fontFamily: 'WorkSans-Medium',
    fontSize: 14,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    color: T.text,
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
  },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
  },
  chipActive: {
    borderColor: T.gold,
    backgroundColor: 'rgba(206,143,82,0.12)',
  },
  chipText: {
    color: T.textMuted,
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 13.5,
  },
  chipTextActive: { color: T.text },
  chipDate: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 11,
    marginTop: 2,
  },
  chipDateActive: { color: T.gold },

  ticketCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
  },
  ticketTitle: {
    color: T.text,
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 14.5,
  },
  ticketNote: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 12.5,
    lineHeight: 19,
    marginTop: 5,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 10,
    backgroundColor: T.surfaceActive,
    overflow: 'hidden',
  },
  stepBtn: {
    width: 36,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValueBox: {
    minWidth: 34,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: T.border,
  },
  stepValue: {
    color: T.text,
    fontFamily: 'WorkSans-Bold',
    fontSize: 15.5,
  },

  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(206,143,82,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(206,143,82,0.32)',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  bannerText: {
    flex: 1,
    color: T.gold,
    fontFamily: 'WorkSans-Regular',
    fontSize: 13,
    lineHeight: 20,
    marginLeft: 10,
  },
  bannerStrong: { fontFamily: 'WorkSans-Bold' },

  submitBtn: {
    flexDirection: 'row',
    height: 54,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#1A1206',
    fontFamily: 'WorkSans-Bold',
    fontSize: 15.5,
  },

  errorText: {
    color: '#E0736A',
    fontFamily: 'WorkSans-Regular',
    fontSize: 11.5,
    marginTop: 5,
  },
});
