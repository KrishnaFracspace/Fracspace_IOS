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
import { AppContext } from '../Context/AppContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9]{10}$/;

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
}) {
  const insets = useSafeAreaInsets();

  const fallbackCityId = useMemo(
    () => concert?.defaultCityId || cities?.[0]?.id,
    [concert, cities],
  );
  const {globalState} = React.useContext(AppContext);

  const [name, setName] = useState(globalState?.userDetails?.userName || '');
  const [email, setEmail] = useState(globalState?.userDetails?.email || '');
  const [phone, setPhone] = useState(globalState?.userDetails?.phoneNumber || '');
  const [cityId, setCityId] = useState(selectedCityId || fallbackCityId);
  const [tickets, setTickets] = useState(DEFAULT_TICKETS);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  

  useEffect(() => {
    if (visible) {
      setCityId(selectedCityId || fallbackCityId);
      setErrors({});
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
      concertId: concert?.id,
      name: name.trim(),
      email: email.trim(),
      countryCode: '+91',
      phoneNumber: phone.trim(),
      cityId,
      city: cities.find(c => c.id === cityId)?.city,
      ticketsNeeded: tickets,
    };

    setSubmitting(true);
    try {
      // TODO: replace with the register-interest API call
      console.log('Concert interest payload:', payload);
      await new Promise(res => setTimeout(res, 600));

      Toast.show({
        type: 'success',
        text1: "You're on the list!",
        text2: 'We will notify you the moment tickets go live.',
      });
      setName('');
      setEmail('');
      setPhone('');
      setTickets(DEFAULT_TICKETS);
      onClose?.(true);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Please try again in a moment.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={() => onClose?.(false)}>
      <View style={styles.root}>
        <TouchableWithoutFeedback onPress={() => onClose?.(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          style={styles.kav}
          pointerEvents="box-none"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
            {/* ---------- header ---------- */}
            <View style={styles.headerRow}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.heading}>Register your Interest</Text>
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
                  <Text style={styles.label}>FULL NAME</Text>
                  <TextInput
                    value={name}
                    onChangeText={t => {
                      setName(t);
                      clearError('name');
                    }}
                    placeholder="Ashish G"
                    placeholderTextColor={T.textDim}
                    style={[styles.input, !!errors.name && styles.inputError]}
                  />
                  {!!errors.name && (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  )}
                </View>

                <View style={styles.col}>
                  <Text style={styles.label}>EMAIL ID</Text>
                  <TextInput
                    value={email}
                    onChangeText={t => {
                      setEmail(t);
                      clearError('email');
                    }}
                    placeholder="ashishg@gmail.com"
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
                MOBILE NUMBER
              </Text>
              <View
                style={[
                  styles.phoneWrap,
                  !!errors.phone && styles.inputError,
                ]}>
                <View style={styles.codeBox}>
                  <Text style={styles.codeText}>+91</Text>
                </View>
                <TextInput
                  value={phone}
                  onChangeText={t => {
                    setPhone(t.replace(/[^0-9]/g, '').slice(0, 10));
                    clearError('phone');
                  }}
                  placeholder="9876543210"
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
              <Text style={[styles.label, { marginTop: 18 }]}>SELECT CITY</Text>
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
              <View style={styles.ticketCard}>
                <View style={{ flex: 1, paddingRight: 14 }}>
                  <Text style={styles.ticketTitle}>
                    Estimated Tickets Needed
                  </Text>
                  <Text style={styles.ticketNote}>
                    You'll get priority window booking link for these tickets.
                  </Text>
                </View>

                <View style={styles.stepper}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    disabled={tickets <= MIN_TICKETS}
                    onPress={() => setTickets(v => Math.max(MIN_TICKETS, v - 1))}
                    style={styles.stepBtn}>
                    <Icon
                      name="remove"
                      size={18}
                      color={tickets <= MIN_TICKETS ? T.textDim : T.text}
                    />
                  </TouchableOpacity>

                  <View style={styles.stepValueBox}>
                    <Text style={styles.stepValue}>{tickets}</Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    disabled={tickets >= MAX_TICKETS}
                    onPress={() => setTickets(v => Math.min(MAX_TICKETS, v + 1))}
                    style={styles.stepBtn}>
                    <Icon
                      name="add"
                      size={18}
                      color={tickets >= MAX_TICKETS ? T.textDim : T.text}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* ---------- alerts banner ---------- */}
              <View style={styles.banner}>
                <Icon
                  name="flash"
                  size={16}
                  color={T.gold}
                  style={{ marginTop: 2 }}
                />
                <Text style={styles.bannerText}>
                  You will receive instant{' '}
                  <Text style={styles.bannerStrong}>WhatsApp &amp; SMS</Text>{' '}
                  alerts the minute ticket booking opens.
                </Text>
              </View>

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
                      <Text style={styles.submitText}>Submit</Text>
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
