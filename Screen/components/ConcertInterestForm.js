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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9]{10}$/;

/**
 * "I'm Interested" bottom-sheet form.
 * City is pre-filled from the schedule selection (falls back to the first city).
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

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cityId, setCityId] = useState(selectedCityId || fallbackCityId);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      setCityId(selectedCityId || fallbackCityId);
      setErrors({});
    }
  }, [visible, selectedCityId, fallbackCityId]);

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
      phoneNumber: phone.trim(),
      cityId,
      city: cities.find(c => c.id === cityId)?.city,
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
      <View style={styles.backdrop}>
        <TouchableWithoutFeedback onPress={() => onClose?.(false)}>
          <View style={styles.backdropTouch} />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
          <View style={[styles.sheet, { paddingBottom: insets.bottom + 18 }]}>
            <View style={styles.grabber} />

            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.heading}>Register your interest</Text>
                <Text style={styles.subHeading}>
                  {concert?.title} • {concert?.artist}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => onClose?.(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.closeBtn}>
                <Icon name="close" size={18} color={T.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <Field
                label="Full Name"
                value={name}
                onChangeText={t => {
                  setName(t);
                  if (errors.name) setErrors(e => ({ ...e, name: null }));
                }}
                placeholder="Enter your full name"
                error={errors.name}
              />

              <Field
                label="Email Address"
                value={email}
                onChangeText={t => {
                  setEmail(t);
                  if (errors.email) setErrors(e => ({ ...e, email: null }));
                }}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <Field
                label="Phone Number"
                value={phone}
                onChangeText={t => {
                  setPhone(t.replace(/[^0-9]/g, '').slice(0, 10));
                  if (errors.phone) setErrors(e => ({ ...e, phone: null }));
                }}
                placeholder="10 digit mobile number"
                keyboardType="number-pad"
                maxLength={10}
                error={errors.phone}
              />

              <Text style={styles.label}>City</Text>
              <View style={styles.chipRow}>
                {cities.map(city => {
                  const active = city.id === cityId;
                  return (
                    <TouchableOpacity
                      key={city.id}
                      activeOpacity={0.85}
                      onPress={() => setCityId(city.id)}
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

              <TouchableOpacity
                activeOpacity={0.9}
                disabled={submitting}
                onPress={handleSubmit}
                style={{ marginTop: 22 }}>
                <LinearGradient
                  colors={[T.goldLight, T.gold, T.goldDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitBtn}>
                  {submitting ? (
                    <ActivityIndicator color="#1A1206" />
                  ) : (
                    <Text style={styles.submitText}>Submit</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.footNote}>
                We will only use these details to notify you about this concert.
              </Text>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function Field({ label, error, ...props }) {
  return (
    <View style={{ marginTop: 16 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={T.textDim}
        style={[styles.input, !!error && styles.inputError]}
        {...props}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  backdropTouch: { flex: 1 },
  sheet: {
    backgroundColor: T.bg,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 10,
    maxHeight: '88%',
    borderTopWidth: 1,
    borderColor: T.border,
  },
  grabber: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3A2E22',
    marginBottom: 14,
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start' },
  heading: {
    color: T.text,
    fontFamily: 'WorkSans-Bold',
    fontSize: 19,
  },
  subHeading: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Regular',
    fontSize: 12.5,
    marginTop: 3,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: T.textMuted,
    fontFamily: 'WorkSans-Medium',
    fontSize: 12,
    marginBottom: 7,
    marginTop: 16,
  },
  input: {
    backgroundColor: T.surface,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 13 : 9,
    color: T.text,
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
  },
  inputError: { borderColor: '#B3453B' },
  errorText: {
    color: '#E0736A',
    fontFamily: 'WorkSans-Regular',
    fontSize: 11.5,
    marginTop: 5,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
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
  submitBtn: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#1A1206',
    fontFamily: 'WorkSans-Bold',
    fontSize: 15.5,
  },
  footNote: {
    color: T.textDim,
    fontFamily: 'WorkSans-Regular',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 14,
  },
});
